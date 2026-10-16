/**
 * Geeta Bhawan Mandir — Standalone Client Bundle
 * Works seamlessly across both HTTP servers and local file:// protocol
 */
(function() {
  'use strict';

  /* =========================================================================
     1. SACRED WEB AUDIO SYNTHESIZER ENGINE
     ========================================================================= */
  let audioCtx = null;
  let isAudioActive = false;
  let tanpuraNodes = [];
  let masterGain = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTempleBell() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bellGain = ctx.createGain();
    bellGain.connect(masterGain);

    const clapperOsc = ctx.createOscillator();
    const clapperGain = ctx.createGain();
    clapperOsc.type = 'triangle';
    clapperOsc.frequency.setValueAtTime(3200, now);
    clapperOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    clapperGain.gain.setValueAtTime(0.6, now);
    clapperGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    clapperOsc.connect(clapperGain);
    clapperGain.connect(bellGain);

    clapperOsc.start(now);
    clapperOsc.stop(now + 0.1);

    const partials = [
      { freq: 590, gain: 0.35, decay: 3.5 },
      { freq: 1180, gain: 0.5, decay: 4.2 },
      { freq: 1420, gain: 0.3, decay: 2.8 },
      { freq: 1780, gain: 0.25, decay: 2.2 },
      { freq: 2360, gain: 0.15, decay: 1.6 },
      { freq: 3540, gain: 0.08, decay: 0.9 }
    ];

    partials.forEach((part) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(part.freq + (Math.random() * 4 - 2), now);

      pGain.gain.setValueAtTime(part.gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.00001, now + part.decay);

      osc.connect(pGain);
      pGain.connect(bellGain);

      osc.start(now);
      osc.stop(now + part.decay + 0.1);
    });
  }

  function toggleTanpuraDrone() {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isAudioActive) {
      stopTanpuraDrone();
      return false;
    }

    playTempleBell();

    const strings = [
      { freq: 110.0, gain: 0.12, type: 'sawtooth' },
      { freq: 164.81, gain: 0.15, type: 'triangle' },
      { freq: 220.0, gain: 0.18, type: 'sine' },
      { freq: 440.0, gain: 0.08, type: 'triangle' }
    ];

    const droneMaster = ctx.createGain();
    droneMaster.gain.setValueAtTime(0.001, ctx.currentTime);
    droneMaster.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3.0);
    droneMaster.connect(masterGain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    strings.forEach((str) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = str.type;
      osc.frequency.setValueAtTime(str.freq, ctx.currentTime);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, ctx.currentTime);

      g.gain.setValueAtTime(str.gain, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.18 + Math.random() * 0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(str.gain * 0.3, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      lfo.start();

      osc.connect(g);
      g.connect(filter);

      osc.start();

      tanpuraNodes.push(osc, lfo);
    });

    filter.connect(droneMaster);
    tanpuraNodes.push(droneMaster, filter);

    isAudioActive = true;
    return true;
  }

  function stopTanpuraDrone() {
    if (!audioCtx || !isAudioActive) return;

    tanpuraNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });

    tanpuraNodes = [];
    isAudioActive = false;
  }

  /* =========================================================================
     2. LIVE IST CLOCK & DARSHAN STATUS ENGINE
     ========================================================================= */
  function initLiveClock() {
    const clockTimeEl = document.getElementById('ist-live-time');
    const clockMetaEl = document.getElementById('ist-live-meta');
    const dynamicStatusEl = document.getElementById('dynamic-darshan-status');
    const heroStatusTextEl = document.getElementById('hero-status-text');
    const heroStatusDotEl = document.getElementById('hero-status-dot');

    function update() {
      const now = new Date();

      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const dateFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const timeString = timeFormatter.format(now);
      const dateString = dateFormatter.format(now);

      const istHour24 = parseInt(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          hour12: false
        }).format(now),
        10
      );

      const istMinutes = parseInt(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          minute: 'numeric'
        }).format(now),
        10
      );

      const istDayOfWeek = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short'
      }).format(now);

      const currentTotalMinutes = istHour24 * 60 + istMinutes;

      const morningOpen = 5 * 60; // 300
      const morningClose = 11 * 60; // 660
      const eveningOpen = 16 * 60 + 30; // 990
      const eveningClose = 21 * 60; // 1260

      let statusText = '';
      let isCurrentlyOpen = false;

      if (currentTotalMinutes >= morningOpen && currentTotalMinutes < morningClose) {
        isCurrentlyOpen = true;
        const minsLeft = morningClose - currentTotalMinutes;
        const hoursLeft = Math.floor(minsLeft / 60);
        const remMins = minsLeft % 60;
        const timeRemaining = hoursLeft > 0 ? `${hoursLeft}h ${remMins}m` : `${remMins}m`;

        if (currentTotalMinutes >= 420 && currentTotalMinutes < 480) {
          statusText = `Open for Morning Darshan • Daily Satsang Ongoing (Until 11:00 AM)`;
        } else {
          statusText = `Open for Morning Darshan • Closes at 11:00 AM (${timeRemaining} left)`;
        }
      } else if (currentTotalMinutes >= morningClose && currentTotalMinutes < eveningOpen) {
        isCurrentlyOpen = false;
        const minsToOpen = eveningOpen - currentTotalMinutes;
        const hoursToOpen = Math.floor(minsToOpen / 60);
        const remMins = minsToOpen % 60;
        statusText = `Pat Closed • Opens for Evening Darshan at 4:30 PM (in ${hoursToOpen}h ${remMins}m)`;
      } else if (currentTotalMinutes >= eveningOpen && currentTotalMinutes < eveningClose) {
        isCurrentlyOpen = true;
        const minsLeft = eveningClose - currentTotalMinutes;
        const hoursLeft = Math.floor(minsLeft / 60);
        const remMins = minsLeft % 60;
        const timeRemaining = hoursLeft > 0 ? `${hoursLeft}h ${remMins}m` : `${remMins}m`;

        if (istDayOfWeek === 'Tue' && currentTotalMinutes >= 1080) {
          statusText = `Open for Evening Darshan • Weekly Sundarkand Path Ongoing (Until 9:00 PM)`;
        } else {
          statusText = `Open for Evening Darshan • Closes at 9:00 PM (${timeRemaining} left)`;
        }
      } else {
        isCurrentlyOpen = false;
        statusText = `Pat Closed for the Night • Opens tomorrow at 5:00 AM`;
      }

      if (clockTimeEl) clockTimeEl.textContent = `${timeString} IST`;
      if (clockMetaEl) clockMetaEl.textContent = `${dateString} • Kirti Nagar, New Delhi`;

      if (dynamicStatusEl) {
        dynamicStatusEl.innerHTML = `
          <span class="status-dot ${isCurrentlyOpen ? '' : 'closed'}"></span>
          <span class="status-badge-live">${statusText}</span>
        `;
      }

      if (heroStatusTextEl) {
        heroStatusTextEl.textContent = statusText;
      }

      if (heroStatusDotEl) {
        if (isCurrentlyOpen) {
          heroStatusDotEl.classList.remove('closed');
        } else {
          heroStatusDotEl.classList.add('closed');
        }
      }
    }

    update();
    setInterval(update, 1000);
  }

  /* =========================================================================
     3. BHAGAVAD GITA WISDOM ORACLE
     ========================================================================= */
  const GITA_VERSES = [
    {
      id: 1,
      category: 'duty',
      chapter: 2,
      verse: 47,
      sanskrit: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥`,
      iast: `karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi ||`,
      hindi: `तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्म के फल के प्रति आसक्त मत होओ, और न ही अकर्मण्यता (कर्म न करने) में तुम्हारी रुचि हो।`,
      english: `You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.`,
      lifeKey: `Focus completely on the integrity and quality of your effort; release anxious fixation on outcomes you cannot control.`,
      application: `When experiencing work pressure, exam stress, or major decisions, channel all your energy into sincere action today rather than burning mental energy dreading future outcomes.`
    },
    {
      id: 2,
      category: 'mind',
      chapter: 6,
      verse: 5,
      sanskrit: `उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥`,
      iast: `uddhared ātmanātmānaṁ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||`,
      hindi: `मनुष्य को चाहिए कि वह अपने मन द्वारा अपना उद्धार करे, अपने को नीचे न गिराए। क्योंकि यह मन ही आत्मा का मित्र है और मन ही आत्मा का शत्रु भी है।`,
      english: `Elevate yourself through the power of your own mind, and do not degrade yourself. For the mind can be the greatest friend of the self, and the mind can also be its greatest enemy.`,
      lifeKey: `Your internal dialogue shapes your reality; consciously train your mind to be your steadfast ally rather than an uncontrolled critic.`,
      application: `When feeling trapped by negative self-talk or discouragement, pause and consciously guide your thoughts with self-discipline and positive resolve.`
    },
    {
      id: 3,
      category: 'peace',
      chapter: 2,
      verse: 70,
      sanskrit: `आपूर्यमाणमचलप्रतिष्ठं समुद्रमापः प्रविशन्ति यद्वत् ।\nतद्वत्कामा यं प्रविशन्ति सर्वे स शान्तिमप्नोति न कामकामी ॥`,
      iast: `āpūryamāṇam acala-pratiṣṭhaṁ samudram āpaḥ praviśanti yadvat |\ntadvat kāmā yaṁ praviśanti sarve sa śāntim āpnoti na kāma-kāmī ||`,
      hindi: `जैसे निरंतर भरती रहने वाली नदियों का जल शांत, अचल समुद्र में विलीन हो जाता है, वैसे ही सब कामनाएं जिस स्थिर व्यक्ति में विकार उत्पन्न किए बिना समा जाती हैं, वही परम शांति प्राप्त करता है।`,
      english: `Just as the ocean remains undisturbed by the incessant flow of rivers pouring into it, so does the sage into whom all desires enter without disturbing his peace attain true tranquility—not one who strives to satisfy desires.`,
      lifeKey: `Cultivate an inner depth that remains serene and grounded regardless of the turbulence of external circumstances.`,
      application: `In tense or conflicting situations, ground yourself in your deeper values and observe the disturbance without allowing it to shake your inner equilibrium.`
    },
    {
      id: 4,
      category: 'surrender',
      chapter: 18,
      verse: 66,
      sanskrit: `सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥`,
      iast: `sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||`,
      hindi: `सब धर्मों और उपाधियों के अहंकारी बंधनों को त्यागकर केवल मेरी शरण में आ जाओ। मैं तुम्हें समस्त पापों और भयों से मुक्त कर दूँगा, तुम शोक मत करो।`,
      english: `Abandon all varieties of attachment and simply surrender unto Me alone. I shall liberate you from all distress; do not grieve.`,
      lifeKey: `Release the exhausting illusion of total personal control; place your supreme faith in the benevolent divine order.`,
      application: `When facing grief, loss, or situations beyond human control, surrender the burden with trust, knowing divine grace is ever-present.`
    }
  ];

  let currentGitaIndex = 0;

  function initGitaSection(showToastCallback) {
    const container = document.getElementById('gita-verse-display');
    const tabs = document.querySelectorAll('.gita-tab-btn');
    const prevBtn = document.getElementById('gita-prev-btn');
    const nextBtn = document.getElementById('gita-next-btn');

    function renderVerse(index) {
      currentGitaIndex = index;
      const v = GITA_VERSES[currentGitaIndex];
      if (!v || !container) return;

      tabs.forEach((tab) => {
        const cat = tab.getAttribute('data-category');
        if (cat === v.category || (cat === 'all' && index === 0)) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      container.innerHTML = `
        <div class="shloka-ornament-top">
          अध्याय ${v.chapter}, श्लोक ${v.verse} • Chapter ${v.chapter}, Verse ${v.verse}
        </div>

        <div class="shloka-sanskrit">${v.sanskrit.replace(/\n/g, '<br>')}</div>
        <div class="shloka-iast">${v.iast.replace(/\n/g, '<br>')}</div>

        <div class="shloka-divider"></div>

        <div class="shloka-translations">
          <div class="translation-block">
            <h5>हिंदी अर्थ (Hindi Meaning)</h5>
            <p class="hindi-meaning">${v.hindi}</p>
          </div>
          <div class="translation-block">
            <h5>English Translation</h5>
            <p>${v.english}</p>
          </div>
        </div>

        <div class="gita-application-grid">
          <div class="app-box">
            <h6>💡 LIFE KEY (जीवन का सार)</h6>
            <p>${v.lifeKey}</p>
          </div>
          <div class="app-box">
            <h6>✨ APPLY TO LIFE (दैनिक जीवन में उपयोग)</h6>
            <p>${v.application}</p>
          </div>
        </div>

        <div class="shloka-actions">
          <button class="copy-btn" id="copy-shloka-btn" title="Copy Shloka text to clipboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Shloka & Meaning</span>
          </button>

          <div class="shloka-nav-btns">
            <button class="shloka-nav-btn" id="btn-bell-chime" title="Auspicious Temple Bell Chime">
              🔔
            </button>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0.4rem;">
              ${currentGitaIndex + 1} / ${GITA_VERSES.length}
            </span>
            <button class="shloka-nav-btn" id="sub-prev-btn" title="Previous Shloka" aria-label="Previous Shloka">
              &larr;
            </button>
            <button class="shloka-nav-btn" id="sub-next-btn" title="Next Shloka" aria-label="Next Shloka">
              &rarr;
            </button>
          </div>
        </div>
      `;

      const copyBtn = document.getElementById('copy-shloka-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const textToCopy = `॥ श्रीमद्भगवद्गीता (अध्याय ${v.chapter}, श्लोक ${v.verse}) ॥\n\n${v.sanskrit}\n\n[IAST]:\n${v.iast}\n\n[हिंदी अर्थ]:\n${v.hindi}\n\n[English]:\n${v.english}\n\n[Life Key]:\n${v.lifeKey}\n\n— Geeta Bhawan Mandir, New Delhi`;
          navigator.clipboard.writeText(textToCopy).then(() => {
            if (showToastCallback) showToastCallback('Shloka copied to clipboard with blessings! 🙏');
          }).catch(() => {
            if (showToastCallback) showToastCallback('Failed to copy. Please try again.');
          });
        });
      }

      const bellBtn = document.getElementById('btn-bell-chime');
      if (bellBtn) {
        bellBtn.addEventListener('click', () => {
          playTempleBell();
          if (showToastCallback) showToastCallback('घंटी निनाद (Temple Bell Strike) 🔔');
        });
      }

      const subPrev = document.getElementById('sub-prev-btn');
      const subNext = document.getElementById('sub-next-btn');
      if (subPrev) subPrev.addEventListener('click', () => step(-1));
      if (subNext) subNext.addEventListener('click', () => step(1));
    }

    function step(dir) {
      let nextIndex = (currentGitaIndex + dir) % GITA_VERSES.length;
      if (nextIndex < 0) nextIndex = GITA_VERSES.length - 1;
      renderVerse(nextIndex);
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const cat = tab.getAttribute('data-category');
        if (cat === 'all') {
          renderVerse(0);
        } else {
          const idx = GITA_VERSES.findIndex((v) => v.category === cat);
          if (idx !== -1) renderVerse(idx);
        }
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => step(1));

    renderVerse(0);
  }

  /* =========================================================================
     4. SACRED 3D CANVAS BACKGROUND ENGINE
     ========================================================================= */
  function init3DBackground() {
    const canvas = document.getElementById('bg-sacred-3d-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let centerX = width / 2;
    let centerY = height / 2;
    const fov = 420;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    }
    window.addEventListener('resize', onResize, { passive: true });

    window.addEventListener('mousemove', (e) => {
      targetTiltX = ((e.clientX / width) - 0.5) * 0.4;
      targetTiltY = ((e.clientY / height) - 0.5) * 0.4;
    }, { passive: true });

    const isMobile = width < 768;
    const emberCount = isMobile ? 22 : 45;
    const embers = [];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 - 200,
        radius: Math.random() * 2.2 + 1.2,
        speedY: Math.random() * 0.4 + 0.2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.4 ? 'rgba(234, 179, 8,' : 'rgba(249, 115, 22,'
      });
    }

    const petalCount = isMobile ? 8 : 16;
    const petals = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.6,
        z: Math.random() * 700 - 150,
        size: Math.random() * 8 + 8,
        speedY: Math.random() * 0.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        color: Math.random() > 0.35 
          ? { r: 245, g: 158, b: 11, a: 0.38 }
          : { r: 220, g: 38, b: 38, a: 0.28 }
      });
    }

    const ringCount = 3;
    let mandalaAngle = 0;
    let animFrameId = null;
    let isTabActive = true;

    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
      if (isTabActive && !animFrameId) {
        loop();
      }
    });

    function render3DProjectedPoint(x, y, z) {
      const cosY = Math.cos(tiltX);
      const sinY = Math.sin(tiltX);
      const cosX = Math.cos(tiltY);
      const sinX = Math.sin(tiltY);

      let x1 = x * cosY - z * sinY;
      let z1 = z * cosY + x * sinY;

      let y1 = y * cosX - z1 * sinX;
      let z2 = z1 * cosX + y * sinX;

      const scale = fov / (fov + z2);
      if (scale <= 0) return null;

      return {
        x: centerX + x1 * scale,
        y: centerY + y1 * scale,
        scale: scale,
        depth: z2
      };
    }

    function loop() {
      if (!isTabActive) {
        animFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      mandalaAngle += 0.003;

      ctx.save();
      for (let r = 0; r < ringCount; r++) {
        const radius = 180 + r * 110;
        const ringZ = Math.sin(mandalaAngle + r * 1.2) * 80;
        const segments = 16;
        ctx.beginPath();

        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2 + (r % 2 === 0 ? mandalaAngle : -mandalaAngle * 0.8);
          const px = Math.cos(theta) * radius;
          const py = Math.sin(theta) * radius * 0.65;
          const pt = render3DProjectedPoint(px, py, ringZ);

          if (pt) {
            if (s === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }

        ctx.strokeStyle = `rgba(234, 179, 8, ${0.05 + r * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let s = 0; s < 8; s++) {
          const theta = (s / 8) * Math.PI * 2 + (r % 2 === 0 ? mandalaAngle : -mandalaAngle * 0.8);
          const px = Math.cos(theta) * radius;
          const py = Math.sin(theta) * radius * 0.65;
          const pt = render3DProjectedPoint(px, py, ringZ);
          if (pt && pt.scale > 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(1, 2.5 * pt.scale), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(254, 240, 138, ${0.15 + r * 0.05})`;
            ctx.fill();
          }
        }
      }
      ctx.restore();

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.speedY;
        e.swayOffset += e.swaySpeed;
        const currentX = e.x + Math.sin(e.swayOffset) * 20;

        if (e.y < -height * 0.8) {
          e.y = height * 0.8;
          e.x = (Math.random() - 0.5) * width * 1.3;
        }

        const pt = render3DProjectedPoint(currentX, e.y, e.z);
        if (pt && pt.scale > 0) {
          const drawRadius = Math.max(0.8, e.radius * pt.scale);
          const alpha = Math.min(0.65, e.opacity * pt.scale);

          const glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, drawRadius * 3);
          glow.addColorStop(0, `${e.color} ${alpha})`);
          glow.addColorStop(0.5, `${e.color} ${alpha * 0.4})`);
          glow.addColorStop(1, `${e.color} 0)`);

          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, drawRadius * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, drawRadius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotX += p.rotSpeedX;
        p.rotY += p.rotSpeedY;
        p.rotZ += p.rotSpeedZ;

        if (p.y > height * 0.85) {
          p.y = -height * 0.85;
          p.x = (Math.random() - 0.5) * width * 1.2;
        }

        const pt = render3DProjectedPoint(p.x, p.y, p.z);
        if (pt && pt.scale > 0) {
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(p.rotZ);

          const scaleX = Math.cos(p.rotY) * pt.scale;
          const scaleY = Math.sin(p.rotX) * pt.scale;
          ctx.scale(scaleX, scaleY);

          const sz = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.bezierCurveTo(sz * 0.7, -sz * 0.5, sz * 0.7, sz * 0.5, 0, sz);
          ctx.bezierCurveTo(-sz * 0.7, sz * 0.5, -sz * 0.7, -sz * 0.5, 0, -sz);

          const col = p.color;
          const alpha = Math.max(0.05, col.a * pt.scale);
          ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.5})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();

          ctx.restore();
        }
      }

      animFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  /* =========================================================================
     5. MAIN CONTROLLER & EVENT LISTENERS
     ========================================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    const toastEl = document.getElementById('toast-notice');
    let toastTimer = null;

    function showToast(message) {
      if (!toastEl) return;
      toastEl.querySelector('.toast-text').textContent = message;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
      }, 3800);
    }

    init3DBackground();
    initLiveClock();
    initGitaSection(showToast);

    const header = document.querySelector('.site-header');
    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    function openMobileMenu() {
      if (!mobileMenuBtn || !mobileNavDrawer) return;
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileNavDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      if (!mobileMenuBtn || !mobileNavDrawer) return;
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileNavDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      mobileNavDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    }

    const audioBtn = document.getElementById('toggle-audio-btn');
    const audioMobileBtn = document.getElementById('toggle-audio-btn-mobile');

    function handleAudioToggle() {
      const isNowPlaying = toggleTanpuraDrone();
      const btns = [audioBtn, audioMobileBtn].filter(Boolean);

      btns.forEach((b) => {
        if (isNowPlaying) {
          b.classList.add('active');
          b.setAttribute('aria-pressed', 'true');
          b.querySelector('.audio-text').textContent = 'Tanpura Drone On';
        } else {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
          b.querySelector('.audio-text').textContent = 'Acoustic Sound';
        }
      });

      if (isNowPlaying) {
        showToast('शांत तानपुरा व घंटी (Pure Web Audio Synthesis Active) 🕉️');
      } else {
        showToast('Acoustic sound paused.');
      }
    }

    if (audioBtn) audioBtn.addEventListener('click', handleAudioToggle);
    if (audioMobileBtn) audioMobileBtn.addEventListener('click', handleAudioToggle);

    const sanctumsModal = document.getElementById('sanctums-modal');
    const openSanctumsBtns = document.querySelectorAll('.open-sanctums-btn');
    const closeSanctumsBtn = document.getElementById('close-sanctums-btn');

    function openModal(modal) {
      if (!modal) return;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openSanctumsBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(sanctumsModal);
      });
    });

    if (closeSanctumsBtn) {
      closeSanctumsBtn.addEventListener('click', () => closeModal(sanctumsModal));
    }

    const phase2Modal = document.getElementById('phase2-modal');
    const phase2Links = document.querySelectorAll('.phase2-future-link');
    const closePhase2Btn = document.getElementById('close-phase2-btn');
    const phase2FeatureName = document.getElementById('phase2-feature-name');

    phase2Links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const feature = link.getAttribute('data-feature') || 'This section';
        if (phase2FeatureName) {
          phase2FeatureName.textContent = feature;
        }
        openModal(phase2Modal);
      });
    });

    if (closePhase2Btn) {
      closePhase2Btn.addEventListener('click', () => closeModal(phase2Modal));
    }

    [sanctumsModal, phase2Modal].forEach((modal) => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal(modal);
          }
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(sanctumsModal);
        closeModal(phase2Modal);
        closeMobileMenu();
      }
    });

    const inquiryForm = document.getElementById('quick-inquiry-form');
    if (inquiryForm) {
      inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('inquiry-name')?.value.trim();
        const phone = document.getElementById('inquiry-phone')?.value.trim();

        if (!name || !phone) {
          showToast('Please provide your name and contact phone number.');
          return;
        }

        showToast(`Thank you, ${name}! Connecting you to Mandir Karyalay... 🙏`);
        setTimeout(() => {
          window.location.href = `tel:01147000208`;
        }, 1200);
      });
    }
  });
})();
