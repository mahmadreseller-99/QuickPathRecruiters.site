/**
 * Quick Path Recruiters – Main Site Script
 * Handles: sticky header, mobile nav, policies dropdown,
 * FAQ accordions, contact form, property filters, scroll animations.
 */

/* ============================================================
   1. UTILITY HELPERS
   ============================================================ */

/** Set the copyright year dynamically */
function setYear() {
  document.querySelectorAll('#current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ============================================================
   2. STICKY HEADER — scroll-based shadow / bg toggle
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('bg-white', 'shadow-md', 'py-2.5');
      header.classList.remove('py-4');
    } else {
      header.classList.remove('shadow-md', 'py-2.5');
      header.classList.add('py-4');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   3. MOBILE MENU TOGGLE
   ============================================================ */
function initMobileMenu() {
  const btn        = document.getElementById('mobile-menu-btn');
  const dropdown   = document.getElementById('mobile-menu-dropdown');
  const menuIcon   = document.querySelector('.id-menu-icon');
  const closeIcon  = document.querySelector('.id-close-icon');
  if (!btn || !dropdown) return;

  let open = false;

  const setOpen = (state) => {
    open = state;
    if (open) {
      dropdown.classList.remove('max-h-0', 'opacity-0');
      dropdown.classList.add('max-h-screen', 'opacity-100');
      menuIcon && menuIcon.classList.add('hidden');
      closeIcon && closeIcon.classList.remove('hidden');
    } else {
      dropdown.classList.add('max-h-0', 'opacity-0');
      dropdown.classList.remove('max-h-screen', 'opacity-100');
      menuIcon && menuIcon.classList.remove('hidden');
      closeIcon && closeIcon.classList.add('hidden');
    }
  };

  btn.addEventListener('click', () => setOpen(!open));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (open && !btn.contains(e.target) && !dropdown.contains(e.target)) {
      setOpen(false);
    }
  });
}

/* ============================================================
   4. POLICIES DROPDOWN (desktop)
   ============================================================ */
function initPoliciesDropdown() {
  const container = document.getElementById('policies-dropdown-container');
  const btn       = document.getElementById('policies-menu-btn');
  const menu      = document.getElementById('policies-menu-dropdown');
  const chevron   = document.querySelector('.id-policies-chevron');
  if (!btn || !menu) return;

  let open = false;

  const setOpen = (state) => {
    open = state;
    if (open) {
      menu.classList.remove('hidden');
      chevron && chevron.classList.add('rotate-180');
    } else {
      menu.classList.add('hidden');
      chevron && chevron.classList.remove('rotate-180');
    }
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  document.addEventListener('click', (e) => {
    if (container && !container.contains(e.target)) {
      setOpen(false);
    }
  });
}

/* ============================================================
   5. FAQ ACCORDIONS
   ============================================================ */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn     = item.querySelector('.faq-btn');
    const content = item.querySelector('.faq-content');
    const chevron = btn.querySelector('svg');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all first
      faqItems.forEach(other => {
        const otherBtn     = other.querySelector('.faq-btn');
        const otherContent = other.querySelector('.faq-content');
        const otherChevron = otherBtn && otherBtn.querySelector('svg');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherContent) {
          otherContent.style.maxHeight = '0';
          otherContent.classList.remove('pb-5');
        }
        if (otherChevron) otherChevron.classList.remove('rotate-180', 'text-primary');
        if (otherChevron) otherChevron.classList.add('text-gray-400');
        other.classList.remove('border-primary/20', 'bg-primary/5', 'shadow-sm');
        other.classList.add('border-gray-200', 'bg-white');
        const otherQ = otherBtn && otherBtn.querySelector('span');
        if (otherQ) {
          otherQ.classList.remove('text-primary');
          otherQ.classList.add('text-navy');
        }
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (chevron) {
          chevron.classList.add('rotate-180', 'text-primary');
          chevron.classList.remove('text-gray-400');
        }
        item.classList.add('border-primary/20', 'bg-primary/5', 'shadow-sm');
        item.classList.remove('border-gray-200', 'bg-white');
        const q = btn.querySelector('span');
        if (q) {
          q.classList.add('text-primary');
          q.classList.remove('text-navy');
        }
      }
    });

    // Initialise closed
    content.style.maxHeight = '0';
  });
}

