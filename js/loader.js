/* =================================================================
   Portfolio Romain Begot - Gestionnaire JavaScript Avancé
   Version 2.1 - Optimisé pour performance, accessibilité et menu mobile
   ================================================================= */

class PortfolioManager {
  constructor() {
    this.config = {
      loaderDuration: 1000,
      transitionDelay: 200,
      scrollOffset: 100,
      debounceDelay: 250,
      animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      version: '2.1.0'
    };

    this.state = {
      isLoading: false,
      isMobileMenuOpen: false,
      currentPage: '',
      scrollPosition: 0,
      isScrolling: false,
      deviceType: this.detectDeviceType(),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      isMenuAnimating: false,
      lastScrollY: 0,
      touchStartY: 0,
      isDesktop: window.innerWidth > 768
    };

    this.elements = {};
    this.eventListeners = new Map();
    this.animations = new Map();
    this.observers = new Map();
    this.timers = new Map();
    
    this.init();
  }

  /* =================================================================
     INITIALISATION AMÉLIORÉE
     ================================================================= */
  
  async init() {
    try {
      console.log(`[Portfolio] 🚀 Initialisation v${this.config.version}`);
      
      // Détection précoce des capacités du navigateur
      this.detectBrowserCapabilities();
      
      // Initialisation séquentielle optimisée
      await this.initializeElements();
      await this.setupLoader();
      this.setupNavigation();
      this.setupMobileMenu();
      this.setupAccessibility();
      this.setupScrollFeatures();
      this.setupImageOptimization();
      this.setupPerformanceMonitoring();
      this.setupErrorHandling();
      this.setupResponsiveHandlers();
      this.setupTouchHandlers();
      
      // Finalisation
      this.setActiveNavigation();
      this.handlePageLoad();
      
      console.log('[Portfolio] ✅ Initialisation terminée avec succès');
    } catch (error) {
      console.error('[Portfolio] ❌ Erreur lors de l\'initialisation:', error);
      this.handleError(error);
    }
  }

