// Strict validation of the one request shape /api/analyze accepts.
// Anything not listed here is rejected or ignored. Nothing the browser sends is passed to the model as-is.
'use strict';

const LIMITS = {
  maxImages: 3,
  maxImageB64: 1800000,   // about 1.3 MB of image bytes per photo (the app sends ~1200 px JPEGs, far smaller)
  maxTotalB64: 4000000,   // Vercel rejects bodies over 4.5 MB, so stay under it
  area: 120,
  duration: 120,
  notes: 1500
};
const MIME_OK = ['image/jpeg', 'image/png', 'image/webp'];
const SEX_OK = ['', 'Male', 'Female', 'Other'];
const FITZ_OK = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
const LANG_OK = ['ko', 'en'];
const B64 = /^[A-Za-z0-9+/]+={0,2}$/;

function bad(detail) { return { ok: false, status: 400, code: 'invalid_request', detail }; }

// C0/C1 controls (except tab and newline), zero-width and direction-override characters, line/paragraph separators, BOM,
// soft hyphen, Arabic letter mark, Mongolian vowel separator, interlinear annotation marks, and the invisible "tag" and
// variation-selector-supplement blocks (U+E0000 to U+E01EF), which can carry hidden text that a reader cannot see but a model can.
const CTRL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F\\u00AD\\u061C\\u180E\\u200B-\\u200F\\u2028-\\u202E\\u2060-\\u2069\\uFEFF\\uFFF9-\\uFFFB\\u{E0000}-\\u{E007F}\\u{E0100}-\\u{E01EF}]', 'gu');

// Cleaning can only shorten a string, so a raw value far longer than the limit can never become valid. It is refused
// before any regular expression runs: the tag-removal loop below is quadratic on hostile input (a few hundred KB of
// "<patient_" and "context>" pairs, or "<" followed by spaces, would otherwise keep one server instance busy for minutes).
const RAW_LIMIT_FACTOR = 3;

// Control characters and invisible direction overrides are removed. Tabs and newlines survive in notes.
function clean(v, max, multiline) {
  if (v === undefined || v === null) return '';
  if (typeof v !== 'string') return null;
  if (v.length > max * RAW_LIMIT_FACTOR) return null;
  let s = v.replace(/\r\n?/g, '\n').replace(CTRL, '');
  // remove our delimiter tag, repeating so that nested fragments cannot rebuild it
  for (let prev = null; prev !== s;) { prev = s; s = s.replace(/<\s*\/?\s*patient_context[^>]*>/gi, ''); }
  if (!multiline) s = s.replace(/[\n\t]+/g, ' ');
  s = s.trim();
  if (s.length > max) return null;
  return s;
}

function magicOk(mime, b64) {
  let b;
  try { b = Buffer.from(b64.slice(0, 24), 'base64'); } catch (e) { return false; }
  if (mime === 'image/jpeg') return b.length >= 3 && b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF;
  if (mime === 'image/png') return b.length >= 8 && b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
  if (mime === 'image/webp') return b.length >= 12 && b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP';
  return false;
}

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return bad('body');
  if (LANG_OK.indexOf(body.lang) < 0) return bad('lang');

  const imgs = body.images;
  if (!Array.isArray(imgs) || imgs.length < 1 || imgs.length > LIMITS.maxImages) return bad('images');
  let total = 0;
  const images = [];
  for (const im of imgs) {
    if (!im || typeof im !== 'object' || Array.isArray(im)) return bad('images');
    if (MIME_OK.indexOf(im.mime) < 0) return bad('image_type');
    if (typeof im.data !== 'string' || im.data.length < 100) return bad('image_data');
    if (im.data.length > LIMITS.maxImageB64) return { ok: false, status: 413, code: 'too_large', detail: 'image' };
    if (im.data.length % 4 !== 0 || !B64.test(im.data)) return bad('image_data');
    if (!magicOk(im.mime, im.data)) return bad('image_type');
    total += im.data.length;
    images.push({ mime: im.mime, data: im.data });
  }
  if (total > LIMITS.maxTotalB64) return { ok: false, status: 413, code: 'too_large', detail: 'images' };

  const c = body.case === undefined ? {} : body.case;
  if (!c || typeof c !== 'object' || Array.isArray(c)) return bad('case');

  let age = '';
  if (c.age !== undefined && c.age !== null && c.age !== '') {
    const a = typeof c.age === 'number' ? String(c.age) : c.age;
    if (typeof a !== 'string' || !/^\d{1,3}$/.test(a.trim()) || Number(a) > 120) return bad('age');
    age = String(Number(a));
  }
  if (c.sex !== undefined && c.sex !== null && SEX_OK.indexOf(c.sex) < 0) return bad('sex');
  if (c.fitz !== undefined && c.fitz !== null && FITZ_OK.indexOf(c.fitz) < 0) return bad('fitz');
  const area = clean(c.area, LIMITS.area, false);
  const duration = clean(c.duration, LIMITS.duration, false);
  const notes = clean(c.notes, LIMITS.notes, true);
  if (area === null) return bad('area');
  if (duration === null) return bad('duration');
  if (notes === null) return bad('notes');

  return { ok: true, value: { lang: body.lang, images, c: { age, sex: c.sex || '', area, duration, fitz: c.fitz || '', notes } } };
}

module.exports = { validate, LIMITS };