/* ============================================================
   6. CONTACT FORM — validation + success toggle
   ============================================================ */
function initContactForm() {
  const form        = document.getElementById('contact-page-form');
  const formCard    = document.getElementById('contact-form-card');
  const thankYou    = document.getElementById('thank-you-card');
  const againBtn    = document.getElementById('send-another-btn');
  if (!form) return;

  let statusEl = document.getElementById('contact-form-status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.id = 'contact-form-status';
    statusEl.className = 'mt-4 text-sm hidden';
    form.appendChild(statusEl);
  }

  const validate = () => {
    let valid = true;

    const name    = document.getElementById('contact-name');
    const phone   = document.getElementById('contact-phone');
    const email   = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');

    const showErr = (id, msg) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    };
    const clearErr = (id) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.add('hidden'); }
    };

    if (!name || !name.value.trim()) {
      showErr('name-error', 'Name is required.');
      valid = false;
    } else {
      clearErr('name-error');
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailReg.test(email.value.trim())) {
      showErr('email-error', 'A valid email address is required.');
      valid = false;
    } else {
      clearErr('email-error');
    }

    if (!message || message.value.trim().length < 10) {
      showErr('message-error', 'Please enter a message (minimum 10 characters).');
      valid = false;
    } else {
      clearErr('message-error');
    }

    return valid;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    try {
      await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form)
      });

      if (formCard && thankYou) {
        formCard.classList.add('hidden');
        thankYou.classList.remove('hidden');
      }
      if (statusEl) {
        statusEl.textContent = 'Thanks! Your message has been sent.';
        statusEl.className = 'mt-4 text-sm text-green-600';
      }
      form.reset();
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = 'Unable to send right now. Please email us directly.';
        statusEl.className = 'mt-4 text-sm text-red-500';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });

  if (againBtn) {
    againBtn.addEventListener('click', () => {
      form.reset();
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'mt-4 text-sm hidden';
      }
      if (formCard && thankYou) {
        thankYou.classList.add('hidden');
        formCard.classList.remove('hidden');
      }
    });
  }
}

/* ============================================================
   7. HOMEPAGE CONTACT / GET-OFFER FORM (index.html)
   ============================================================ */
function initHomeForm() {
  const form = document.getElementById('homepage-contact-form');
  if (!form) return;

  let statusEl = document.getElementById('homepage-form-status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.id = 'homepage-form-status';
    statusEl.className = 'mt-4 text-sm hidden';
    form.appendChild(statusEl);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name');
    const phone = document.getElementById('contact-phone');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    document.querySelectorAll('.input-error-msg').forEach(el => el.classList.add('hidden'));

    let valid = true;

    if (!name || !name.value.trim()) {
      const err = document.getElementById('name-error');
      if (err) { err.textContent = 'Name is required.'; err.classList.remove('hidden'); }
      valid = false;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailReg.test(email.value.trim())) {
      const err = document.getElementById('email-error');
      if (err) { err.textContent = 'A valid email address is required.'; err.classList.remove('hidden'); }
      valid = false;
    }

    if (!message || message.value.trim().length < 10) {
      const err = document.getElementById('message-error');
      if (err) { err.textContent = 'Please enter a message (minimum 10 characters).'; err.classList.remove('hidden'); }
      valid = false;
    }

    if (!valid) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    try {
      await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form)
      });

      if (statusEl) {
        statusEl.textContent = 'Thanks! Your message has been sent.';
        statusEl.className = 'mt-4 text-sm text-green-600';
      }
      form.reset();
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = 'Unable to send right now. Please email us directly.';
        statusEl.className = 'mt-4 text-sm text-red-500';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

/* ============================================================
   8. PROPERTIES PAGE — market filter + advanced filters
   ============================================================ */