  detectBrowserCapabilities() {
    this.capabilities = {
      intersectionObserver: 'IntersectionObserver' in window,
      mutationObserver: 'MutationObserver' in window,
      performanceAPI: 'performance' in window,
      webP: this.supportsWebP(),
      touch: 'ontouchstart' in window,
      passiveEvents: this.supportsPassiveEvents(),
      customProperties: CSS.supports('--fake-var', '0')
    };
    
    console.log('[Portfolio] 🔍 Capacités navigateur:', this.capabilities);
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  supportsPassiveEvents() {
    let passiveSupported = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: () => {
          passiveSupported = true;
          return false;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }

  async initializeElements() {
    return new Promise((resolve) => {
      this.elements = {
        loader: document.getElementById('page-loader'),
        hamburger: document.querySelector('.hamburger-menu'),
        nav: document.querySelector('.main-nav'),
        menu: document.querySelector('.menu'),
        body: document.body,
        html: document.documentElement,
        main: document.querySelector('main'),
        header: document.querySelector('header'),
        footer: document.querySelector('footer')
      };

      // Vérification des éléments critiques avec fallbacks
      if (!this.elements.hamburger || !this.elements.nav) {
        console.warn('[Portfolio] ⚠️ Éléments de navigation manquants - Création de fallbacks');
        this.createNavigationFallbacks();
      }

      // Ajout d'un ID au main si manquant pour l'accessibilité
      if (this.elements.main && !this.elements.main.id) {
        this.elements.main.id = 'main-content';
        this.elements.main.setAttribute('tabindex', '-1');
      }

      resolve();
    });
  }

  createNavigationFallbacks() {
    if (!this.elements.hamburger && this.elements.nav) {
      const hamburger = document.createElement('button');
      hamburger.className = 'hamburger-menu';
      hamburger.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      `;
      this.elements.nav.parentNode.insertBefore(hamburger, this.elements.nav);
      this.elements.hamburger = hamburger;
    }
  }

  detectDeviceType() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    
    // Détection plus précise
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    if (/Mac|Win|Linux/.test(platform) && !/(tablet|ipad)/i.test(ua)) {
      return 'desktop';
    }
    return 'unknown';
  }

  /* =================================================================
     GESTIONNAIRE DE LOADER ULTRA-AMÉLIORÉ
     ================================================================= */

  async setupLoader() {
    if (!this.elements.loader) {
      await this.createAdvancedLoader();
    }
    this.initializeLoaderAnimations();
    this.setupLoaderProgress();
  }

  async createAdvancedLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.setAttribute('role', 'status');
    
    loader.innerHTML = `
      <div class="loader-logo">
        <img src="img/22 mai 2025, 13_51_32.png" alt="Logo Romain Begot" class="loader-img" loading="eager">
        <div class="loader-cyber" role="progressbar" aria-label="Chargement en cours" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <div class="loader-text" aria-live="polite">Chargement du Portfolio...</div>
      <div class="loader-progress">
        <div class="loader-progress-bar"></div>
      </div>
      <div class="loader-tips">
        <div class="loader-tip active">💡 Portfolio en cours de chargement...</div>
        <div class="loader-tip">🚀 Préparation de l'expérience utilisateur...</div>
        <div class="loader-tip">✨ Finalisation des composants...</div>
      </div>
    `;
    
    this.elements.body.appendChild(loader);
    this.elements.loader = loader;
    
    // Précharger les ressources critiques
    await this.preloadCriticalResources();
  }

  async preloadCriticalResources() {
    const criticalResources = [
      'css/style.css',
      'img/22 mai 2025, 13_51_32.png'
    ];

    const preloadPromises = criticalResources.map(resource => {
      return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        link.href = resource;
        link.onload = resolve;
        link.onerror = resolve; // Continue même en cas d'erreur
        document.head.appendChild(link);
        
        // Timeout de sécurité
        setTimeout(resolve, 2000);
      });
    });

    await Promise.allSettled(preloadPromises);
  }

  initializeLoaderAnimations() {
    if (!this.elements.loader) return;

    const progressBar = this.elements.loader.querySelector('.loader-progress-bar');
    const cyberLoader = this.elements.loader.querySelector('.loader-cyber');
    const tips = this.elements.loader.querySelectorAll('.loader-tip');
    
    if (progressBar && cyberLoader) {
      let progress = 0;
      let tipIndex = 0;
      
      const progressInterval = setInterval(() => {
        // Animation de progression réaliste
        const increment = Math.random() * 8 + 2;
        progress = Math.min(progress + increment, 95); // Ne jamais atteindre 100% avant la fin
        
        progressBar.style.width = `${progress}%`;
        cyberLoader.setAttribute('aria-valuenow', Math.round(progress));
        
        // Changement des tips
        if (progress > 30 && tipIndex === 0) {
          this.switchLoaderTip(tips, 1);
          tipIndex = 1;
        } else if (progress > 70 && tipIndex === 1) {
          this.switchLoaderTip(tips, 2);
          tipIndex = 2;
        }
        
        if (progress >= 95) {
          clearInterval(progressInterval);
        }
      }, 150);
      
      // Stockage pour nettoyage
      this.timers.set('loaderProgress', progressInterval);
    }
  }

  switchLoaderTip(tips, newIndex) {
    tips.forEach((tip, index) => {
      tip.classList.toggle('active', index === newIndex);
    });
  }

  setupLoaderProgress() {
    // Écouter les événements de chargement
    let resourcesLoaded = 0;
    let totalResources = 0;
    
    // Compter les ressources à charger
    const images = document.querySelectorAll('img');
    const scripts = document.querySelectorAll('script[src]');
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    
    totalResources = images.length + scripts.length + links.length;
    
    const updateProgress = () => {
      resourcesLoaded++;
      const percentage = Math.min((resourcesLoaded / totalResources) * 30 + 70, 100);
      
      const progressBar = this.elements.loader?.querySelector('.loader-progress-bar');
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }
    };

    // Écouter le chargement des ressources
    [...images, ...scripts, ...links].forEach(resource => {
      if (resource.complete || resource.readyState === 'complete') {
        updateProgress();
      } else {
        resource.addEventListener('load', updateProgress, { once: true });
        resource.addEventListener('error', updateProgress, { once: true });
      }
    });
  }

  async hideLoader() {
    if (!this.elements.loader || this.state.isLoading) return;
    
    this.state.isLoading = true;
    
    try {
      // Finaliser la barre de progression
      const progressBar = this.elements.loader.querySelector('.loader-progress-bar');
      if (progressBar) {
        progressBar.style.width = '100%';
        await this.wait(300);
      }
      
      // Animation de sortie sophistiquée
      this.elements.loader.classList.add('fade-out');
      
      // Annoncer la fin du chargement
      const loaderText = this.elements.loader.querySelector('.loader-text');
      if (loaderText) {
        loaderText.textContent = 'Portfolio chargé !';
      }
      
      await this.wait(this.state.prefersReducedMotion ? 100 : 600);
      
      if (this.elements.loader) {
        this.elements.loader.remove();
        this.elements.loader = null;
      }
      
      // Activation des animations de page
      this.elements.body.classList.add('page-loaded');
      await this.wait(100);
      this.triggerPageAnimations();
      
    } catch (error) {
      console.error('[Portfolio] ❌ Erreur lors de la suppression du loader:', error);
    } finally {
      this.state.isLoading = false;
      
      // Nettoyage des timers
      this.timers.forEach((timer, key) => {
        clearInterval(timer);
        this.timers.delete(key);
      });
    }
  }

  async showTransitionLoader() {
    if (this.state.isLoading) return null;
    
    const transitionLoader = document.createElement('div');
    transitionLoader.className = 'transition-loader';
    transitionLoader.setAttribute('role', 'status');
    transitionLoader.setAttribute('aria-label', 'Navigation en cours');
    transitionLoader.innerHTML = `
      <div class="transition-spinner"></div>
      <div class="transition-text">Navigation...</div>
    `;
    
    this.elements.body.appendChild(transitionLoader);
    
    await this.wait(50);
    transitionLoader.classList.add('active');
    
    return transitionLoader;
  }

  /* =================================================================
     NAVIGATION ULTRA-AMÉLIORÉE
     ================================================================= */

  setupNavigation() {
    this.setupSmoothScrolling();
    this.setupLinkInterception();
    this.setupNavigationHighlight();
    this.setupKeyboardNavigation();
    this.setupNavigationHistory();
  }

  setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      this.addEventListener(link, 'click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        this.smoothScrollTo(targetElement);
        
        // Mise à jour de l'historique pour le scroll
        if (history.pushState) {
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }

  smoothScrollTo(element) {
    const headerHeight = this.elements.header?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - 20;
    
    if (this.state.prefersReducedMotion) {
      window.scrollTo(0, targetPosition);
      element.focus({ preventScroll: true });
      return;
    }
    
    // Animation de scroll personnalisée plus fluide
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000);
    let start = null;
    
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function pour un mouvement plus naturel
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        element.focus({ preventScroll: true });
      }
    };
    
    requestAnimationFrame(animation);
  }

  setupLinkInterception() {
    const internalLinks = document.querySelectorAll('a[href$=".html"]:not([download]):not([target="_blank"])');
    
    internalLinks.forEach(link => {
      this.addEventListener(link, 'click', async (e) => {
        // Ignore si modificateurs de clavier
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        
        const href = link.getAttribute('href');
        if (href.includes('#') || href.startsWith('http')) return;
        
        e.preventDefault();
        await this.navigateToPage(href, link);
      });
    });
  }

  async navigateToPage(url, sourceElement = null) {
    try {
      // Fermer le menu mobile s'il est ouvert
      if (this.state.isMobileMenuOpen) {
        this.closeMobileMenu();
        await this.wait(300); // Attendre la fermeture
      }
      
      const loader = await this.showTransitionLoader();
      
      // Ajouter l'URL à l'historique
      if (sourceElement) {
        this.addToNavigationHistory(url, sourceElement.textContent);
      }
      
      await this.wait(this.config.transitionDelay);
      
      // Preload de la page si possible
      await this.preloadPage(url);
      
      // Navigation avec gestion d'erreur
      window.location.href = url;
      
    } catch (error) {
      console.error('[Portfolio] ❌ Erreur de navigation:', error);
      // Fallback direct
      window.location.href = url;
    }
  }

  async preloadPage(url) {
    if (!this.capabilities.intersectionObserver || !('fetch' in window)) return;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`[Portfolio] ✅ Page préchargée: ${url}`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn(`[Portfolio] ⚠️ Impossible de précharger: ${url}`, error);
      }
    }
  }

  setupNavigationHighlight() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.state.currentPage = currentPage;
    
    // Highlight du lien actif avec gestion améliorée
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.split('#')[0] === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        
        // Activer le parent du sous-menu si nécessaire
        const parentSubmenu = link.closest('.submenu-list')?.previousElementSibling;
        if (parentSubmenu) {
          parentSubmenu.classList.add('active');
          parentSubmenu.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }

  setupNavigationHistory() {
    this.navigationHistory = [];
    
    // Écouter les changements d'historique
    this.addEventListener(window, 'popstate', (e) => {
      console.log('[Portfolio] 🔄 Navigation historique détectée');
      // Le navigateur gère déjà le changement, on peut faire du nettoyage ici
      this.cleanupBeforeNavigation();
    });
  }

  addToNavigationHistory(url, title) {
    this.navigationHistory.push({
      url,
      title,
      timestamp: Date.now()
    });
    
    // Garder seulement les 10 dernières navigations
    if (this.navigationHistory.length > 10) {
      this.navigationHistory.shift();
    }
  }

  cleanupBeforeNavigation() {
    // Fermer le menu mobile
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Nettoyer les timers actifs
    this.timers.forEach((timer, key) => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.timers.clear();
  }

  setupKeyboardNavigation() {
    this.addEventListener(document, 'keydown', (e) => {
      switch (e.key) {
        case 'Escape':
          this.handleEscapeKey(e);
          break;
        case 'Tab':
          this.handleTabNavigation(e);
          break;
        case 'Enter':
        case ' ':
          this.handleActivationKeys(e);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          this.handleArrowNavigation(e);
          break;
      }
    });
  }

  handleEscapeKey(e) {
    if (this.state.isMobileMenuOpen) {
      e.preventDefault();
      this.closeMobileMenu();
    }
  }

  handleTabNavigation(e) {
    if (this.state.isMobileMenuOpen) {
      const focusableElements = this.elements.nav.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleActivationKeys(e) {
    if (e.target.matches('.hamburger-menu')) {
      e.preventDefault();
      this.toggleMobileMenu();
    }
  }

  handleArrowNavigation(e) {
    if (this.state.isMobileMenuOpen && e.target.matches('.menu a')) {
      e.preventDefault();
      const menuLinks = Array.from(this.elements.nav.querySelectorAll('.menu a'));
      const currentIndex = menuLinks.indexOf(e.target);
      
      let nextIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % menuLinks.length;
      } else {
        nextIndex = (currentIndex - 1 + menuLinks.length) % menuLinks.length;
      }
      
      menuLinks[nextIndex].focus();
    }
  }

  /* =================================================================
     MENU MOBILE ULTRA-PERFORMANT
     ================================================================= */

  setupMobileMenu() {
    if (!this.elements.hamburger || !this.elements.nav) return;
    
    this.setupHamburgerButton();
    this.setupMobileSubmenus();
    this.setupMobileMenuAnimations();
    this.setupOutsideClickClose();
    this.setupMobileMenuAccessibility();
  }

  setupHamburgerButton() {
    this.addEventListener(this.elements.hamburger, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // Attributs d'accessibilité complets
    this.elements.hamburger.setAttribute('aria-expanded', 'false');
    this.elements.hamburger.setAttribute('aria-controls', 'main-navigation');
    this.elements.hamburger.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    this.elements.nav.setAttribute('id', 'main-navigation');
    this.elements.nav.setAttribute('aria-hidden', 'true');
  }

  toggleMobileMenu() {
    if (this.state.isMenuAnimating) return;
    
    const isOpen = this.state.isMobileMenuOpen;
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  async openMobileMenu() {
    if (this.state.isMobileMenuOpen || this.state.isMenuAnimating) return;
    
    this.state.isMenuAnimating = true;
    this.state.isMobileMenuOpen = true;
    
    console.log('[Portfolio] 📱 Ouverture du menu mobile');
    
    // Préparation de l'ouverture
    this.elements.nav.style.display = 'block';
    this.elements.nav.classList.add('menu-mobile-ouvert');
    this.elements.hamburger.classList.add('menu-ouvert');
    
    // Mise à jour des attributs d'accessibilité
    this.elements.hamburger.setAttribute('aria-expanded', 'true');
    this.elements.hamburger.setAttribute('aria-label', 'Fermer le menu de navigation');
    this.elements.nav.setAttribute('aria-hidden', 'false');
    
    // Gestion du body - CORRECTION PRINCIPALE
    this.elements.body.classList.add('mobile-menu-open');
    this.elements.body.style.overflow = 'hidden';
    this.elements.body.style.position = 'fixed';
    this.elements.body.style.width = '100%';
    this.elements.body.style.top = `-${window.scrollY}px`;
    
    // Stockage de la position de scroll
    this.state.scrollPosition = window.scrollY;
    
    // Focus management
    await this.wait(100);
    const firstLink = this.elements.nav.querySelector('a');
    if (firstLink) {
      firstLink.focus();
    }
    
    this.bindMobileSubmenus();
    
    // Annoncer l'ouverture
    this.announceToScreenReader('Menu de navigation ouvert');
    
    await this.wait(300);
    this.state.isMenuAnimating = false;
  }

  async closeMobileMenu() {
    if (!this.state.isMobileMenuOpen || this.state.isMenuAnimating) return;
    
    this.state.isMenuAnimating = true;
    
    console.log('[Portfolio] 📱 Fermeture du menu mobile');
    
    // Animation de fermeture
    this.elements.nav.classList.remove('menu-mobile-ouvert');
    this.elements.hamburger.classList.remove('menu-ouvert');
    
    // Mise à jour des attributs d'accessibilité
    this.elements.hamburger.setAttribute('aria-expanded', 'false');
    this.elements.hamburger.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    this.elements.nav.setAttribute('aria-hidden', 'true');
    
    // Restauration du body - CORRECTION PRINCIPALE
    this.elements.body.classList.remove('mobile-menu-open');
    this.elements.body.style.overflow = '';
    this.elements.body.style.position = '';
    this.elements.body.style.width = '';
    this.elements.body.style.top = '';
    
    // Restauration de la position de scroll
    window.scrollTo(0, this.state.scrollPosition);
    
    // Fermer tous les sous-menus
    const openSubmenus = this.elements.nav.querySelectorAll('.submenu-open');
    openSubmenus.forEach(submenu => {
      submenu.classList.remove('submenu-open');
    });
    
    const activeParents = this.elements.nav.querySelectorAll('.active-submenu-parent');
    activeParents.forEach(parent => {
      parent.classList.remove('active-submenu-parent');
    });
    
    // Annoncer la fermeture
    this.announceToScreenReader('Menu de navigation fermé');
    
    await this.wait(300);
    
    this.elements.nav.style.display = 'none';
    this.state.isMobileMenuOpen = false;
    this.state.isMenuAnimating = false;
  }

  setupMobileSubmenus() {
    const submenuLinks = document.querySelectorAll('.submenu > a');
    
    submenuLinks.forEach(link => {
      if (link.dataset.mobileSubmenuBound) return;
      
      this.addEventListener(link, 'click', (e) => {
        if (window.innerWidth > 768) return;
        
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileSubmenu(link);
      });
      
      // Support tactile amélioré
      if (this.capabilities.touch) {
        this.addEventListener(link, 'touchstart', (e) => {
          if (window.innerWidth > 768) return;
          link.classList.add('touch-active');
        }, { passive: true });
        
        this.addEventListener(link, 'touchend', (e) => {
          if (window.innerWidth > 768) return;
          link.classList.remove('touch-active');
        }, { passive: true });
      }
      
      link.dataset.mobileSubmenuBound = 'true';
    });
  }

  bindMobileSubmenus() {
    // Re-binding après ouverture pour assurer le bon fonctionnement
    this.setupMobileSubmenus();
  }

  toggleMobileSubmenu(link) {
    const submenu = link.nextElementSibling;
    if (!submenu?.classList.contains('submenu-list')) return;
    
    const isOpen = submenu.classList.contains('submenu-open');
    
    // Fermer tous les autres sous-menus avec animation
    const allSubmenus = document.querySelectorAll('.submenu-list');
    const allParents = document.querySelectorAll('.active-submenu-parent');
    
    allSubmenus.forEach(sub => {
      if (sub !== submenu) {
        sub.classList.remove('submenu-open');
      }
    });
    allParents.forEach(parent => {
      if (parent !== link) {
        parent.classList.remove('active-submenu-parent');
      }
    });
    
    // Toggle du sous-menu courant
    if (!isOpen) {
      submenu.classList.add('submenu-open');
      link.classList.add('active-submenu-parent');
      link.setAttribute('aria-expanded', 'true');
      
      // Annoncer le changement
      this.announceToScreenReader(`Sous-menu ${link.textContent.trim()} ouvert`);
      
      // Scroll vers le sous-menu si nécessaire
      setTimeout(() => {
        const submenuRect = submenu.getBoundingClientRect();
        const navRect = this.elements.nav.getBoundingClientRect();
        if (submenuRect.bottom > navRect.bottom) {
          submenu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      submenu.classList.remove('submenu-open');
     link.classList.remove('active-submenu-parent');
     link.setAttribute('aria-expanded', 'false');
     
     // Annoncer le changement
     this.announceToScreenReader(`Sous-menu ${link.textContent.trim()} fermé`);
   }
 }

 setupMobileMenuAnimations() {
   if (this.state.prefersReducedMotion) return;
   
   // Animations d'entrée progressive pour les éléments du menu
   const observer = new IntersectionObserver((entries) => {
     entries.forEach((entry, index) => {
       if (entry.isIntersecting) {
         setTimeout(() => {
           entry.target.classList.add('animate-in');
         }, index * 50);
         observer.unobserve(entry.target);
       }
     });
   }, { threshold: 0.1 });
   
   const menuItems = document.querySelectorAll('.menu li');
   menuItems.forEach(item => {
     if (this.capabilities.intersectionObserver) {
       observer.observe(item);
     } else {
       item.classList.add('animate-in');
     }
   });
   
   this.observers.set('menuAnimation', observer);
 }

 setupOutsideClickClose() {
   this.addEventListener(document, 'click', (e) => {
     if (this.state.isMobileMenuOpen && 
         !this.elements.nav.contains(e.target) && 
         !this.elements.hamburger.contains(e.target)) {
       this.closeMobileMenu();
     }
   });
   
   // Support tactile pour fermeture
   if (this.capabilities.touch) {
     this.addEventListener(document, 'touchstart', (e) => {
       if (this.state.isMobileMenuOpen && 
           !this.elements.nav.contains(e.target) && 
           !this.elements.hamburger.contains(e.target)) {
         this.closeMobileMenu();
       }
     }, { passive: true });
   }
 }

 setupMobileMenuAccessibility() {
   // Piégeage du focus dans le menu mobile
   this.addEventListener(this.elements.nav, 'keydown', (e) => {
     if (!this.state.isMobileMenuOpen) return;
     
     if (e.key === 'Tab') {
       const focusableElements = this.elements.nav.querySelectorAll(
         'a:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
       );
       
       const firstElement = focusableElements[0];
       const lastElement = focusableElements[focusableElements.length - 1];
       
       if (e.shiftKey) {
         if (document.activeElement === firstElement) {
           e.preventDefault();
           lastElement.focus();
         }
       } else {
         if (document.activeElement === lastElement) {
           e.preventDefault();
           firstElement.focus();
         }
       }
     }
   });
 }

 /* =================================================================
    ACCESSIBILITÉ ULTRA-AVANCÉE
    ================================================================= */

 setupAccessibility() {
   this.setupScreenReaderSupport();
   this.setupHighContrastMode();
   this.setupFocusManagement();
   this.setupSkipLinks();
   this.setupReducedMotionSupport();
   this.setupColorBlindnessSupport();
 }

 setupScreenReaderSupport() {
   // Créer un annonceur pour les lecteurs d'écran
   const announcer = document.createElement('div');
   announcer.setAttribute('aria-live', 'polite');
   announcer.setAttribute('aria-atomic', 'true');
   announcer.className = 'sr-only';
   announcer.id = 'screen-reader-announcer';
   announcer.style.cssText = `
     position: absolute !important;
     width: 1px !important;
     height: 1px !important;
     padding: 0 !important;
     margin: -1px !important;
     overflow: hidden !important;
     clip: rect(0, 0, 0, 0) !important;
     white-space: nowrap !important;
     border: 0 !important;
   `;
   this.elements.body.appendChild(announcer);
   this.elements.screenReaderAnnouncer = announcer;
   
   // Annoncer les changements de page
   this.announcePageChange();
 }

 announcePageChange() {
   const pageTitle = document.title;
   setTimeout(() => {
     this.announceToScreenReader(`Page chargée: ${pageTitle}`);
   }, 1000);
 }

 announceToScreenReader(message) {
   if (this.elements.screenReaderAnnouncer) {
     // Effacer le message précédent
     this.elements.screenReaderAnnouncer.textContent = '';
     
     // Petit délai pour forcer la re-lecture
     setTimeout(() => {
       this.elements.screenReaderAnnouncer.textContent = message;
       console.log(`[Portfolio] 📢 Annonce SR: ${message}`);
       
       // Nettoyer après lecture
       setTimeout(() => {
         this.elements.screenReaderAnnouncer.textContent = '';
       }, 2000);
     }, 100);
   }
 }

 setupHighContrastMode() {
   const mediaQuery = window.matchMedia('(prefers-contrast: high)');
   
   const handleHighContrast = (e) => {
     if (e.matches) {
       this.elements.body.classList.add('high-contrast');
       console.log('[Portfolio] 🎨 Mode contraste élevé activé');
     } else {
       this.elements.body.classList.remove('high-contrast');
     }
   };
   
   handleHighContrast(mediaQuery);
   
   if (mediaQuery.addEventListener) {
     mediaQuery.addEventListener('change', handleHighContrast);
   } else {
     // Fallback pour les anciens navigateurs
     mediaQuery.addListener(handleHighContrast);
   }
 }

 setupFocusManagement() {
   let isTabbing = false;
   let lastFocusedElement = null;
   
   // Détecter la navigation au clavier
   this.addEventListener(document, 'keydown', (e) => {
     if (e.key === 'Tab') {
       isTabbing = true;
       this.elements.body.classList.add('is-tabbing');
       lastFocusedElement = document.activeElement;
     }
   });
   
   // Désactiver les styles de focus pour la souris
   this.addEventListener(document, 'mousedown', () => {
     if (isTabbing) {
       isTabbing = false;
       this.elements.body.classList.remove('is-tabbing');
     }
   });
   
   // Gestion du focus visible
   this.addEventListener(document, 'focusin', (e) => {
     if (isTabbing) {
       e.target.classList.add('focus-visible');
     }
   });
   
   this.addEventListener(document, 'focusout', (e) => {
     e.target.classList.remove('focus-visible');
   });
   
   // Restaurer le focus après fermeture du menu
   this.addEventListener(document, 'keydown', (e) => {
     if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
       this.closeMobileMenu();
       if (lastFocusedElement && lastFocusedElement !== this.elements.hamburger) {
         setTimeout(() => {
           this.elements.hamburger.focus();
         }, 100);
       }
     }
   });
 }

 setupSkipLinks() {
   const skipLink = document.createElement('a');
   skipLink.href = '#main-content';
   skipLink.className = 'skip-link';
   skipLink.textContent = 'Aller au contenu principal';
   skipLink.setAttribute('tabindex', '0');
   
   this.addEventListener(skipLink, 'click', (e) => {
     e.preventDefault();
     const mainContent = document.getElementById('main-content') || this.elements.main;
     if (mainContent) {
       mainContent.focus();
       this.smoothScrollTo(mainContent);
       this.announceToScreenReader('Navigation vers le contenu principal');
     }
   });
   
   this.elements.body.insertBefore(skipLink, this.elements.body.firstChild);
 }

 setupReducedMotionSupport() {
   const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
   
   const handleReducedMotion = (e) => {
     this.state.prefersReducedMotion = e.matches;
     this.elements.body.classList.toggle('reduced-motion', e.matches);
     
     if (e.matches) {
       console.log('[Portfolio] ⚡ Mode animation réduite activé');
       // Désactiver les animations non essentielles
       this.disableNonEssentialAnimations();
     }
   };
   
   handleReducedMotion(mediaQuery);
   
   if (mediaQuery.addEventListener) {
     mediaQuery.addEventListener('change', handleReducedMotion);
   } else {
     mediaQuery.addListener(handleReducedMotion);
   }
 }

 disableNonEssentialAnimations() {
   const animatedElements = document.querySelectorAll('[data-animate]');
   animatedElements.forEach(el => {
     el.style.transition = 'none';
     el.style.animation = 'none';
   });
 }

 setupColorBlindnessSupport() {
   // Ajouter des indicateurs non-colorimétriques
   const buttons = document.querySelectorAll('button, .btn');
   buttons.forEach(btn => {
     if (!btn.querySelector('.sr-only')) {
       const context = btn.textContent.toLowerCase();
       let indicator = '';
       
       if (context.includes('fermer') || context.includes('close')) {
         indicator = '✕';
       } else if (context.includes('menu')) {
         indicator = '☰';
       } else if (context.includes('télécharger') || context.includes('download')) {
         indicator = '⬇';
       }
       
       if (indicator) {
         const span = document.createElement('span');
         span.className = 'sr-only';
         span.textContent = ` ${indicator}`;
         btn.appendChild(span);
       }
     }
   });
 }

 /* =================================================================
    FONCTIONNALITÉS DE SCROLL ULTRA-PERFORMANTES
    ================================================================= */

 setupScrollFeatures() {
   this.setupScrollSpy();
   this.setupScrollToTop();
   this.setupScrollProgress();
   this.setupScrollDirectionDetection();
   this.setupParallaxEffects();
 }

 setupScrollSpy() {
   const sections = document.querySelectorAll('section[id]');
   if (sections.length === 0) return;
   
   if (this.capabilities.intersectionObserver) {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         const navLink = document.querySelector(`a[href="#${entry.target.id}"]`);
         if (navLink) {
           if (entry.isIntersecting) {
             // Retirer la classe active de tous les liens
             document.querySelectorAll('.menu a.current-section').forEach(link => {
               link.classList.remove('current-section');
               link.removeAttribute('aria-current');
             });
             
             // Ajouter la classe active au lien courant
             navLink.classList.add('current-section');
             navLink.setAttribute('aria-current', 'location');
           }
         }
       });
     }, {
       rootMargin: '-20% 0px -80% 0px',
       threshold: [0, 0.25, 0.5, 0.75, 1]
     });
     
     sections.forEach(section => observer.observe(section));
     this.observers.set('scrollSpy', observer);
   }
 }

 setupScrollToTop() {
   const scrollButton = document.createElement('button');
   scrollButton.className = 'scroll-to-top';
   scrollButton.innerHTML = '↑';
   scrollButton.setAttribute('aria-label', 'Retour en haut de page');
   scrollButton.setAttribute('title', 'Retour en haut');
   scrollButton.style.display = 'none';
   scrollButton.type = 'button';
   
   this.addEventListener(scrollButton, 'click', () => {
     this.smoothScrollToTop();
     this.announceToScreenReader('Retour en haut de page');
   });
   
   // Gestion optimisée de l'affichage du bouton
   let scrollTimer;
   let lastScrollY = 0;
   
   this.addEventListener(window, 'scroll', () => {
     clearTimeout(scrollTimer);
     scrollTimer = setTimeout(() => {
       const currentScrollY = window.scrollY;
       const isScrollingDown = currentScrollY > lastScrollY;
       const shouldShow = currentScrollY > 500;
       
       scrollButton.style.display = shouldShow ? 'flex' : 'none';
       scrollButton.classList.toggle('scrolling-down', isScrollingDown);
       
       lastScrollY = currentScrollY;
     }, 16);
   }, { passive: true });
   
   this.elements.body.appendChild(scrollButton);
 }

 smoothScrollToTop() {
   if (this.state.prefersReducedMotion) {
     window.scrollTo(0, 0);
     return;
   }
   
   const startY = window.scrollY;
   const duration = Math.min(startY / 3, 1000);
   let start = null;
   
   const animation = (currentTime) => {
     if (start === null) start = currentTime;
     const timeElapsed = currentTime - start;
     const progress = Math.min(timeElapsed / duration, 1);
     
     // Easing out cubic pour un arrêt en douceur
     const ease = 1 - Math.pow(1 - progress, 3);
     
     window.scrollTo(0, startY * (1 - ease));
     
     if (progress < 1) {
       requestAnimationFrame(animation);
     }
   };
   
   requestAnimationFrame(animation);
 }

 setupScrollProgress() {
   const progressBar = document.createElement('div');
   progressBar.className = 'scroll-progress';
   progressBar.setAttribute('role', 'progressbar');
   progressBar.setAttribute('aria-label', 'Progression de lecture');
   
   const progressFill = document.createElement('div');
   progressFill.className = 'scroll-progress-fill';
   progressBar.appendChild(progressFill);
   
   let ticking = false;
   
   const updateProgress = () => {
     const scrollTop = window.scrollY;
     const docHeight = document.body.scrollHeight - window.innerHeight;
     const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
     
     progressFill.style.width = `${scrollPercent}%`;
     progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
     progressBar.setAttribute('aria-valuemin', '0');
     progressBar.setAttribute('aria-valuemax', '100');
     
     ticking = false;
   };
   
   this.addEventListener(window, 'scroll', () => {
     if (!ticking) {
       requestAnimationFrame(updateProgress);
       ticking = true;
     }
   }, { passive: true });
   
   this.elements.body.appendChild(progressBar);
 }

 setupScrollDirectionDetection() {
   let lastScrollTop = 0;
   let ticking = false;
   
   const updateScrollDirection = () => {
     const scrollTop = window.scrollY;
     const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
     
     this.elements.body.setAttribute('data-scroll-direction', scrollDirection);
     this.state.lastScrollY = scrollTop;
     lastScrollTop = scrollTop;
     
     // Cacher/montrer le header selon la direction
     if (this.elements.header) {
       if (scrollDirection === 'down' && scrollTop > 100) {
         this.elements.header.classList.add('header-hidden');
       } else {
         this.elements.header.classList.remove('header-hidden');
       }
     }
     
     ticking = false;
   };
   
   this.addEventListener(window, 'scroll', () => {
     if (!ticking) {
       requestAnimationFrame(updateScrollDirection);
       ticking = true;
     }
   }, { passive: true });
 }

 setupParallaxEffects() {
   if (this.state.prefersReducedMotion) return;
   
   const parallaxElements = document.querySelectorAll('[data-parallax]');
   if (parallaxElements.length === 0) return;
   
   let ticking = false;
   
   const updateParallax = () => {
     const scrollY = window.scrollY;
     
     parallaxElements.forEach(element => {
       const speed = parseFloat(element.dataset.parallax) || 0.5;
       const yPos = -(scrollY * speed);
       element.style.transform = `translateY(${yPos}px)`;
     });
     
     ticking = false;
   };
   
   this.addEventListener(window, 'scroll', () => {
     if (!ticking) {
       requestAnimationFrame(updateParallax);
       ticking = true;
     }
   }, { passive: true });
 }

 /* =================================================================
    GESTION TACTILE ET RESPONSIVE
    ================================================================= */

 setupTouchHandlers() {
   if (!this.capabilities.touch) return;
   
   this.setupSwipeGestures();
   this.setupTouchFeedback();
 }

 setupSwipeGestures() {
   let startX = 0;
   let startY = 0;
   let threshold = 50;
   
   this.addEventListener(document, 'touchstart', (e) => {
     startX = e.touches[0].clientX;
     startY = e.touches[0].clientY;
   }, { passive: true });
   
   this.addEventListener(document, 'touchend', (e) => {
     if (!startX || !startY) return;
     
     const endX = e.changedTouches[0].clientX;
     const endY = e.changedTouches[0].clientY;
     
     const diffX = startX - endX;
     const diffY = startY - endY;
     
     // Swipe horizontal (menu)
     if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
       if (diffX > 0) {
         // Swipe left - fermer le menu
         if (this.state.isMobileMenuOpen) {
           this.closeMobileMenu();
         }
       } else {
         // Swipe right - ouvrir le menu
         if (!this.state.isMobileMenuOpen && window.innerWidth <= 768) {
           this.openMobileMenu();
         }
       }
     }
     
     startX = 0;
     startY = 0;
   }, { passive: true });
 }

 setupTouchFeedback() {
   const touchableElements = document.querySelectorAll('a, button, .touchable');
   
   touchableElements.forEach(element => {
     this.addEventListener(element, 'touchstart', (e) => {
       element.classList.add('touch-active');
     }, { passive: true });
     
     this.addEventListener(element, 'touchend', (e) => {
       setTimeout(() => {
         element.classList.remove('touch-active');
       }, 150);
     }, { passive: true });
     
     this.addEventListener(element, 'touchcancel', (e) => {
       element.classList.remove('touch-active');
     }, { passive: true });
   });
 }

 setupResponsiveHandlers() {
   // Écouter les changements d'orientation et de taille
   this.addEventListener(window, 'resize', this.debounce(() => {
     this.handleResize();
   }, 250));
   
   this.addEventListener(window, 'orientationchange', () => {
     setTimeout(() => {
       this.handleOrientationChange();
     }, 100);
   });
 }

 handleResize() {
   const wasDesktop = this.state.isDesktop;
   this.state.isDesktop = window.innerWidth > 768;
   
   // Fermer le menu mobile si on passe en desktop
   if (!wasDesktop && this.state.isDesktop && this.state.isMobileMenuOpen) {
     this.closeMobileMenu();
   }
   
   // Mettre à jour les éléments dépendants de la taille
   this.updateResponsiveElements();
   
   console.log(`[Portfolio] 📱 Resize: ${window.innerWidth}x${window.innerHeight}`);
 }

 handleOrientationChange() {
   // Recalculer les hauteurs après changement d'orientation
   if (this.state.isMobileMenuOpen) {
     this.elements.nav.style.height = `${window.innerHeight}px`;
   }
   
   console.log('[Portfolio] 🔄 Changement d\'orientation détecté');
 }

 updateResponsiveElements() {
   // Mettre à jour les hauteurs des éléments full-height
   const fullHeightElements = document.querySelectorAll('.full-height');
   fullHeightElements.forEach(element => {
     element.style.minHeight = `${window.innerHeight}px`;
   });
 }

 /* =================================================================
    OPTIMISATION DES IMAGES AVANCÉE
    ================================================================= */

 setupImageOptimization() {
   this.setupLazyLoading();
   this.setupImageErrorHandling();
   this.setupResponsiveImages();
   this.setupImagePreloading();
 }

 setupLazyLoading() {
   if (!this.capabilities.intersectionObserver) {
     // Fallback pour les navigateurs sans IntersectionObserver
     this.loadAllImages();
     return;
   }
   
   const imageObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         const img = entry.target;
         this.loadImage(img);
         imageObserver.unobserve(img);
       }
     });
   }, {
     rootMargin: '50px 0px',
     threshold: 0.01
   });
   
   const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
   lazyImages.forEach(img => {
     imageObserver.observe(img);
   });
   
   this.observers.set('lazyLoading', imageObserver);
 }

 loadImage(img) {
   return new Promise((resolve, reject) => {
     const imageUrl = img.dataset.src || img.src;
     
     if (!imageUrl) {
       resolve();
       return;
     }
     
     const imageLoader = new Image();
     
     imageLoader.onload = () => {
       img.src = imageUrl;
       img.classList.add('loaded');
       img.classList.remove('loading');
       resolve();
     };
     
     imageLoader.onerror = () => {
       img.classList.add('error');
       img.classList.remove('loading');
       console.warn(`[Portfolio] ⚠️ Erreur de chargement: ${imageUrl}`);
       reject();
     };
     
     img.classList.add('loading');
     imageLoader.src = imageUrl;
   });
 }

 loadAllImages() {
   const images = document.querySelectorAll('img[data-src]');
   images.forEach(img => {
     if (img.dataset.src) {
       img.src = img.dataset.src;
     }
   });
 }

 setupImageErrorHandling() {
   const images = document.querySelectorAll('img');
   
   images.forEach(img => {
     this.addEventListener(img, 'error', () => {
       img.classList.add('image-error');
       img.alt = img.alt || 'Image non disponible';
       
       // Tentative de rechargement après délai
       setTimeout(() => {
         if (img.dataset.fallback) {
           img.src = img.dataset.fallback;
         }
       }, 1000);
     });
     
     this.addEventListener(img, 'load', () => {
       img.classList.add('image-loaded');
       img.classList.remove('image-loading');
     });
   });
 }

 setupResponsiveImages() {
   if (window.devicePixelRatio > 1) {
     const images = document.querySelectorAll('img[data-srcset]');
     images.forEach(img => {
       if (img.dataset.srcset) {
         img.srcset = img.dataset.srcset;
       }
     });
   }
 }

 setupImagePreloading() {
   // Précharger les images critiques
   const criticalImages = document.querySelectorAll('img[data-critical]');
   criticalImages.forEach(img => {
     this.loadImage(img);
   });
 }

 /* =================================================================
    MONITORING DE PERFORMANCE AVANCÉ
    ================================================================= */

 setupPerformanceMonitoring() {
   this.measurePageLoadTime();
   this.monitorResourceUsage();
   this.setupPerformanceReporting();
   this.monitorUserInteractions();
 }

 measurePageLoadTime() {
   if (!this.capabilities.performanceAPI) return;
   
   window.addEventListener('load', () => {
     setTimeout(() => {
       try {
         const perfData = performance.getEntriesByType('navigation')[0];
         const metrics = {
           loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
           domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
           firstPaint: this.getFirstPaint(),
           firstContentfulPaint: this.getFirstContentfulPaint()
         };
         
         console.log('[Portfolio] 📊 Métriques de performance:', metrics);
         
         if (metrics.loadTime > 3000) {
           console.warn('[Portfolio] ⚠️ Temps de chargement élevé détecté');
           this.reportSlowLoading(metrics);
         }
         
         this.reportPerformanceMetrics(metrics);
       } catch (error) {
         console.warn('[Portfolio] ⚠️ Erreur de mesure de performance:', error);
       }
     }, 0);
   });
 }

 getFirstPaint() {
   try {
     const entries = performance.getEntriesByType('paint');
     const fpEntry = entries.find(entry => entry.name === 'first-paint');
     return fpEntry ? Math.round(fpEntry.startTime) : null;
   } catch (error) {
     return null;
   }
 }

 getFirstContentfulPaint() {
   try {
     const entries = performance.getEntriesByType('paint');
     const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
     return fcpEntry ? Math.round(fcpEntry.startTime) : null;
   } catch (error) {
     return null;
   }
 }

 monitorResourceUsage() {
   if (!('memory' in performance)) return;
   
   const checkMemory = () => {
     try {
       const memory = performance.memory;
       const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
       
       if (usagePercent > 80) {
         console.warn(`[Portfolio] ⚠️ Utilisation mémoire élevée: ${usagePercent.toFixed(1)}%`);
         this.cleanupUnusedResources();
       }
     } catch (error) {
       console.warn('[Portfolio] ⚠️ Erreur de monitoring mémoire:', error);
     }
   };
   
   const memoryTimer = setInterval(checkMemory, 30000);
   this.timers.set('memoryMonitor', memoryTimer);
 }

 cleanupUnusedResources() {
   // Nettoyer les observers non utilisés
   this.observers.forEach((observer, key) => {
     if (observer && typeof observer.disconnect === 'function') {
       observer.disconnect();
     }
   });
   
   // Nettoyer les event listeners inactifs
   let cleanedCount = 0;
   this.eventListeners.forEach((listener, key) => {
     if (!document.contains(listener.element)) {
       listener.element.removeEventListener(listener.event, listener.handler, listener.options);
       this.eventListeners.delete(key);
       cleanedCount++;
     }
   });
   
   if (cleanedCount > 0) {
     console.log(`[Portfolio] 🧹 Nettoyage: ${cleanedCount} listeners supprimés`);
   }
 }

 setupPerformanceReporting() {
   if (!('PerformanceObserver' in window)) return;
   
   try {
     // Observer pour les métriques de rendu
     const observer = new PerformanceObserver((list) => {
       list.getEntries().forEach((entry) => {
         switch (entry.entryType) {
           case 'largest-contentful-paint':
             console.log(`[Portfolio] 🎨 LCP: ${Math.round(entry.startTime)}ms`);
             break;
           case 'first-input':
             console.log(`[Portfolio] ⚡ FID: ${Math.round(entry.processingStart - entry.startTime)}ms`);
             break;
           case 'layout-shift':
             if (entry.hadRecentInput) return;
             console.log(`[Portfolio] 📐 CLS: ${entry.value}`);
             break;
         }
       });
     });
     
     observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
     this.observers.set('performanceMetrics', observer);
   } catch (error) {
     console.warn('[Portfolio] ⚠️ PerformanceObserver non supporté');
   }
 }

 monitorUserInteractions() {
   let interactionCount = 0;
   const interactions = ['click', 'keydown', 'scroll', 'touchstart'];
   
   interactions.forEach(eventType => {
     this.addEventListener(document, eventType, () => {
       interactionCount++;
     }, { passive: true, once: false });
   });
   
   // Rapport périodique
   setInterval(() => {
     if (interactionCount > 0) {
       console.log(`[Portfolio] 👆 Interactions: ${interactionCount}`);
       interactionCount = 0;
     }
   }, 60000);
 }

 reportPerformanceMetrics(metrics) {
   // Ici on pourrait envoyer les métriques à un service d'analytics
   // Google Analytics, Sentry, etc.
   console.log('[Portfolio] 📈 Rapport de performance généré');
 }

 reportSlowLoading(metrics) {
   // Signaler les problèmes de performance
   console.warn('[Portfolio] 🐌 Performance dégradée détectée');
 }
 
 /* =================================================================
    GESTION D'ERREURS ULTRA-ROBUSTE
    ================================================================= */

 setupErrorHandling() {
   // Gestion des erreurs JavaScript globales
   this.addEventListener(window, 'error', (e) => {
     this.handleJavaScriptError(e.error, e.filename, e.lineno, e.colno);
   });
   
   // Gestion des promesses rejetées
   this.addEventListener(window, 'unhandledrejection', (e) => {
     this.handlePromiseRejection(e.reason, e.promise);
   });
   
   // Gestion des erreurs de ressources
   this.addEventListener(document, 'error', (e) => {
     if (e.target !== window) {
       this.handleResourceError(e.target);
     }
   }, true);
   
   // Surveillance des erreurs de réseau
   this.setupNetworkErrorHandling();
 }

 handleJavaScriptError(error, filename, lineno, colno) {
   const errorInfo = {
     type: 'javascript',
     message: error?.message || 'Erreur JavaScript inconnue',
     stack: error?.stack,
     filename: filename || 'unknown',
     lineno: lineno || 0,
     colno: colno || 0,
     userAgent: navigator.userAgent,
     timestamp: new Date().toISOString(),
     url: window.location.href,
     userId: this.getUserId()
   };
   
   console.error('[Portfolio] ❌ Erreur JavaScript:', errorInfo);
   this.reportError(errorInfo);
   
   // Tentative de récupération automatique
   this.attemptErrorRecovery('javascript', error);
 }

 handlePromiseRejection(reason, promise) {
   const errorInfo = {
     type: 'promise',
     message: reason?.message || reason || 'Promise rejetée',
     stack: reason?.stack,
     promise: promise.toString(),
     userAgent: navigator.userAgent,
     timestamp: new Date().toISOString(),
     url: window.location.href,
     userId: this.getUserId()
   };
   
   console.error('[Portfolio] ❌ Promise rejetée:', errorInfo);
   this.reportError(errorInfo);
 }

 handleResourceError(element) {
   const errorInfo = {
     type: 'resource',
     element: element.tagName,
     source: element.src || element.href || 'unknown',
     message: `Erreur de chargement: ${element.tagName}`,
     timestamp: new Date().toISOString(),
     url: window.location.href
   };
   
   console.warn('[Portfolio] ⚠️ Erreur de ressource:', errorInfo);
   
   // Tentative de rechargement pour les images
   if (element.tagName === 'IMG' && element.dataset.retryCount < 3) {
     this.retryImageLoad(element);
   }
   
   this.reportError(errorInfo);
 }

 retryImageLoad(img) {
   const retryCount = parseInt(img.dataset.retryCount || '0') + 1;
   img.dataset.retryCount = retryCount;
   
   setTimeout(() => {
     const originalSrc = img.src;
     img.src = '';
     img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'retry=' + retryCount;
   }, 1000 * retryCount);
 }

 setupNetworkErrorHandling() {
   // Détection des problèmes de connectivité
   this.addEventListener(window, 'online', () => {
     console.log('[Portfolio] 🌐 Connexion rétablie');
     this.announceToScreenReader('Connexion internet rétablie');
     this.elements.body.classList.remove('offline');
   });
   
   this.addEventListener(window, 'offline', () => {
     console.warn('[Portfolio] 📡 Connexion perdue');
     this.announceToScreenReader('Connexion internet perdue');
     this.elements.body.classList.add('offline');
   });
 }

 attemptErrorRecovery(errorType, error) {
   switch (errorType) {
     case 'javascript':
       if (error?.message?.includes('menu')) {
         this.reinitializeMobileMenu();
       }
       break;
     case 'resource':
       // Tentative de rechargement des ressources critiques
       this.reloadCriticalResources();
       break;
   }
 }

 reinitializeMobileMenu() {
   try {
     console.log('[Portfolio] 🔄 Réinitialisation du menu mobile');
     this.state.isMobileMenuOpen = false;
     this.state.isMenuAnimating = false;
     
     if (this.elements.hamburger && this.elements.nav) {
       this.elements.hamburger.classList.remove('menu-ouvert');
       this.elements.nav.classList.remove('menu-mobile-ouvert');
       this.elements.body.classList.remove('mobile-menu-open');
       
       // Re-setup des event listeners
       this.setupMobileMenu();
     }
   } catch (recoveryError) {
     console.error('[Portfolio] ❌ Échec de récupération du menu:', recoveryError);
   }
 }

 reloadCriticalResources() {
   const criticalSelectors = ['link[rel="stylesheet"]', 'script[src*="loader"]'];
   
   criticalSelectors.forEach(selector => {
     const elements = document.querySelectorAll(selector);
     elements.forEach(element => {
       if (element.tagName === 'LINK') {
         element.href = element.href + (element.href.includes('?') ? '&' : '?') + 'reload=' + Date.now();
       }
     });
   });
 }

 getUserId() {
   // Générer ou récupérer un ID utilisateur anonyme pour le tracking des erreurs
   let userId = localStorage.getItem('portfolio_user_id');
   if (!userId) {
     userId = 'user_' + Math.random().toString(36).substr(2, 9);
     localStorage.setItem('portfolio_user_id', userId);
   }
   return userId;
 }

 async reportError(errorInfo) {
   try {
     // En production, envoyer à un service de monitoring (Sentry, LogRocket, etc.)
     if (process?.env?.NODE_ENV === 'production') {
       await this.sendErrorToService(errorInfo);
     }
     
     // Stockage local pour debug
     this.storeErrorLocally(errorInfo);
     
   } catch (reportingError) {
     console.warn('[Portfolio] ⚠️ Impossible de reporter l\'erreur:', reportingError);
   }
 }

 async sendErrorToService(errorInfo) {
   // Placeholder pour service externe
   // const response = await fetch('/api/errors', {
   //   method: 'POST',
   //   headers: { 'Content-Type': 'application/json' },
   //   body: JSON.stringify(errorInfo)
   // });
   console.log('[Portfolio] 📤 Erreur signalée au service de monitoring');
 }

 storeErrorLocally(errorInfo) {
   try {
     const errors = JSON.parse(localStorage.getItem('portfolio_errors') || '[]');
     errors.push(errorInfo);
     
     // Garder seulement les 50 dernières erreurs
     if (errors.length > 50) {
       errors.splice(0, errors.length - 50);
     }
     
     localStorage.setItem('portfolio_errors', JSON.stringify(errors));
   } catch (storageError) {
     console.warn('[Portfolio] ⚠️ Impossible de stocker l\'erreur localement');
   }
 }

 /* =================================================================
    ANIMATIONS ET EFFETS VISUELS AVANCÉS
    ================================================================= */

 triggerPageAnimations() {
   if (this.state.prefersReducedMotion) {
     this.enableImmediateDisplay();
     return;
   }
   
   this.setupIntersectionAnimations();
   this.setupScrollTriggeredAnimations();
   this.setupHoverEffects();
 }

 enableImmediateDisplay() {
   const animatedElements = document.querySelectorAll('[data-animate]');
   animatedElements.forEach(element => {
     element.classList.add('animate', 'no-animation');
     element.style.opacity = '1';
     element.style.transform = 'none';
   });
 }

 setupIntersectionAnimations() {
   if (!this.capabilities.intersectionObserver) return;
   
   const animationObserver = new IntersectionObserver((entries) => {
     entries.forEach((entry, index) => {
       if (entry.isIntersecting) {
         const element = entry.target;
         const animationType = element.dataset.animate || 'fadeIn';
         const delay = parseInt(element.dataset.delay || '0');
         
         setTimeout(() => {
           element.classList.add('animate', animationType);
           element.style.setProperty('--animation-delay', `${index * 100}ms`);
         }, delay);
         
         animationObserver.unobserve(element);
       }
     });
   }, { 
     threshold: 0.1,
     rootMargin: '0px 0px -50px 0px'
   });
   
   const animatedElements = document.querySelectorAll('[data-animate]');
   animatedElements.forEach(el => {
     el.style.opacity = '0';
     animationObserver.observe(el);
   });
   
   this.observers.set('animations', animationObserver);
 }

 setupScrollTriggeredAnimations() {
   const scrollElements = document.querySelectorAll('[data-scroll-animation]');
   if (scrollElements.length === 0) return;
   
   let ticking = false;
   
   const checkScrollAnimations = () => {
     const scrollY = window.scrollY;
     const viewportHeight = window.innerHeight;
     
     scrollElements.forEach(element => {
       const elementTop = element.offsetTop;
       const elementHeight = element.offsetHeight;
       const triggerPoint = elementTop - viewportHeight + (elementHeight * 0.2);
       
       if (scrollY > triggerPoint) {
         const animationType = element.dataset.scrollAnimation;
         element.classList.add('scroll-animated', animationType);
       }
     });
     
     ticking = false;
   };
   
   this.addEventListener(window, 'scroll', () => {
     if (!ticking) {
       requestAnimationFrame(checkScrollAnimations);
       ticking = true;
     }
   }, { passive: true });
 }

 setupHoverEffects() {
   const hoverElements = document.querySelectorAll('[data-hover-effect]');
   
   hoverElements.forEach(element => {
     this.addEventListener(element, 'mouseenter', () => {
       const effect = element.dataset.hoverEffect;
       element.classList.add(`hover-${effect}`);
     });
     
     this.addEventListener(element, 'mouseleave', () => {
       const effect = element.dataset.hoverEffect;
       element.classList.remove(`hover-${effect}`);
     });
   });
 }

 /* =================================================================
    UTILITAIRES AVANCÉS
    ================================================================= */

 addEventListener(element, event, handler, options = {}) {
   if (!element) {
     console.warn('[Portfolio] ⚠️ Tentative d\'ajout d\'event listener sur élément null');
     return;
   }
   
   // Options par défaut améliorées
   const defaultOptions = {
     passive: this.isPassiveEvent(event),
     capture: false
   };
   
   const finalOptions = { ...defaultOptions, ...options };
   
   try {
     element.addEventListener(event, handler, finalOptions);
     
     // Stockage pour cleanup
     const key = `${element.tagName || 'window'}-${event}-${Date.now()}-${Math.random()}`;
     this.eventListeners.set(key, { element, event, handler, options: finalOptions });
     
   } catch (error) {
     console.error('[Portfolio] ❌ Erreur ajout event listener:', error);
   }
 }

 isPassiveEvent(eventType) {
   const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];
   return passiveEvents.includes(eventType);
 }

 debounce(func, wait, immediate = false) {
   let timeout;
   return function executedFunction(...args) {
     const later = () => {
       timeout = null;
       if (!immediate) func.apply(this, args);
     };
     
     const callNow = immediate && !timeout;
     clearTimeout(timeout);
     timeout = setTimeout(later, wait);
     
     if (callNow) func.apply(this, args);
   };
 }

 throttle(func, limit) {
   let inThrottle;
   return function(...args) {
     if (!inThrottle) {
       func.apply(this, args);
       inThrottle = true;
       setTimeout(() => inThrottle = false, limit);
     }
   };
 }

 wait(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }

 // Utilitaire pour vérifier si un élément est visible
 isElementVisible(element) {
   const rect = element.getBoundingClientRect();
   return (
     rect.top >= 0 &&
     rect.left >= 0 &&
     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
     rect.right <= (window.innerWidth || document.documentElement.clientWidth)
   );
 }

 // Utilitaire pour obtenir les informations de l'appareil
 getDeviceInfo() {
   return {
     type: this.state.deviceType,
     screenWidth: window.screen.width,
     screenHeight: window.screen.height,
     viewportWidth: window.innerWidth,
     viewportHeight: window.innerHeight,
     pixelRatio: window.devicePixelRatio,
     orientation: screen.orientation?.type || 'unknown',
     touchSupport: this.capabilities.touch,
     connection: navigator.connection?.effectiveType || 'unknown'
   };
 }

 // Utilitaire pour générer des identifiants uniques
 generateUniqueId(prefix = 'id') {
   return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
 }

 /* =================================================================
    MÉTHODES DE COMPATIBILITÉ ET FALLBACKS
    ================================================================= */

 setActiveNavigation() {
   this.setupNavigationHighlight();
 }

 handlePageLoad() {
   console.log('[Portfolio] 🎉 Page entièrement chargée');
   
   // Finalisation du chargement avec délai intelligent
   const loadDelay = this.calculateOptimalLoadDelay();
   
   setTimeout(() => {
     this.hideLoader();
   }, loadDelay);
   
   // Analytics de base
   this.trackPageLoad();
 }

 calculateOptimalLoadDelay() {
   // Délai adaptatif basé sur la performance
   const baseDelay = this.config.loaderDuration;
   const connectionSpeed = navigator.connection?.effectiveType;
   
   switch (connectionSpeed) {
     case 'slow-2g':
     case '2g':
       return baseDelay + 500;
     case '3g':
       return baseDelay + 200;
     case '4g':
     default:
       return baseDelay;
   }
 }

 trackPageLoad() {
   if (this.capabilities.performanceAPI) {
     const perfData = performance.getEntriesByType('navigation')[0];
     const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
     
     console.log(`[Portfolio] ⏱️ Page chargée en ${loadTime}ms`);
     
     // Ici on pourrait envoyer à Google Analytics
     if (typeof gtag !== 'undefined') {
       gtag('event', 'page_load_time', {
         value: loadTime,
         custom_parameter: this.state.deviceType
       });
     }
   }
 }

 /* =================================================================
    NETTOYAGE ET DESTRUCTION OPTIMISÉS
    ================================================================= */

 destroy() {
   console.log('[Portfolio] 🧹 Début du nettoyage...');
   
   // Nettoyage des event listeners
   let cleanedListeners = 0;
   this.eventListeners.forEach(({ element, event, handler, options }, key) => {
     try {
       element.removeEventListener(event, handler, options);
       cleanedListeners++;
     } catch (error) {
       console.warn(`[Portfolio] ⚠️ Erreur nettoyage listener ${key}:`, error);
     }
   });
   this.eventListeners.clear();
   
   // Nettoyage des observers
   let cleanedObservers = 0;
   this.observers.forEach((observer, key) => {
     try {
       if (observer && typeof observer.disconnect === 'function') {
         observer.disconnect();
         cleanedObservers++;
       }
     } catch (error) {
       console.warn(`[Portfolio] ⚠️ Erreur nettoyage observer ${key}:`, error);
     }
   });
   this.observers.clear();
   
   // Nettoyage des timers
   let cleanedTimers = 0;
   this.timers.forEach((timer, key) => {
     try {
       clearTimeout(timer);
       clearInterval(timer);
       cleanedTimers++;
     } catch (error) {
       console.warn(`[Portfolio] ⚠️ Erreur nettoyage timer ${key}:`, error);
     }
   });
   this.timers.clear();
   
   // Nettoyage des animations
   this.animations.forEach(animation => {
     try {
       if (animation && typeof animation.cancel === 'function') {
         animation.cancel();
       }
     } catch (error) {
       console.warn('[Portfolio] ⚠️ Erreur nettoyage animation:', error);
     }
   });
   this.animations.clear();
   
   // Restauration de l'état du body
   if (this.elements.body) {
     this.elements.body.classList.remove('mobile-menu-open', 'page-loaded', 'is-tabbing');
     this.elements.body.style.overflow = '';
     this.elements.body.style.position = '';
     this.elements.body.style.width = '';
     this.elements.body.style.top = '';
   }
   
   // Nettoyage final
   this.state = {};
   this.elements = {};
   this.config = {};
   
   console.log(`[Portfolio] ✅ Nettoyage terminé: ${cleanedListeners} listeners, ${cleanedObservers} observers, ${cleanedTimers} timers`);
 }

 // Méthode pour un nettoyage partiel (utile pour les SPA)
 partialCleanup() {
   // Nettoyer seulement les éléments non critiques
   this.observers.forEach((observer, key) => {
     if (key !== 'performanceMetrics' && key !== 'scrollSpy') {
       observer.disconnect();
       this.observers.delete(key);
     }
   });
 }
}

/* =================================================================
  INITIALISATION GLOBALE RENFORCÉE
  ================================================================= */

// Variables globales
let portfolioManager;
let initializationAttempts = 0;
const maxInitializationAttempts = 3;

// Fonction d'initialisation avec retry
async function initializePortfolio() {
 initializationAttempts++;
 
 try {
   portfolioManager = new PortfolioManager();
   console.log('[Portfolio] 🚀 Gestionnaire initialisé avec succès');
 } catch (error) {
   console.error(`[Portfolio] ❌ Échec d'initialisation (tentative ${initializationAttempts}):`, error);
   
   if (initializationAttempts < maxInitializationAttempts) {
     console.log(`[Portfolio] 🔄 Nouvelle tentative dans 1 seconde...`);
     setTimeout(initializePortfolio, 1000);
   } else {
     console.error('[Portfolio] ❌ Impossible d\'initialiser après plusieurs tentatives');
     // Fallback minimal
     initializeFallbackMode();
   }
 }
}

// Mode de fallback minimal
function initializeFallbackMode() {
 console.log('[Portfolio] 🆘 Activation du mode de fallback');
 
 // Menu mobile basique
 const hamburger = document.querySelector('.hamburger-menu');
 const nav = document.querySelector('.main-nav');
 
 if (hamburger && nav) {
   hamburger.addEventListener('click', (e) => {
     e.preventDefault();
     nav.classList.toggle('menu-mobile-ouvert');
     hamburger.classList.toggle('menu-ouvert');
   });
 }
 
 // Masquer le loader si présent
 const loader = document.getElementById('page-loader');
 if (loader) {
   setTimeout(() => {
     loader.style.opacity = '0';
     setTimeout(() => loader.remove(), 500);
   }, 2000);
 }
}

// Initialisation avec détection d'état
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
 // DOM déjà chargé
 initializePortfolio();
}

// Nettoyage avant déchargement
window.addEventListener('beforeunload', () => {
 if (portfolioManager && typeof portfolioManager.destroy === 'function') {
   portfolioManager.destroy();
 }
});

// Nettoyage sur changement de visibilité (pour les SPA)
document.addEventListener('visibilitychange', () => {
 if (document.hidden && portfolioManager) {
   portfolioManager.partialCleanup();
 }
});

// Export pour usage externe
if (typeof module !== 'undefined' && module.exports) {
 module.exports = PortfolioManager;
}

// Exposition globale pour debug
if (typeof window !== 'undefined') {
 window.PortfolioManager = PortfolioManager;
 window.portfolioManager = portfolioManager;
}

/* =================================================================
  POLYFILLS ET COMPATIBILITY
  ================================================================= */

// Polyfill pour IntersectionObserver
if (!('IntersectionObserver' in window)) {
 console.warn('[Portfolio] ⚠️ IntersectionObserver non supporté');
 // Charger un polyfill en production
 if (typeof importScripts !== 'undefined') {
   // Web Worker context
 } else if (typeof window !== 'undefined') {
   // Browser context
   const script = document.createElement('script');
   script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
   document.head.appendChild(script);
 }
}

// Polyfill pour requestAnimationFrame
if (!window.requestAnimationFrame) {
 window.requestAnimationFrame = function(callback) {
   return setTimeout(callback, 1000 / 60);
 };
 window.cancelAnimationFrame = function(id) {
   clearTimeout(id);
 };
}

// Polyfill pour Element.matches
if (!Element.prototype.matches) {
 Element.prototype.matches = Element.prototype.msMatchesSelector || 
                             Element.prototype.webkitMatchesSelector;
}

// Polyfill pour Element.closest
if (!Element.prototype.closest) {
 Element.prototype.closest = function(selector) {
   let element = this;
   while (element && element.nodeType === 1) {
     if (element.matches(selector)) {
       return element;
     }
     element = element.parentElement;
   }
   return null;
 };
}

// Polyfill pour Object.assign (IE)
if (typeof Object.assign !== 'function') {
 Object.assign = function(target) {
   if (target == null) {
     throw new TypeError('Cannot convert undefined or null to object');
   }
   const to = Object(target);
   for (let index = 1; index < arguments.length; index++) {
     const nextSource = arguments[index];
     if (nextSource != null) {
       for (const nextKey in nextSource) {
         if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
           to[nextKey] = nextSource[nextKey];
         }
       }
     }
   }
   return to;
 };
}

// Support pour les anciennes versions d'iOS
if (typeof window !== 'undefined' && window.navigator && /iPhone|iPad|iPod/.test(window.navigator.userAgent)) {
 document.addEventListener('touchstart', function() {}, {passive: true});
}

console.log('[Portfolio] 💫 JavaScript ultra-optimisé initialisé avec succès');