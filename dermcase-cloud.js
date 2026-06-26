// Thin Supabase wrapper for DermCase. Every method no-ops or throws clearly
// when cloud isn't configured, so the anonymous/local path is never affected.
// IMPORTANT: only the structured case is ever stored — never the raw image.
(function () {
  let _sb = null;
  function client() {
    if (_sb) return _sb;
    if (!window.DERMCASE_CLOUD_ENABLED || !window.DERMCASE_CLOUD_ENABLED()) return null;
    _sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    return _sb;
  }
  const Cloud = {
    enabled() { return !!client(); },
    async user() {
      const c = client(); if (!c) return null;
      const { data } = await c.auth.getUser();
      return (data && data.user) || null;
    },
    async signIn(email, password) {
      const c = client(); if (!c) throw new Error('Cloud is not configured.');
      const { data, error } = await c.auth.signInWithPassword({ email, password });
      if (error) throw error; return data;
    },
    async signUp(email, password) {
      const c = client(); if (!c) throw new Error('Cloud is not configured.');
      const { data, error } = await c.auth.signUp({ email, password });
      if (error) throw error; return data;
    },
    async signOut() { const c = client(); if (c) await c.auth.signOut(); },
    async saveCase(record) {
      const c = client(); if (!c) throw new Error('Cloud is not configured.');
      const u = await this.user(); if (!u) throw new Error('Not signed in.');
      // Strip anything image-like defensively; we only persist structured fields.
      const row = { user_id: u.id, dx: record.dx || null, meta: record.meta || null, result: record.result || null };
      const { data, error } = await c.from('cases').insert(row).select().single();
      if (error) throw error; return data;
    },
    async listCases() {
      const c = client(); if (!c) return [];
      const { data, error } = await c.from('cases').select('*').order('created_at', { ascending: false });
      if (error) throw error; return data || [];
    },
    async deleteCase(id) {
      const c = client(); if (!c) return;
      const { error } = await c.from('cases').delete().eq('id', id);
      if (error) throw error;
    },
    onAuthChange(cb) {
      const c = client(); if (!c) return;
      c.auth.onAuthStateChange((_e, session) => cb(session && session.user || null));
    }
  };
  window.DermCaseCloud = Cloud;
})();
