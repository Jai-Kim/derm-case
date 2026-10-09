# Vendored third-party files

Self-hosted so the site can run with `script-src 'self'` and `font-src 'self'` and never depend on a third-party CDN at runtime. Do not edit these files. To upgrade, download the new release, replace the file, update the version and hash here, and run `node tests/smoke.js`.

| File | Source | Version | Licence | SHA-256 |
|---|---|---|---|---|
| `supabase-js-2.117.1.min.js` | npm `@supabase/supabase-js`, `dist/umd/supabase.js` | 2.117.1 | MIT (`supabase-js-LICENSE.txt`) | `dff1e545f4f35bd42895cd6f46431e56137dd13031e46a9759c446447c11a567` |
| `../fonts/pretendard-1.3.9/pretendardvariable-dynamic-subset.css` | npm `pretendard`, `dist/web/variable` | 1.3.9 | SIL OFL 1.1 (full text in the CSS header) | `2973bcae80262dcb630cfb793fbf6af29bd986c769ee54953fb3e5b3e32323ca` |
| `../fonts/pretendard-1.3.9/woff2-dynamic-subset/*.woff2` (92 files) | same package | 1.3.9 | SIL OFL 1.1 | combined hash of `sha256sum *.woff2` sorted by name: `9f28beca6e2e6dd15466fe6aefa01d11ab09c2803155153ebaa8b80af615bbd3` |

The tests in `tests/smoke.js` check the Supabase file against the hash above.
