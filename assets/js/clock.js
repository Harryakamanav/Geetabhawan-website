/**
 * Geeta Bhawan Mandir — Live IST Clock & Darshan Status Engine
 * Timezone: Asia/Kolkata (Indian Standard Time)
 * Verified Darshan Hours:
 * - Morning: 5:00 AM – 11:00 AM
 * - Evening: 4:30 PM – 9:00 PM
 * - Morning Satsang: 7:00 AM – 8:00 AM
 * - Tuesday Sundarkand Path: 6:00 PM onwards
 */

export function initLiveClock() {
  const clockTimeEl = document.getElementById('ist-live-time');
  const clockMetaEl = document.getElementById('ist-live-meta');
  const dynamicStatusEl = document.getElementById('dynamic-darshan-status');
  const heroStatusTextEl = document.getElementById('hero-status-text');
  const heroStatusDotEl = document.getElementById('hero-status-dot');

  function update() {
    const now = new Date();

    // Format IST time
    const timeFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Format IST date and day
    const dateFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const parts = timeFormatter.formatToParts(now);
    const timeString = timeFormatter.format(now);
    const dateString = dateFormatter.format(now);

    // Get numeric hour and minute in IST
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

    // Define verified timings in minutes from midnight IST:
    // Morning: 5:00 AM (300) to 11:00 AM (660)
    // Evening: 4:30 PM (990) to 9:00 PM (1260)
    // Morning Satsang: 7:00 AM (420) to 8:00 AM (480)
    // Tuesday Sundarkand: Tuesday 6:00 PM (1080)
    const morningOpen = 5 * 60; // 300
    const morningClose = 11 * 60; // 660
    const eveningOpen = 16 * 60 + 30; // 990
    const eveningClose = 21 * 60; // 1260

    let statusText = '';
    let statusBadgeClass = 'open';
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
      statusBadgeClass = 'closed';
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
      statusBadgeClass = 'closed';
      statusText = `Pat Closed for the Night • Opens tomorrow at 5:00 AM`;
    }

    // Update DOM elements
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
