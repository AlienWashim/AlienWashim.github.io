/**
 * Washim Akram - Portfolio Interactive Engine
 * Theme Controller, Seamless SPA Page Transitions, Responsive Nav, Typewriter & Modal
 */

// 1. Immediate Theme Initialization (prevents flash of wrong theme)
(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const targetTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', targetTheme);
})();

// Active typewriter handle so we can cancel it cleanly on page switch
let typewriterTimeout = null;

// Top loading progress bar controller
function setProgressBar(percent, hideAfter = false) {
  let bar = document.getElementById('page-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'page-progress-bar';
    document.body.prepend(bar);
  }
  bar.style.opacity = '1';
  bar.style.width = percent + '%';
  if (hideAfter) {
    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => {
        bar.style.width = '0%';
      }, 300);
    }, 200);
  }
}

// Global Modal Handlers
window.openModal = function(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  if (modal && modalImg) {
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Helper to ensure all resume / PDF links open directly in a new tab without downloading
function setupPdfLinks() {
  document.querySelectorAll('a[href*=".pdf"], a[href*="CV.pdf"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.removeAttribute('download');
  });
}

// Ensure circular brand avatars are always wrapped in animated glowing ring
function setupBrandAvatars() {
  document.querySelectorAll('img.nav-brand-avatar').forEach(img => {
    if (!img.closest('.nav-brand-avatar-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'nav-brand-avatar-wrap';
      const inner = document.createElement('div');
      inner.className = 'nav-brand-avatar-inner';
      img.parentNode.insertBefore(wrap, img);
      inner.appendChild(img);
      wrap.appendChild(inner);
    }
  });
}

// Back To Top Controller (Auto-injected across all pages)
function setupBackToTop() {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Scroll to top');
    btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    document.body.appendChild(btn);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 350) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (!btn.dataset.bound) {
    btn.dataset.bound = 'true';
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Main DOM Controller
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupMobileNav();
  setupScrollReveals();
  initTypewriter();
  setupModalEvents();
  setupHeaderScroll();
  setupSmoothPageTransitions();
  updateActiveNavLink();
  setupPdfLinks();
  setupBackToTop();
  setupBrandAvatars();
});

// ----------------------------------------------------
// Theme Toggle
// ----------------------------------------------------
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  function updateToggleIcon(currentTheme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    if (currentTheme === 'light') {
      icon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('title', 'Switch to Dark Mode');
      themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      icon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('title', 'Switch to Light Mode');
      themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }

  const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateToggleIcon(activeTheme);

  if (themeToggle && !themeToggle.dataset.bound) {
    themeToggle.dataset.bound = 'true';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleIcon(next);
    });
  }
}

// ----------------------------------------------------
// Responsive Mobile Navigation
// ----------------------------------------------------
function setupMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu && !mobileToggle.dataset.bound) {
    mobileToggle.dataset.bound = 'true';
    
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu immediately when any nav link is tapped
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
          const icon = mobileToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    });
  }
}

// ----------------------------------------------------
// Active Navigation Link Detection
// ----------------------------------------------------
function updateActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0].split('/').pop();
    
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ----------------------------------------------------
// Header Scroll Effect
// ----------------------------------------------------
function setupHeaderScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ----------------------------------------------------
// Typewriter Animation
// ----------------------------------------------------
function initTypewriter() {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }

  const typedText = document.getElementById('typed-text');
  if (!typedText) return;

  const phrases = [
    "Jr. Software Developer @ AkijBashir Group",
    "Full Stack .NET & Angular Developer",
    "ASP.NET Core & Web API Engineer",
    "MS SQL Server & SSRS Reporting Specialist",
    "Passionate Educator & Tech YouTuber",
    "Research Author & Problem Solver"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 80;

  function typeLoop() {
    if (!document.getElementById('typed-text')) return;
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typedText.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      speed = 35;
    } else {
      typedText.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      speed = 75;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      speed = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 350;
    }

    typewriterTimeout = setTimeout(typeLoop, speed);
  }

  typeLoop();
}

