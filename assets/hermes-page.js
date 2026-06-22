(function () {
  const page = window.HERMES_PAGE || {};
  const panels = document.querySelectorAll('[data-panel]');
  const tabButtons = document.querySelectorAll('[data-tab]');
  const opsCommandLabel = document.getElementById('ops-command-label');
  const opsCommandSummary = document.getElementById('ops-command-summary');
  const opsCommandNotes = document.getElementById('ops-command-notes');
  const opsCommandCode = document.querySelector('#ops-code code');

  function setOpsCopy(key) {
    const data = page.ops && page.ops[key];
    if (!data) return;
    if (opsCommandLabel) opsCommandLabel.textContent = data.label || key;
    if (opsCommandSummary) opsCommandSummary.textContent = data.summary || '';
    if (opsCommandNotes) opsCommandNotes.innerHTML = (data.notes || []).map((note) => `<li>${note}</li>`).join('');
    if (opsCommandCode) opsCommandCode.textContent = data.code || '';
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.tab;
      tabButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.panel === key;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
      setOpsCopy(key);
    });
  });

  const title = document.getElementById('timeline-title');
  const copy = document.getElementById('timeline-copy');
  const timelineCommandLabel = document.getElementById('timeline-command-label');
  const timelineCommandCode = document.querySelector('#bootstrap-code code');
  document.querySelectorAll('.timeline-step').forEach((button) => {
    button.addEventListener('click', () => {
      const data = page.timeline && page.timeline[button.dataset.step];
      if (!data) return;
      document.querySelectorAll('.timeline-step').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      if (title) title.textContent = data.title || '';
      if (copy) copy.textContent = data.copy || '';
      if (timelineCommandLabel) timelineCommandLabel.textContent = data.label || '';
      if (timelineCommandCode) timelineCommandCode.textContent = data.code || '';
    });
  });

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try { return document.execCommand('copy'); } catch (_) { return false; }
    finally { document.body.removeChild(textarea); }
  }

  async function copyText(text) {
    if (!text) return false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        return fallbackCopy(text);
      }
    }
    return fallbackCopy(text);
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copy);
      if (!target) return;
      const original = button.textContent;
      const ok = await copyText(target.innerText.trim());
      button.textContent = ok ? '已复制' : '复制失败';
      setTimeout(() => { button.textContent = original; }, 1400);
    });
  });

  const glowTargets = document.querySelectorAll([
    '.hero-shell',
    'section',
    '.cockpit',
    '.panel-card',
    '.arch-node',
    '.boundary-card',
    '.feature-card',
    '.ops-board',
    '.timeline-detail',
    '.command-card',
    '.safe-zone',
    '.doc-link',
    '.terminal-line',
    '.feature-list li',
    '.command-notes li',
    '.feature-facts span',
    '.flow-list li',
    '.fit-list li',
    '.chip'
  ].join(','));

  glowTargets.forEach((target) => {
    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      target.style.setProperty('--glow-x', `${Math.max(0, Math.min(100, x)).toFixed(1)}%`);
      target.style.setProperty('--glow-y', `${Math.max(0, Math.min(100, y)).toFixed(1)}%`);
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
