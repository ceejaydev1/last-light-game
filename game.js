(() => {
    const $ = i => document.getElementById(i), st = $('st'), C = $('c'), g = C.getContext('2d'), W = 480;
    let H = 720;
    C.width = W * 2;
    C.height = H * 2;
    // ---- supabase ----
    const SB_URL = 'https://bbetyncuhyvbtunpablq.supabase.co', SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZXR5bmN1aHl2YnR1bnBhYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTM0ODUsImV4cCI6MjEwODQyOTQ4NX0.-UIZ-KDRz9T5b4A3Tk29vcV_I7ru6FmSFoU5akDGCdY';
    let sb = null;
    try {
        if (window.supabase && !SB_URL.includes('YOUR-PROJECT'))
            sb = supabase.createClient(SB_URL, SB_KEY);
    }
    catch (e) { }
    let me = null, pushT = 0;
    const em = n => n.toLowerCase().replace(/[^a-z0-9]/g, '_') + '@lastlight.app';
    async function pushNow() {
    const a = acc && ACC()[acc];

    if (!sb || !me || !a) return;

    const { error } = await sb.from('profiles').upsert({
        id: me.id,
        name: a.name,
        hi: Number(a.hi || 0),
        skin: Number(a.skin || 0),
        st: a.st || {},
        pg: a.pg || {},
        updated_at: new Date().toISOString()
    });

    if (error) {
        console.error('Profile sync failed:', error.message);
        return;
    }

    console.log('Profile statistics synced successfully.');
}
    function cloudPush() { if (!sb || !me || !acc)
        return; clearTimeout(pushT); pushT = setTimeout(pushNow, 800); }
    async function cloudLogin(u, fallback, seed) {
    const { data, error } = await sb
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .maybeSingle();

    if (error) {
        console.error('Failed to load cloud profile:', error.message);
        throw error;
    }

    const m = ACC();
    const sd = seed || {};
    const name = (
        data?.name ||
        u.user_metadata?.name ||
        u.user_metadata?.full_name ||
        fallback ||
        'PILOT'
    ).slice(0, 12);

    const key = name.toUpperCase();
    const loc = m[key] || {};

    const cloudStats = data?.st || {};
    const localStats = loc.st || sd.st || {};
    const defaults = ZS();

    // Preserve the highest recorded cumulative statistics.
    const st = {};

    for (const field of Object.keys(defaults)) {
        const cloudValue = Number(cloudStats[field] ?? 0);
        const localValue = Number(localStats[field] ?? 0);

        st[field] = field === 'bestChain'
            ? Math.max(1, cloudValue, localValue)
            : Math.max(0, cloudValue, localValue);
    }

    // An empty cloud object should not erase local progression.
    const cloudPg = data?.pg || {};
    const localPg = loc.pg || sd.pg || {};

    const pg = Object.keys(cloudPg).length
        ? cloudPg
        : localPg;

    m[key] = {
        ...loc,
        name,
        hi: Math.max(
            Number(data?.hi || 0),
            Number(loc.hi || 0),
            Number(sd.hi || 0),
            Number(st.bestScore || 0)
        ),
        skin: data?.skin ?? loc.skin ?? sd.skin ?? 0,
        st,
        pg
    };

    saveAcc(m);

    acc = key;
    me = u;
    myId = u.id;

    // Push the merged statistics to Supabase.
    await pushNow();
}
    async function cloudOut() { clearTimeout(pushT); await pushNow(); try {
        if (sb)
            await sb.auth.signOut();
    }
    catch (e) { } me = null; myId = null; }
    const R = (a, b) => Math.random() * (b - a) + a, cl = (v, a, b) => Math.max(a, Math.min(b, v)), D = Math.hypot;
    const INK = '#14161f', PAP = '#f1e8d4', RED = '#e8452c', GLD = '#f0b429', TEA = '#2a9d8f', MUT = '#8d8a7f';
    let hi = 0, mute = false;
    try {
        hi = +localStorage.getItem('ll_hi') || 0;
    }
    catch (e) { }
    const set = Object.assign({ sfx: 1, mus: .6, vib: 1, lay: 0, sens: 1, diff: 1, tut: 0 }, (() => { try {
        return JSON.parse(localStorage.getItem('ll_set') || '{}');
    }
    catch (e) {
        return {};
    } })());
    const saveSet = () => { try {
        localStorage.setItem('ll_set', JSON.stringify(set));
    }
    catch (e) { } }, vib = m => { if (set.vib && navigator.vibrate)
        try {
            navigator.vibrate(m);
        }
        catch (e) { } };
    // ---- audio ----
    let AC = null;
    function snd(f, d, ty = 'square', v = .04, sl = 0) {
        if (mute)
            return;
        try {
            AC = AC || new (window.AudioContext || window.webkitAudioContext)();
            const o = AC.createOscillator(), n = AC.createGain();
            o.type = ty;
            o.frequency.value = f;
            if (sl)
                o.frequency.exponentialRampToValueAtTime(Math.max(30, f + sl), AC.currentTime + d);
            n.gain.value = v * set.sfx;
            n.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d);
            o.connect(n).connect(AC.destination);
            o.start();
            o.stop(AC.currentTime + d);
        }
        catch (e) { }
    }
    const S = { shot: () => snd(640, .07, 'square', .015, -380), boom: () => snd(150, .3, 'sawtooth', .06, -110), hit: () => snd(280, .08, 'triangle', .04, -140),
        pow: () => { vib(25); snd(420, .12, 'sine', .06, 300); setTimeout(() => snd(630, .2, 'sine', .05, 300), 90); }, hurt: () => { vib(120); snd(110, .45, 'sawtooth', .09, -70); }, big: () => { vib(70); snd(80, .8, 'sawtooth', .11, -40); }, gz: () => snd(900, .04, 'sine', .02) };
    // ---- data ----
    const POW = {
        P: { n: 'Spread', d: 'Weapon tier +1, up to five', c: GLD },
        R: { n: 'Rapid', d: 'Much faster fire for 10 s', c: RED, t: 10 },
        X: { n: 'Pierce', d: 'Shots slice through, 10 s', c: TEA, t: 10 },
        W: { n: 'Wingmen', d: 'Two escort drones, 14 s', c: PAP, t: 14 },
        M: { n: 'Magnet', d: 'Draws salvage to you, 12 s', c: GLD, t: 12 },
        T: { n: 'Stillness', d: 'Slows enemy time, 6 s', c: TEA, t: 6 },
        S: { n: 'Aegis', d: 'Absorbs the next hit', c: PAP },
        B: { n: 'Flare', d: '+1 screen-clearing flare', c: RED },
        H: { n: 'Mend', d: 'Restores one hull', c: RED }
    };
    $('gl').innerHTML = Object.entries(POW).map(([k, v]) => `<div class="row"><i class="chip" style="background:${v.c}">${k}</i><span><b>${v.n}</b> &mdash; ${v.d}</span></div>`).join('');
    const BOSS = ['The Warden', 'The Chorus', 'The Lamp-Eater', 'The Eclipse'], FL = ['Hold the line', 'Stay quiet, stay lit', 'They are drawn to the light', 'Nobody is coming', 'Keep the convoy asleep', 'The dark closes in'];
    // k = skill variant per slot [Space/E, Q, F, R]; b = bullet color
    const SKINS = [
        { n: 'Paper Kite', u: 0, L: PAP, D: '#b9b09a', A: RED, C: TEA, w: 0, f: [RED, GLD, PAP], o: RED, t: PAP, b: PAP, k: [0, 0, 0, 0], d: 'The original. Folded, not forged.' },
        { n: 'Ember', u: 0, L: RED, D: '#8e2a1a', A: GLD, C: '#ffd9a0', w: 1, f: [RED, GLD, PAP], o: GLD, t: GLD, b: '#ff7a3d', k: [1, 1, 0, 1], d: 'Forward-swept wings with glowing cannons.' },
        { n: 'Tern', u: 1500, L: TEA, D: '#1c6359', A: PAP, C: '#d9f3ee', w: 0, f: [TEA, PAP, '#fff'], o: PAP, t: TEA, b: '#5eead4', k: [2, 0, 1, 2], d: 'Sea-glass hull built for long hauls.' },
        { n: 'Obsidian', u: 4000, L: '#4a4d5e', D: '#2f3140', A: GLD, C: GLD, w: 1, f: [GLD, PAP, '#fff'], o: GLD, t: MUT, b: GLD, k: [0, 2, 2, 1], d: 'Runs dark. Burns gold.' },
        { n: 'Aurora', u: 8000, L: PAP, D: TEA, A: GLD, C: '#9fe0d6', w: 0, f: [TEA, '#9fe0d6', PAP], o: TEA, t: '#9fe0d6', b: '#7dd3fc', k: [1, 2, 1, 0], d: 'Cold fire and a pale ribbon trail.' },
        { n: 'Solar', u: 15000, L: GLD, D: '#a8780f', A: RED, C: PAP, w: 1, f: [GLD, PAP, '#fff'], o: RED, t: GLD, b: '#fff27a', k: [2, 1, 2, 2], d: 'Gold plate. A small sun on a long night.' },
        { n: 'Nebula', u: 20000, L: '#7b3fa0', D: '#4a2268', A: '#f472b6', C: '#f5d0fe', w: 0, f: ['#e879f9', '#f5d0fe', '#fff'], o: '#f472b6', t: '#e879f9', b: '#e879f9', k: [1, 0, 2, 0], d: 'Violet dust and a long magenta wake.' },
        { n: 'Jade', u: 28000, L: '#2f9e5c', D: '#1b6b3d', A: GLD, C: '#d6ffe3', w: 1, f: ['#86efac', GLD, '#fff'], o: GLD, t: '#86efac', b: '#86efac', k: [2, 2, 0, 1], d: 'Carved from green glass. Quick and quiet.' },
        { n: 'Phantom', u: 38000, L: '#2a2540', D: '#17132a', A: '#c4b5fd', C: '#c4b5fd', w: 0, f: ['#c4b5fd', '#fff', '#fff'], o: '#c4b5fd', t: '#a78bfa', b: '#c4b5fd', k: [0, 1, 1, 2], d: 'Barely there. Leaves a violet whisper.' },
        { n: 'Inferno', u: 50000, L: '#c2281a', D: '#5e0f08', A: '#ffb703', C: '#ffe8a3', w: 1, f: ['#ff3b30', '#ffb703', '#fff'], o: '#ffb703', t: '#ff3b30', b: '#ff3b30', k: [1, 1, 1, 1], d: 'Built to burn everything near it.' },
        { n: 'Glacier', u: 70000, L: '#cfe9f7', D: '#7fb0cc', A: '#38bdf8', C: '#e0f7ff', w: 0, f: ['#38bdf8', '#e0f7ff', '#fff'], o: '#38bdf8', t: '#bae6fd', b: '#e0f2fe', k: [2, 2, 2, 0], d: 'Frozen light. Cold, bright, patient.' },
        { n: 'Prism', u: 100000, L: PAP, D: MUT, A: '#f472b6', C: '#7dd3fc', w: 1, f: ['#f472b6', '#7dd3fc', '#fff'], o: GLD, t: '#7dd3fc', b: 'rainbow', k: [0, 2, 0, 2], d: 'Every color at once. The rarest hull.' }
    ];
    const STAT = [[1, 1, 0], [1, 1.15, 0], [.94, 1, 1], [1.06, 1.06, 0], [1.14, .96, 0], [1, 1.08, 0], [1.04, 1.1, 0], [1.1, 1, 0], [1.16, .94, 0], [.9, 1.18, 1], [.97, 1.04, 1], [1.05, 1.1, 0]], DIFFN = [{ n: 'Easy', bs: .85, sp: .8, hp: .8, sc: .8, lives: 4 }, { n: 'Normal', bs: 1, sp: 1, hp: 1, sc: 1, lives: 3 }, { n: 'Hard', bs: 1.15, sp: 1.3, hp: 1.3, sc: 1.3, lives: 3 }], DF = () => DIFFN[set.diff] || DIFFN[1], LAY = () => set.lay == 1 ? { bx: 36, lx: W - 24, ld: -24, fx: W - 24, fd: -20, fy: H - 52, gx: W - 130 } : set.lay == 2 ? { bx: W - 210, lx: 24, ld: 24, fx: 24, fd: 20, fy: H - 52, gx: 20 } : { bx: W / 2 - 87, lx: 24, ld: 24, fx: W - 24, fd: -20, fy: H - 28, gx: W - 130 };
    const KEYN = ['Space / E', 'Q', 'F', 'R'], SKCD = [[11, 9, 10], [3.5, 4, 7], [8, 10, 9], [14, 14, 11]], SKD = [[['Lantern', 'lure foes, swallow bullets, burst'], ['Nova', 'instant burst around you'], ['Storm', 'fan of 12 homing shots']],
        [['Comet dash', 'phase through fire, slice foes'], ['Blink', 'teleport and strike on arrival'], ['Phase', 'invulnerable speed surge']],
        [['Mirror', 'reflect bullets as homing shots'], ['Stasis', 'slow enemy time for 4 s'], ['Barrier', 'shield and push bullets away']],
        [['Sunspear', 'charge a piercing beam'], ['Twin beam', 'two piercing beams'], ['Missiles', 'launch 14 homing missiles']]];
    const skHTML = i => `<div style="color:var(--gold);margin-bottom:.6cqw">${SKINS[i].n} loadout</div>` + SKINS[i].sk.map((x, s) => `<div><b>${KEYN[s]} &middot; ${x.n}</b> &mdash; ${x.d}</div>`).join('');
    const bcol = c => c == 'rainbow' ? `hsl(${(time * 220) % 360},95%,65%)` : c;
    const BO = () => SPC(3).bo || [0];
    const bgOnly = () => state == 'menu' || state == 'guide' || state == 'hangar' || state == 'board' || state == 'exit' || state == 'splash';
    const KITE = [[0, -20], [12, 14], [0, 7], [-12, 14]], DRONE = [[0, 13], [12, -10], [0, -4], [-12, -10]], FIGH = [[0, 17], [17, 0], [0, -14], [-17, 0]], DIVE = [[0, 22], [8, -12], [0, -6], [-8, -12]], HEX = [...Array(6)].map((_, i) => [Math.cos(i * 1.047) * 23, Math.sin(i * 1.047) * 23]);
    const PL = document.createElement('canvas');
    PL.width = PL.height = 240;
    (() => { const q = PL.getContext('2d'); q.fillStyle = PAP; for (let y = 4; y < 240; y += 7)
        for (let x = 4 + ((y / 7 | 0) % 2) * 3.5; x < 240; x += 7) {
            const dx = x - 120, dy = y - 120;
            if (D(dx, dy) > 112)
                continue;
            const r = cl((-dx * .6 - dy * .5) / 112 + .55, 0, 1) * 3.1;
            if (r < .4)
                continue;
            q.beginPath();
            q.arc(x, y, r, 0, 6.28);
            q.fill();
        } })();
    // ---- state ----
    let state = 'menu', lamp = null, lampCd = 0, rings = [], ghosts = [], cdD = 0, cdM = 0, cdS = 0, P, bul = [], ebul = [], en = [], pw = [], pt = [], pops = [], score, wave, kills, spT, boss, shake = 0, flash = 0, banner = 0, bT = '', bS = '', combo, comboT, maxC, graze, time = 0, dead = 0;
    const keys = {};
    let gzW = { w: 0, s: 0 }, gzTot = 0, wl = [], lw = 1;
    let ptr = null, ptrId = -1, rk = 0, rb = 0, rt = 0, ev = null, evT = 40, rc = 0, slow = 0, trl = [], runMsg = '';
    const stars = [...Array(80)].map(() => ({ x: R(0, W), y: R(0, H), z: R(.3, 1.5) }));
    const mult = () => Math.min(5, 1 + (combo / 5 | 0));
    const tg = () => lamp ? { x: lamp.x, y: lamp.y } : P, aimAt = e => { const t = tg(); return Math.atan2(t.y - e.y, t.x - e.x); };
    const bs = () => (wave > 5 ? Math.min(330, 190 + (wave - 6) * 10) : 145 + wave * 8) * DF().bs;
    function reset() {
        P = { x: W / 2, y: H - 110, r: 12, lives: DF().lives + STAT[skin][2] + Math.min(5, U(4) / 150 | 0), shield: U(9) ? 1 : 0, tier: 1, cool: 0, inv: 2 + Math.min(2, (U(9) / 100 | 0) * .25), bomb: 1 + Math.min(4, U(8) / 100 | 0), wc: 0, dsh: 0, mir: 0, sp: 0, sf: 0, ph: 0, ldx: 0, ldy: -1, did: 0, dvx: 0, dvy: 0, fx: { R: 0, X: 0, W: 0, M: 0, T: 0 } };
        bul = [];
        ebul = [];
        en = [];
        pw = [];
        pt = [];
        pops = [];
        lamp = null;
        lampCd = 0;
        rings = [];
        ghosts = [];
        cdD = 0;
        cdM = 0;
        cdS = 0;
        score = 0;
        wave = 1;
        kills = 0;
        spT = 1;
        boss = null;
        combo = 0;
        comboT = 0;
        maxC = 1;
        graze = 0;
        shake = 0;
        flash = 0;
        rk = 0;
        rb = 0;
        rt = 0;
        ev = null;
        evT = 40;
        rc = 0;
        trl = [];
        gzW = { w: 0, s: 0 };
        gzTot = 0;
        wl = [];
        lw = 1;
        ann('Wave 1', FL[0]);
    }
    function ann(a, b) { bT = a; bS = b; banner = 2.2; }
    function burst(x, y, n = 16, c = GLD, sp = 220) { for (let i = 0; i < n; i++) {
        const a = R(0, 6.28), s = R(30, sp);
        pt.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: R(.3, .8), m: .8, c, s: R(1.5, 3.5) });
    } }
    const drop = (x, y, k) => pw.push({ x, y, k, t: R(0, 6) });
    function rockSprite(r, p) {
        const c = document.createElement('canvas'), z = Math.ceil(r * 2 + 10);
        c.width = c.height = z;
        const q = c.getContext('2d');
        q.translate(z / 2, z / 2);
        const path = () => { q.beginPath(); p.forEach((v, i) => q[i ? 'lineTo' : 'moveTo'](v[0], v[1])); q.closePath(); };
        path();
        const gr = q.createRadialGradient(-r * .4, -r * .4, r * .1, 0, 0, r * 1.15);
        gr.addColorStop(0, '#cfc4aa');
        gr.addColorStop(.5, '#8d8a7f');
        gr.addColorStop(1, '#343642');
        q.fillStyle = gr;
        q.fill();
        q.save();
        q.clip();
        for (let i = 0; i < 6; i++) {
            const a = R(0, 6.28), d = R(0, r * .75), cr = R(r * .1, r * .26), cx = Math.cos(a) * d, cy = Math.sin(a) * d;
            q.fillStyle = 'rgba(30,31,42,.55)';
            q.beginPath();
            q.arc(cx, cy, cr, 0, 6.28);
            q.fill();
            q.strokeStyle = 'rgba(225,215,190,.6)';
            q.lineWidth = 1.2;
            q.beginPath();
            q.arc(cx, cy, cr, .3, 1.9);
            q.stroke();
        }
        q.restore();
        path();
        q.strokeStyle = '#14161f';
        q.lineWidth = 1.5;
        q.stroke();
        return c;
    }
    function rock(x, y, r, vx) {
        const p = [...Array(11)].map((_, i) => { const a = i / 11 * 6.28, q = R(.74, 1); return [Math.cos(a) * r * q, Math.sin(a) * r * q]; });
        en.push({ k: 'rock', x, y, r, hp: r > 20 ? 5 : 2, mhp: 5, vy: R(60, 120), vx: vx ?? R(-45, 45), rot: R(0, 6), vr: R(-.9, .9), sc: r > 20 ? 90 : 50, p, sp: rockSprite(r, p) });
    }
    function spawn() {
        const r = Math.random(), x = R(40, W - 40), w = wave, hd = w > 5, h = Math.max(0, w - 6), fh = hd ? 3 + (h / 4 | 0) : 2;
        const q = Math.random();
        if (w >= 6 && q < .06) {
            en.push({ k: 'sniper', x, y: -30, r: 15, hp: 4, mhp: 4, t: 0, cd: 1.6, ch: 0, sc: 250 });
            return;
        }
        if (w >= 4 && q < .12) {
            const bx = cl(x, 90, W - 90);
            for (let i = 0; i < 5; i++)
                en.push({ k: 'bug', x: bx + (i - 2) * 26, x0: bx + (i - 2) * 26, y: -20 - Math.abs(i - 2) * 22, r: 9, hp: 1, mhp: 1, t: i * .2, sc: 60 });
            return;
        }
        if (hd && r < .1 + Math.min(.1, h * .012))
            en.push({ k: 'tank', x, y: -40, r: 23, hp: 8 + w, mhp: 8 + w, t: 0, cd: 1.5, sc: 300 });
        else if (hd && w >= 7 && r < .24 + Math.min(.1, h * .01))
            en.push({ k: 'diver', x, y: -30, r: 13, hp: 2, mhp: 2, t: 0, ph: 0, tx: x, sc: 200 });
        else if (w >= 3 && r < (hd ? .5 : .12 + w * .03))
            en.push({ k: 'fighter', x, y: -30, r: 16, hp: fh, mhp: fh, t: 0, cd: R(1, 2), sc: 150, dir: Math.random() < .5 ? -1 : 1 });
        else if (w >= 4 && r > (hd ? .86 : .93))
            en.push({ k: 'mine', x, y: -30, r: 15, hp: 3, mhp: 3, t: 0, sc: 120 });
        else if (r < (hd ? .62 : .5))
            rock(x, -30, hd ? R(16, 32) : R(14, 24));
        else
            en.push({ k: 'drone', x, x0: x, y: -30, r: 13, hp: hd && w >= 9 ? 2 : 1, mhp: 1, vy: hd ? Math.min(230, R(105, 140) + h * 8) : R(70, 100) + w * 4, t: R(0, 6), amp: R(40, 90), sc: 100 });
    }
    function spawnBoss() { const tier = ((wave / 5 | 0) - 1) % 4, hp = Math.round((wave <= 5 ? 90 : 110 + (wave - 5) * 30) * DF().hp); boss = { k: 'boss', tier, x: W / 2, y: -90, r: 46, hp, mhp: hp, t: 0, cd: 1.5, ph: 0, sc: 2500 + wave * 250 }; en.push(boss); ann('Warning', BOSS[tier]); S.big(); }
    function fire() {
        const n = [1, 2, 3, 5, 7][P.tier - 1], pr = P.fx.X > 0, c = SKINS[skin].b;
        for (let i = 0; i < n; i++) {
            let a = 0, ox = 0;
            if (n == 2)
                ox = i ? 8 : -8;
            else
                a = (i - (n - 1) / 2) * .1;
            bul.push({ x: P.x + ox, y: P.y - 16, vx: Math.sin(a) * 640, vy: -Math.cos(a) * 640, r: 3, p: pr, h: [], c });
        }
        S.shot();
    }
    function es(e, a, sp = 220, n = 1, sd = 0) { for (let i = 0; i < n; i++) {
        const q = a + (n > 1 ? (i - (n - 1) / 2) * sd : 0);
        ebul.push({ x: e.x, y: e.y + e.r * .5, vx: Math.cos(q) * sp, vy: Math.sin(q) * sp, r: 5 });
    } }
    function hurt() {
        if (P.inv > 0)
            return;
        combo = 0;
        if (P.shield) {
            P.shield = 0;
            P.inv = 1;
            burst(P.x, P.y, 14, PAP);
            S.hit();
            return;
        }
        P.lives--;
        P.inv = 2.2;
        P.tier = Math.max(1, P.tier - 1);
        shake = .5;
        flash = .25;
        burst(P.x, P.y, 30, RED);
        S.hurt();
        if (P.lives <= 0) {
            state = 'dead';
            dead = 1.5;
            burst(P.x, P.y, 70, PAP, 380);
            S.big();
        }
    }
    function kill(e) {
        combo++;
        comboT = 1.5 + 1.5 * SAT(U(13), 250);
        maxC = Math.max(maxC, mult());
        score += Math.round(e.sc * (e.k == 'boss' ? 1 : mult()) * DF().sc * (1 + SAT(U(12), 250)));
        kills++;
        rk++;
        if (e.gold) {
            rc += 8;
            drop(e.x, e.y, 'PRXWMTSBH'[R(0, 9) | 0]);
        }
        burst(e.x, e.y, e.k == 'boss' ? 90 : e.k == 'tank' ? 30 : 14, e.k == 'rock' ? MUT : e.k == 'drone' ? RED : GLD, e.k == 'boss' ? 420 : 220);
        S.boom();
        if (e.k == 'mine')
            for (let i = 0; i < 8; i++)
                es(e, i * .7854, 150);
        if (e.k == 'rock' && e.r > 20) {
            rock(e.x - 10, e.y, 13, -70);
            rock(e.x + 10, e.y, 13, 70);
        }
        if (e.k == 'boss') {
            rb++;
            rc += 40;
            slow = 1.2;
            shake = 1;
            flash = .4;
            boss = null;
            wave++;
            kills = 0;
            ann('Wave ' + wave, 'The sky exhales');
            P.bomb = Math.min(5, P.bomb + 1);
            P.lives = Math.min(5, P.lives + 1);
            ['P', 'W', 'S', 'R'].forEach((k, i) => drop(e.x + (i - 1.5) * 34, e.y, k));
            return;
        }
        const ks = 'PPRXWMTSBH';
        if (Math.random() < (e.k == 'tank' ? .55 : e.k == 'rock' ? .04 : wave > 5 ? .09 : .17) + (.25 * SAT(U(11), 250)))
            drop(e.x, e.y, ks[R(0, ks.length) | 0]);
        if (!boss && kills >= (wave > 5 ? 10 + wave * 3 : 6 + wave * 2)) {
            kills = 0;
            if (wave % 5 == 0)
                spawnBoss();
            else {
                wave++;
                ann('Wave ' + wave, FL[(wave - 1) % FL.length]);
            }
        }
    }
    // ---- skills (variant picked by the equipped skin) ----
    function dash() {
        if (state != 'play' || cdD > 0 || P.dsh > 0 || P.ph > 0) return;
        const c = SPC(1), a = c.a, n = c.q, m = D(P.ldx, P.ldy) || 1, ux = P.ldx / m, uy = P.ldy / m;
        cdD = c.cd; P.dtr = a == 7; P.dd = c.dm;
        if (a == 0 || a == 7) { const sp = (a == 7 ? 740 : 620) * (.9 + .1 * c.rd); P.dvx = ux * sp; P.dvy = uy * sp; P.dsh = .22 * c.rd; P.did++; P.inv = Math.max(P.inv, .45 + .1 * n); }
        else if (a == 1) { burst(P.x, P.y, 14, GLD, 160); P.x = cl(P.x + ux * 180 * c.rd, 16, W - 16); P.y = cl(P.y + uy * 180 * c.rd, 70, H - 92); P.inv = Math.max(P.inv, .6); burst(P.x, P.y, 22, GLD, 260); ringFx(P.x, P.y, 70 * c.rd); for (const e of en) if (D(e.x - P.x, e.y - P.y) < 70 * c.rd + e.r) { e.hp -= 5 * c.dm; e.hit = .1; } }
        else if (a == 2) { P.ph = 1.6 + n * .3; P.inv = Math.max(P.inv, P.ph); }
        else if (a == 3) { burst(P.x, P.y, 16, GLD, 200); P.x = cl(W - P.x, 16, W - 16); P.inv = Math.max(P.inv, .7); burst(P.x, P.y, 24, GLD, 260); ringFx(P.x, P.y, 90 * c.rd); for (const e of en) if (D(e.x - P.x, e.y - P.y) < 90 * c.rd + e.r) { e.hp -= 6 * c.dm; e.hit = .1; } }
        else if (a == 4) { P.inv = Math.max(P.inv, 1 + n * .3); const N = 10 + n * 4; for (let i = 0; i < N; i++) hb(c, P.x, P.y, i * 6.283 / N); ringFx(P.x, P.y, 60); }
        else if (a == 5) { P.y = cl(P.y + 140 * c.rd, 70, H - 92); P.inv = Math.max(P.inv, .5); const N = 7 + n * 2; for (let i = 0; i < N; i++) pb(c, P.x, P.y - 10, -1.5708 + (i - (N - 1) / 2) * .12, 560, 3, 4); burst(P.x, P.y, 14, GLD, 160); }
        else { P.ph = 2.2 + n * .4; P.inv = Math.max(P.inv, P.ph); P.fx.R = Math.max(P.fx.R, P.ph); }
        twist(c); S.hit();
    }
    function mirror() {
        if (state != 'play' || cdM > 0 || P.mir > 0) return;
        const c = SPC(2), a = c.a, n = c.q; cdM = c.cd; P.md = c.dm;
        if (a == 0) P.mir = .7 + n * .2;
        else if (a == 1) { P.fx.T = 3 + n; ringFx(P.x, P.y, 200 * c.rd); flash = .15; }
        else if (a == 2) { P.shield = 1; ebul = ebul.filter(b => D(b.x - P.x, b.y - P.y) > 110 * c.rd); ringFx(P.x, P.y, 110 * c.rd); }
        else if (a == 3) { P.shield = 1; for (const e of en) if (D(e.x - P.x, e.y - P.y) < 160 * c.rd + e.r) { e.hp -= 4 * c.dm; e.hit = .1; burst(e.x, e.y, 6, TEA, 140); } ringFx(P.x, P.y, 160 * c.rd); }
        else if (a == 4) { P.fx.W = Math.max(P.fx.W, 6 + n * 2); P.fx.R = Math.max(P.fx.R, 6 + n * 2); ringFx(P.x, P.y, 70); }
        else if (a == 5) { const k = Math.max(.1, .35 - n * .08); for (const b of ebul) { b.vx *= k; b.vy *= k; } ringFx(P.x, P.y, 240 * c.rd); flash = .1; }
        else if (a == 6) { for (const b of ebul) if (!b.dead && D(b.x - P.x, b.y - P.y) < 150 * c.rd) { b.dead = 1; reflect(b); } ringFx(P.x, P.y, 150 * c.rd); }
        else { const tx = P.x, ty = P.y - 170; for (const e of en) if (e.k != 'boss' && D(e.x - P.x, e.y - P.y) < 430 * c.rd) { const dx = (tx - e.x) * .6; e.x += dx; if (e.x0 != null) e.x0 += dx; e.y += (ty - e.y) * .6; e.hp -= 3 * c.dm; e.hit = .1; } ringFx(tx, ty, 120 * c.rd); }
        twist(c); S.pow();
    }
    function spear() {
        if (state != 'play' || cdS > 0 || P.sp > 0) return;
        const c = SPC(3), a = c.a, n = c.q; cdS = c.cd;
        if (c.bo) { P.sp = 1.45; P.sf = 0; }
        else if (a == 2) { const N = 10 + n * 4; for (let i = 0; i < N; i++) { const an = -1.5708 + (i - (N - 1) / 2) * .16; bul.push({ x: P.x + (i % 2 ? 12 : -12), y: P.y - 10, vx: Math.cos(an) * 380, vy: Math.sin(an) * 380, r: 5, p: 0, h: [], hm: 1, d: 3 * c.dm, c: SKINS[skin].b }); } shake = .2; }
        else if (a == 3) { const N = 8 + n * 3; for (let i = 0; i < N; i++) pb(c, R(30, W - 30), R(0, 50), 1.5708, 520, 4, 6); shake = .3; }
        else if (a == 4) { near(5 + n).forEach(e => { e.hp -= 10 * c.dm; e.hit = .1; burst(e.x, e.y, 10, PAP, 200); rings.push({ x: e.x, y: e.y, r: 4, m: 34, l: .25 }); }); flash = .12; shake = .25; }
        else if (a == 5) { for (const e of en) { e.hp -= 12 * c.dm; e.hit = .1; burst(e.x, e.y, 8, GLD); } flash = .35; shake = .6; S.big(); }
        else { const N = 16 + n * 6; for (let i = 0; i < N; i++) pb(c, P.x, P.y - 16, -1.5708 + (i - (N - 1) / 2) * .07, 540, 2.5, 4); shake = .2; }
        twist(c); S.pow();
    }
    function reflect(b) { bul.push({ x: b.x, y: b.y, vx: 0, vy: -520, r: 4, p: 0, h: [], hm: 1, d: 2 * (P.md || 1), c: SKINS[skin].b }); score += 3; rings.push({ x: b.x, y: b.y, r: 2, m: 14, l: .2 }); S.gz(); }
    function throwLamp() {
        if (state != 'play' || lamp || lampCd > 0) return;
        const c = SPC(0), a = c.a, n = c.q; lampCd = c.cd;
        if (a == 0) lamp = { x: P.x, y: P.y - 20, tx: cl(P.x, 40, W - 40), ty: Math.max(110, P.y - 190), t: 0, life: 4.5, n: 0, rd: c.rd, dm: c.dm };
        else if (a == 1) blast({ x: P.x, y: P.y - 10, n: 2, rd: c.rd, dm: c.dm });
        else if (a == 2) { const N = 8 + n * 4; for (let i = 0; i < N; i++) hb(c, P.x, P.y - 16, -1.5708 + (i - (N - 1) / 2) * .2); }
        else if (a == 3) { const N = 14 + n * 6; for (let i = 0; i < N; i++) hb(c, P.x, P.y, i * 6.283 / N); ringFx(P.x, P.y, 90 * c.rd); }
        else if (a == 4) { const y = P.y - 120; ebul = ebul.filter(b => Math.abs(b.y - y) > 110 * c.rd); for (const e of en) if (Math.abs(e.y - y) < 110 * c.rd + e.r) { e.hp -= 5 * c.dm; e.hit = .1; } ringFx(P.x, y, 200 * c.rd); flash = .12; }
        else if (a == 5) { const N = 7 + n * 3; for (let i = 0; i < N; i++) pb(c, R(30, W - 30), R(0, 50), 1.5708, 520, 4, 6); shake = .2; }
        else if (a == 6) { const M = 3 + n; for (let k = 0; k < 4; k++) for (let i = 0; i < M; i++) hb(c, P.x, P.y, k * 1.5708 + (i - (M - 1) / 2) * .09, 2, 330 + i * 40); ringFx(P.x, P.y, 70); }
        else { P.fx.R = Math.max(P.fx.R, 7 + n); P.fx.X = Math.max(P.fx.X, 7 + n); ringFx(P.x, P.y, 80); }
        twist(c); S.pow();
    }
    function blast(L) {
        L = L || lamp;
        if (L === lamp)
            lamp = null;
        const r = (110 + L.n * 4) * (L.rd || 1), dm = (5 + L.n * .5) * (L.dm || 1);
        for (const e of en.slice()) {
            if (D(e.x - L.x, e.y - L.y) < r + e.r) {
                e.hp -= e.k == 'boss' ? dm * 3 : dm;
                e.hit = .1;
                if (e.hp <= 0) {
                    en.splice(en.indexOf(e), 1);
                    kill(e);
                }
            }
        }
        ebul = ebul.filter(b => D(b.x - L.x, b.y - L.y) > r);
        rings.push({ x: L.x, y: L.y, r: 10, m: r, l: .4 });
        burst(L.x, L.y, 50 + L.n, GLD, r * 2.2);
        flash = .25;
        shake = .4;
        S.big();
    }
    function flare() {
        if (P.bomb <= 0 || state != 'play')
            return;
        P.bomb--;
        flash = .5;
        shake = .7;
        S.big();
        ebul = [];
        for (const e of en.slice()) {
            e.hp -= e.k == 'boss' ? 30 : 99;
            burst(e.x, e.y, 8);
            if (e.hp <= 0) {
                en.splice(en.indexOf(e), 1);
                kill(e);
            }
        }
    }
    function take(k) {
        const d = POW[k];
        S.pow();
        score += 10;
        if (k == 'P')
            P.tier = Math.min(5, P.tier + 1);
        else if (k == 'S')
            P.shield = 1;
        else if (k == 'B')
            P.bomb = Math.min(5, P.bomb + 1);
        else if (k == 'H')
            P.lives = Math.min(5, P.lives + 1);
        else
            P.fx[k] = d.t;
        pops.push({ x: P.x, y: P.y - 30, s: d.n.toUpperCase(), l: 1, c: d.c });
    }
    // ---- update ----
    function update(dt) {
        if (state == 'pause')
            return;
        time += dt;
        for (const s of stars) {
            s.y += s.z * (state == 'play' ? 70 : 28) * dt;
            if (s.y > H) {
                s.y = 0;
                s.x = R(0, W);
            }
        }
        for (const p of pt) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.l -= dt;
        }
        pt = pt.filter(p => p.l > 0);
        for (const p of pops) {
            p.y -= 30 * dt;
            p.l -= dt;
        }
        pops = pops.filter(p => p.l > 0);
        for (const q of rings) {
            q.r += (q.m - q.r) * Math.min(1, dt * 9);
            q.l -= dt;
        }
        rings = rings.filter(q => q.l > 0);
        for (const q of ghosts)
            q.l -= dt;
        ghosts = ghosts.filter(q => q.l > 0);
        for (const q of trl)
            q.l -= dt;
        trl = trl.filter(q => q.l > 0);
        shake = Math.max(0, shake - dt * 1.5);
        flash = Math.max(0, flash - dt);
        banner = Math.max(0, banner - dt);
        if (state == 'dead') {
            dead -= dt;
            if (dead <= 0)
                over();
            return;
        }
        if (state != 'play')
            return;
        rt += dt;
        if (wave !== lw) {
            wl.push({ wave: lw, score, t: +rt.toFixed(1) });
            lw = wave;
        }
        const f = P.fx;
        for (const k in f)
            f[k] = Math.max(0, f[k] - dt);
        const sl = f.T > 0 ? .45 : 1, ed = dt * sl;
        let dx = (keys.ArrowRight || keys.d || 0) - (keys.ArrowLeft || keys.a || 0), dy = (keys.ArrowDown || keys.s || 0) - (keys.ArrowUp || keys.w || 0);
        if (dx && dy) {
            dx *= .707;
            dy *= .707;
        }
        if (dx || dy) {
            P.ldx = dx;
            P.ldy = dy;
        }
        P.ph = Math.max(0, P.ph - dt);
        if (P.ph > 0)
            ghosts.push({ x: P.x, y: P.y, l: .3 });
        const ms = (P.sp > 0 ? .55 : 1) * (P.ph > 0 ? 1.5 : 1) * STAT[skin][0];
        P.x += dx * 340 * ms * dt;
        P.y += dy * 340 * ms * dt;
        if (ptr) {
            const k = Math.min(1, dt * 16 * set.sens * STAT[skin][0] * (P.ph > 0 ? 1.5 : 1)), ox = P.x, oy = P.y;
            P.x += (ptr.x - P.x) * k;
            P.y += (ptr.y - 70 - P.y) * k;
            if (Math.abs(P.x - ox) + Math.abs(P.y - oy) > .8) {
                P.ldx = P.x - ox;
                P.ldy = P.y - oy;
            }
        }
        if (P.dsh > 0) {
            P.dsh -= dt;
            P.x += P.dvx * dt;
            P.y += P.dvy * dt;
            P.inv = Math.max(P.inv, .2);
            ghosts.push({ x: P.x, y: P.y, l: .3 });
            for (const e of en)
                if (e.dh !== P.did && D(e.x - P.x, e.y - P.y) < e.r + 22) {
                    e.dh = P.did;
                    e.hp -= 4 * (P.dd || 1);
                    if (P.dtr) e.burn = 3;
                    e.hit = .1;
                    burst(e.x, e.y, 8, GLD, 160);
                }
        }
        P.x = cl(P.x, 16, W - 16);
        P.y = cl(P.y, 70, H - 92);
        P.cool -= dt;
        P.inv = Math.max(0, P.inv - dt);
        trl.push({ x: P.x, y: P.y + 13, l: .4 });
        if (Math.random() < .9)
            pt.push({ x: P.x + R(-4, 4), y: P.y + 16, vx: R(-14, 14), vy: R(70, 130), l: .35, m: .35, c: SKINS[skin].t, s: R(1.5, 3) });
        if (P.cool <= 0 && !(P.sp > 0)) {
            fire();
            P.cool = (.21 - P.tier * .014) * (f.R > 0 ? .55 : 1) / STAT[skin][1] / (1 + .8 * SAT(U(5), 250));
        }
        if (f.W > 0) {
            P.wc -= dt;
            if (P.wc <= 0) {
                P.wc = .3;
                for (let i = 0; i < 2; i++) {
                    const a = time * 3 + i * Math.PI;
                    bul.push({ x: P.x + Math.cos(a) * 38, y: P.y + Math.sin(a) * 12, vx: 0, vy: -600, r: 3, h: [], c: SKINS[skin].b });
                }
            }
        }
        comboT -= dt;
        if (comboT <= 0)
            combo = 0;
        lampCd = Math.max(0, lampCd - dt * RB(pg.up[0] | 0));
        cdD = Math.max(0, cdD - dt * RB(pg.up[1] | 0));
        cdM = Math.max(0, cdM - dt * RB(pg.up[2] | 0));
        cdS = Math.max(0, cdS - dt * RB(pg.up[3] | 0));
        if (P.mir > 0) {
            P.mir -= dt;
            for (const b of ebul)
                if (!b.dead && b.y < P.y + 12 && D(b.x - P.x, b.y - P.y) < 46) {
                    b.dead = 1;
                    reflect(b);
                }
        }
        if (P.sp > 0) {
            P.sp -= dt;
            if (1.45 - P.sp > .35) {
                const bo = BO(), hw = (bo.length > 1 ? 18 : 28) * SPC(3).rd;
                if (!P.sf) {
                    P.sf = 1;
                    S.big();
                    shake = .5;
                    flash = .15;
                }
                for (const e of en)
                    if (bo.some(o => Math.abs(e.x - P.x - o) < hw + e.r) && e.y < P.y) {
                        e.hp -= (e.k == 'boss' ? 22 : 18) * SPC(3).dm * dt;
                        e.hit = .05;
                    }
                for (const b of ebul)
                    if (bo.some(o => Math.abs(b.x - P.x - o) < hw + 4) && b.y < P.y)
                        b.dead = 1;
                if (Math.random() < .7)
                    pt.push({ x: P.x + bo[Math.random() * bo.length | 0] + R(-14, 14), y: R(0, P.y), vx: R(-30, 30), vy: R(-40, 40), l: .3, m: .3, c: GLD, s: 2.5 });
            }
        }
        if (lamp) {
            lamp.t += dt;
            const k = Math.min(1, dt * 5);
            lamp.x += (lamp.tx - lamp.x) * k;
            lamp.y += (lamp.ty - lamp.y) * k;
            for (const b of ebul)
                if (!b.dead && D(b.x - lamp.x, b.y - lamp.y) < 20) {
                    b.dead = 1;
                    lamp.n = Math.min(40, lamp.n + 1);
                    S.gz();
                }
            if (lamp.t >= lamp.life)
                blast();
        }
        spT -= dt;
        if (!boss && spT <= 0 && en.length < (wave > 5 ? 7 + (wave - 5) : 2 + wave)) {
            const n0 = en.length;
            spawn();
            for (let i = n0; i < en.length; i++) {
                en[i].hp = Math.max(1, Math.round(en[i].hp * DF().hp));
                en[i].mhp = en[i].hp;
            }
            spT = (wave > 5 ? Math.max(.28, 1.05 - (wave - 6) * .07) : 1.9 - wave * .12) / DF().sp;
        }
        evUpd(dt);
        for (const b of bul) {
            if (b.hm && en.length) {
                let n = null, bd = 1e9;
                for (const e of en) {
                    const d = D(e.x - b.x, e.y - b.y);
                    if (d < bd) {
                        bd = d;
                        n = e;
                    }
                }
                if (n) {
                    const a = Math.atan2(n.y - b.y, n.x - b.x), v = D(b.vx, b.vy), k = Math.min(1, dt * 6);
                    b.vx += (Math.cos(a) * v - b.vx) * k;
                    b.vy += (Math.sin(a) * v - b.vy) * k;
                }
            }
            b.x += b.vx * dt;
            b.y += b.vy * dt;
        }
        bul = bul.filter(b => b.y > -20 && b.y < H + 40 && b.x > -20 && b.x < W + 20);
        for (const b of ebul) {
            b.x += b.vx * ed;
            b.y += b.vy * ed;
            const d = D(b.x - P.x, b.y - P.y);
            if (d < b.r + P.r * .55) {
                b.dead = 1;
                hurt();
            }
            else if (d < b.r + 26 && !b.g && P.inv <= 0) {
                b.g = 1;
                if (gzW.w != wave) {
                    gzW.w = wave;
                    gzW.s = 0;
                }
                if (gzW.s < 100) {
                    score += 2;
                    gzW.s += 2;
                    gzTot += 2;
                }
                graze++;
                S.gz();
                if (graze >= GZ()) {
                    graze = 0;
                    P.bomb = Math.min(5, P.bomb + 1);
                    pops.push({ x: P.x, y: P.y - 30, s: 'FLARE CHARGED', l: 1, c: RED });
                }
            }
        }
        ebul = ebul.filter(b => !b.dead && b.y > -20 && b.y < H + 20 && b.x > -20 && b.x < W + 20);
        for (const e of en) {
            if (e.burn > 0) { e.burn -= dt; e.hp -= 2.2 * dt; if (Math.random() < .3) pt.push({ x: e.x + R(-8, 8), y: e.y + R(-8, 8), vx: 0, vy: -40, l: .3, m: .3, c: RED, s: 2 }); }
            if (e.fz > 0) e.fz -= dt;
            const ed = dt * sl * (e.fz > 0 ? .4 : 1);
            e.t += ed;
            const an = aimAt(e);
            if (e.k == 'drone') {
                if (lamp)
                    e.x0 += (lamp.x - e.x0) * Math.min(1, ed * .9);
                e.y += e.vy * ed;
                e.x = e.x0 + Math.sin(e.t * 3) * e.amp;
            }
            else if (e.k == 'rock') {
                e.y += e.vy * ed;
                e.x += e.vx * ed;
                e.rot += e.vr * ed;
            }
            else if (e.k == 'fighter') {
                if (e.y < 120)
                    e.y += 95 * ed;
                else {
                    if (lamp && Math.abs(lamp.x - e.x) > 12)
                        e.dir = Math.sign(lamp.x - e.x);
                    e.x += e.dir * 110 * ed;
                    if (e.x < 30 || e.x > W - 30)
                        e.dir *= -1;
                    if (e.t > 9)
                        e.y += 95 * ed;
                }
                e.cd -= ed;
                if (e.cd <= 0 && e.y > 0) {
                    es(e, an, bs());
                    e.cd = wave > 5 ? Math.max(.55, 1.7 - (wave - 6) * .09) : 2.6;
                }
            }
            else if (e.k == 'tank') {
                if (e.y < 100)
                    e.y += 38 * ed;
                else
                    e.x += Math.sin(e.t) * 40 * ed;
                e.cd -= ed;
                if (e.cd <= 0) {
                    es(e, Math.PI / 2, bs(), wave > 8 ? 5 : 3, .3);
                    e.cd = Math.max(1.1, 2 - (wave - 6) * .06);
                }
            }
            else if (e.k == 'bug') {
                e.y += 150 * ed;
                e.x = e.x0 + Math.sin(e.t * 4) * 28;
            }
            else if (e.k == 'sniper') {
                if (e.y < 95)
                    e.y += 70 * ed;
                else {
                    e.cd -= ed;
                    if (e.cd < .9)
                        e.ch = 1;
                    if (e.cd <= 0) {
                        const a = aimAt(e);
                        ebul.push({ x: e.x, y: e.y + 10, vx: Math.cos(a) * 430, vy: Math.sin(a) * 430, r: 6 });
                        e.cd = 2.4;
                        e.ch = 0;
                        S.hit();
                    }
                    if (e.t > 11)
                        e.y += 80 * ed;
                }
            }
            else if (e.k == 'mine') {
                e.y += 55 * ed;
                e.x += Math.sin(e.t) * 20 * ed;
            }
            else if (e.k == 'diver') {
                if (e.ph == 0) {
                    if (e.y < 100)
                        e.y += 140 * ed;
                    if (e.t < 1.3) {
                        e.x += (tg().x - e.x) * Math.min(1, ed * 3);
                        e.tx = e.x;
                    }
                    if (e.t > 2)
                        e.ph = 1;
                }
                else
                    e.y += 560 * ed;
            }
            else {
                const lo = e.hp < e.mhp * .5, sp = bs() - 25;
                if (e.y < 110)
                    e.y += 60 * ed;
                else {
                    e.x = W / 2 + Math.sin(e.t * (lo ? 1.1 : .8)) * (W / 2 - 70);
                    e.cd -= ed * (wave <= 5 ? .7 : Math.min(1.8, 1 + (wave - 6) * .06));
                    if (e.cd <= 0) {
                        e.ph++;
                        if (e.tier == 0) {
                            if (e.ph % 3 == 0)
                                for (let i = 0; i < (lo ? 20 : 14); i++)
                                    es(e, i / (lo ? 20 : 14) * 6.28 + e.t, sp);
                            else
                                es(e, an, sp + 60, lo ? 7 : 5, .22);
                            e.cd = lo ? .9 : 1.3;
                        }
                        else if (e.tier == 1) {
                            for (let i = 0; i < 3; i++)
                                es(e, e.t * 2.2 + i * 2.09, sp);
                            if (e.ph % 10 == 0)
                                es(e, an, sp + 80, 3, .18);
                            e.cd = lo ? .1 : .15;
                        }
                        else if (e.tier == 2) {
                            if (e.ph % 2 == 0) {
                                const gap = R(0, 11) | 0;
                                for (let i = 0; i < 12; i++)
                                    if (i != gap && i != gap + 1)
                                        ebul.push({ x: 20 + i * 40, y: e.y + 30, vx: 0, vy: sp, r: 5 });
                            }
                            else
                                es(e, an, sp + 60, 3, .2);
                            e.cd = lo ? .8 : 1.1;
                        }
                        else {
                            const n = lo ? 16 : 11;
                            for (let i = 0; i < n; i++)
                                es(e, i / n * 6.28 + e.ph * .35, sp - 10);
                            if (e.ph % 2 == 0)
                                es(e, an, sp + 90, lo ? 5 : 3, .16);
                            e.cd = lo ? .6 : .8;
                        }
                    }
                }
            }
            for (const b of bul) {
                if (b.dead || b.h.includes(e))
                    continue;
                if (D(b.x - e.x, b.y - e.y) < e.r + b.r) {
                    if (b.p)
                        b.h.push(e);
                    else
                        b.dead = 1;
                    e.hp -= b.d || 1;
                    e.hit = .07;
                    if (e.k != 'boss')
                        S.hit();
                    burst(b.x, b.y, 2, PAP, 80);
                }
            }
            if (e.hit > 0)
                e.hit -= dt;
            if (D(e.x - P.x, e.y - P.y) < e.r + P.r * .6) {
                if (e.k != 'boss')
                    e.hp = 0;
                hurt();
            }
        }
        bul = bul.filter(b => !b.dead);
        for (const e of en.slice())
            if (e.hp <= 0) {
                en.splice(en.indexOf(e), 1);
                kill(e);
            }
        en = en.filter(e => e.y < H + 60 && e.x > -90 && e.x < W + 90);
        for (const p of pw) {
            p.t += dt;
            p.y += 70 * dt;
            p.x += Math.sin(p.t * 2) * 18 * dt;
            {
                const mr = (f.M > 0 ? 190 : 0) + 160 * SAT(U(6), 200), d = D(P.x - p.x, P.y - p.y);
                if (mr > 0 && d < mr && d > 1) {
                    p.x += (P.x - p.x) / d * 320 * dt;
                    p.y += (P.y - p.y) / d * 320 * dt;
                }
            }
            if (D(p.x - P.x, p.y - P.y) < 24) {
                p.dead = 1;
                take(p.k);
            }
        }
        pw = pw.filter(p => !p.dead && p.y < H + 20);
    }
    function dbg() { try {
        const r = { score, wave, secs: Math.round(rt), perMin: Math.round(score / Math.max(1, rt / 60)), maxChain: maxC, kills: rk, bosses: rb, grazePts: gzTot, perWave: wl };
        console.log('[LL balance]', r);
        const a = JSON.parse(localStorage.getItem('ll_dbg') || '[]');
        a.push(r);
        localStorage.setItem('ll_dbg', JSON.stringify(a.slice(-30)));
    }
    catch (e) { } }
    function over() {
        dbg();
        saveStats();
        const old = hi;
        if (score > hi) {
            hi = score;
            try {
                if (acc)
                    acSave();
                else
                    localStorage.setItem('ll_hi', hi);
            }
            catch (e) { }
        }
        const nu = SKINS.filter(k => k.u > old && k.u <= hi).map(k => k.n);
        $('o1').textContent = score.toLocaleString();
        $('o2').textContent = wave;
        $('o3').textContent = '\u00D7' + maxC;
        $('o4').textContent = hi.toLocaleString();
        runMsg = endRun();
        show('over');
        post(nu, score, wave);
    }
    // ---- draw ----
    function poly(x, y, pts, fill, off, rot = 0, s = 1) {
        g.save();
        g.translate(x, y);
        g.rotate(rot);
        g.scale(s, s);
        for (const [o, c] of [[2.6, off], [0, fill]]) {
            if (!c)
                continue;
            g.fillStyle = c;
            g.beginPath();
            pts.forEach((v, i) => g[i ? 'lineTo' : 'moveTo'](v[0] + o, v[1] + o));
            g.closePath();
            g.fill();
        }
        g.restore();
    }
    function txt(s, x, y, sz, c = PAP, al = 'left', w = 600) { g.font = `${w} ${sz}px "IBM Plex Mono",ui-monospace,monospace`; g.textAlign = al; g.fillStyle = c; g.fillText(s, x, y); }
    function dia(x, y, r, c) { g.fillStyle = c; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r, y); g.lineTo(x, y + r); g.lineTo(x - r, y); g.closePath(); g.fill(); }
    const SIL = [[0, -27], [7, -6], [27, 19], [24, 23], [6, 15], [0, 14], [-6, 15], [-24, 23], [-27, 19], [-7, -6]];
    function P2(pts, c) { g.fillStyle = c; g.beginPath(); pts.forEach((v, i) => g[i ? 'lineTo' : 'moveTo'](v[0], v[1])); g.closePath(); g.fill(); }
    function glow(x, y, r, c, a = .5) { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, c); q.addColorStop(1, 'rgba(20,22,31,0)'); g.globalAlpha = a; g.fillStyle = q; g.beginPath(); g.arc(x, y, r, 0, 6.28); g.fill(); g.globalAlpha = 1; }
    function craft(x, y, s, fl, L, Dk, A, Cn, fw, fa, fc) {
        g.save();
        g.translate(x, y);
        g.scale(s, fl ? -s : s);
        const f = (fa || 1) * (8 + Math.random() * 9);
        const q = fc || [RED, GLD, PAP];
        glow(0, 20, 24, q[1], .3);
        P2([[-5, 12], [5, 12], [0, 12 + f * 1.7]], q[0]);
        P2([[-3.5, 12], [3.5, 12], [0, 12 + f * 1.15]], q[1]);
        P2([[-2, 12], [2, 12], [0, 12 + f * .6]], q[2]);
        const wl = fw ? [[-6, -8], [-28, -2], [-26, 7], [-6, 13]] : [[-6, -2], [-26, 18], [-24, 22], [-6, 14]], wr = wl.map(v => [-v[0], v[1]]);
        P2(wl, Dk);
        P2(wr, Dk);
        P2(wr, 'rgba(0,0,0,.25)');
        P2([wl[1], wl[2], [wl[2][0] + 4, wl[2][1] - 5]], A);
        P2([wr[1], wr[2], [wr[2][0] - 4, wr[2][1] - 5]], A);
        if (fw) {
            g.fillStyle = '#3b3d4a';
            g.fillRect(-29, 4, 3, 12);
            g.fillRect(26, 4, 3, 12);
            glow(-27.5, 16, 6, RED, .8);
            glow(27.5, 16, 6, RED, .8);
        }
        const fu = [[0, -26], [7, -6], [6, 14], [0, 12]], fx = fu.map(v => [-v[0], v[1]]);
        P2(fx, L);
        P2(fu, L);
        P2(fu, 'rgba(0,0,0,.22)');
        P2([[0, -26], [-4, -14], [4, -14]], A);
        P2([[0, -13], [-3.6, -3], [0, 1], [3.6, -3]], Cn);
        P2([[0, -12], [-1.8, -6], [0, -3.5]], 'rgba(255,255,255,.55)');
        g.fillStyle = '#3b3d4a';
        g.fillRect(-7, 10, 4, 5);
        g.fillRect(3, 10, 4, 5);
        g.strokeStyle = 'rgba(20,22,31,.4)';
        g.lineWidth = .8;
        g.beginPath();
        g.moveTo(0, 2);
        g.lineTo(0, 12);
        g.moveTo(-6, 5);
        g.lineTo(-19, 17);
        g.moveTo(6, 5);
        g.lineTo(19, 17);
        g.stroke();
        g.restore();
    }
    // ---- 12 unique hull structures: [mode, right-half points, color]; f=mirrored whole, s=two sides, h=as is ----
    const HULL = [
        { e: [[0, 14]], p: [['f', [[0, -28], [24, 16], [8, 10], [0, 16]], 'L'], ['h', [[0, -28], [3, -10], [0, -2]], 'A'], ['f', [[0, -8], [3.5, 0], [0, 6]], 'C']] },
        { e: [[-4, 14], [4, 14]], p: [['s', [[6, -4], [30, -22], [34, -14], [10, 12]], 'D'], ['s', [[7, 6], [15, 16], [7, 14]], 'D'], ['f', [[0, -30], [6, -10], [7, 12], [0, 14]], 'L'], ['s', [[30, -18], [33, -18], [33, -32], [30, -32]], 'G'], ['s', [[30, -32], [33, -32], [31.5, -37]], 'A'], ['f', [[0, -16], [3.5, -6], [0, 0]], 'C']] },
        { e: [[-12, 16], [12, 16], [0, 14]], p: [['s', [[10, -14], [14, -14], [14, 16], [10, 16]], 'L'], ['h', [[-10, 10], [10, 10], [10, 14], [-10, 14]], 'D'], ['s', [[5, -4], [30, 0], [30, 6], [5, 8]], 'D'], ['s', [[28, -3], [32, -3], [32, 9], [28, 9]], 'A'], ['s', [[10, -14], [12, -22], [14, -14]], 'A'], ['f', [[0, -26], [5, -8], [5, 10], [0, 14]], 'L'], ['f', [[0, -16], [3, -8], [0, -2]], 'C']] },
        { e: [[-6, 13], [6, 13]], p: [['f', [[0, -30], [10, -6], [30, 14], [22, 18], [8, 10], [0, 14]], 'L'], ['s', [[10, -6], [30, 14], [26, 14], [9, -1]], 'A'], ['f', [[0, -14], [3, -6], [0, 0]], 'C']] },
        { e: [[0, 13]], p: [['s', [[24, 6], [36, 22], [29, 22], [20, 14]], 'A'], ['s', [[4, -8], [16, -22], [32, -28], [24, -12], [28, 6], [18, 18], [4, 12]], 'D'], ['s', [[5, -4], [18, -12], [22, -4], [10, 10], [5, 8]], 'A'], ['f', [[0, -28], [5, -6], [4, 14], [0, 12]], 'L'], ['f', [[0, -16], [2.6, -8], [0, -2]], 'C']] },
        { e: [[-7, 18], [7, 18]], p: [['s', [[18, -4], [36, 2], [18, 6]], 'A'], ['s', [[13, 13], [24, 26], [9, 19]], 'D'], ['f', [[0, -32], [5, -17], [0, -14]], 'A'], ['f', [[0, -18], [13, -13], [18, 0], [13, 13], [0, 18]], 'L'], ['f', [[0, -11], [8, -8], [11, 0], [8, 8], [0, 11]], 'D'], ['f', [[0, -6], [5, 0], [0, 6]], 'C']] },
        { e: [[0, 12], [-23, 12], [23, 12]], p: [['s', [[6, 0], [20, -2], [20, 2], [6, 5]], 'D'], ['s', [[23, -14], [29, -8], [29, 6], [23, 12], [17, 6], [17, -8]], 'D'], ['s', [[23, -8], [26, 0], [23, 8], [20, 0]], 'A'], ['f', [[0, -30], [6, -8], [6, 12], [0, 10]], 'L'], ['f', [[0, -16], [3, -8], [0, -2]], 'C']] },
        { e: [[0, 17]], p: [['s', [[4, 0], [28, 6], [24, 16], [6, 10]], 'A'], ['s', [[4, -12], [26, -24], [32, -14], [8, 0]], 'D'], ['f', [[0, -30], [4, -14], [5, 14], [0, 18]], 'L'], ['f', [[0, -18], [3, -10], [0, -4]], 'C']] },
        { e: [[0, 15]], p: [['s', [[3, -14], [18, -8], [34, 10], [27, 8], [22, 16], [15, 10], [9, 18], [3, 10]], 'D'], ['s', [[6, -10], [18, -4], [8, 4]], 'A'], ['f', [[0, -28], [5, -10], [4, 14], [0, 16]], 'L'], ['f', [[0, -16], [2.6, -8], [0, -2]], 'C']] },
        { e: [[-6, 18], [6, 18], [-26, 10], [26, 10]], p: [['s', [[9, -4], [30, 2], [32, 16], [10, 14]], 'D'], ['s', [[24, -8], [28, -8], [28, 10], [24, 10]], 'G'], ['s', [[24, -8], [28, -8], [26, -15]], 'A'], ['f', [[0, -28], [9, -14], [10, 10], [6, 18], [0, 16]], 'L'], ['s', [[9, -14], [16, -12], [13, -2], [9, -4]], 'A'], ['f', [[0, -18], [4, -8], [0, -2]], 'C']] },
        { e: [[0, 14], [-12, 13], [12, 13]], p: [['s', [[16, 4], [30, 0], [26, 18], [16, 16]], 'A'], ['s', [[6, -6], [18, -20], [22, -2], [12, 14]], 'D'], ['f', [[0, -32], [6, -8], [0, 16]], 'L'], ['f', [[0, -14], [3, -6], [0, 0]], 'C']] },
        { e: [[-5, 13], [5, 13]], p: [['s', [[5, -6], [34, 12], [26, 18], [5, 8]], 'D'], ['s', [[10, -2], [34, 12], [30, 14], [8, 3]], 'A'], ['s', [[16, 2], [34, 12], [32, 13], [14, 6]], 'C'], ['f', [[0, -30], [8, 10], [0, 14]], 'L'], ['f', [[0, -12], [3, -4], [0, 2]], 'W']] }
    ];
    // ---- expansion: 6 skill variants per slot, 50 rockets, 10 extra upgrades ----
    SKD[0].push(['Pulse ring', '20 homing bolts in a ring'], ['Bulwark wall', 'erase bullets, hurt foes in a band'], ['Overcharge', 'rapid fire and pierce for 7 s']);
    SKD[1].push(['Rift jump', 'mirror-swap sides, blast on arrival'], ['Bastion', '1 s shield and a ring of bolts'], ['Surge', '2 s of extreme speed']);
    SKD[2].push(['Siphon', 'drain nearby foes, gain a shield'], ['Overdrive', 'wingmen and rapid fire for 8 s'], ['Gravity', 'slow every bullet on screen']);
    SKD[3].push(['Meteors', 'rain of piercing rocks'], ['Arc lightning', 'strike the 6 nearest foes'], ['Orbital', 'damage every foe on screen']);
    SKCD[0].push(12, 10, 13);
    SKCD[1].push(6, 8, 8);
    SKCD[2].push(10, 12, 11);
    SKCD[3].push(13, 12, 16);
    const UPX = [{ n: 'Hull plating', d: '+1 hull per 150 levels (max +5)', m: 2, b: 500 }, { n: 'Rapid cannons', d: 'up to +80% fire rate', m: 5, b: 300 }, { n: 'Salvage magnet', d: 'pickup pull range, up to +160', m: 3, b: 350 }, { n: 'Fortune', d: 'up to 4x coins per run', m: 5, b: 400 }, { n: 'Flare stock', d: '+1 flare per 100 levels (max +4)', m: 2, b: 600 }, { n: 'Aegis start', d: 'start shielded, +0.25 s safety per 100 levels', m: 1, b: 900 }, { n: 'Graze coil', d: 'flares charge up to 40% faster', m: 3, b: 450 }, { n: 'Lucky drops', d: 'up to +25% drop chance', m: 4, b: 500 }, { n: 'Score amplifier', d: 'up to 2x score', m: 5, b: 700 }, { n: 'Chain keeper', d: 'chain lasts up to +1.5 s', m: 3, b: 550 }];
    UPX.forEach(u => u.m = 1000);
    const U = i => (pg.up[i] | 0), RB = L => 1 + 3 * (1 - Math.exp(-L / 200)), SAT = (L, k) => 1 - Math.exp(-L / k), GZ = () => 30 - Math.round(18 * SAT(U(10), 200)), UC = (i, L) => Math.round((i < 4 ? 200 : UPX[i - 4].b) * (1 + L * .3));
    const UI = (i, n, d, mx, cs, b) => { const L = U(i), c = UC(i, L); return `<div class="mi bx"><div>${n}<br><small>${d} &middot; Level ${L}/${mx}</small></div>${L >= mx ? '<small>MAX</small>' : `<div style="display:flex;gap:1.4cqw"><button class="sm" data-u="${i}" ${pg.coins < c ? 'disabled' : ''}>${c.toLocaleString()}</button><button class="sm" data-u="${i}" data-n="10" ${pg.coins < c ? 'disabled' : ''}>x10</button><button class="sm" data-u="${i}" data-n="100" ${pg.coins < c ? 'disabled' : ''}>x100</button></div>`}</div>`; };
    [0, 3000, 8000, 15000, 25000, 40000, 60000, 85000, 115000, 150000, 200000, 260000].forEach((u, i) => SKINS[i].u = u);
    const NM = ['Vesper', 'Corsair', 'Mistral', 'Halcyon', 'Zephyr', 'Onyx', 'Cinder', 'Lumen', 'Talon', 'Sable', 'Vortex', 'Quasar', 'Pulsar', 'Helios', 'Nyx', 'Boreal', 'Cobalt', 'Garnet', 'Marigold', 'Orchid', 'Falcon', 'Tempest', 'Mirage', 'Eclipse', 'Comet', 'Rune', 'Sentinel', 'Wraith', 'Valkyrie', 'Titan', 'Seraph', 'Draco', 'Orion', 'Lyra', 'Fenix', 'Chimera', 'Apex', 'Zenith'];
    const hs = (i, k) => { let h = Math.imul(i * 977 + k * 40503 + 13, 2654435761) >>> 0; h ^= h >>> 13; h = Math.imul(h, 1274126177) >>> 0; return (h ^ (h >>> 16)) >>> 0; };
    {
        const used = new Set(SKINS.map(k => k.k.join()));
        let q = 0;
        NM.forEach((n, j) => {
            const r = k => hs(j + 7, k), hue = r(1) % 360, h2 = (hue + 90 + r(2) % 160) % 360, sat = 45 + r(3) % 45, lt = 38 + r(4) % 32, pr = j / 37;
            let kk;
            do {
                const x = (q++ * 131 + 17) % 1296;
                kk = [x % 6, (x / 6 | 0) % 6, (x / 36 | 0) % 6, (x / 216 | 0) % 6];
            } while (used.has(kk.join()) || !kk.some(v => v > 2));
            used.add(kk.join());
            const hl = j % 5 == 4, A = `hsl(${h2},85%,62%)`;
            SKINS.push({ n, u: Math.round(330000 * Math.pow(1.069, j) / 5000) * 5000, L: `hsl(${hue},${sat}%,${lt}%)`, D: `hsl(${hue},${sat}%,${lt * .55 | 0}%)`, A, C: `hsl(${h2},90%,85%)`, w: 0, f: [`hsl(${h2},90%,55%)`, `hsl(${h2},95%,75%)`, '#fff'], o: A, t: A, b: j >= 36 ? 'rainbow' : `hsl(${h2},95%,70%)`, k: kk, d: 'Rank ' + (j + 13) + ' hull.' });
            STAT.push([+(.92 + pr * .12 + (r(5) % 12) / 100 - (hl ? .06 : 0)).toFixed(2), +(.94 + pr * .12 + (r(6) % 10) / 100).toFixed(2), hl ? 1 : 0]);
            const w = 14 + r(7) % 16, sw = r(8) % 14, nl = 24 + r(9) % 10, fw = 4 + r(10) % 5, ex = r(11) % 3, p = [['s', [[5, (-8 + sw / 2) | 0], [w + 6, sw - 4], [w + 2, 16], [5, 12]], 'D'], ['s', [[w + 6, sw - 4], [w + 9, sw + 8], [w + 2, 16]], 'A'], ['f', [[0, -nl], [fw + 1, -8], [fw + 2, 12], [0, 15]], 'L'], ['f', [[0, -14], [3, -7], [0, -1]], 'C']];
            if (r(12) % 2)
                p.unshift(['s', [[4, -16], [10 + r(13) % 10, -12], [4, -5]], 'D']);
            if (r(14) % 3 == 0)
                p.push(['s', [[w - 4, 2], [w, 2], [w, 14], [w - 4, 14]], 'G']);
            if (r(15) % 2)
                p.push(['s', [[4, 8], [9 + r(16) % 8, 22], [4, 17]], 'A']);
            HULL.push({ e: ex == 0 ? [[0, 14]] : ex == 1 ? [[-5, 13], [5, 13]] : [[0, 14], [-11, 13], [11, 13]], p });
        });
    }
    const SPC = s => SKINS[skin].sk[s];
    const hb = (c, x, y, a, d = 2, sp = 400) => bul.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 4, p: 0, h: [], hm: 1, d: d * c.dm, c: SKINS[skin].b });
    const pb = (c, x, y, a, sp, d = 3, r = 5) => bul.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r, p: 1, h: [], d: d * c.dm, c: SKINS[skin].b });
    const near = n => en.slice().sort((a, b) => D(a.x - P.x, a.y - P.y) - D(b.x - P.x, b.y - P.y)).slice(0, n);
    const ringFx = (x, y, m) => rings.push({ x, y, r: 6, m, l: .35 });
    const TW = [['Burn', 'sets foes ablaze'], ['Frost', 'chills foes'], ['Shock', 'jolts the 4 nearest foes'], ['Aegis', 'grants a shield'], ['Haste', 'rapid fire for 4 s'], ['Pierce', 'piercing shots for 5 s'], ['Wingmen', 'escort drones for 5 s'], ['Magnet', 'pulls salvage for 6 s'], ['Bounty', 'bonus coins and score'], ['Purge', 'wipes nearby bullets'], ['Stillness', 'slows enemy time 2.5 s'], ['Charge', 'charges your flare']];
    function twist(c) {
        const t = c.tw; if (t < 0) return;
        const rr = 260 * c.rd;
        if (t == 0) { for (const e of en) if (D(e.x - P.x, e.y - P.y) < rr) e.burn = 3; }
        else if (t == 1) { for (const e of en) if (D(e.x - P.x, e.y - P.y) < rr) e.fz = 2.5; }
        else if (t == 2) near(4).forEach(e => { e.hp -= 4 * c.dm; e.hit = .1; burst(e.x, e.y, 6, PAP, 160); });
        else if (t == 3) P.shield = 1;
        else if (t == 4) P.fx.R = Math.max(P.fx.R, 4);
        else if (t == 5) P.fx.X = Math.max(P.fx.X, 5);
        else if (t == 6) P.fx.W = Math.max(P.fx.W, 5);
        else if (t == 7) P.fx.M = Math.max(P.fx.M, 6);
        else if (t == 8) { rc += 15; score += 300; }
        else if (t == 9) ebul = ebul.filter(b => D(b.x - P.x, b.y - P.y) > 140 * c.rd);
        else if (t == 10) P.fx.T = Math.max(P.fx.T, 2.5);
        else graze = Math.min(29, graze + 10);
        pops.push({ x: P.x, y: P.y - 30, s: TW[t][0].toUpperCase(), l: 1, c: GLD });
    }
    // 8 archetypes per skill slot: [name, description, base cooldown]
    const AR = [
        [['Lantern', 'hang a lamp that eats bullets, then bursts', 11], ['Nova', 'instant burst around you', 9], ['Storm', 'fan of homing bolts', 10], ['Halo', 'ring of homing bolts', 12], ['Wall', 'scrub bullets and foes in a band', 10], ['Rain', 'piercing bolts fall from above', 13], ['Cross', 'four arms of homing bolts', 11], ['Overcharge', 'rapid fire and pierce', 13]],
        [['Comet dash', 'dash through fire, slicing foes', 3.5], ['Blink', 'teleport and strike on arrival', 4], ['Phase', 'invulnerable speed surge', 7], ['Rift', 'swap sides, blast on arrival', 6], ['Bastion', 'brief invulnerability, ring of bolts', 8], ['Recoil', 'leap back and fire a fan', 5], ['Surge', 'long speed burst with rapid fire', 8], ['Afterburn', 'fast dash that ignites foes', 4.5]],
        [['Mirror', 'reflect bullets as homing shots', 8], ['Stasis', 'slow enemy time', 10], ['Barrier', 'shield and push bullets away', 9], ['Siphon', 'drain foes, gain a shield', 10], ['Overdrive', 'wingmen and rapid fire', 12], ['Gravity', 'slow every bullet on screen', 11], ['Purge', 'turn nearby bullets into your bolts', 10], ['Vortex', 'pull foes in and crush them', 11]],
        [['Sunspear', 'charge a piercing beam', 14], ['Twin beam', 'two piercing beams', 14], ['Missiles', 'launch homing missiles', 11], ['Meteors', 'rain of piercing rocks', 13], ['Arc lightning', 'strike the nearest foes', 12], ['Orbital', 'damage every foe on screen', 16], ['Tri-beam', 'three piercing beams', 16], ['Barrage', 'cone of piercing bolts', 12]]];
    // each skin gets a codeword: any two rockets share at most ONE archetype, then numbers/twist/name differ again
    const MP = [[0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 7], [0, 1, 2, 3, 4, 6, 7], [0, 1, 2, 3, 5, 6, 7]];
    SKINS.forEach((K, i) => {
        const r = k => hs(i + 101, k), pr = i / 49, x = i % 7, y = i / 7 | 0, cw = [x, y, (x + y) % 7, (x + 2 * y) % 7];
        K.sk = [0, 1, 2, 3].map(s => {
            const a = i < 49 ? MP[s][cw[s]] : [7, 6, 5, 4][s], A = AR[s][a], f = i == 0;
            const o = { a, q: f ? 0 : r(s * 9 + 1) % 3, dm: f ? 1 : +(.85 + pr * .55 + (r(s * 9 + 2) % 40) / 100).toFixed(2), rd: f ? 1 : +(.85 + (r(s * 9 + 3) % 60) / 100).toFixed(2), tw: f ? -1 : (r(s * 9 + 5) + i * 3 + s) % 12 };
            o.cd = +(A[2] * (f ? 1 : .8 + (r(s * 9 + 4) % 50) / 100)).toFixed(1);
            o.n = f ? A[0] : K.n + ' ' + A[0];
            o.d = A[1] + (o.tw >= 0 ? ' + ' + TW[o.tw][1] : '');
            if (s == 3) o.bo = a == 0 ? [0] : a == 1 ? [-55, 55] : a == 6 ? [-80, 0, 80] : null;
            return o;
        });
        if (i >= 12) K.d = 'Rank ' + (i + 1) + ' hull. Ultimate: ' + K.sk[3].n + '.';
    });
    function ship(x, y, s, K, fa, sil) {
        const H = HULL[SKINS.indexOf(K)], Q = { L: K.L, D: K.D, A: K.A, C: K.C, G: '#3b3d4a', W: '#fff' }, f = (fa || 1) * (8 + Math.random() * 9), q = K.f;
        const dr = (t, p, c, ln) => {
            const m = a => a.map(v => [-v[0], v[1]]), one = a => { g.fillStyle = c; g.beginPath(); a.forEach((v, i) => g[i ? 'lineTo' : 'moveTo'](v[0], v[1])); g.closePath(); g.fill(); if (ln) {
                g.strokeStyle = 'rgba(20,22,31,.45)';
                g.lineWidth = .7;
                g.stroke();
            } };
            if (t == 'h')
                one(p);
            else if (t == 'f')
                one(p.concat(m(p).reverse()));
            else {
                one(p);
                one(m(p));
            }
        };
        g.save();
        g.translate(x, y);
        g.scale(s, s);
        if (sil) {
            g.save();
            g.translate(2.4, 2.4);
            for (const [t, p] of H.p)
                dr(t, p, K.o);
            g.restore();
        }
        for (const [ex, ey] of H.e) {
            glow(ex, ey + 6, 18, q[1], .3);
            P2([[ex - 4.5, ey], [ex + 4.5, ey], [ex, ey + f * 1.6]], q[0]);
            P2([[ex - 3, ey], [ex + 3, ey], [ex, ey + f * 1.1]], q[1]);
            P2([[ex - 1.6, ey], [ex + 1.6, ey], [ex, ey + f * .55]], q[2]);
        }
        for (const [t, p, k] of H.p) {
            dr(t, p, Q[k], 1);
            if (t == 'f' && (k == 'L' || k == 'D'))
                dr('h', p, 'rgba(0,0,0,.2)');
            if (k == 'C')
                dr('h', p, 'rgba(255,255,255,.38)');
        }
        g.restore();
    }
    function sniperArt(e, h) {
        const a = aimAt(e);
        if (e.ch) {
            g.save();
            g.strokeStyle = RED;
            g.globalAlpha = .4 + .5 * Math.sin(time * 40);
            g.lineWidth = 1.5;
            g.setLineDash([4, 6]);
            g.beginPath();
            g.moveTo(e.x, e.y);
            g.lineTo(e.x + Math.cos(a) * 900, e.y + Math.sin(a) * 900);
            g.stroke();
            g.restore();
        }
        g.save();
        g.translate(e.x, e.y);
        P2([[0, -16], [10, 10], [0, 5], [-10, 10]], h ? PAP : '#6d28d9');
        P2([[0, -16], [10, 10], [0, 5]], 'rgba(0,0,0,.28)');
        P2([[-16, 2], [-9, -6], [-9, 8]], '#3b3d4a');
        P2([[16, 2], [9, -6], [9, 8]], '#3b3d4a');
        g.save();
        g.rotate(a - Math.PI / 2);
        g.fillStyle = PAP;
        g.fillRect(-2, 0, 4, 24);
        g.fillStyle = RED;
        g.fillRect(-2.5, 22, 5, 3);
        g.restore();
        glow(0, 0, 14, '#a78bfa', .4);
        g.fillStyle = INK;
        g.beginPath();
        g.arc(0, 0, 4, 0, 6.28);
        g.fill();
        g.restore();
    }
    function bugArt(e, h) { g.save(); g.translate(e.x, e.y); glow(0, 0, 13, '#34d399', .35); P2([[0, 9], [9, 0], [0, -9], [-9, 0]], h ? PAP : '#10b981'); P2([[0, 9], [9, 0], [0, -9]], 'rgba(0,0,0,.25)'); g.fillStyle = INK; g.beginPath(); g.arc(0, 0, 3, 0, 6.28); g.fill(); g.restore(); }
    function podArt(e, h) {
        const a = aimAt(e);
        g.save();
        g.translate(e.x, e.y);
        g.strokeStyle = MUT;
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(3, -12);
        g.lineTo(7, -24);
        g.stroke();
        g.fillStyle = GLD;
        g.fillRect(5, -27, 4, 4);
        P2([[-3, -13], [3, -13], [0, -19 - Math.random() * 6]], GLD);
        g.fillStyle = '#6a6d7c';
        g.fillRect(-15, -2, 30, 4);
        g.fillStyle = '#3b3d4a';
        g.fillRect(-25, -10, 11, 20);
        g.fillRect(14, -10, 11, 20);
        g.fillStyle = 'rgba(240,180,41,.55)';
        for (let i = 0; i < 3; i++) {
            g.fillRect(-24, -8 + i * 6, 9, 1);
            g.fillRect(15, -8 + i * 6, 9, 1);
        }
        g.fillStyle = h ? PAP : e.gold ? GLD : RED;
        g.beginPath();
        g.arc(0, 0, 13, 0, 6.28);
        g.fill();
        g.fillStyle = 'rgba(0,0,0,.25)';
        g.beginPath();
        g.arc(0, 0, 13, -.5, 2.6);
        g.arc(-3, -3, 11, 2.6, -.5, true);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,.35)';
        g.beginPath();
        g.ellipse(-5, -6, 5, 3, -.6, 0, 6.28);
        g.fill();
        g.strokeStyle = GLD;
        g.lineWidth = 2;
        g.beginPath();
        g.arc(0, 0, 13, 0, 6.28);
        g.stroke();
        glow(0, 0, 18, RED, .35 + .25 * Math.sin(time * 6));
        g.fillStyle = INK;
        g.beginPath();
        g.arc(0, 2, 6, 0, 6.28);
        g.fill();
        g.fillStyle = PAP;
        g.beginPath();
        g.arc(Math.cos(a) * 2.5, 2 + Math.sin(a) * 2.5, 2.2, 0, 6.28);
        g.fill();
        g.restore();
    }
    function tankArt(e, h) {
        const a = aimAt(e), T = h ? PAP : TEA, K = h ? PAP : '#1f6d63';
        g.save();
        g.translate(e.x, e.y);
        for (const s of [-1, 1]) {
            P2([[s * 24, -16], [s * 35, -12], [s * 35, 18], [s * 24, 22]], K);
            glow(s * 29, -17, 10, RED, .45);
            P2([[s * 27, -16], [s * 31, -16], [s * 29, -22 - Math.random() * 6]], GLD);
        }
        P2([[-24, -14], [-14, -24], [14, -24], [24, -14], [24, 12], [14, 24], [-14, 24], [-24, 12]], T);
        P2([[-17, -9], [-10, -17], [10, -17], [17, -9], [17, 9], [10, 17], [-10, 17], [-17, 9]], K);
        P2([[0, -24], [14, -24], [24, -14], [24, 12], [14, 24], [0, 24]], 'rgba(0,0,0,.28)');
        g.fillStyle = GLD;
        for (const [rx, ry] of [[-20, -12], [20, -12], [-20, 10], [20, 10]]) {
            g.beginPath();
            g.arc(rx, ry, 1.8, 0, 6.28);
            g.fill();
        }
        g.fillStyle = RED;
        g.fillRect(-6, 19, 12, 3);
        g.fillStyle = INK;
        g.beginPath();
        g.arc(0, 0, 10, 0, 6.28);
        g.fill();
        g.strokeStyle = PAP;
        g.lineWidth = 1.5;
        g.stroke();
        g.save();
        g.rotate(a);
        g.fillStyle = PAP;
        g.fillRect(4, -2.5, 18, 5);
        g.fillStyle = RED;
        g.fillRect(20, -2.5, 3, 5);
        g.restore();
        g.fillStyle = MUT;
        g.beginPath();
        g.arc(0, 0, 4, 0, 6.28);
        g.fill();
        g.restore();
    }
    function missileArt(e, h) {
        const fast = e.ph == 1, fl = fast ? 26 : 8;
        g.save();
        g.translate(e.x, e.y);
        glow(0, -18, fast ? 30 : 14, GLD, fast ? .55 : .25);
        P2([[-3.5, -14], [3.5, -14], [0, -14 - fl - Math.random() * 6]], RED);
        P2([[-2, -14], [2, -14], [0, -14 - fl * .6]], GLD);
        P2([[4, -4], [13, -19], [4, -14]], '#b9b09a');
        P2([[-4, -4], [-13, -19], [-4, -14]], '#b9b09a');
        P2([[-4, 12], [4, 12], [4, -14], [-4, -14]], h ? '#fff' : '#e4dac2');
        P2([[0, 12], [4, 12], [4, -14], [0, -14]], 'rgba(0,0,0,.25)');
        P2([[0, 25], [4, 12], [-4, 12]], RED);
        g.fillStyle = RED;
        g.fillRect(-4, -3, 8, 3);
        g.restore();
    }
    function mineArt(e, h) {
        g.save();
        g.translate(e.x, e.y);
        g.rotate(e.t * .8);
        for (let i = 0; i < 8; i++) {
            g.save();
            g.rotate(i * .7854);
            P2([[-4, -12], [4, -12], [0, -25]], h ? PAP : '#5a5d6e');
            g.restore();
        }
        g.fillStyle = h ? PAP : '#2b2d38';
        g.beginPath();
        g.arc(0, 0, 14, 0, 6.28);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,.14)';
        g.beginPath();
        g.arc(-4, -4, 9, 0, 6.28);
        g.fill();
        g.restore();
        const on = Math.sin(e.t * 7) > 0;
        glow(e.x, e.y, on ? 28 : 12, RED, on ? .6 : .25);
        g.fillStyle = on ? RED : '#6a2a22';
        g.beginPath();
        g.arc(e.x, e.y, 4, 0, 6.28);
        g.fill();
    }
    function bossArt(e, h) {
        const c = [RED, TEA, GLD, '#8b5cf6'][e.tier], d = ['#8e2a1a', '#1c6359', '#a8780f', '#4c1d95'][e.tier], a = aimAt(e);
        g.save();
        g.translate(e.x, e.y);
        P2([[-30, -20], [-72, 6], [-86, 32], [-52, 22], [-30, 10]], h ? PAP : d);
        P2([[30, -20], [72, 6], [86, 32], [52, 22], [30, 10]], h ? PAP : d);
        P2([[30, -20], [72, 6], [86, 32], [52, 22], [30, 10]], 'rgba(0,0,0,.25)');
        for (const ex of [-24, 0, 24]) {
            glow(ex, -38, 16, GLD, .8);
            P2([[ex - 6, -34], [ex + 6, -34], [ex, -46 - Math.random() * 9]], GLD);
        }
        P2([[-34, -34], [34, -34], [52, 0], [34, 34], [-34, 34], [-52, 0]], h ? PAP : c);
        P2([[0, -34], [34, -34], [52, 0], [34, 34], [0, 34]], 'rgba(0,0,0,.22)');
        g.strokeStyle = 'rgba(20,22,31,.45)';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(-42, -14);
        g.lineTo(42, -14);
        g.moveTo(-46, 12);
        g.lineTo(46, 12);
        g.moveTo(-18, -34);
        g.lineTo(-18, 34);
        g.moveTo(18, -34);
        g.lineTo(18, 34);
        g.stroke();
        if (e.tier == 0) {
            P2([[-34, -34], [-46, -56], [-22, -34]], c);
            P2([[34, -34], [46, -56], [22, -34]], c);
        }
        if (e.tier == 1)
            for (let i = 0; i < 5; i++) {
                const t = time * 1.4 + i * 1.2566;
                g.fillStyle = PAP;
                g.beginPath();
                g.arc(Math.cos(t) * 66, Math.sin(t) * 22 + 8, 5, 0, 6.28);
                g.fill();
            }
        if (e.tier == 2) {
            g.fillStyle = INK;
            g.beginPath();
            g.arc(0, 0, 26, 0, 6.28);
            g.fill();
            for (let i = 0; i < 12; i++) {
                g.save();
                g.rotate(i * .5236);
                P2([[-4, -26], [4, -26], [0, -15]], PAP);
                g.restore();
            }
        }
        if (e.tier == 3) {
            g.fillStyle = INK;
            g.beginPath();
            g.arc(0, 0, 24, 0, 6.28);
            g.fill();
            g.strokeStyle = '#c4b5fd';
            g.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                const t = time * 1.8 + i * 2.094;
                g.beginPath();
                g.arc(Math.cos(t) * 40, Math.sin(t) * 14, 7, 0, 6.28);
                g.stroke();
            }
        }
        for (const s of [-1, 1]) {
            g.fillStyle = '#2b2d38';
            g.beginPath();
            g.arc(s * 38, 18, 7, 0, 6.28);
            g.fill();
            g.strokeStyle = PAP;
            g.lineWidth = 3;
            g.beginPath();
            g.moveTo(s * 38, 18);
            g.lineTo(s * 38 + Math.cos(a) * 13, 18 + Math.sin(a) * 13);
            g.stroke();
        }
        glow(0, 0, 30, RED, .4 + .3 * Math.sin(time * 5));
        g.fillStyle = PAP;
        g.beginPath();
        g.arc(0, 0, 15, 0, 6.28);
        g.fill();
        g.fillStyle = INK;
        g.beginPath();
        g.arc(Math.cos(a) * 6, Math.sin(a) * 6, 7, 0, 6.28);
        g.fill();
        g.restore();
    }
    function icon(i, x, y, c) {
        g.fillStyle = c;
        g.strokeStyle = c;
        g.lineWidth = 2;
        if (i == 0) {
            g.fillRect(x - 3, y - 6, 6, 9);
            g.fillRect(x - 5, y - 8, 10, 2);
            g.fillRect(x - 5, y + 4, 10, 2);
        }
        else if (i == 1) {
            g.beginPath();
            g.moveTo(x - 6, y - 6);
            g.lineTo(x, y);
            g.lineTo(x - 6, y + 6);
            g.moveTo(x + 1, y - 6);
            g.lineTo(x + 7, y);
            g.lineTo(x + 1, y + 6);
            g.stroke();
        }
        else if (i == 2) {
            g.beginPath();
            g.arc(x, y + 5, 9, Math.PI * 1.1, Math.PI * 1.9);
            g.stroke();
            g.fillRect(x - 1.5, y - 6, 3, 3);
        }
        else {
            g.fillRect(x - 2, y - 2, 4, 10);
            P2([[x, y - 9], [x - 5, y - 2], [x + 5, y - 2]], c);
        }
    }
    function skillFx() {
        if (P.mir > 0) {
            g.save();
            g.translate(P.x, P.y);
            g.globalAlpha = Math.min(1, P.mir / .7 * 2);
            g.strokeStyle = PAP;
            g.lineWidth = 3;
            g.beginPath();
            g.arc(0, 0, 40, Math.PI * 1.02, Math.PI * 1.98);
            g.stroke();
            g.strokeStyle = GLD;
            g.lineWidth = 1.5;
            g.beginPath();
            g.arc(0, 0, 46, Math.PI * 1.1, Math.PI * 1.9);
            g.stroke();
            g.restore();
            g.globalAlpha = 1;
        }
        if (P.sp > 0) {
            const el = 1.45 - P.sp, bo = BO(), hw = bo.length > 1 ? .7 : 1;
            for (const o of bo) {
                const x = P.x + o;
                if (el < .35) {
                    g.strokeStyle = GLD;
                    g.globalAlpha = .4 + .4 * Math.sin(el * 40);
                    g.lineWidth = 2;
                    g.beginPath();
                    g.moveTo(x, P.y - 16);
                    g.lineTo(x, 0);
                    g.stroke();
                    g.globalAlpha = 1;
                    glow(x, P.y - 20, 20 + el * 60, GLD, .5);
                }
                else {
                    const f = Math.min(1, P.sp / .25), w = (22 + Math.random() * 4) * f * hw;
                    g.fillStyle = 'rgba(240,180,41,.35)';
                    g.fillRect(x - w * 1.5, 0, w * 3, P.y - 16);
                    g.fillStyle = GLD;
                    g.fillRect(x - w, 0, w * 2, P.y - 16);
                    g.fillStyle = PAP;
                    g.fillRect(x - w * .45, 0, w * .9, P.y - 16);
                    glow(x, P.y - 16, 44, GLD, .7);
                }
            }
        }
    }
    function lampArt() {
        const l = lamp, fl = .75 + .25 * Math.sin(l.t * 16), r = (110 + l.n * 4) * (l.rd || 1);
        g.save();
        g.strokeStyle = GLD;
        g.lineWidth = 1.5;
        g.globalAlpha = .3;
        g.setLineDash([5, 7]);
        g.beginPath();
        g.arc(l.x, l.y, r, 0, 6.28);
        g.stroke();
        g.setLineDash([]);
        g.globalAlpha = 1;
        glow(l.x, l.y, 40 + l.n * 2, GLD, .55 * fl + .2);
        g.translate(l.x, l.y);
        g.fillStyle = '#3b3d4a';
        g.fillRect(-7, -12, 14, 3);
        g.fillRect(-7, 10, 14, 3);
        P2([[-5, -12], [0, -18], [5, -12]], '#3b3d4a');
        g.fillStyle = 'rgba(240,180,41,.9)';
        g.fillRect(-6, -9, 12, 19);
        g.fillStyle = PAP;
        g.beginPath();
        g.ellipse(0, 1, 3, 4 * fl + 1, 0, 0, 6.28);
        g.fill();
        g.strokeStyle = '#3b3d4a';
        g.lineWidth = 1.2;
        g.strokeRect(-6, -9, 12, 19);
        g.strokeStyle = PAP;
        g.lineWidth = 2;
        g.beginPath();
        g.arc(0, 0, 21, -1.5708, -1.5708 + 6.283 * (1 - l.t / l.life));
        g.stroke();
        g.restore();
    }
    function draw() {
        g.setTransform(2, 0, 0, 2, 0, 0);
        g.fillStyle = INK;
        g.fillRect(0, 0, W, H);
        g.save();
        if (shake > 0)
            g.translate(R(-1, 1) * shake * 10, R(-1, 1) * shake * 10);
        g.globalAlpha = .2;
        g.drawImage(PL, 260, ((time * 6) % (H + 300)) - 260);
        g.globalAlpha = 1;
        stars.forEach((s, i) => { if (i % 6 == 0) {
            g.fillStyle = MUT;
            g.fillRect(s.x - 3, s.y, 7, 1);
            g.fillRect(s.x, s.y - 3, 1, 7);
        }
        else {
            g.fillStyle = PAP;
            g.globalAlpha = .25 + s.z * .35;
            g.fillRect(s.x, s.y, s.z * 1.5, s.z * 1.5);
            g.globalAlpha = 1;
        } });
        if (state == 'hangar') {
            const K = SKINS[pvS], yy = 178 + Math.sin(time * 1.6) * 6;
            glow(W / 2, yy, 130, K.t, .2);
            g.strokeStyle = K.t;
            g.globalAlpha = .35;
            g.lineWidth = 1.5;
            g.setLineDash([4, 9]);
            g.lineDashOffset = -time * 24;
            g.beginPath();
            g.arc(W / 2, yy, 112, 0, 6.28);
            g.stroke();
            g.setLineDash([]);
            g.globalAlpha = 1;
            ship(W / 2, yy, 3.2, K, 2, 1);
            g.fillStyle = bcol(K.b);
            for (let i = 0; i < 3; i++)
                g.fillRect(W / 2 - 1.8, ((time * 260 + i * 26) % 78) + 8, 3.6, 15);
        }
        if (1) {
            if (P && !bgOnly()) {
                for (const p of pw) {
                    const pu = POW[p.k];
                    dia(p.x + 2, p.y + 2, 13, '#0007');
                    dia(p.x, p.y, 13, pu.c);
                    g.strokeStyle = pu.c;
                    g.lineWidth = 1.5;
                    g.globalAlpha = .5 + .5 * Math.sin(p.t * 6);
                    g.strokeRect(p.x - 17, p.y - 17, 34, 34);
                    g.globalAlpha = 1;
                    txt(p.k, p.x, p.y + 4.5, 13, INK, 'center', 600);
                }
                for (const e of en) {
                    const h = e.hit > 0, x = e.x, y = e.y;
                    if (e.k == 'drone')
                        podArt(e, h);
                    else if (e.k == 'rock') {
                        g.save();
                        g.translate(x, y);
                        g.rotate(e.rot);
                        g.drawImage(e.sp, -e.sp.width / 2, -e.sp.height / 2);
                        g.restore();
                        if (h) {
                            g.globalAlpha = .6;
                            poly(x, y, e.p, PAP, null, e.rot);
                            g.globalAlpha = 1;
                        }
                    }
                    else if (e.k == 'fighter')
                        craft(x, y, 1.1, true, h ? PAP : GLD, h ? PAP : '#a8780f', RED, '#ff9a80', 1, .8);
                    else if (e.k == 'tank') {
                        tankArt(e, h);
                        g.fillStyle = '#0008';
                        g.fillRect(x - 20, y - 34, 40, 4);
                        g.fillStyle = PAP;
                        g.fillRect(x - 20, y - 34, 40 * e.hp / e.mhp, 4);
                    }
                    else if (e.k == 'diver') {
                        if (e.ph == 0 && e.t > .6) {
                            g.strokeStyle = RED;
                            g.lineWidth = 1.5;
                            g.setLineDash([6, 8]);
                            g.globalAlpha = .7;
                            g.beginPath();
                            g.moveTo(e.tx, y);
                            g.lineTo(e.tx, H);
                            g.stroke();
                            g.setLineDash([]);
                            g.globalAlpha = 1;
                        }
                        missileArt(e, h);
                    }
                    else if (e.k == 'sniper')
                        sniperArt(e, h);
                    else if (e.k == 'bug')
                        bugArt(e, h);
                    else if (e.k == 'mine')
                        mineArt(e, h);
                    else
                        bossArt(e, h);
                }
                if (lamp)
                    lampArt();
                if (P.mir > 0 || P.sp > 0)
                    skillFx();
                for (const b of bul) {
                    const c = bcol(b.c || (b.p || b.hm ? GLD : PAP));
                    g.fillStyle = c;
                    if (b.hm) {
                        glow(b.x, b.y, 11, c, .45);
                        g.fillStyle = c;
                        g.beginPath();
                        g.arc(b.x, b.y, 4.5, 0, 6.28);
                        g.fill();
                    }
                    else
                        g.fillRect(b.x - 1.8, b.y - 8, 3.6, 15);
                }
                for (const b of ebul) {
                    g.strokeStyle = RED;
                    g.lineWidth = 2.6;
                    g.beginPath();
                    g.arc(b.x, b.y, b.r, 0, 6.28);
                    g.stroke();
                    g.fillStyle = PAP;
                    g.fillRect(b.x - 1, b.y - 1, 2, 2);
                }
                for (const q of ghosts) {
                    g.globalAlpha = q.l * 2;
                    poly(q.x, q.y, SIL, GLD, null, 0, 1.1);
                    g.globalAlpha = 1;
                }
                for (let i = 1; i < trl.length; i++) {
                    const a = trl[i - 1], b = trl[i], k = b.l / .4;
                    if (D(a.x - b.x, a.y - b.y) < 60) {
                        g.globalAlpha = k * .5;
                        g.strokeStyle = SKINS[skin].t;
                        g.lineWidth = 5 * k;
                        g.beginPath();
                        g.moveTo(a.x, a.y);
                        g.lineTo(b.x, b.y);
                        g.stroke();
                    }
                }
                g.globalAlpha = 1;
                if (state == 'play' || state == 'pause') {
                    const bl = P.inv > 0 && Math.floor(P.inv * 14) % 2;
                    if (!bl) {
                        ship(P.x, P.y, 1.1, SKINS[skin], 1.1, 1);
                    }
                    if (P.fx.W > 0)
                        for (let i = 0; i < 2; i++) {
                            const a = time * 3 + i * Math.PI;
                            craft(P.x + Math.cos(a) * 38, P.y + Math.sin(a) * 12, .4, false, PAP, '#b9b09a', TEA, TEA, 0, .5);
                        }
                    if (P.shield) {
                        g.strokeStyle = PAP;
                        g.lineWidth = 2;
                        g.setLineDash([5, 5]);
                        g.beginPath();
                        g.arc(P.x, P.y, 25, time * 2, time * 2 + 6.28);
                        g.stroke();
                        g.setLineDash([]);
                    }
                }
            }
            for (const p of pt) {
                g.globalAlpha = cl(p.l / p.m, 0, 1);
                g.fillStyle = p.c;
                g.fillRect(p.x, p.y, p.s, p.s);
            }
            g.globalAlpha = 1;
            for (const q of rings) {
                g.globalAlpha = cl(q.l * 2.5, 0, 1);
                g.strokeStyle = GLD;
                g.lineWidth = 3;
                g.beginPath();
                g.arc(q.x, q.y, q.r, 0, 6.28);
                g.stroke();
                g.globalAlpha = 1;
            }
            for (const p of pops) {
                g.globalAlpha = cl(p.l, 0, 1);
                txt(p.s, p.x, p.y, 12, p.c, 'center', 600);
                g.globalAlpha = 1;
            }
        }
        g.restore();
        g.strokeStyle = '#f1e8d433';
        g.lineWidth = 1;
        for (const [x, y, a, b] of [[10, 10, 1, 1], [W - 10, 10, -1, 1], [10, H - 10, 1, -1], [W - 10, H - 10, -1, -1]]) {
            g.beginPath();
            g.moveTo(x + a * 16, y);
            g.lineTo(x, y);
            g.lineTo(x, y + b * 16);
            g.stroke();
        }
        if (flash > 0) {
            g.fillStyle = PAP;
            g.globalAlpha = flash;
            g.fillRect(0, 0, W, H);
            g.globalAlpha = 1;
        }
        if (P && (state == 'play' || state == 'dead' || state == 'pause')) {
            txt(String(score).padStart(7, '0'), 18, 38, 24);
            if (mult() > 1) {
                txt('\u00D7' + mult() + ' CHAIN', 18, 56, 11, GLD);
                g.fillStyle = GLD;
                g.fillRect(18, 61, 70 * cl(comboT / 1.5, 0, 1), 2);
            }
            txt('WAVE ' + String(wave).padStart(2, '0'), W - 18, 34, 13, PAP, 'right');
            txt('BEST ' + String(Math.max(hi, score)).padStart(7, '0'), W - 18, 50, 10, MUT, 'right');
            g.fillStyle = PAP;
            g.fillRect(W / 2 - 6, 18, 4, 14);
            g.fillRect(W / 2 + 2, 18, 4, 14);
            let i = 0;
            for (const k in P.fx)
                if (P.fx[k] > 0) {
                    const x = 24 + i * 34;
                    dia(x, 86, 10, POW[k].c);
                    txt(k, x, 90, 11, INK, 'center', 600);
                    g.fillStyle = '#ffffff25';
                    g.fillRect(x - 11, 100, 22, 2);
                    g.fillStyle = POW[k].c;
                    g.fillRect(x - 11, 100, 22 * P.fx[k] / POW[k].t, 2);
                    i++;
                }
            const Y = LAY();
            for (let j = 0; j < P.lives; j++)
                poly(Y.lx + j * Y.ld, H - 26, KITE, PAP, RED, 0, .6);
            for (let j = 0; j < P.bomb; j++) {
                g.fillStyle = RED;
                g.beginPath();
                g.arc(Y.fx + j * Y.fd, Y.fy, 7, 0, 6.28);
                g.fill();
            }
            txt('B', Y.fx, Y.fy - 17, 10, MUT, 'center');
            const kk = SKINS[skin].k;
            [[lampCd, SPC(0).cd, lamp ? 1 - lamp.t / lamp.life : 0, 'SPC', GLD], [cdD, SPC(1).cd, P.dsh > 0 ? 1 : P.ph > 0 ? P.ph / 1.6 : 0, 'Q', TEA], [cdM, SPC(2).cd, P.mir > 0 ? P.mir / .7 : 0, 'F', PAP], [cdS, SPC(3).cd, P.sp > 0 ? P.sp / 1.45 : 0, 'R', RED]].forEach(([cd, mx, act, key, col], i) => {
                const cx = Y.bx + i * 58, cy = H - 36, rdy = cd <= 0 && !act;
                g.fillStyle = INK;
                g.beginPath();
                g.arc(cx, cy, 21, 0, 6.28);
                g.fill();
                g.strokeStyle = '#ffffff25';
                g.lineWidth = 2.5;
                g.beginPath();
                g.arc(cx, cy, 21, 0, 6.28);
                g.stroke();
                g.strokeStyle = rdy ? col : act ? PAP : MUT;
                g.beginPath();
                g.arc(cx, cy, 21, -1.5708, -1.5708 + 6.283 * (act ? act : 1 - cd / mx));
                g.stroke();
                g.save();
                g.translate(cx, cy);
                g.scale(1.25, 1.25);
                icon(i, 0, 0, rdy ? col : MUT);
                g.restore();
                txt(key, cx, H - 5, 9, MUT, 'center');
            });
            g.fillStyle = '#ffffff25';
            g.fillRect(Y.gx, H - 12, 110, 2);
            g.fillStyle = RED;
            g.fillRect(Y.gx, H - 12, 110 * Math.min(1, graze / (GZ())), 2);
            if (boss && state == 'play') {
                g.fillStyle = '#ffffff25';
                g.fillRect(60, H - 70, W - 120, 6);
                g.fillStyle = RED;
                g.fillRect(60, H - 70, (W - 120) * Math.max(0, boss.hp) / boss.mhp, 6);
                txt(BOSS[boss.tier].toUpperCase(), W / 2, H - 78, 10, PAP, 'center');
            }
            if (banner > 0 && state == 'play') {
                const a = cl(banner, 0, 1);
                g.globalAlpha = a;
                g.font = '900 44px Fraunces,Georgia,serif';
                g.textAlign = 'center';
                g.fillStyle = RED;
                g.fillText(bT, W / 2 + 2.5, H / 2 - 58 + 2.5);
                g.fillStyle = PAP;
                g.fillText(bT, W / 2, H / 2 - 58);
                txt(bS.toUpperCase(), W / 2, H / 2 - 30, 11, GLD, 'center');
                g.globalAlpha = 1;
            }
        }
    }
    // ---- responsive stage: fills the phone screen, keeps 480 logical width ----
    function fit() {
        const bw = document.body.clientWidth, bh = document.body.clientHeight;
        if (!bw || !bh)
            return;
        const r = cl(bh / bw, 1.5, 2), w = Math.min(bw, bh / r), oh = H;
        H = Math.round(W * r);
        st.style.width = w + 'px';
        st.style.height = (w * r) + 'px';
        if (H != oh) {
            C.height = H * 2;
            stars.forEach(s => s.y *= H / oh);
            if (P)
                P.y = cl(P.y, 70, H - 92);
        }
    }
    addEventListener('resize', fit);
    addEventListener('orientationchange', () => setTimeout(fit, 200));
    if (window.visualViewport)
        visualViewport.addEventListener('resize', fit);
    // ---- ui / input ----
    const show = s => { state = s; st.dataset.s = s; $('hi').textContent = String(hi).padStart(6, '0'); $('mcn').textContent = pg.coins.toLocaleString() + ' coins'; };
    const launch = () => { reset(); ptr = null; show('play'); };
    const start = () => { if (!set.tut)
        showTut('play');
    else
        launch(); };
    $('go').onclick = start;
    $('ag').onclick = start;
    $('gd').onclick = () => { $('skl').innerHTML = skHTML(skin); show('guide'); };
    $('bk').onclick = () => show('menu');
    $('mm').onclick = $('m2').onclick = () => show('menu');
    $('rs').onclick = () => { ptr = null; show('play'); };
    $('sn').onclick = e => { mute = !mute; e.currentTarget.firstChild.textContent = 'Sound: ' + (mute ? 'off ' : 'on '); };
    const pause = () => { if (state == 'play')
        show('pause');
    else if (state == 'pause')
        show('play'); };
    addEventListener('keydown', e => {
        const k = e.key.length == 1 ? e.key.toLowerCase() : e.key;
        keys[k] = 1;
        const st0 = state;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && state == 'play')
            e.preventDefault();
        if ((k == 'Enter' || k == ' ') && (state == 'menu' || state == 'over') && document.activeElement.tagName != 'BUTTON' && document.activeElement.tagName != 'INPUT')
            start();
        if (k == 'p' || k == 'Escape')
            pause();
        if (k == 'b')
            flare();
        if (k == 'e' || k == 'Shift' || (k == ' ' && st0 == 'play'))
            throwLamp();
        if (k == 'q')
            dash();
        if (k == 'f')
            mirror();
        if (k == 'r')
            spear();
    });
    addEventListener('keyup', e => { keys[e.key.length == 1 ? e.key.toLowerCase() : e.key] = 0; });
    addEventListener('blur', () => { if (state == 'play')
        show('pause'); });
    const pos = e => { const r = C.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; };
    C.addEventListener('pointerdown', e => {
        if (state != 'play')
            return;
        C.setPointerCapture(e.pointerId);
        const p = pos(e);
        if (p.y < 50 && Math.abs(p.x - W / 2) < 30) {
            pause();
            return;
        }
        const Y = LAY(), xa = Math.min(Y.fx, Y.fx + Y.fd * 4) - 14, xb = Math.max(Y.fx, Y.fx + Y.fd * 4) + 14;
        if (p.x > xa && p.x < xb && Math.abs(p.y - Y.fy) < 18) {
            flare();
            return;
        }
        if (p.y > H - 70) {
            const i = Math.round((p.x - Y.bx) / 58);
            if (i >= 0 && i < 4 && Math.abs(p.x - (Y.bx + i * 58)) < 30) {
                [throwLamp, dash, mirror, spear][i]();
                return;
            }
        }
        ptr = p;
        ptrId = e.pointerId;
    });
    C.addEventListener('pointermove', e => { if (ptr && e.pointerId === ptrId)
        ptr = pos(e); });
    const pup = e => { if (e.pointerId === ptrId)
        ptr = null; };
    C.addEventListener('pointerup', pup);
    C.addEventListener('pointercancel', pup);
    let skin = 0, pvS = 0, cs = 'PILOT', tab = 'g', lbDb = null, myId = null, rows = [], reloadBoard = () => { };
    try {
        skin = +localStorage.getItem('ll_skin') || 0;
        cs = localStorage.getItem('ll_cs') || 'PILOT';
    }
    catch (e) { }
    if (!SKINS[skin] || hi < SKINS[skin].u)
        skin = 0;
    pvS = skin;
    $('cs').value = cs == 'PILOT' ? '' : cs;
    const unl = i => hi >= SKINS[i].u || pg.owned.includes(i);
    function renderHangar() {
        const K = SKINS[pvS], ok = unl(pvS);
        $('sn2').textContent = K.n;
        $('sd').textContent = ok ? K.d + (pvS == skin ? ' \u00B7 Equipped' : '') : 'Locked \u00B7 reach a best score of ' + K.u.toLocaleString() + ' (yours: ' + hi.toLocaleString() + ')';
        const T = STAT[pvS], pr = Math.ceil(K.u / 5);
        $('hsk').innerHTML = K.sk.map(x => x.n).join(' \u00B7 ') + '<br>Speed ' + T[0].toFixed(2) + 'x \u00B7 Fire ' + T[1].toFixed(2) + 'x \u00B7 Hull ' + (3 + T[2]);
        $('hbuy').style.display = ok ? 'none' : 'flex';
        $('hbuy').firstChild.textContent = 'Unlock for ' + pr.toLocaleString() + ' coins ';
        $('hbuy').dataset.p = pr;
        $('hcn').textContent = pg.coins.toLocaleString() + ' coins';
        [...$('sks').children].forEach((b, i) => { b.className = 'sw' + (i == pvS ? ' on' : '') + (unl(i) ? '' : ' lk'); });
    }
    SKINS.forEach((K, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.style.setProperty('--c', K.L);
        b.style.setProperty('--a', K.A);
        b.setAttribute('aria-label', K.n);
        b.onclick = () => { pvS = i; if (unl(i)) {
            skin = i;
            try {
                if (acc)
                    acSave();
                else
                    localStorage.setItem('ll_skin', i);
            }
            catch (e) { }
        } renderHangar(); };
        $('sks').appendChild(b);
    });
    $('cs').oninput = e => { cs = e.target.value.trim().slice(0, 12) || 'PILOT'; try {
        localStorage.setItem('ll_cs', cs);
    }
    catch (x) { } };
    const local = () => { try {
        return JSON.parse(localStorage.getItem('ll_runs') || '[]');
    }
    catch (e) {
        return [];
    } };
    function addLocal(sc, wv) { try {
        const a = local();
        a.push({ name: cs, score: sc, wave: wv });
        a.sort((x, y) => y.score - x.score);
        localStorage.setItem('ll_runs', JSON.stringify(a.slice(0, 10)));
    }
    catch (e) { } }

    async function openPlayerProfile(player, rank) {
    if (!player || !player.id || !sb) return;

    show('player');

    $('vpn').textContent = formatPlayerName(player.name);
    $('vpav').textContent = (player.name || 'P').charAt(0).toUpperCase();
    $('vprank').textContent = 'GLOBAL RANK #' + String(rank).padStart(2, '0');
    $('vpdesc').textContent = 'Loading pilot statistics...';
    $('vps').textContent = '';

    const fmt = v => Number(v || 0).toLocaleString();
    const duration = v => {
        const s = Number(v || 0);
        return s >= 3600
            ? Math.floor(s / 3600) + 'h ' + Math.floor(s % 3600 / 60) + 'm'
            : Math.floor(s / 60) + 'm ' + Math.floor(s % 60) + 's';
    };

    try {
        const { data, error } = await sb
            .from('profiles')
            .select('id,name,hi,skin,st,pg')
            .eq('id', player.id)
            .maybeSingle();

        if (error) throw error;

        const p = data || {};
        const s = p.st || {};
        const pg0 = p.pg || {};
        const ship = SKINS[Number(p.skin ?? 0)] || SKINS[0];

        $('vpav').style.background = ship.L;
        $('vpdesc').textContent = data
            ? 'Pilot statistics · Last Light'
            : 'Only leaderboard statistics are available for this pilot.';

        const stats = [
            ['Best score', fmt(Math.max(Number(p.hi || 0), Number(player.score || 0)))],
            ['Best wave', fmt(Math.max(Number(s.bestWave || 0), Number(player.wave || 0)))],
            ['Best chain', '×' + fmt(s.bestChain || 1)],
            ['Runs flown', fmt(s.runs)],
            ['Enemies downed', fmt(s.kills)],
            ['Bosses felled', fmt(s.bosses)],
            ['Total score', fmt(s.total)],
            ['Time flown', duration(s.time)],
            ['Rocket', ship.n],
            ['Coins', fmt(pg0.coins)]
        ];

        $('vps').innerHTML = stats.map(([label, value]) =>
            `<dt>${label}</dt><dd>${value}</dd>`
        ).join('');
    } catch (e) {
        console.error('Player profile error:', e);
        $('vpdesc').textContent = 'Could not load the full player profile.';
        $('vps').innerHTML = [
            ['Best score', fmt(player.score)],
            ['Best wave', fmt(player.wave)]
        ].map(([label, value]) =>
            `<dt>${label}</dt><dd>${value}</dd>`
        ).join('');
    }
}

