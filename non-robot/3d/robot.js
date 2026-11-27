// robot.js — Non tarqatuvchi robot 3D modeli (Three.js r128). O'lchamlar metrda.
// O'q: x — oldinga (ekran tomoni), y — yuqoriga, z — eni.
(function () {
  const BOM = [
    // n, nomi, izoh, soni, narx [min,max] $, bosqich (yig'ish qadami)
    { n: 1, name: "Fanera 18 mm", note: "korpus, ramka va qopqoq uchun (2 list 1525×1525)", qty: "2 list", p: [40, 60], step: 1 },
    { n: 2, name: "Yog'och brus va metall burchaklar", note: "40×40 brus, burchaklar, murvat, shurup", qty: "to'plam", p: [10, 20], step: 1 },
    { n: 3, name: "Motor-g'ildirak 10\"", note: "ishlatilgan giroskuterdan, ichida motor bor", qty: "2 ta", p: [50, 100], step: 2 },
    { n: 4, name: "Aylanuvchi g'ildirak", note: "old 2 ta Ø100 mm, orqada tayanch 1 ta", qty: "3 ta", p: [10, 20], step: 2 },
    { n: 5, name: "Motor kontrolleri", note: "giroskuter platasi, qayta dasturlanadi", qty: "1 ta", p: [0, 0], step: 3 },
    { n: 6, name: "Batareya LiFePO4 24 V 30 Ah", note: "zaryadlovchi bilan birga", qty: "1 ta", p: [180, 280], step: 3 },
    { n: 7, name: "Raspberry Pi 5 (8 GB)", note: "robotning \"miyasi\": kamera, xarita, ilova", qty: "1 ta", p: [80, 100], step: 3 },
    { n: 8, name: "ESP32", note: "motor, qulf, tarozi va sensorlarni boshqaradi", qty: "1 ta", p: [5, 10], step: 3 },
    { n: 9, name: "4G modem va antenna", note: "rahbar ilovasi bilan aloqa, jonli video", qty: "1 ta", p: [40, 80], step: 3 },
    { n: 10, name: "Sensorli ekran 10\"", note: "non soni, ✓ tugma, Naqd / Nasiya", qty: "1 ta", p: [60, 100], step: 7 },
    { n: 11, name: "Kameralar", note: "old, yon, yuk bo'limi ichi va yuz tanish", qty: "4 ta", p: [60, 120], step: 7 },
    { n: 12, name: "LiDAR (RPLIDAR C1)", note: "to'siqgacha masofani o'lchaydi", qty: "1 ta", p: [70, 100], step: 7 },
    { n: 13, name: "Ultratovush sensorlar", note: "yaqin to'siqlar uchun zaxira", qty: "8 ta", p: [15, 25], step: 7 },
    { n: 14, name: "Pastga qaragan sensorlar (ToF)", note: "chuqur va bordyur chetini sezadi", qty: "4 ta", p: [20, 30], step: 7 },
    { n: 15, name: "GPS va IMU", note: "joylashuv va yo'nalish", qty: "1 to'plam", p: [30, 60], step: 7 },
    { n: 16, name: "Tarozi", note: "4 ta tenzodatchik 50 kg + HX711", qty: "1 to'plam", p: [20, 30], step: 5 },
    { n: 17, name: "Qopqoq qulfi va aktuator", note: "elektromagnit qulf + chiziqli aktuator", qty: "1 to'plam", p: [50, 90], step: 6 },
    { n: 18, name: "Chiroqlar va sirena", note: "old oq, orqa qizil, sariq mayoq, karnay", qty: "to'plam", p: [20, 35], step: 7 },
    { n: 19, name: "Avariya to'xtatish tugmasi", note: "bosilsa robot darhol to'xtaydi", qty: "1 ta", p: [5, 10], step: 7 },
    { n: 20, name: "Rezina bamper", note: "tegish sensori bilan", qty: "1 to'plam", p: [10, 20], step: 4 },
    { n: 21, name: "Savat (banan qutisi o'lchamida)", note: "50×40×24 sm, dastali, 32 tadan non", qty: "2 ta", p: [10, 20], step: 8 },
    { n: 22, name: "Kupyura qabul qilgich va seyf", note: "keyingi bosqich: naqd pulni sanaydi", qty: "1 to'plam", p: [150, 400], step: 7, later: true },
    { n: 23, name: "Simlar, sug'urtagich, DC-DC", note: "ulagichlar, kalit, kabel kanallari", qty: "to'plam", p: [60, 100], step: 3 },
    { n: 24, name: "Zaryad kontaktlari", note: "orqada, stansiyaga ulanadi", qty: "1 juft", p: [10, 20], step: 4 },
  ];

  const STEPS = [
    { n: 1, title: "Pastki ramka", text: "Faneradan pastki quti va ustki pol yasaladi, brus bilan mustahkamlanadi.", bom: [1, 2] },
    { n: 2, title: "G'ildiraklar", text: "Giroskuterning 2 ta motor-g'ildiragi va 3 ta aylanuvchi g'ildirak o'rnatiladi.", bom: [3, 4] },
    { n: 3, title: "Batareya va elektronika", text: "Old bo'limga batareya, Raspberry Pi, ESP32, motor platasi va 4G modem qo'yiladi.", bom: [5, 6, 7, 8, 9, 23] },
    { n: 4, title: "Korpus devorlari", text: "Fanera devorlar, oraliq to'siq, rezina bamper va zaryad kontaktlari.", bom: [1, 20, 24] },
    { n: 5, title: "Tarozi", text: "Yuk bo'limi tagiga 4 ta tenzodatchik va tarozi plitasi.", bom: [16] },
    { n: 6, title: "Qopqoq va qulf", text: "Orqa tomonga ilmoqli qopqoq, elektr qulf va ochuvchi aktuator.", bom: [17] },
    { n: 7, title: "Ekran va sensorlar", text: "Ekran, kameralar, LiDAR, ultratovush sensorlar, GPS, chiroqlar va avariya tugmasi.", bom: [10, 11, 12, 13, 14, 15, 18, 19, 22] },
    { n: 8, title: "Savatlar va non", text: "2 ta savat ustma-ust qo'yiladi: har birida 32 tadan, jami 64 ta non.", bom: [21] },
  ];

  function makeTextures(THREE, rnd) {
    const mk = (w, h, draw) => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8;
      return t;
    };
    const wood = mk(1024, 1024, (g, w, h) => {
      g.fillStyle = "#c79f68"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) {
        const y0 = rnd() * h, amp = 4 + rnd() * 14, fr = 0.002 + rnd() * 0.006, ph = rnd() * 6;
        const dark = rnd() < 0.55;
        g.strokeStyle = dark ? `rgba(120,78,38,${0.05 + rnd() * 0.16})` : `rgba(255,236,200,${0.05 + rnd() * 0.12})`;
        g.lineWidth = 0.6 + rnd() * 2.6; g.beginPath();
        for (let x = 0; x <= w; x += 16) { const y = y0 + Math.sin(x * fr + ph) * amp + Math.sin(x * 0.02 + ph * 2) * 1.5; x ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
      }
      for (let k = 0; k < 4; k++) {
        const x = rnd() * w, y = rnd() * h;
        for (let r = 22; r > 2; r -= 4) { g.strokeStyle = `rgba(110,64,28,${0.25 + (22 - r) / 60})`; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, r * 2.2, r, 0, 0, 7); g.stroke(); }
      }
    });
    wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
    const bread = mk(512, 512, (g, w, h) => {
      const cx = w / 2, cy = h / 2;
      const gr = g.createRadialGradient(cx, cy, 10, cx, cy, w / 2);
      gr.addColorStop(0, "#efc583"); gr.addColorStop(0.55, "#e2aa5c"); gr.addColorStop(0.9, "#c98638"); gr.addColorStop(1, "#a9682a");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (let ring = 1; ring <= 6; ring++) {
        const r = ring * 34, n = Math.round(ring * 9);
        for (let i = 0; i < n; i++) {
          const a = i / n * Math.PI * 2 + ring * 0.3;
          g.fillStyle = "rgba(120,70,25,0.55)"; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3.2, 0, 7); g.fill();
        }
      }
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.strokeStyle = "rgba(130,80,30,.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26); g.stroke(); }
      for (let i = 0; i < 260; i++) {
        const a = rnd() * 7, r = Math.sqrt(rnd()) * 225, sx = cx + Math.cos(a) * r, sy = cy + Math.sin(a) * r;
        if (rnd() < 0.5) { g.fillStyle = "#1c1410"; g.beginPath(); g.ellipse(sx, sy, 2.2, 1.2, rnd() * 3, 0, 7); g.fill(); }
        else { g.fillStyle = "#f6e2b3"; g.beginPath(); g.ellipse(sx, sy, 2.6, 1.4, rnd() * 3, 0, 7); g.fill(); }
      }
    });
    const screen = mk(1024, 640, (g, w, h) => {
      g.fillStyle = "#0e1a24"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#16303f"; g.fillRect(0, 0, w, 86);
      g.fillStyle = "#cfe7f3"; g.font = "600 40px Arial"; g.fillText("1-do'kon · Baraka", 36, 57);
      g.fillStyle = "#7fd1a8"; g.font = "600 34px Arial"; g.fillText("● 78%", w - 170, 57);
      g.fillStyle = "#9db6c4"; g.font = "36px Arial"; g.fillText("Siz uchun ajratilgan non", 36, 160);
      g.fillStyle = "#ffffff"; g.font = "bold 170px Arial"; g.fillText("32", 36, 330);
      g.fillStyle = "#f2c76b"; g.font = "bold 70px Arial"; g.fillText("ta obi non", 270, 320);
      const btn = (x, y, bw, bh, c, txt, tc) => { g.fillStyle = c; g.beginPath(); g.roundRect ? g.roundRect(x, y, bw, bh, 22) : g.rect(x, y, bw, bh); g.fill(); g.fillStyle = tc; g.font = "bold 46px Arial"; g.fillText(txt, x + 34, y + bh / 2 + 16); };
      btn(36, 400, 450, 110, "#2fb36d", "✓ Tasdiqlash", "#fff");
      btn(520, 400, 468, 110, "#2c4250", "Kamroq kerak", "#d6e4ec");
      g.fillStyle = "#6f8a98"; g.font = "30px Arial"; g.fillText("Naqd  ·  Nasiya  ·  Karta (QR)", 36, 590);
    });
    const tiles = mk(1024, 1024, (g, w, h) => {
      g.fillStyle = "#7a7e85"; g.fillRect(0, 0, w, h);
      const tw = 128, th = 64;
      for (let r = 0; r < h / th; r++) for (let c = -1; c < w / tw + 1; c++) {
        const x = c * tw + (r % 2 ? tw / 2 : 0), y = r * th, v = 150 + Math.floor((rnd() - 0.5) * 18);
        g.fillStyle = `rgb(${v},${v + 2},${v + 6})`; g.fillRect(x + 3, y + 3, tw - 6, th - 6);
        for (let k = 0; k < 40; k++) { const q = v + Math.floor((rnd() - 0.5) * 40); g.fillStyle = `rgba(${q},${q},${q + 4},.5)`; g.fillRect(x + 3 + rnd() * (tw - 8), y + 3 + rnd() * (th - 8), 2, 2); }
      }
    });
    tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping; tiles.repeat.set(12, 12);
    return { wood, bread, screen, tiles };
  }

  function makeRobot(THREE) {
    let seed = 11; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const tex = makeTextures(THREE, rnd);
    const S = (o) => new THREE.MeshStandardMaterial(o);
    const M = {
      wood: S({ map: tex.wood, roughness: 0.78, metalness: 0 }),
      brus: S({ color: 0xb98a55, roughness: 0.8 }),
      rubber: S({ color: 0x1a1b1d, roughness: 0.92 }),
      tire: S({ color: 0x141414, roughness: 0.88 }),
      hub: S({ color: 0x8f969d, roughness: 0.32, metalness: 0.85 }),
      steel: S({ color: 0xc8ccd1, roughness: 0.25, metalness: 0.9 }),
      black: S({ color: 0x1f2124, roughness: 0.45 }),
      white: S({ color: 0xe8eaed, roughness: 0.4 }),
      batt: S({ color: 0x1d4b86, roughness: 0.5 }),
      pcb: S({ color: 0x1d7a45, roughness: 0.5 }),
      pcb2: S({ color: 0x1b4ea3, roughness: 0.5 }),
      crate: S({ color: 0x2d6fb8, roughness: 0.55 }),
      rim: S({ color: 0xb06b2a, roughness: 0.72 }),
      breadTop: S({ map: tex.bread, roughness: 0.7 }),
      red: S({ color: 0xc81e28, roughness: 0.35 }),
      yellow: S({ color: 0xf0c02c, roughness: 0.4 }),
      copper: S({ color: 0xc27a3a, roughness: 0.3, metalness: 1 }),
      head: S({ color: 0xffffff, emissive: 0xfff4dd, emissiveIntensity: 1.6, roughness: 0.2 }),
      tail: S({ color: 0x400000, emissive: 0xff2a1a, emissiveIntensity: 1.2, roughness: 0.3 }),
      beacon: S({ color: 0xffa21a, emissive: 0xff8a00, emissiveIntensity: 0.9, roughness: 0.2, transparent: true, opacity: 0.92 }),
      screen: S({ color: 0x000000, emissive: 0xffffff, emissiveMap: tex.screen, roughness: 0.15 }),
      lens: S({ color: 0x0a0d12, roughness: 0.05, metalness: 0.6 }),
      led: S({ color: 0x0a3010, emissive: 0x2cff6a, emissiveIntensity: 1.2 }),
    };

    for (const k in M) M[k].envMapIntensity = M[k].metalness > 0.5 ? 0.9 : 0.35;
    const root = new THREE.Group();
    const parts = [];
    const part = (id, step, sub, explode) => {
      const g = new THREE.Group(); g.name = id; root.add(g);
      const p = { id, step, sub, group: g, explode: new THREE.Vector3(...explode) };
      parts.push(p); return g;
    };
    const box = (parent, w, h, d, mat, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m;
    };
    const cyl = (parent, r, h, mat, x, y, z, axis, seg) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg || 32), mat); m.position.set(x, y, z);
      if (axis === "z") m.rotation.x = Math.PI / 2; if (axis === "x") m.rotation.z = Math.PI / 2;
      parent.add(m); return m;
    };

    // ---- 1. Pastki ramka ----
    const DECK_Y = 0.27, TOP_Y = 0.861;
    {
      const g = part("frame", 1, 0, [0, -0.45, 0]);
      box(g, 0.92, 0.018, 0.42, M.wood, 0, 0.159, 0);           // pastki tag
      box(g, 0.92, 0.09, 0.018, M.wood, 0, 0.212, 0.201);        // yon taxtalar
      box(g, 0.92, 0.09, 0.018, M.wood, 0, 0.212, -0.201);
      box(g, 0.018, 0.09, 0.42, M.wood, 0.451, 0.212, 0);
      box(g, 0.018, 0.09, 0.42, M.wood, -0.451, 0.212, 0);
      for (const x of [-0.3, 0, 0.3]) box(g, 0.04, 0.04, 0.38, M.brus, x, 0.188, 0);
      const deck = part("deck", 1, 0.5, [0, 0.5, 0]);
      box(deck, 1.0, 0.018, 0.6, M.wood, 0, DECK_Y, 0);
    }
    // ---- 2. G'ildiraklar ----
    const wheels = [];
    for (const s of [1, -1]) {
      const g = part("wheel" + s, 2, s > 0 ? 0 : 0.25, [0, 0, 0.45 * s]);
      const w = new THREE.Group(); w.position.set(-0.17, 0.125, 0.265 * s); g.add(w);
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.03, 24, 64), M.tire); w.add(tire);
      cyl(w, 0.092, 0.05, M.hub, 0, 0, 0, "z", 48);
      cyl(w, 0.03, 0.056, M.steel, 0, 0, 0, "z", 24);
      for (let i = 0; i < 6; i++) { const b = cyl(w, 0.006, 0.058, M.steel, Math.cos(i) * 0.06, Math.sin(i) * 0.06, 0, "z", 8); }
      box(g, 0.08, 0.05, 0.03, M.steel, -0.17, 0.155, 0.218 * s);  // o'q qisqichi
      wheels.push(w);
    }
    {
      const g = part("casters", 2, 0.5, [0, -0.35, 0]);
      const caster = (x, z, r) => {
        box(g, 0.07, 0.008, 0.07, M.steel, x, 0.146, z);
        box(g, 0.006, 0.09 - (0.05 - r), 0.04, M.steel, x - 0.012, 0.1, z + 0.02);
        box(g, 0.006, 0.09 - (0.05 - r), 0.04, M.steel, x - 0.012, 0.1, z - 0.02);
        cyl(g, r, 0.03, M.rubber, x - 0.02, r, z, "z", 32);
      };
      caster(0.37, 0.15, 0.05); caster(0.37, -0.15, 0.05); caster(-0.41, 0, 0.035);
    }
    // ---- 3. Elektronika ----
    {
      const g = part("battery", 3, 0, [0, 0.7, 0]);
      box(g, 0.17, 0.19, 0.3, M.batt, 0.2, DECK_Y + 0.104, -0.1);
      box(g, 0.172, 0.03, 0.302, M.black, 0.2, DECK_Y + 0.19, -0.1);
      cyl(g, 0.012, 0.02, M.red, 0.16, DECK_Y + 0.215, -0.04); cyl(g, 0.012, 0.02, M.black, 0.16, DECK_Y + 0.215, -0.16);
      const sh = part("shelf", 3, 0.35, [0, 0.8, 0]);
      const SY = 0.52;
      box(sh, 0.36, 0.012, 0.52, M.wood, 0.3, SY, 0);
      for (const z of [0.24, -0.24]) box(sh, 0.03, SY - DECK_Y, 0.03, M.brus, 0.44, (SY + DECK_Y) / 2, z);
      box(sh, 0.15, 0.008, 0.08, M.pcb, 0.2, SY + 0.01, 0.14);      // giroskuter platasi
      for (let i = 0; i < 5; i++) box(sh, 0.012, 0.02, 0.012, M.black, 0.15 + i * 0.024, SY + 0.024, 0.16);
      box(sh, 0.1, 0.03, 0.07, M.black, 0.33, SY + 0.021, 0.14);    // Raspberry Pi (korpusda)
      box(sh, 0.085, 0.003, 0.056, M.pcb, 0.33, SY + 0.038, 0.14);
      box(sh, 0.055, 0.006, 0.028, M.pcb2, 0.3, SY + 0.01, -0.04);  // ESP32
      box(sh, 0.11, 0.025, 0.07, M.white, 0.3, SY + 0.019, -0.17);  // 4G modem
      box(sh, 0.05, 0.02, 0.04, M.steel, 0.2, SY + 0.016, -0.12);   // DC-DC
      box(sh, 0.08, 0.025, 0.035, M.red, 0.38, SY + 0.018, -0.05);  // sug'urtagich bloki
      const wire = (a, b, mat) => { const d = new THREE.Vector3().subVectors(b, a); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, d.length(), 6), mat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); sh.add(m); };
      wire(new THREE.Vector3(0.16, DECK_Y + 0.22, -0.04), new THREE.Vector3(0.36, SY - 0.006, -0.05), M.red);
      wire(new THREE.Vector3(0.16, DECK_Y + 0.22, -0.16), new THREE.Vector3(0.21, SY - 0.006, -0.12), M.black);
    }
    // ---- 4. Korpus devorlari ----
    {
      const sideShape = new THREE.Shape();
      sideShape.moveTo(-0.5, DECK_Y + 0.009); sideShape.lineTo(0.5, DECK_Y + 0.009); sideShape.lineTo(0.5, 0.7);
      sideShape.lineTo(0.09, TOP_Y); sideShape.lineTo(-0.5, TOP_Y); sideShape.lineTo(-0.5, DECK_Y + 0.009);
      const sg = new THREE.ExtrudeGeometry(sideShape, { depth: 0.018, bevelEnabled: false });
      for (const s of [1, -1]) {
        const g = part("side" + s, 4, s > 0 ? 0 : 0.15, [0, 0, 0.6 * s]);
        const m = new THREE.Mesh(sg, M.wood); m.position.z = s > 0 ? 0.282 : -0.3; g.add(m);
      }
      const rear = part("rear", 4, 0.3, [-0.6, 0, 0]);
      box(rear, 0.018, TOP_Y - DECK_Y - 0.009, 0.564, M.wood, -0.491, (TOP_Y + DECK_Y + 0.009) / 2, 0);
      const front = part("front", 4, 0.4, [0.6, 0, 0]);
      box(front, 0.018, 0.7 - DECK_Y - 0.009, 0.564, M.wood, 0.491, (0.7 + DECK_Y + 0.009) / 2, 0);
      const mid = part("partition", 4, 0.5, [0, 0.6, 0]);
      box(mid, 0.018, TOP_Y - DECK_Y - 0.009, 0.564, M.wood, 0.09, (TOP_Y + DECK_Y + 0.009) / 2, 0);
      const con = part("console", 4, 0.6, [0.25, 0.5, 0]);
      const L = Math.hypot(0.41, TOP_Y - 0.7), ang = Math.atan2(TOP_Y - 0.7, 0.41);
      const c = box(con, L + 0.01, 0.018, 0.6, M.wood, 0.295, (TOP_Y + 0.7) / 2 + 0.009, 0); c.rotation.z = -ang;
      const bump = part("bumper", 4, 0.75, [0, -0.3, 0]);
      const BY = DECK_Y + 0.04;
      box(bump, 1.05, 0.06, 0.025, M.rubber, 0, BY, 0.304); box(bump, 1.05, 0.06, 0.025, M.rubber, 0, BY, -0.304);
      box(bump, 0.025, 0.06, 0.63, M.rubber, 0.513, BY, 0); box(bump, 0.025, 0.06, 0.63, M.rubber, -0.513, BY, 0);
      for (const z of [0.07, -0.07]) box(bump, 0.008, 0.03, 0.06, M.copper, -0.528, BY + 0.06, z); // zaryad kontaktlari
    }
    // ---- 5. Tarozi ----
    const PLATE_Y = 0.317;
    {
      const g = part("scale", 5, 0, [0, 0.75, 0]);
      for (const [x, z] of [[-0.42, 0.22], [-0.42, -0.22], [0.02, 0.22], [0.02, -0.22]]) box(g, 0.08, 0.026, 0.03, M.steel, x, DECK_Y + 0.022, z);
      box(g, 0.54, 0.012, 0.54, M.white, -0.2, PLATE_Y - 0.006, 0);
    }
    // ---- 6. Qopqoq ----
    const lidPart = part("lid", 6, 0, [0, 0.7, 0]);
    const lidPivot = new THREE.Group(); lidPivot.position.set(-0.5, TOP_Y, 0); lidPart.add(lidPivot);
    box(lidPivot, 0.6, 0.018, 0.6, M.wood, 0.3, 0.009, 0);
    for (const z of [0.2, -0.2]) cyl(lidPivot, 0.01, 0.08, M.steel, 0, 0.004, z, "z", 12); // ilmoqlar (petlya)
    box(lidPivot, 0.03, 0.02, 0.06, M.black, 0.58, -0.01, 0);  // qulf tili
    const cam_in = box(lidPivot, 0.03, 0.02, 0.03, M.black, 0.3, -0.012, 0); // ichki kamera
    box(lidPart, 0.04, 0.04, 0.08, M.black, 0.075, TOP_Y - 0.03, 0); // elektromagnit qulf
    const actBody = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1, 16), M.black); lidPart.add(actBody);
    const actRod = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 1, 12), M.steel); lidPart.add(actRod);
    const ACT_B = new THREE.Vector3(-0.3, 0.45, 0.262);
    const up = new THREE.Vector3(0, 1, 0);
    const orient = (m, a, b) => { const d = new THREE.Vector3().subVectors(b, a); const L = d.length(); m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(up, d.normalize()); };
    function setLid(a) {
      lidPivot.rotation.z = a;
      const P = new THREE.Vector3(0.25 * Math.cos(a) + 0.012 * Math.sin(a), 0.25 * Math.sin(a) - 0.012 * Math.cos(a), 0.262).add(new THREE.Vector3(-0.5, TOP_Y, 0));
      const dir = new THREE.Vector3().subVectors(P, ACT_B).normalize();
      const mid = ACT_B.clone().addScaledVector(dir, 0.24);
      orient(actBody, ACT_B, mid); orient(actRod, mid, P);
    }
    setLid(0);
    // ---- 7. Ekran va sensorlar ----
    const ang = Math.atan2(TOP_Y - 0.7, 0.41);
    {
      const g = part("screen", 7, 0, [0.3, 0.45, 0]);
      const holder = new THREE.Group(); holder.position.set(0.31, (TOP_Y + 0.7) / 2 + 0.024 - 0.015 * 0.38, 0); holder.rotation.z = -ang; g.add(holder);
      box(holder, 0.19, 0.014, 0.27, M.black, 0, 0, 0);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.255, 0.165), M.screen);
      scr.rotation.x = -Math.PI / 2; scr.rotation.z = Math.PI / 2; scr.position.y = 0.0075; holder.add(scr);
      box(g, 0.025, 0.025, 0.04, M.black, 0.13, TOP_Y + 0.0, 0.17); // yuz kamerasi
      cyl(g, 0.008, 0.004, M.lens, 0.143, TOP_Y + 0.002, 0.17, "x", 16);
    }
    {
      const g = part("cams", 7, 0.15, [0.35, 0, 0]);
      box(g, 0.03, 0.035, 0.06, M.black, 0.508, 0.64, 0); cyl(g, 0.012, 0.006, M.lens, 0.525, 0.64, 0, "x", 20);
      for (const s of [1, -1]) { box(g, 0.05, 0.035, 0.03, M.black, 0.4, 0.62, 0.3 * s + 0.012 * s); cyl(g, 0.011, 0.006, M.lens, 0.4, 0.62, 0.33 * s, "z", 20); }
    }
    {
      const g = part("lidar", 7, 0.25, [0, 0.45, 0]);
      cyl(g, 0.012, 0.07, M.steel, 0.15, TOP_Y + 0.03, -0.22, null, 12);
      cyl(g, 0.045, 0.035, M.black, 0.15, TOP_Y + 0.08, -0.22, null, 40);
      cyl(g, 0.038, 0.025, M.lens, 0.15, TOP_Y + 0.11, -0.22, null, 40);
    }
    {
      const g = part("ultra", 7, 0.35, [0.25, 0, 0]);
      const us = (x, y, z, ry) => {
        const u = new THREE.Group(); u.position.set(x, y, z); u.rotation.y = ry; g.add(u);
        box(u, 0.006, 0.022, 0.046, M.pcb2, 0, 0, 0);
        for (const dz of [0.012, -0.012]) cyl(u, 0.008, 0.012, M.steel, 0.006, 0, dz, "x", 16);
      };
      const Y = DECK_Y + 0.11;
      for (const z of [-0.2, 0, 0.2]) us(0.501, Y, z, 0);
      for (const s of [1, -1]) for (const x of [0.3, -0.3]) us(x, Y, 0.292 * s, -s * Math.PI / 2);
      us(-0.501, Y, 0, Math.PI);
      for (const z of [-0.17, 0.17, -0.06, 0.06]) box(g, 0.02, 0.008, 0.02, M.black, 0.46, 0.146, z); // ToF pastda
    }
    {
      const g = part("gps", 7, 0.45, [0, 0.5, 0]);
      cyl(g, 0.035, 0.016, M.white, 0.14, TOP_Y + 0.008, 0.05, null, 32);
      cyl(g, 0.005, 0.16, M.black, 0.12, TOP_Y + 0.08, 0.25, null, 10);
    }
    {
      const g = part("lights", 7, 0.55, [0.3, 0.2, 0]);
      for (const s of [1, -1]) {
        box(g, 0.014, 0.035, 0.08, M.head, 0.505, 0.47, 0.19 * s);
        box(g, 0.014, 0.03, 0.08, M.tail, -0.505, 0.62, 0.19 * s);
      }
      cyl(g, 0.03, 0.05, M.beacon, 0.14, TOP_Y + 0.025, -0.06, null, 32);
      const spk = cyl(g, 0.035, 0.006, M.black, 0.3, 0.42, 0.293, "z", 32);
    }
    {
      const g = part("estop", 7, 0.65, [-0.35, 0, 0]);
      box(g, 0.03, 0.07, 0.07, M.yellow, -0.512, 0.76, 0.18);
      cyl(g, 0.012, 0.03, M.red, -0.535, 0.76, 0.18, "x", 20);
      cyl(g, 0.026, 0.016, M.red, -0.555, 0.76, 0.18, "x", 32);
    }
    {
      const g = part("cash", 7, 0.8, [0, 0, 0.45]);
      box(g, 0.1, 0.14, 0.02, M.black, 0.3, 0.62, 0.3);
      box(g, 0.08, 0.006, 0.006, M.lens, 0.3, 0.64, 0.311);
      box(g, 0.012, 0.012, 0.004, M.led, 0.33, 0.58, 0.311);
      box(g, 0.13, 0.15, 0.17, M.steel, 0.37, DECK_Y + 0.085, 0.17);  // seyf
      box(g, 0.004, 0.06, 0.02, M.black, 0.437, DECK_Y + 0.1, 0.17);
    }
    // ---- 8. Savatlar va non ----
    const breadRim = new THREE.TorusGeometry(0.074, 0.022, 14, 36);
    const breadMid = new THREE.CylinderGeometry(0.075, 0.075, 0.016, 36);
    const handles = [];
    function makeCrate(parent, y0) {
      const g = new THREE.Group(); g.position.set(-0.2, y0, 0); parent.add(g);
      const X = 0.5, Y = 0.24, Z = 0.4, t = 0.012;
      box(g, X, 0.012, Z, M.crate, 0, 0.006, 0);
      for (const s of [1, -1]) {
        const z = s * (Z / 2 - t / 2);
        for (const y of [0.02, Y / 2, Y - 0.015]) box(g, X, 0.026, t, M.crate, 0, y, z);
        for (let i = 0; i <= 10; i++) box(g, 0.012, Y, t, M.crate, -X / 2 + 0.006 + i * (X - 0.012) / 10, Y / 2, z);
        const x = s * (X / 2 - t / 2);
        for (const y of [0.02, Y / 2, Y - 0.015]) box(g, t, 0.026, Z, M.crate, x, y, 0);
        for (let i = 0; i <= 8; i++) box(g, t, Y, 0.012, M.crate, x, Y / 2, -Z / 2 + 0.006 + i * (Z - 0.012) / 8);
      }
      for (const s of [1, -1]) { // yig'iladigan dasta
        const h = new THREE.Group(); h.position.set(0, Y, 0); g.add(h);
        const arc = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.007, 8, 40, Math.PI), M.black);
        arc.rotation.y = Math.PI / 2; h.add(arc); h.rotation.z = s * 1.48; h.userData.s = s; handles.push(h);
      }
      return g;
    }
    const breads = [];
    function fillBread(parent, crate) {
      for (const zr of [0.1, -0.1]) for (let i = 0; i < 16; i++) {
        const b = new THREE.Group();
        b.position.set(-0.2 - 0.225 + i * 0.03, crate.position.y + 0.11, zr);
        b.rotation.y = Math.PI / 2; b.rotation.x = (rnd() - 0.5) * 0.08;
        b.add(new THREE.Mesh(breadRim, M.rim));
        const mid = new THREE.Mesh(breadMid, [M.rim, M.breadTop, M.breadTop]); mid.rotation.x = Math.PI / 2; b.add(mid);
        parent.add(b); breads.push(b);
      }
    }
    const crate1 = part("crate1", 8, 0, [0, 0.9, 0]);
    const c1 = makeCrate(crate1, PLATE_Y);
    const bread1 = part("bread1", 8, 0.22, [0, 0.9, 0]); fillBread(bread1, c1);
    const crate2 = part("crate2", 8, 0.45, [0, 0.9, 0]);
    const c2 = makeCrate(crate2, PLATE_Y + 0.245);
    const bread2 = part("bread2", 8, 0.67, [0, 0.9, 0]); fillBread(bread2, c2);

    root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

    // Raqamli belgilar (BOM raqami → qism va nuqta)
    const anchors = [
      [1, "side1", [-0.2, 0.55, 0.3]], [2, "frame", [0.3, 0.2, 0.21]], [3, "wheel1", [-0.17, 0.125, 0.31]],
      [4, "casters", [0.37, 0.05, 0.17]], [5, "shelf", [0.2, 0.54, 0.14]], [6, "battery", [0.2, 0.42, -0.1]],
      [7, "shelf", [0.33, 0.56, 0.14]], [8, "shelf", [0.3, 0.535, -0.04]], [9, "gps", [0.12, 1.0, 0.25]],
      [10, "screen", [0.31, 0.8, -0.08]], [11, "cams", [0.52, 0.64, 0]], [12, "lidar", [0.15, 0.98, -0.22]],
      [13, "ultra", [0.51, 0.38, 0.2]], [14, "ultra", [0.46, 0.14, -0.17]], [15, "gps", [0.14, 0.875, 0.05]],
      [16, "scale", [0.02, 0.3, 0.22]], [17, "lid", [0.075, 0.85, 0]], [18, "lights", [0.51, 0.47, -0.19]],
      [19, "estop", [-0.56, 0.76, 0.18]], [20, "bumper", [0.52, 0.31, -0.1]], [21, "crate2", [-0.2, 0.8, 0]],
      [22, "cash", [0.3, 0.62, 0.31]], [23, "shelf", [0.38, 0.54, -0.05]], [24, "bumper", [-0.53, 0.37, 0]],
    ].map(([n, id, p]) => ({ n, part: parts.find((q) => q.id === id), pos: new THREE.Vector3(...p) }));

    const easeOut = (k) => 1 - Math.pow(1 - k, 3);
    function setAssembly(p) { // p: 0..8 (8 = to'liq yig'ilgan)
      for (const q of parts) {
        const start = q.step - 1 + q.sub * 0.55, k = Math.min(1, Math.max(0, (p - start) / 0.45));
        q.group.visible = k > 0.001; q.group.position.copy(q.explode).multiplyScalar(1 - easeOut(k));
      }
    }
    function setExplode(e) { for (const q of parts) { q.group.visible = true; q.group.position.copy(q.explode).multiplyScalar(e * 0.6); } }
    function setHandles(up) { for (const h of handles) h.rotation.z = h.userData.s * 1.48 * (1 - up); }
    function spinWheels(a) { for (const w of wheels) w.rotation.z = -a; }

    return { root, parts, anchors, M, tex, setLid, setAssembly, setExplode, setHandles, spinWheels, breads };
  }

  // Studiya: yorug'lik, pol, aks ettirish muhiti
  function makeStage(THREE, renderer, scene, dark) {
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.82;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const bg = new THREE.Color(dark ? 0x1b1f24 : 0xaeb7c1);
    scene.background = bg; scene.fog = new THREE.Fog(bg, 4.5, 11);
    // muhit xaritasi (oddiy xona)
    const pm = new THREE.PMREMGenerator(renderer);
    const room = new THREE.Scene();
    const rb = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 10), new THREE.MeshBasicMaterial({ color: 0x8a8f96, side: THREE.BackSide })); rb.position.y = 2.5; room.add(rb);
    const panel = (x, y, z, w, h, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 1, 0); room.add(m); };
    panel(0, 5.2, 0, 5, 5, 0xffffff); panel(4.8, 2.5, 0, 2, 3, 0xfff1dc); panel(-4.8, 2, 1, 2, 2.5, 0xdde8ff);
    scene.environment = pm.fromScene(room, 0.04).texture;
    const hemi = new THREE.HemisphereLight(0xe6eefa, 0x5a5348, 0.35); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff0dc, 1.7); sun.position.set(2.6, 4.2, 1.8); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = -1.6; sc.right = 1.6; sc.top = 1.6; sc.bottom = -1.6; sc.near = 0.5; sc.far = 10;
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.015; sun.shadow.radius = 4; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.45); fill.position.set(-3, 2, -2.5); scene.add(fill);
    const tex = makeTextures(THREE, (() => { let s = 5; return () => (s = s * 16807 % 2147483647) / 2147483647; })()).tiles;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, envMapIntensity: 0.2, color: dark ? 0x7d828a : 0xa9adb3 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    return { sun, floor, setDark(d) { const c = new THREE.Color(d ? 0x1b1f24 : 0xaeb7c1); scene.background = c; scene.fog.color = c; floor.material.color.set(d ? 0x7d828a : 0xa9adb3); } };
  }

  window.NonRobot = { BOM, STEPS, makeRobot, makeStage };
})();
