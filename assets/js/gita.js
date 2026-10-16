/**
 * Geeta Bhawan Mandir — Bhagavad Gita Wisdom Oracle
 * Verified, authentic shlokas with Devanagari Sanskrit, IAST, Hindi meaning,
 * English translation, Life Key, and Practical Application.
 */

import { playTempleBell } from './audio.js';

export const GITA_VERSES = [
  {
    id: 1,
    category: 'duty',
    categoryName: 'कर्म एवं कर्तव्य (Duty & Action)',
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
    categoryName: 'मन का संयम (Mind Mastery)',
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
    categoryName: 'मानसिक शांति (Inner Peace)',
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
    categoryName: 'शरण एवं भक्ति (Surrender & Faith)',
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

let currentIndex = 0;

export function initGitaSection(showToastCallback) {
  const container = document.getElementById('gita-verse-display');
  const tabs = document.querySelectorAll('.gita-tab-btn');
  const prevBtn = document.getElementById('gita-prev-btn');
  const nextBtn = document.getElementById('gita-next-btn');

  function renderVerse(index) {
    currentIndex = index;
    const v = GITA_VERSES[currentIndex];
    if (!v || !container) return;

    // Update active tab styling
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
            ${currentIndex + 1} / ${GITA_VERSES.length}
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

    // Hook up copy button
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

    // Bell chime in card
    const bellBtn = document.getElementById('btn-bell-chime');
    if (bellBtn) {
      bellBtn.addEventListener('click', () => {
        playTempleBell();
        if (showToastCallback) showToastCallback('घंटी निनाद (Temple Bell Strike) 🔔');
      });
    }

    // Secondary sub prev/next
    const subPrev = document.getElementById('sub-prev-btn');
    const subNext = document.getElementById('sub-next-btn');
    if (subPrev) subPrev.addEventListener('click', () => step(-1));
    if (subNext) subNext.addEventListener('click', () => step(1));
  }

  function step(dir) {
    let nextIndex = (currentIndex + dir) % GITA_VERSES.length;
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

  // Initial render
  renderVerse(0);
}