function initPropertiesFilter() {
  const grid        = document.getElementById('properties-grid');
  const noMsg       = document.getElementById('no-properties-msg');
  const countLabel  = document.getElementById('properties-count-label');
  const marketBtns  = document.querySelectorAll('.market-btn');
  const filterTray  = document.getElementById('advanced-filters-tray');
  const toggleBtn   = document.getElementById('toggle-filters-btn');
  const toggleText  = document.getElementById('toggle-filters-text');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.property-card'));

  let activeMarket = 'All';
  let filtersOpen  = false;

  // Toggle advanced filter tray
  if (toggleBtn && filterTray) {
    toggleBtn.addEventListener('click', () => {
      filtersOpen = !filtersOpen;
      filterTray.classList.toggle('hidden', !filtersOpen);
      if (toggleText) toggleText.textContent = filtersOpen ? 'Hide Filters' : 'Show Filters';
    });
  }

  const getFilterValues = () => ({
    type:   document.getElementById('filter-type')   ? document.getElementById('filter-type').value   : 'All',
    status: document.getElementById('filter-status') ? document.getElementById('filter-status').value : 'All',
    price:  document.getElementById('filter-price')  ? document.getElementById('filter-price').value  : 'All',
    beds:   document.getElementById('filter-beds')   ? document.getElementById('filter-beds').value   : 'All',
    baths:  document.getElementById('filter-baths')  ? document.getElementById('filter-baths').value  : 'All',
  });

  const priceInRange = (price, range) => {
    price = parseInt(price);
    if (range === 'All') return true;
    if (range === 'Under $200k') return price < 200000;
    if (range === '$200k - $300k') return price >= 200000 && price < 300000;
    if (range === '$300k - $400k') return price >= 300000 && price < 400000;
    if (range === '$400k - $500k') return price >= 400000 && price < 500000;
    if (range === '$500k+') return price >= 500000;
    return true;
  };

  const applyFilters = () => {
    const f = getFilterValues();
    let visible = 0;

    cards.forEach(card => {
      const market = card.dataset.state  || 'All';
      const type   = card.dataset.type   || '';
      const status = card.dataset.status || '';
      const price  = card.dataset.price  || 0;
      const beds   = parseInt(card.dataset.beds)  || 0;
      const baths  = parseInt(card.dataset.baths) || 0;

      const matchMarket = activeMarket === 'All' || market === activeMarket;
      const matchType   = f.type   === 'All' || type   === f.type;
      const matchStatus = f.status === 'All' || status === f.status;
      const matchPrice  = priceInRange(price, f.price);
      const matchBeds   = f.beds  === 'All' || beds  >= parseInt(f.beds);
      const matchBaths  = f.baths === 'All' || baths >= parseInt(f.baths);

      const show = matchMarket && matchType && matchStatus && matchPrice && matchBeds && matchBaths;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    if (countLabel) countLabel.textContent = `${visible} ${visible === 1 ? 'property' : 'properties'} found`;
    if (noMsg) noMsg.classList.toggle('hidden', visible > 0);
  };

  // Market toggle buttons
  marketBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeMarket = btn.dataset.market;
      marketBtns.forEach(b => {
        b.classList.toggle('bg-navy', b === btn);
        b.classList.toggle('text-white', b === btn);
        b.classList.toggle('shadow-lg', b === btn);
        b.classList.toggle('bg-gray-100', b !== btn);
        b.classList.toggle('text-gray-600', b !== btn);
        b.classList.toggle('hover:bg-gray-200', b !== btn);
      });
      applyFilters();
    });
  });

  // Advanced filter selects
  ['filter-type', 'filter-status', 'filter-price', 'filter-beds', 'filter-baths'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  applyFilters(); // initial state
}

/* ============================================================
   9. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-in-view');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
    observer.observe(el);
  });
}

/* ============================================================
   10. TESTIMONIAL SLIDER (homepage carousel)
   ============================================================ */
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const dots  = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (!track || !dots.length) return;

  let current = 0;
  const count = dots.length;

  const goTo = (index) => {
    current = (index + count) % count;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('bg-primary', i === current);
      d.classList.toggle('opacity-100', i === current);
      d.classList.toggle('bg-white/50', i !== current);
      d.classList.toggle('opacity-60', i !== current);
    });
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance every 5 seconds
  let autoTimer = setInterval(() => goTo(current + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  });

  goTo(0);
}

/* ============================================================
   INIT — run everything on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initStickyHeader();
  initMobileMenu();
  initPoliciesDropdown();
  initFaqAccordions();
  initContactForm();
  initHomeForm();
  initPropertiesFilter();
  initScrollReveal();
  initTestimonialSlider();
});