function formatPlayerName(name) {
    const parts = String(name || 'PILOT').trim().split(/\s+/).filter(Boolean);

    if (parts.length < 2) return parts[0] || 'PILOT';

    return parts[0] + ' ' + parts[parts.length - 1][0].toUpperCase() + '.';
}

    function renderBoard() {
        const useG = tab == 'g' && lbDb, list = useG ? rows : local(), box = $('rows');
        box.textContent = '';
        $('tg').className = 'tb' + (tab == 'g' ? ' on' : '');
        $('tl').className = 'tb' + (tab == 'l' ? ' on' : '');
        if (!list.length) {
            const d = document.createElement('div');
            d.className = 'em';
            d.textContent = tab == 'g' && !lbDb ? 'The shared board is not available here. Your runs are still saved on this device.' : 'No runs yet. Be the first lamp in the dark.';
            box.appendChild(d);
        }
        list.slice(0, 11).forEach((r, i) => {
    const d = document.createElement('div');
    d.className = 'lr' + (r.id && r.id === myId ? ' me' : '');

    [
    r.far ? '..' : String(i + 1).padStart(2, '0'),
    formatPlayerName(r.name),
    'W' + String(r.wave || 1).padStart(2, '0'),
    (r.score || 0).toLocaleString()
].forEach(t => {
        const sp = document.createElement('span');
        sp.textContent = t;
        d.appendChild(sp);
    });

    if (tab === 'g' && r.id) {
        d.style.cursor = 'pointer';
        d.title = 'View pilot statistics';
        d.setAttribute('role', 'button');
        d.setAttribute('tabindex', '0');

        d.addEventListener('click', () => openPlayerProfile(r, i + 1));

        d.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPlayerProfile(r, i + 1);
            }
        });
    }

    box.appendChild(d);
});
        $('bn').textContent = tab == 'g' ? (lbDb ? 'Live \u00B7 best run per pilot' : 'Offline \u00B7 open this page signed in for the shared board') : 'Stored on this device';
    }
    async function post(nu, sc, wv) {
        const pre = (nu.length ? 'Rocket unlocked: ' + nu.join(', ') + '. ' : '') + runMsg, say = m => { $('on').textContent = pre + m; };
        if (sc <= 0) {
            say('');
            return;
        }
        addLocal(sc, wv);
        if (!sb || !me) {
            say('Run saved on this device. Sign in to post to the global board.');
            return;
        }
        try {
            const { error } = await sb.rpc('submit_score', { p_score: sc, p_wave: wv, p_skin: skin, p_name: cs, p_secs: Math.round(rt) });
            if (error)
                throw error;
            say('Score sent to the global board.');
            reloadBoard();
        }
        catch (e) {
            say('Run saved on this device. Board error: ' + ((e && e.message) || e));
        }
    }
    if (sb) {
        lbDb = true;
        const loadBoard = async () => {
            try {
                const { data } = await sb.from('scores').select('user_id,name,score,wave').order('score', { ascending: false }).limit(10);
                rows = (data || []).map(r => ({ ...r, id: r.user_id }));
                if (me && !rows.some(r => r.id === me.id)) {
                    const { data: mine } = await sb.from('scores').select('user_id,name,score,wave').eq('user_id', me.id).maybeSingle();
                    if (mine) rows.push({ ...mine, id: mine.user_id, far: 1 });
                }
                if (state == 'board')
                    renderBoard();
            }
            catch (e) { }
        };
        reloadBoard = loadBoard;
        loadBoard();
        try {
            sb.channel('scores').on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, loadBoard).subscribe();
        }
        catch (e) { }
    }
    $('hg').onclick = () => { pvS = skin; renderHangar(); show('hangar'); };
    $('hb').onclick = () => show('menu');
    $('lb').onclick = $('lo').onclick = () => { tab = lbDb ? 'g' : 'l'; renderBoard(); show('board'); reloadBoard(); };
    $('bb').onclick = () => show('menu');

    $('vpb').onclick = () => {
    show('board');
    renderBoard();
};

    $('tg').onclick = () => { tab = 'g'; renderBoard(); };
    $('tl').onclick = () => { tab = 'l'; renderBoard(); };
    // ---- accounts: Supabase Auth (callsign -> pseudo-email) + local cache; progress synced to the cloud ----
    let acc = null, mode = 'in', pg = { coins: 0, owned: [], up: [0, 0, 0, 0], daily: null, ach: [] };
    const ACC = () => { try {
        return JSON.parse(localStorage.getItem('ll_acc') || '{}');
    }
    catch (e) {
        return {};
    } }, saveAcc = m => { try {
        localStorage.setItem('ll_acc', JSON.stringify(m));
        return true;
    }
    catch (e) {
        return false;
    } };
    function acSave() { if (!acc)
        return; const m = ACC(), a = m[acc]; if (!a)
        return; a.hi = hi; a.skin = skin; saveAcc(m); cloudPush(); }
    function renderAcct() {
        const o = !!acc;
        $('af').style.display = o ? 'none' : 'flex';
        $('aout').style.display = o ? 'flex' : 'none';
        $('atb').style.display = o ? 'none' : 'flex';
        $('at').textContent = o ? 'Signed in' : (mode == 'in' ? 'Sign in' : 'Create account');
        $('ti').className = 'tb' + (mode == 'in' ? ' on' : '');
        $('tc').className = 'tb' + (mode == 'c' ? ' on' : '');
        $('ap2').style.display = mode == 'c' ? '' : 'none';
        $('asub').firstChild.textContent = mode == 'c' ? 'Create account ' : 'Sign in ';
        $('ap').autocomplete = mode == 'c' ? 'new-password' : 'current-password';
        $('aw').textContent = o ? 'Welcome back, ' + cs + '. Your best score and rocket choice are saved to this account.' : '';
    }
    function applyAcc() {
        const a = acc && ACC()[acc];
        if (a) {
            hi = a.hi || 0;
            skin = a.skin || 0;
            cs = a.name;
            try {
                localStorage.setItem('ll_sess', acc);
            }
            catch (e) { }
        }
        else {
            acc = null;
            try {
                localStorage.removeItem('ll_sess');
                hi = +localStorage.getItem('ll_hi') || 0;
                skin = +localStorage.getItem('ll_skin') || 0;
                cs = localStorage.getItem('ll_cs') || 'PILOT';
            }
            catch (e) { }
        }
        loadPg();
        if (!SKINS[skin] || !unl(skin))
            skin = 0;
        pvS = skin;
        $('cs').value = acc ? cs : (cs == 'PILOT' ? '' : cs);
        $('cs').disabled = !!acc;
        $('hi').textContent = String(hi).padStart(6, '0');
        $('acs').textContent = acc ? cs : 'Guest';
        renderAcct();
        renderHangar();
    }
    $('asub').onclick = async () => {
        const nm = $('au').value.trim(), pw = $('ap').value, say = t => { $('am').textContent = t; };
        if (!sb)
            return say('Cloud accounts are not configured. Add your Supabase URL and key.');
        if (!/^[A-Za-z0-9_ -]{3,12}$/.test(nm))
            return say('Callsign: 3-12 letters, numbers, space, _ or -.');
        if (pw.length < 6)
            return say('Password needs at least 6 characters.');
        try {
            let r, seed = null;
            if (mode == 'c') {
                if (pw !== $('ap2').value)
                    return say('Passwords do not match.');
                seed = { hi: hi, skin: skin, st: getSt(), pg: pg };
                r = await sb.auth.signUp({ email: em(nm), password: pw, options: { data: { name: nm } } });
                if (r.error)
                    return say(/registered/i.test(r.error.message) ? 'That callsign is already taken.' : r.error.message);
                if (!r.data.session)
                    return say('Turn off "Confirm email" in Supabase Auth settings.');
            }
            else {
                r = await sb.auth.signInWithPassword({ email: em(nm), password: pw });
                if (r.error)
                    return say('Wrong callsign or password.');
            }
            await cloudLogin(r.data.user, nm, seed);
            $('ap').value = $('ap2').value = '';
            say('');
            applyAcc();
            show('menu');
        }
        catch (e) {
            say('Something went wrong. Try again.');
        }
    };
    $('ti').onclick = () => { mode = 'in'; $('am').textContent = ''; renderAcct(); };
    $('tc').onclick = () => { mode = 'c'; $('am').textContent = ''; renderAcct(); };
    $('aso').onclick = async () => { acSave(); await cloudOut(); acc = null; guest = false; applyAcc(); show('gate'); };
    function ZS() { return { runs: 0, kills: 0, bosses: 0, bestWave: 0, bestChain: 1, bestScore: 0, total: 0, time: 0 }; }
    function getSt() { let s = null; try {
        s = acc ? ACC()[acc]?.st : JSON.parse(localStorage.getItem('ll_st') || 'null');
    }
    catch (e) { } return Object.assign(ZS(), s || {}); }
    function saveStats() {
        const s = getSt();
        s.runs++;
        s.kills += rk;
        s.bosses += rb;
        s.total += score;
        s.time += rt;
        s.bestWave = Math.max(s.bestWave, wave);
        s.bestChain = Math.max(s.bestChain, maxC);
        s.bestScore = Math.max(s.bestScore, score);
        try {
            if (acc) {
                const m = ACC();
                if (m[acc]) {
                    m[acc].st = s;
                    saveAcc(m);
                }
            }
            else
                localStorage.setItem('ll_st', JSON.stringify(s));
        }
        catch (e) { }
        cloudPush();
    }
    function renderProf() {
        const s = getSt(), o = !!acc, t = x => x >= 3600 ? Math.floor(x / 3600) + 'h ' + Math.floor(x % 3600 / 60) + 'm' : Math.floor(x / 60) + 'm ' + Math.floor(x % 60) + 's';
        $('pn').textContent = o ? formatPlayerName(cs) : 'Guest';
        $('pav').style.background = o ? SKINS[skin].L : 'var(--mute)';
        $('pd').textContent = o ? 'Signed in. Stats are saved to your cloud account.' : 'Guest profile. Stats are saved on this device only. Create an account to keep them under your callsign.';
        const rows = [['Best score', hi.toLocaleString()], ['Best wave', s.bestWave || 0], ['Best chain', '\u00D7' + s.bestChain], ['Runs flown', s.runs], ['Enemies downed', s.kills.toLocaleString()], ['Bosses felled', s.bosses], ['Total score', s.total.toLocaleString()], ['Time flown', t(s.time)], ['Rocket', SKINS[skin].n], ['Coins', pg.coins.toLocaleString()]];
        $('ps').innerHTML = rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
        $('pc').style.display = $('pi').style.display = o ? 'none' : 'flex';
        $('po').style.display = o ? 'flex' : 'none';
    }
    $('ac').onclick = () => { renderProf(); show('prof'); };
    $('pb').onclick = () => show('menu');
    $('pc').onclick = () => { mode = 'c'; $('am').textContent = ''; renderAcct(); show('acct'); };
    $('pi').onclick = () => { mode = 'in'; $('am').textContent = ''; renderAcct(); show('acct'); };
    $('po').onclick = async () => { acSave(); await cloudOut(); acc = null; guest = false; applyAcc(); show('gate'); };
    $('ab').onclick = () => show(acc || guest ? 'menu' : 'gate');
    ['au', 'ap', 'ap2'].forEach(i => { $(i).onkeydown = e => { if (e.key == 'Enter')
        $('asub').click(); }; });
    applyAcc();
    if (sb)
        sb.auth.getSession().then(async ({ data }) => {
            const u = data.session?.user;
            if (u) {
                try {
                    await cloudLogin(u);
                    applyAcc();
                    if (state == 'gate' || state == 'acct')
                        show('menu');
                }
                catch (e) { }
            }
        }).catch(() => { });
    const goog = () => {
        if (!sb) {
            const t = 'Cloud sign-in is not configured yet. Use guest.';
            $('gm').textContent = t;
            $('am').textContent = t;
            return;
        }
        sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
    };
    $('gog').onclick = goog;
    $('gog2').onclick = goog;
    // ---- progression: coins, missions, upgrades, awards ----
    const MT = [{ t: 'kills', n: [30, 50, 80], d: 'Down %n enemies', r: 60 }, { t: 'wave', n: [4, 6, 8], d: 'Reach wave %n in one run', r: 80 }, { t: 'score', n: [3000, 6000, 10000], d: 'Score %n in one run', r: 90 }, { t: 'boss', n: [1], d: 'Defeat a boss', r: 120 }, { t: 'chain', n: [3, 4, 5], d: 'Reach a x%n chain', r: 70 }, { t: 'runs', n: [2, 3], d: 'Fly %n runs', r: 40 }];
    const AW = 100;
    const ACHS = [{ id: 'first', n: 'First flight', d: 'Fly your first run', p: s => [s.runs, 1], f: s => s.runs >= 1 }, { id: 'boss', n: 'Giant slayer', d: 'Defeat a boss', p: s => [s.bosses, 1], f: s => s.bosses >= 1 }, { id: 'chain', n: 'Chain master', d: 'Reach a x5 chain', p: s => [s.bestChain, 5], f: s => s.bestChain >= 5 }, { id: 'vet', n: 'Veteran', d: 'Reach wave 10', p: s => [s.bestWave, 10], f: s => s.bestWave >= 10 }, { id: 'cent', n: 'Centurion', d: 'Down 500 enemies in total', p: s => [s.kills, 500], f: s => s.kills >= 500 }, { id: 'roll', n: 'High roller', d: 'Score 50,000 in one run', p: s => [s.bestScore, 50000], f: s => s.bestScore >= 50000 }, { id: 'coll', n: 'Collector', d: 'Own 6 rockets', p: () => [SKINS.filter((k, i) => unl(i)).length, 6], f: () => SKINS.filter((k, i) => unl(i)).length >= 6 }, { id: 'mara', n: 'Marathon', d: 'Fly for one hour in total', u: ' min', p: s => [Math.floor(s.time / 60), 60], f: s => s.time >= 3600 }, { id: 'ecl', n: 'Eclipse', d: 'Reach wave 20', p: s => [s.bestWave, 20], f: s => s.bestWave >= 20 }];
    const AWX = (id, n, d, p, r, u) => ACHS.push({ id, n, d, p, r, u, f: s => { const x = p(s); return x[0] >= x[1]; } });
    const UT = () => pg.up.reduce((a, b) => a + (b | 0), 0), OW = () => SKINS.filter((k, i) => unl(i)).length;
    AWX('k1', 'Exterminator', 'Down 2,000 enemies in total', s => [s.kills, 2000], 150);
    AWX('k2', 'Reaper', 'Down 10,000 enemies in total', s => [s.kills, 10000], 300);
    AWX('k3', 'Extinction event', 'Down 50,000 enemies in total', s => [s.kills, 50000], 800);
    AWX('r1', 'Regular', 'Fly 10 runs', s => [s.runs, 10], 100);
    AWX('r2', 'Frequent flyer', 'Fly 50 runs', s => [s.runs, 50], 300);
    AWX('r3', 'Lifer', 'Fly 250 runs', s => [s.runs, 250], 1000);
    AWX('b1', 'Boss hunter', 'Defeat 10 bosses', s => [s.bosses, 10], 200);
    AWX('b2', 'Warden\u2019s bane', 'Defeat 40 bosses', s => [s.bosses, 40], 500);
    AWX('b3', 'Dark breaker', 'Defeat 150 bosses', s => [s.bosses, 150], 1500);
    AWX('w1', 'Deep field', 'Reach wave 15', s => [s.bestWave, 15], 250);
    AWX('w2', 'Edge of the map', 'Reach wave 30', s => [s.bestWave, 30], 600);
    AWX('w3', 'Past the light', 'Reach wave 50', s => [s.bestWave, 50], 1500);
    AWX('s1', 'Six figures', 'Score 100,000 in one run', s => [s.bestScore, 100000], 300);
    AWX('s2', 'Quarter million', 'Score 250,000 in one run', s => [s.bestScore, 250000], 700);
    AWX('s3', 'Half a million', 'Score 500,000 in one run', s => [s.bestScore, 500000], 1200);
    AWX('s4', 'Millionaire', 'Score 1,000,000 in one run', s => [s.bestScore, 1000000], 2500);
    AWX('t1', 'Long haul', 'Earn 1,000,000 total score', s => [s.total, 1000000], 300);
    AWX('t2', 'Ten million', 'Earn 10,000,000 total score', s => [s.total, 10000000], 1000);
    AWX('t3', 'Hundred million', 'Earn 100,000,000 total score', s => [s.total, 100000000], 3000);
    AWX('m1', 'Warming up', 'Fly for 10 minutes in total', s => [Math.floor(s.time / 60), 10], 100, ' min');
    AWX('m2', 'Night shift', 'Fly for 5 hours in total', s => [Math.floor(s.time / 60), 300], 800, ' min');
    AWX('c1', 'Hangar rat', 'Own 12 rockets', () => [OW(), 12], 300);
    AWX('c2', 'Fleet', 'Own 25 rockets', () => [OW(), 25], 800);
    AWX('c3', 'Armada', 'Own all 50 rockets', () => [OW(), 50], 5000);
    AWX('u1', 'Tinkerer', 'Buy 100 upgrade levels', () => [UT(), 100], 200);
    AWX('u2', 'Engineer', 'Buy 1,000 upgrade levels', () => [UT(), 1000], 600);
    AWX('u3', 'Fully loaded', 'Max every upgrade (14,000 levels)', () => [UT(), 14000], 2000);
    AWX('g1', 'Savings', 'Hold 25,000 coins at once', () => [pg.coins, 25000], 600);
    function dayKey() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function mkDaily() {
        const k = dayKey();
        let h = 0;
        for (const c of k)
            h = (h * 31 + c.charCodeAt(0)) >>> 0;
        const rnd = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; }, pool = MT.slice(), ms = [];
        for (let i = 0; i < 3; i++) {
            const t = pool.splice(rnd() * pool.length | 0, 1)[0], lv = Math.min(t.n.length - 1, rnd() * t.n.length | 0);
            ms.push({ t: t.t, n: t.n[lv], r: t.r + lv * 20, p: 0, done: 0 });
        }
        return { d: k, m: ms };
    }
    function loadPg() { let o = null; try {
        o = acc ? ACC()[acc]?.pg : JSON.parse(localStorage.getItem('ll_pg') || 'null');
    }
    catch (e) { } pg = Object.assign({ coins: 0, owned: [], up: [0, 0, 0, 0], daily: null, ach: [] }, o || {}); }
    function savePg() { try {
        if (acc) {
            const m = ACC();
            if (m[acc]) {
                m[acc].pg = pg;
                saveAcc(m);
            }
        }
        else
            localStorage.setItem('ll_pg', JSON.stringify(pg));
    }
    catch (e) { } cloudPush(); }
    function endRun() {
        let c0 = Math.floor(score / 40) + wave * 5 + rc, msg = '';
        const dl = pg.daily && pg.daily.d == dayKey() ? pg.daily : (pg.daily = mkDaily());
        for (const m of dl.m) {
            if (m.done)
                continue;
            const v = { kills: rk, wave: wave, score: score, boss: rb, chain: maxC, runs: 1 }[m.t];
            m.p = (m.t == 'kills' || m.t == 'boss' || m.t == 'runs') ? m.p + v : Math.max(m.p, v);
            if (m.p >= m.n) {
                m.done = 1;
                m.p = m.n;
                c0 += m.r;
                msg += 'Mission complete +' + m.r + '. ';
            }
        }
        const s = getSt();
        ACHS.filter(a => !pg.ach.includes(a.id) && a.f(s)).forEach(a => { pg.ach.push(a.id); c0 += (a.r || AW); msg += '\u2605 Award: ' + a.n + ' +' + (a.r || AW) + '. '; });
        c0 = Math.round(c0 * (1 + 3 * SAT(U(7), 250)));
        pg.coins += c0;
        savePg();
        return 'Coins +' + c0 + '. ' + msg;
    }
    let ptab = 1, tutFrom = null, setFrom = 'menu', mi = 0;
    function showTut(f) { tutFrom = f; $('tutb').innerHTML = '<div><b>Drag</b> anywhere to move. Your rocket fires on its own.</div><div><b>Keyboard</b> arrows or WASD to move, P to pause.</div><div><b>Skills</b> use the four round buttons at the bottom:</div>' + skHTML(skin) + '<div><b>Flare</b> the red dots clear the screen. Grab pickups to power up.</div><div><b>Coins</b> earned every run buy rockets and skill upgrades.</div>'; show('tut'); }
    $('tgo').onclick = () => { set.tut = 1; saveSet(); if (tutFrom == 'play')
        launch();
    else {
        renderSet();
        show('sett');
    } };
    function renderProg() {
        const b = $('pbody');
        $('pgc').textContent = pg.coins.toLocaleString() + ' coins';
        ['p1', 'p2', 'p3'].forEach((id, i) => { $(id).className = 'tb' + (ptab == i + 1 ? ' on' : ''); });
        $('ph').textContent = ['Missions', 'Upgrades', 'Awards'][ptab - 1];
        let h = '';
        if (ptab == 1) {
            const dl = pg.daily && pg.daily.d == dayKey() ? pg.daily : (pg.daily = mkDaily());
            h = dl.m.map(m => `<div class="mi${m.done ? ' dn' : ''}"><div>${MT.find(x => x.t == m.t).d.replace('%n', m.n)} <b>+${m.r}</b></div><div class="bar"><i style="width:${Math.min(100, m.p / m.n * 100)}%"></i></div><small>${m.done ? 'Complete' : m.p + ' / ' + m.n}</small></div>`).join('') + '<div class="sk">New missions every day. Rewards are paid when a run ends.</div>';
        }
        else if (ptab == 2) {
            h = [0, 1, 2, 3].map(q => UI(q, KEYN[q] + ' &middot; ' + SPC(q).n, 'recharge up to +300%, now +' + Math.round((RB(U(q)) - 1) * 100) + '%', 1000, null)).join('') + UPX.map((u, i) => UI(4 + i, u.n, u.d, u.m, null, u.b)).join('') + '<div class="sk">Upgrades apply to every rocket. Each level costs more than the last.</div>';
        }
        else {
            const st = getSt();
            h = '<div class="sk">' + pg.ach.length + ' / ' + ACHS.length + ' earned &middot; each pays coins</div>' + ACHS.map(a => { const o = pg.ach.includes(a.id), [c, m] = a.p(st), pc = Math.min(100, c / m * 100); return `<div class="mi${o ? ' dn' : ' lk'}"><b style="color:${o ? 'var(--gold)' : 'var(--mute)'}">${o ? '\u2605' : '\u2606'} ${a.n}</b><br><small>${a.d}</small><div class="bar"><i style="width:${o ? 100 : pc}%"></i></div><small>${o ? 'Earned' : Math.min(c, m).toLocaleString() + ' / ' + m.toLocaleString() + (a.u || '')}</small></div>`; }).join('');
        }
        b.innerHTML = h;
        savePg();
    }
    $('pbody').onclick = e => { const u = e.target.dataset && e.target.dataset.u; if (u == null || u === '')
        return; const q = +u, N = +e.target.dataset.n || 1; for (let i = 0; i <= q; i++)
        pg.up[i] = pg.up[i] | 0; let b = 0; for (let k = 0; k < N; k++) {
        const L = pg.up[q], c = UC(q, L);
        if (L >= 1000 || pg.coins < c)
            break;
        pg.coins -= c;
        pg.up[q] = L + 1;
        b++;
    } if (b) {
        savePg();
        renderProg();
    } };
    $('p1').onclick = () => { ptab = 1; renderProg(); };
    $('p2').onclick = () => { ptab = 2; renderProg(); };
    $('p3').onclick = () => { ptab = 3; renderProg(); };
    $('mprog').onclick = () => { ptab = 1; renderProg(); show('prog'); };
    $('pbk').onclick = () => show('menu');
    $('hbuy').onclick = () => { const pr = +$('hbuy').dataset.p; if (unl(pvS))
        return; if (pg.coins < pr) {
        $('sd').textContent = 'Not enough coins. You have ' + pg.coins.toLocaleString() + ', need ' + pr.toLocaleString() + '.';
        return;
    } pg.coins -= pr; pg.owned.push(pvS); savePg(); skin = pvS; try {
        if (acc)
            acSave();
        else
            localStorage.setItem('ll_skin', pvS);
    }
    catch (e) { } renderHangar(); };
    function renderSet() { $('sv').value = set.sfx * 100; $('mv').value = set.mus * 100; $('ss').value = set.sens * 100; $('sb1').firstChild.textContent = 'Vibration: ' + (set.vib ? 'on ' : 'off '); $('sb2').firstChild.textContent = 'Skill buttons: ' + ['Center', 'Left', 'Right'][set.lay] + ' '; $('sb3').firstChild.textContent = 'Difficulty: ' + DF().n + ' '; }
    $('sv').oninput = e => { set.sfx = e.target.value / 100; saveSet(); };
    $('mv').oninput = e => { set.mus = e.target.value / 100; saveSet(); };
    $('ss').oninput = e => { set.sens = e.target.value / 100; saveSet(); };
    $('sb1').onclick = () => { set.vib = set.vib ? 0 : 1; saveSet(); renderSet(); vib(40); };
    $('sb2').onclick = () => { set.lay = (set.lay + 1) % 3; saveSet(); renderSet(); };
    $('sb3').onclick = () => { set.diff = (set.diff + 1) % 3; saveSet(); renderSet(); };
    $('sb4').onclick = () => showTut('set');
    $('mset').onclick = () => { setFrom = 'menu'; renderSet(); show('sett'); };
    $('pst').onclick = () => { setFrom = 'pause'; renderSet(); show('sett'); };
    $('sbk').onclick = () => show(setFrom);
    $('rsr').onclick = () => launch();
    // ---- endless events ----
    function evUpd(dt) {
        if (boss || wave < 3)
            return;
        if (!ev) {
            evT -= dt;
            if (evT <= 0) {
                const sm = Math.random() < .55;
                ev = { k: sm ? 'storm' : 'gold', t: 9, s: 0 };
                ann(sm ? 'Meteor storm' : 'Treasure wave', sm ? 'Hold steady' : 'Collect everything');
                S.big();
            }
            return;
        }
        ev.t -= dt;
        ev.s -= dt;
        if (ev.s <= 0) {
            if (ev.k == 'storm') {
                rock(R(30, W - 30), -30, R(10, 20));
                const r = en[en.length - 1];
                r.vy = R(180, 280);
                r.vx = R(-30, 30);
                ev.s = .3;
            }
            else {
                const x = R(50, W - 50);
                en.push({ k: 'drone', x, x0: x, y: -30, r: 13, hp: 2, mhp: 2, vy: R(90, 120), t: R(0, 6), amp: R(30, 70), sc: 150, gold: 1 });
                ev.s = .5;
            }
        }
        if (ev.t <= 0) {
            ev = null;
            evT = R(35, 55);
        }
    }
    // ---- music ----
    const BASS = [55, 55, 65.4, 55, 49, 49, 58.3, 49], ARP = [220, 277, 330, 277, 196, 247, 294, 247];
    function tone(f, d, ty, v) { if (mute || !set.mus)
        return; try {
        AC = AC || new (window.AudioContext || window.webkitAudioContext)();
        const o = AC.createOscillator(), n = AC.createGain();
        o.type = ty;
        o.frequency.value = f;
        n.gain.value = v * set.mus;
        n.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d);
        o.connect(n).connect(AC.destination);
        o.start();
        o.stop(AC.currentTime + d);
    }
    catch (e) { } }
    (function ml() { if (state == 'play') {
        const i = mi++, b = !!boss, s = i % 8;
        tone(BASS[s], .24, 'triangle', .07);
        if (b || i % 2 == 0)
            tone(ARP[(i * (b ? 3 : 1)) % 8] * (b ? 2 : 1), .12, 'square', .016);
        if (b && i % 4 == 0)
            tone(110, .1, 'sawtooth', .05);
    } setTimeout(ml, boss ? 115 : 165); })();
    let guest = false;
    $('gg').onclick = () => { guest = true; show('menu'); };
    $('gc').onclick = () => { mode = 'c'; $('am').textContent = ''; renderAcct(); show('acct'); };
    $('gs').onclick = () => { mode = 'in'; $('am').textContent = ''; renderAcct(); show('acct'); };

    $('xb').onclick = () => show(acc || guest ? 'menu' : 'gate');
    const endSplash = () => { if (state == 'splash')
        show(acc ? 'menu' : 'gate'); };
    $('splash').onclick = endSplash;
    addEventListener('keydown', endSplash);
    setTimeout(endSplash, 2600);
    fit();
    reset();
    show('splash');
    let last = performance.now();
    (function loop(n) { const dt = Math.min(.033, (n - last) / 1000); last = n; slow = Math.max(0, slow - dt); update(slow > 0 ? dt * .3 : dt); draw(); requestAnimationFrame(loop); })(last);
})();