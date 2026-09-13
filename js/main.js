document.addEventListener('DOMContentLoaded', () => {

  // ===== Footer year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Header scroll state + progress bar =====
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (header) header.classList.toggle('scrolled', scrollTop > 12);
    if (progressBar) progressBar.style.width = progress + '%';
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 480);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile nav toggle =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Scroll-spy dot nav =====
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const dotNav = document.getElementById('dotNav');

  if (dotNav) {
    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      const label = navLink ? navLink.textContent : id;

      const dot = document.createElement('a');
      dot.href = `#${id}`;
      dot.className = 'dot-nav-item';
      dot.dataset.section = id;
      dot.setAttribute('aria-label', label);

      const tooltip = document.createElement('span');
      tooltip.className = 'dot-nav-item-label';
      tooltip.textContent = label;

      dot.appendChild(tooltip);
      dotNav.appendChild(dot);
    });
  }
  const dotNavItems = dotNav ? dotNav.querySelectorAll('.dot-nav-item') : [];

  // ===== Active nav link + dot nav on scroll =====
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
        dotNavItems.forEach((d) => {
          d.classList.toggle('active', d.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => navObserver.observe(section));

  // ===== Scroll-reveal animations =====
  const revealEls = document.querySelectorAll('.reveal');
  const revealOrder = Array.from(revealEls);

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const globalIndex = revealOrder.indexOf(entry.target);
        const delay = (globalIndex >= 0 ? globalIndex : 0) * 40 % 200;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  // ===== Animated stat counters =====
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => counterObserver.observe(el));

  // ===== Typed rotating role text =====
  const typedRoleEl = document.getElementById('typedRole');
  const roles = [
    'Medical Claims Auditor',
    'Claims Investigation Specialist',
    'Fraud, Waste & Abuse Specialist',
    'Pre-Authorization Expert',
    'Power BI Analytics Builder'
  ];

  if (typedRoleEl) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    function typeTick() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedRoleEl.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          setTimeout(typeTick, 1600);
        } else {
          setTimeout(typeTick, 65);
        }
      } else {
        charIndex--;
        typedRoleEl.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeTick, 300);
        } else {
          setTimeout(typeTick, 35);
        }
      }
    }

    setTimeout(typeTick, 1800);
  }

  // ===== Back to top smooth scroll (progressive enhancement over CSS smooth-scroll anchor) =====
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Theme toggle (dark / light) =====
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // ===== Tilt / spotlight card interaction =====
  const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsHoverTilt && !prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.setProperty('--tilt-lift', '-4px');
      });
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const strength = 5;
        card.style.setProperty('--tilt-x', `${(0.5 - py) * strength}deg`);
        card.style.setProperty('--tilt-y', `${(px - 0.5) * strength}deg`);
        card.style.setProperty('--spot-x', `${px * 100}%`);
        card.style.setProperty('--spot-y', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--tilt-lift', '0px');
      });
    });
  }

  // ===== Command palette (Cmd/Ctrl + K) =====
  const cmdkOverlay = document.getElementById('cmdkOverlay');
  const cmdkInput = document.getElementById('cmdkInput');
  const cmdkList = document.getElementById('cmdkList');
  const cmdkTrigger = document.getElementById('cmdkTrigger');

  if (cmdkOverlay && cmdkInput && cmdkList) {
    const sectionCommands = Array.from(navAnchors).map((a) => ({
      label: a.textContent,
      hint: 'Section',
      icon: '&#8594;',
      action: () => { window.location.hash = a.getAttribute('href').slice(1); }
    }));

    const actionCommands = [
      {
        label: 'Email Dr. Harish Kumar',
        hint: 'drharishkumar30@gmail.com',
        icon: '&#9993;',
        action: () => { window.location.href = 'mailto:drharishkumar30@gmail.com'; }
      },
      {
        label: 'Call',
        hint: '+91 75330 78677',
        icon: '&#128222;',
        action: () => { window.location.href = 'tel:+917533078677'; }
      },
      {
        label: 'Open LinkedIn profile',
        hint: 'dr-harish-kumar-hk30',
        icon: 'in',
        action: () => { window.open('https://www.linkedin.com/in/dr-harish-kumar-hk30', '_blank', 'noopener'); }
      },
      {
        label: 'Toggle dark / light mode',
        hint: 'Appearance',
        icon: '&#9788;',
        action: () => { if (themeToggle) themeToggle.click(); }
      }
    ];

    const allCommands = sectionCommands.concat(actionCommands);
    let filteredCommands = allCommands;
    let activeIndex = 0;

    function renderCmdkList() {
      cmdkList.innerHTML = '';
      if (filteredCommands.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'cmdk-empty';
        empty.textContent = 'No matches found';
        cmdkList.appendChild(empty);
        return;
      }
      filteredCommands.forEach((cmd, i) => {
        const item = document.createElement('li');
        item.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
        item.innerHTML =
          `<span class="cmdk-item-icon">${cmd.icon}</span>` +
          `<span class="cmdk-item-label">${cmd.label}</span>` +
          `<span class="cmdk-item-hint">${cmd.hint}</span>`;
        item.addEventListener('click', () => runCmdkCommand(cmd));
        item.addEventListener('mouseenter', () => {
          activeIndex = i;
          renderCmdkList();
        });
        cmdkList.appendChild(item);
      });
    }

    function runCmdkCommand(cmd) {
      cmd.action();
      closeCmdk();
    }

    function filterCmdkCommands(query) {
      const q = query.trim().toLowerCase();
      filteredCommands = q
        ? allCommands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
        : allCommands;
      activeIndex = 0;
      renderCmdkList();
    }

    function openCmdk() {
      cmdkOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      cmdkInput.value = '';
      filterCmdkCommands('');
      setTimeout(() => cmdkInput.focus(), 50);
    }

    function closeCmdk() {
      cmdkOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (cmdkTrigger) cmdkTrigger.addEventListener('click', openCmdk);

    cmdkOverlay.addEventListener('click', (e) => {
      if (e.target === cmdkOverlay) closeCmdk();
    });

    cmdkInput.addEventListener('input', (e) => filterCmdkCommands(e.target.value));

    cmdkInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filteredCommands.length - 1);
        renderCmdkList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderCmdkList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) runCmdkCommand(filteredCommands[activeIndex]);
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        cmdkOverlay.classList.contains('open') ? closeCmdk() : openCmdk();
      } else if (e.key === 'Escape' && cmdkOverlay.classList.contains('open')) {
        closeCmdk();
      }
    });
  }

});
