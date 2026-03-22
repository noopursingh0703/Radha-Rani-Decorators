/* ===== SHUBH CELEBRATIONS — Production JavaScript ===== */

(function() {
  'use strict';

  // ===== FLOATING PETALS =====
  const petalEl = document.getElementById('petals');
  if (petalEl) {
    const colors = ['#E8560A','#C9922A','#F0C060','#A0145A','#E9A000','#FF8C42','#FF6699'];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.setAttribute('aria-hidden', 'true');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = -(Math.random() * 100) + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      const sz = 9 + Math.random() * 14;
      p.style.width = p.style.height = sz + 'px';
      p.style.animationDuration = (7 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 9) + 's';
      p.style.borderRadius = Math.random() > 0.5 ? '50% 0' : '50%';
      petalEl.appendChild(p);
    }
  }

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, i * 80);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  // ===== MOBILE HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== NAV SCROLL SHADOW =====
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function(a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' });

  sections.forEach(function(section) {
    sectionObserver.observe(section);
  });

  // ===== GALLERY FILTER =====
  var galleryGrid = document.querySelector('.gallery-grid');
  var galleryItems = document.querySelectorAll('.gallery-item');

  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      var cat = btn.getAttribute('data-filter');
      galleryItems.forEach(function(item) {
        if (cat === 'all' || item.getAttribute('data-cat') === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ===== GALLERY LIGHTBOX =====
  var lightbox = document.getElementById('lightbox');
  var lightboxContent = document.getElementById('lightboxContent');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var currentLightboxIndex = 0;

  function getVisibleItems() {
    return Array.from(galleryItems).filter(function(item) {
      return item.style.display !== 'none';
    });
  }

  function openLightbox(index) {
    var visible = getVisibleItems();
    if (index < 0 || index >= visible.length) return;
    currentLightboxIndex = index;
    var item = visible[index];
    var svg = item.querySelector('svg');
    var caption = item.querySelector('.gallery-overlay');

    lightboxContent.innerHTML = '';
    var clonedSvg = svg.cloneNode(true);
    clonedSvg.style.width = '100%';
    clonedSvg.style.height = 'auto';
    lightboxContent.appendChild(clonedSvg);
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    var visible = getVisibleItems();
    currentLightboxIndex = (currentLightboxIndex + dir + visible.length) % visible.length;
    openLightbox(currentLightboxIndex);
  }

  // Attach click to gallery items
  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var visible = getVisibleItems();
      var idx = visible.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  // Lightbox controls
  if (lightbox) {
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', function() { navigateLightbox(-1); });
    document.getElementById('lightboxNext').addEventListener('click', function() { navigateLightbox(1); });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  // ===== FORM VALIDATION & SUBMISSION =====
  var form = document.getElementById('rsvpForm');
  var successMsg = document.getElementById('successMsg');

  if (form) {
    var fields = form.querySelectorAll('input[required], select[required]');

    function validateField(field) {
      var group = field.closest('.form-group');
      var errorEl = group.querySelector('.error-msg');
      var val = field.value.trim();
      var isValid = true;
      var message = '';

      if (!val) {
        isValid = false;
        message = 'This field is required';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        isValid = false;
        message = 'Please enter a valid email address';
      } else if (field.type === 'tel' && !/^[\+]?[\d\s\-()]{8,}$/.test(val)) {
        isValid = false;
        message = 'Please enter a valid phone number';
      }

      if (isValid) {
        group.classList.remove('has-error');
        group.classList.add('valid');
      } else {
        group.classList.remove('valid');
        group.classList.add('has-error');
        if (errorEl) errorEl.textContent = message;
      }

      return isValid;
    }

    // Real-time validation on blur
    fields.forEach(function(field) {
      field.addEventListener('blur', function() {
        if (field.value.trim()) validateField(field);
      });
      field.addEventListener('input', function() {
        var group = field.closest('.form-group');
        if (group.classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function(field) {
        if (!validateField(field)) allValid = false;
      });

      if (allValid) {
        // Collect form data for potential future integration
        var formData = new FormData(form);
        var data = {};
        formData.forEach(function(value, key) { data[key] = value; });

        // Store enquiry in localStorage as a simple static fallback
        var enquiries = JSON.parse(localStorage.getItem('shubh_enquiries') || '[]');
        enquiries.push({ ...data, timestamp: new Date().toISOString() });
        localStorage.setItem('shubh_enquiries', JSON.stringify(enquiries));

        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.setAttribute('aria-live', 'polite');
      }
    });
  }

  // ===== BACK TO TOP =====
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
