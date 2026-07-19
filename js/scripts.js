document.addEventListener('DOMContentLoaded', () => {

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTopBtn');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  const navLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'))
    .filter(link => link.getAttribute('href').length > 1); // виключає порожні href="#"
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach(link => {
        link.classList.toggle('nav__link--active', link.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  const dots = Array.from(document.querySelectorAll('#heroDots .dot'));
  const slides = Array.from(document.querySelectorAll('#heroSlides .hero__slide'));
  let currentSlide = 0;
  const setSlide = (index) => {
    currentSlide = (index + dots.length) % dots.length;
    dots.forEach((dot, i) => dot.classList.toggle('dot--active', i === currentSlide));
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => setSlide(i)));
  document.getElementById('heroPrev').addEventListener('click', () => setSlide(currentSlide - 1));
  document.getElementById('heroNext').addEventListener('click', () => setSlide(currentSlide + 1));

  setInterval(() => setSlide(currentSlide + 1), 6000);

  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert('Тут можна підключити модальне вікно з відео.');
    });
  }

  const tabs = document.querySelectorAll('.auth-tab');
  const forms = {
    signup: document.getElementById('signupForm'),
    login: document.getElementById('loginForm'),
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('auth-tab--active'));
      tab.classList.add('auth-tab--active');

      const target = tab.dataset.tab;
      Object.entries(forms).forEach(([key, form]) => {
        if (!form) return;
        form.hidden = key !== target;
      });
    });
  });

  /* ---------- Кастомний випадаючий список (Budget) ---------- */
  document.querySelectorAll('.custom-select').forEach(root => {
    const trigger = root.querySelector('.custom-select__trigger');
    const valueEl = root.querySelector('.custom-select__value');
    const list = root.querySelector('.custom-select__list');
    const nativeSelect = root.querySelector('select');
    const options = Array.from(list.querySelectorAll('li'));

    const closeList = () => {
      root.classList.remove('is-open');
      list.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };
    const openList = () => {
      root.classList.add('is-open');
      list.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      const active = list.querySelector('.is-selected') || options[0];
      if (active) active.focus();
    };

    trigger.addEventListener('click', () => {
      root.classList.contains('is-open') ? closeList() : openList();
    });

    options.forEach(option => {
      option.setAttribute('tabindex', '-1');
      option.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('is-selected'));
        option.classList.add('is-selected');
        valueEl.textContent = option.dataset.value;
        nativeSelect.value = option.dataset.value;
        nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        closeList();
        trigger.focus();
      });
      option.addEventListener('keydown', (e) => {
        const currentIndex = options.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          (options[currentIndex + 1] || options[0]).focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          (options[currentIndex - 1] || options[options.length - 1]).focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          option.click();
        } else if (e.key === 'Escape') {
          closeList();
          trigger.focus();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) closeList();
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeList();
    });
  });

  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactSuccess.hidden = false;
      contactForm.reset();
      contactForm.querySelectorAll('.custom-select').forEach(root => {
        const options = Array.from(root.querySelectorAll('.custom-select__list li'));
        options.forEach((o, i) => o.classList.toggle('is-selected', i === 0));
        const valueEl = root.querySelector('.custom-select__value');
        if (options[0]) valueEl.textContent = options[0].dataset.value;
      });
      setTimeout(() => { contactSuccess.hidden = true; }, 4000);
    });
  }

  ['signupForm', 'loginForm'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Форма готова до підключення бекенду ✔');
    });
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});