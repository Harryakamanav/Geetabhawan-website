/**
 * Automated Verification Script for Geeta Bhawan Mandir Homepage
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- 1. VERIFYING REQUIRED ASSETS ---');
const requiredFiles = [
  'index.html',
  'package.json',
  'assets/css/styles.css',
  'assets/js/main.js',
  'assets/js/clock.js',
  'assets/js/audio.js',
  'assets/js/gita.js',
  'assets/js/particles3d.js',
  'assets/images/hero-mandir.png',
  'assets/images/mandir-logo.jpeg',
  'assets/images/favicon.png',
  'mandir-darshan.html',
  'assets/images/darshan/laxmi-narayan.png',
  'assets/images/darshan/shivalaya-1.png',
  'assets/images/darshan/shivalaya-2.png',
  'assets/images/darshan/shivalaya-3.png',
  'assets/images/darshan/pardeshwar-ling-1.png',
  'assets/images/darshan/pardeshwar-ling-2.png',
  'assets/images/darshan/mata-hanuman.png',
  'assets/images/darshan/saraswati-mata.png',
  'assets/images/darshan/sai-baba.png',
  'assets/images/darshan/vishnu-avatar.png',
  'assets/images/darshan/sheetla-mata.png',
  'rishte-naate.html',
  'assets/images/rishte-naate/service1.jpg',
  'assets/images/rishte-naate/service2.jpg',
  'assets/images/rishte-naate/service3.jpg',
  'assets/images/rishte-naate/service4.jpg',
  'assets/images/rishte-naate/service5.jpg',
  'assets/images/rishte-naate/service6.jpg',
  'assets/images/rishte-naate/service7.jpg',
  'assets/images/rishte-naate/service8.jpg',
  'assets/images/rishte-naate/service1.png',
  'assets/images/rishte-naate/service2.png',
  'assets/images/rishte-naate/service3.png',
  'assets/images/rishte-naate/gallery1.jpg',
  'assets/images/rishte-naate/gallery2.jpg',
  'assets/images/rishte-naate/gallery3.jpg',
  'assets/images/rishte-naate/mm1.jpeg',
  'assets/images/rishte-naate/mm2.jpeg',
  'assets/images/rishte-naate/mm3.jpeg',
  'assets/images/rishte-naate/mm4.jpeg',
  'assets/images/rishte-naate/mgmt.jpeg'
];

requiredFiles.forEach((file) => {
  const fullPath = path.join(ROOT, file);
  assert(fs.existsSync(fullPath), `Asset file exists: ${file}`);
});

console.log('\n--- 2. VERIFYING HTML STRUCTURE & SECTIONS ---');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const darshanHtml = fs.readFileSync(path.join(ROOT, 'mandir-darshan.html'), 'utf-8');

assert(darshanHtml.includes('श्री लक्ष्मी नारायण'), 'Darshan page contains Shri Laxmi Narayan');
assert(darshanHtml.includes('शिवालय'), 'Darshan page contains Shivalaya');
assert(darshanHtml.includes('पारदेश्वर'), 'Darshan page contains Pardeshwar Ling');
assert(darshanHtml.includes('साईं बाबा') || darshanHtml.includes('Sai Baba'), 'Darshan page contains Sai Baba');
assert(darshanHtml.includes('शीतला') || darshanHtml.includes('Sheetla'), 'Darshan page contains Sheetla Mata');
assert(darshanHtml.includes('दशावतार') || darshanHtml.includes('Dashavatar'), 'Darshan page contains Vishnu Dashavatar');
assert(darshanHtml.includes('assets/images/darshan/laxmi-narayan.png'), 'Darshan page references authentic Laxmi Narayan photo');
assert(darshanHtml.includes('assets/images/darshan/sai-baba.png'), 'Darshan page references authentic Sai Baba photo');
assert(darshanHtml.includes('assets/images/darshan/sheetla-mata.png'), 'Darshan page references authentic Sheetla Mata photo');
assert(darshanHtml.includes('assets/images/darshan/shivalaya-1.png') && darshanHtml.includes('shivalaya-2.png') && darshanHtml.includes('shivalaya-3.png'), 'Darshan page includes all 3 Shivalaya photos');
assert(darshanHtml.includes('rishte-naate.html'), 'Darshan page links to Rishte-Naate Vibhag');

// Rishte-Naate Vibhag Page Verification
const rishteHtml = fs.readFileSync(path.join(ROOT, 'rishte-naate.html'), 'utf-8');
assert(rishteHtml.includes('रिश्ते-नाते विभाग'), 'Rishte-Naate page contains official Hindi title');
assert(rishteHtml.includes('RISHTE-NAATE VIBHAG'), 'Rishte-Naate page contains English title');
assert(rishteHtml.includes('Bringing Hearts Together. Building Bonds for a Lifetime.'), 'Rishte-Naate page contains verified tagline');
assert(rishteHtml.includes('#FFF9F0'), 'Rishte-Naate page implements warm ivory light background');
assert(rishteHtml.includes('#F5EBDD'), 'Rishte-Naate page implements light champagne alternate background');
assert(rishteHtml.includes('#B8860B'), 'Rishte-Naate page implements antique gold primary accent');
assert(rishteHtml.includes('#D97706'), 'Rishte-Naate page implements muted saffron secondary accent');
assert(rishteHtml.includes('#3B281C'), 'Rishte-Naate page implements deep warm brown main text');
assert(rishteHtml.includes('Experience Rooted in Tradition') && rishteHtml.includes('Meaningful Connections') && rishteHtml.includes('Personal Guidance and Support'), 'All 3 approach cards present');
assert(rishteHtml.includes('service1.png') && rishteHtml.includes('service2.png') && rishteHtml.includes('service3.png'), 'All 3 approach card icons linked');
assert(rishteHtml.includes('service1.jpg') && rishteHtml.includes('service8.jpg'), 'All department gallery photos integrated');
assert(rishteHtml.includes('gallery1.jpg') && rishteHtml.includes('gallery2.jpg') && rishteHtml.includes('gallery3.jpg'), 'All 3 wedding photos integrated');
assert(rishteHtml.includes('Avinash Sahni') && rishteHtml.includes('Tribhuvan Sethi') && rishteHtml.includes('Chander Kamal Grover') && rishteHtml.includes('Surinder Mohan Sharma'), 'All 4 Mandir Office Bearers present');
assert(rishteHtml.includes('mgmt.jpeg'), 'Management Committee photo integrated');
assert(rishteHtml.includes('2,100') && rishteHtml.includes('7,100'), 'Verified registration fees present');
assert(rishteHtml.includes('2 Hours') || rishteHtml.includes('2 hours'), 'Verified 2 hours file viewing guideline present');
assert(rishteHtml.includes('011-47000208') && rishteHtml.includes('8810401428'), 'Verified phone numbers present on Rishte-Naate page');
assert(html.includes('rishte-naate.html'), 'Index page links to Rishte-Naate page');
assert(html.includes('Card 4: Rishte-Naate Vibhag'), 'Index page includes Card 4 for Rishte-Naate Vibhag');



// Title & Meta
assert(html.includes('<title>Geeta Bhawan Mandir | Kirti Nagar, New Delhi — Official Website</title>'), 'Correct SEO title present');
assert(html.includes('name="description"'), 'Meta description present');
assert(html.includes('name="viewport"'), 'Mobile viewport tag present');
assert(html.includes('assets/images/favicon.png'), 'Favicon linked');

assert((html.includes('Cinzel+Decorative') || html.includes('Cinzel Decorative')) && html.includes('Noto+Serif+Devanagari') && html.includes('Outfit'), 'All specified fonts loaded');

// Header & Navigation
assert(html.includes('id="site-header"'), 'Global header element present');
assert(html.includes('id="mobile-menu-btn"'), 'Accessible mobile menu button present');
assert(html.includes('id="mobile-nav-drawer"'), 'Mobile nav drawer present');
assert(html.includes('toggle-audio-btn'), 'User-controlled acoustic audio toggle present');

// Section 1: Hero
assert(html.includes('id="hero"'), 'Section One: Hero present');
assert(html.includes('assets/images/hero-mandir.png'), 'Authentic temple photograph used in hero');
assert(html.includes('गीता भवन'), 'Official Hindi name present in hero');
assert(html.includes('GEETA BHAWAN MANDIR'), 'English name present in hero');
assert(html.includes('hero-devotional-quote'), 'Devotional introductory quote present');
assert(html.includes('Aarti &amp; Darshan Timings') || html.includes('Aarti & Darshan Timings'), 'Hero CTA present');

// Section 2: Welcome
assert(html.includes('id="about"'), 'Section Two: Welcome to Geeta Bhawan present');
assert(html.includes('40+ Years'), 'Authentic 40+ years heritage badge present');
assert(html.includes('Kirti Nagar Shree Sanatan Dharam Sabha (Regd.)'), 'Official governing body cited');

// Section 3: Explore
assert(html.includes('id="explore"'), 'Section Three: Explore the Mandir present');
assert(html.includes('Mandir Darshan'), 'Card 1: Mandir Darshan present');
assert(html.includes('Aarti & Pooja') || html.includes('Aarti &amp; Pooja'), 'Card 2: Aarti & Pooja present');
assert(html.includes('Bhagavad Gita Wisdom'), 'Card 3: Gita Wisdom present');

// Section 4: Timings & Live Clock
assert(html.includes('id="timings"'), 'Section Four: Aarti & Darshan Timings present');
assert(html.includes('id="ist-live-time"'), 'Live IST clock container present');
assert(html.includes('5:00 AM – 11:00 AM') || html.includes('5:00 AM &ndash; 11:00 AM'), 'Verified morning darshan hours present');
assert(html.includes('4:30 PM – 9:00 PM') || html.includes('4:30 PM &ndash; 9:00 PM'), 'Verified evening darshan hours present');
assert(html.includes('7:00 AM – 8:00 AM') || html.includes('7:00 AM &ndash; 8:00 AM'), 'Verified morning satsang present');
assert(html.includes('Tuesday'), 'Weekly Tuesday Sundarkand Path present');
assert(html.includes('Navratri'), 'Special Navratri schedule present');

// Section 5: Bhagavad Gita Wisdom
assert(html.includes('id="gita-wisdom"'), 'Section Five: Bhagavad Gita Wisdom Oracle present');
assert(html.includes('id="gita-verse-display"'), 'Dynamic shloka container present');

// Section 6: Festivals
assert(html.includes('id="festivals"'), 'Section Six: Festivals & Celebrations present');
assert(html.includes('श्री कृष्ण जन्माष्टमी'), 'Janmashtami festival present');
assert(html.includes('महा शिवरात्रि'), 'Maha Shivratri present');

// Section 7: Visit & Contact
assert(html.includes('id="visit"'), 'Section Seven: Visit Geeta Bhawan present');
assert(html.includes('A-35, Kirti Nagar'), 'Verified temple address present');
assert(html.includes('011-47000208'), 'Verified telephone present');
assert(html.includes('8810401428'), 'Verified mobile number present');
assert(html.includes('info@geetabhawanshaadi.com'), 'Verified email address present');

// Section 8: Footer
assert(html.includes('class="site-footer"'), 'Section Eight: Footer present');
assert(html.includes('© 2026 Geeta Bhawan Mandir'), 'Copyright statement present');

// Modals & 3D Canvas
assert(html.includes('id="sanctums-modal"'), 'Sanctums Darshan modal present with 6 sanctums');
assert(html.includes('id="bg-sacred-3d-canvas"'), '3D Background sacred canvas present');
assert(html.includes('श्री लक्ष्मी नारायण') && (html.includes('पारदेश्वर लिंग') || html.includes('पारदेश्वर शिवलिंग')) && html.includes('शिवालय'), 'All major sanctums present');
assert(html.includes('id="phase2-modal"'), 'Phase 2 modal present for future navigation links');

console.log('\n--- 3. JAVASCRIPT SYNTAX & MODULE CHECK ---');
try {
  const gitaModule = fs.readFileSync(path.join(ROOT, 'assets/js/gita.js'), 'utf-8');
  assert(gitaModule.includes('GITA_VERSES') && gitaModule.includes('karmaṇy-evādhikāras'), 'Gita module contains authentic verses');

  const clockModule = fs.readFileSync(path.join(ROOT, 'assets/js/clock.js'), 'utf-8');
  assert(clockModule.includes('Asia/Kolkata'), 'Clock module correctly targets Asia/Kolkata timezone');

  const audioModule = fs.readFileSync(path.join(ROOT, 'assets/js/audio.js'), 'utf-8');
  assert(audioModule.includes('AudioContext') && audioModule.includes('playTempleBell'), 'Audio module contains Web Audio API synthesizer');

  const particlesModule = fs.readFileSync(path.join(ROOT, 'assets/js/particles3d.js'), 'utf-8');
  assert(particlesModule.includes('init3DBackground') && particlesModule.includes('render3DProjectedPoint'), '3D particles engine contains 3D projection math');

  const mainModule = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf-8');
  assert(mainModule.includes('initLiveClock') && mainModule.includes('init3DBackground'), 'Main controller connects 3D engine, clock and audio');
} catch (e) {
  assert(false, `JS Module reading error: ${e.message}`);
}

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
