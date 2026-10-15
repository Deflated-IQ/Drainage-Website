// ============================================================
// OXFORD DRAINAGE — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- Mobile Nav Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll-Triggered Animations ---
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children if parent has .stagger class
          const children = entry.target.querySelectorAll('.stagger > *');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 60);
          });
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked if wasn't open
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Stat Counter Animation ---
  const stats = document.querySelectorAll('.stat-count');
  if (stats.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, 16);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(el => statObserver.observe(el));
  }

  // --- Oxfordshire Service-Area Map ---
  const mapElement = document.getElementById('oxfordshire-map');
  if (mapElement) {
    if (!window.L) {
      mapElement.innerHTML = '<p class="map-unavailable">Our interactive map could not load. Please call 01865 236211 to confirm service in your area.</p>';
    } else {
      const serviceLocations = [
        { name: 'Oxford', coordinates: [51.7520, -1.2577], primary: true },
        { name: 'Abingdon', coordinates: [51.6708, -1.2875] },
        { name: 'Banbury', coordinates: [52.0629, -1.3398] },
        { name: 'Bicester', coordinates: [51.8994, -1.1536] },
        { name: 'Chipping Norton', coordinates: [51.9410, -1.5460] },
        { name: 'Didcot', coordinates: [51.6080, -1.2421] },
        { name: 'Eynsham', coordinates: [51.7801, -1.3740] },
        { name: 'Faringdon', coordinates: [51.6560, -1.5860] },
        { name: 'Henley-on-Thames', coordinates: [51.5340, -0.9040] },
        { name: 'Kidlington', coordinates: [51.8213, -1.2885] },
        { name: 'Thame', coordinates: [51.7489, -0.9762] },
        { name: 'Wallingford', coordinates: [51.5990, -1.1240] },
        { name: 'Wantage', coordinates: [51.5881, -1.4250] },
        { name: 'Witney', coordinates: [51.7859, -1.4850] },
        { name: 'Woodstock', coordinates: [51.8486, -1.3510] }
      ];

      const serviceMap = L.map(mapElement, {
        scrollWheelZoom: false,
        zoomControl: true,
        preferCanvas: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(serviceMap);

      L.circle([51.7520, -1.2577], {
        radius: 35000,
        color: '#f97316',
        weight: 2,
        fillColor: '#f97316',
        fillOpacity: 0.12,
        interactive: false
      }).addTo(serviceMap);

      serviceLocations.forEach((location) => {
        const marker = L.circleMarker(location.coordinates, {
          radius: location.primary ? 9 : 6,
          color: '#fff7ed',
          weight: 2,
          fillColor: '#f97316',
          fillOpacity: 1
        }).addTo(serviceMap);

        marker.bindTooltip(location.name, { direction: 'top', offset: [0, -8] });
        marker.bindPopup(location.primary
          ? '<strong>Oxford</strong><br>Our local service base'
          : `<strong>${location.name}</strong><br>Part of our Oxfordshire service area`);
      });

      const serviceBounds = L.latLngBounds(serviceLocations.map((location) => location.coordinates));
      serviceMap.fitBounds(serviceBounds, { padding: [32, 32] });
      window.requestAnimationFrame(() => serviceMap.invalidateSize());
    }
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Contact Form Submission (client-side) ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = 'var(--color-success)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

});