// ----------------------------------------------------
// Scroll Reveal Observer
// ----------------------------------------------------
function setupScrollReveals() {
  const elements = document.querySelectorAll('.card, .timeline-item, .project-card, .cert-card, .stat-card');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// ----------------------------------------------------
// Certificate & Image Modal Viewer
// ----------------------------------------------------
function setupModalEvents() {
  const modal = document.getElementById('imageModal');
  const modalClose = document.getElementById('modalClose');

  if (modalClose && !modalClose.dataset.bound) {
    modalClose.dataset.bound = 'true';
    modalClose.addEventListener('click', window.closeModal);
  }

  if (modal && !modal.dataset.bound) {
    modal.dataset.bound = 'true';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      window.closeModal();
    }
  });
}

// Smooth scroll to an element accounting for sticky header
function smoothScrollToElement(el) {
  if (!el) return;
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 76;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = Math.max(0, elementPosition - headerHeight - 20);
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// ----------------------------------------------------
// Seamless SPA-Style Page Transitions (Buttery Smooth!)
// ----------------------------------------------------
function setupSmoothPageTransitions() {
  document.addEventListener('click', async (e) => {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;

    const href = targetLink.getAttribute('href');
    if (!href) return;

    // Ignore mailto, tel, downloads, external links, or PDF files
    if (
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.toLowerCase().endsWith('.pdf') ||
      href.toLowerCase().includes('.pdf') ||
      targetLink.hasAttribute('download') ||
      targetLink.target === '_blank' ||
      targetLink.origin !== window.location.origin
    ) {
      if (href.toLowerCase().includes('.pdf')) {
        targetLink.target = '_blank';
        targetLink.rel = 'noopener noreferrer';
        targetLink.removeAttribute('download');
      }
      return;
    }

    // If it's an anchor on current page, smooth scroll with header offset
    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        smoothScrollToElement(targetElement);
      }
      return;
    }

    // Check if target points to an internal html page
    const targetUrl = new URL(href, window.location.href);
    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
      if (targetUrl.hash) {
        const targetElement = document.querySelector(targetUrl.hash);
        if (targetElement) {
          e.preventDefault();
          smoothScrollToElement(targetElement);
        }
      }
      return;
    }

    e.preventDefault();
    await navigateTo(targetUrl.href);
  });

  window.addEventListener('popstate', async () => {
    await navigateTo(window.location.href, false);
  });
}

async function navigateTo(url, pushState = true) {
  const main = document.querySelector('main');
  
  try {
    // 1. Start sleek progress bar
    setProgressBar(35);

    // 2. Animate out current page smoothly
    if (main) {
      main.classList.add('page-exit');
    }

    setProgressBar(65);

    // 3. Fetch destination page
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const htmlText = await response.text();

    // 4. Parse incoming page
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const newMain = doc.querySelector('main');

    if (!newMain || !main) {
      window.location.href = url;
      return;
    }

    // 5. Short transition buffer for silky smoothness
    await new Promise(r => setTimeout(r, 140));

    // 6. Update URL in browser
    if (pushState) {
      window.history.pushState({}, '', url);
    }

    // 7. Update document title
    document.title = doc.title;

    // 8. Reset scroll to top cleanly without smooth scroll conflict
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 9. Swap main content
    main.innerHTML = newMain.innerHTML;
    main.className = newMain.className;
    main.classList.remove('page-exit');

    // Restore smooth scroll behavior for in-page navigation
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = '';
    });

    // 10. Close mobile navigation menu if open
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (mobileToggle) {
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    }

    // 11. Re-initialize page dynamic features
    updateActiveNavLink();
    setupScrollReveals();
    initTypewriter();
    setupModalEvents();
    setupPdfLinks();
    setupBackToTop();
    setupBrandAvatars();

    // 12. Complete progress bar
    setProgressBar(100, true);

  } catch (err) {
    console.warn('Page transition fallback to default navigation:', err);
    window.location.href = url;
  }
}
