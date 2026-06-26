// DermCase cloud configuration.
// Fill these in after creating your Supabase project (Settings → API).
// BOTH values are PUBLIC and safe to commit — the anon key is protected by
// Row Level Security (see supabase-schema.sql). Leaving them blank keeps the
// app fully functional in anonymous/local-only mode.
window.SUPABASE_URL = "https://lecbcrqkxtxcbgmxewov.supabase.co";       // e.g. https://abcdefgh.supabase.co
window.SUPABASE_ANON_KEY = "sb_publishable_bd5W6c_JFchtpjxBInyrzQ_ca8cnxYt";  // your project's anon / public key

window.DERMCASE_CLOUD_ENABLED = function () {
  return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
};
