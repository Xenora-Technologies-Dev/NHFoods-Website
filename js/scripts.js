/**
 * NH Foods Website Scripts
 * Handles page loader, navigation, scroll animations, and form interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initPageLoader();
  initNavigation();
  initScrollAnimations();
  initHeaderScroll();
  initBackToTop();
  initFAQAccordion();
  initContactForm();
});

/**
 * Page Loader
 * Shows loading animation and fades out when page is ready
 */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Hide loader when page is fully loaded
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.classList.add('hidden');
      // Enable body scroll
      document.body.style.overflow = '';
    }, 500);
  });

  // Fallback: hide loader after 3 seconds max
  setTimeout(function() {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);
}

/**
 * Navigation Toggle
 * Handles mobile menu open/close
 */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', function() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Scroll Animations
 * Animates elements into view as user scrolls
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (!animatedElements.length) return;

  // Disable heavy scroll animations for users who prefer reduced motion or on small devices
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 420) {
    animatedElements.forEach(function(el) {
      el.classList.add('animated');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function(element) {
    observer.observe(element);
  });
}

/**
 * Header Scroll Effect
 * Adds shadow and background to header on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show header on scroll direction (optional)
    // if (currentScroll > lastScroll && currentScroll > 200) {
    //   header.classList.add('header-hidden');
    // } else {
    //   header.classList.remove('header-hidden');
    // }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', throttle(updateHeader, 10));
  updateHeader(); // Initial check
}

/**
 * Back to Top Button
 * Shows/hides button and handles smooth scroll to top
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  const scrollThreshold = 300;

  function toggleButton() {
    if (window.pageYOffset > scrollThreshold) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', throttle(toggleButton, 100));

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * FAQ Accordion
 * Handles expand/collapse of FAQ items
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;

    question.addEventListener('click', function() {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Close all other items
      faqItems.forEach(function(otherItem) {
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherQuestion && otherAnswer && otherItem !== item) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      question.setAttribute('aria-expanded', !isExpanded);
      item.classList.toggle('active');
    });
  });
}

/**
 * Contact Form Handler
 * Validates and handles form submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate form submission (replace with actual endpoint)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(function() {
      // Since this is static hosting, we'll create a mailto link as fallback
      const subject = encodeURIComponent(`[NH Foods Inquiry] ${data.subject}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Company: ${data.company || 'N/A'}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'N/A'}\n\n` +
        `Message:\n${data.message}`
      );
      
      // Open email client
      window.location.href = `mailto:haneefa@nhfoodsglobal.com?subject=${subject}&body=${body}`;
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success message
      showNotification('Opening your email client...', 'success');
      
      // Reset form
      form.reset();
    }, 1000);
  });
}

/**
 * Show Notification
 * Displays a toast notification
 */
function showNotification(message, type) {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close" aria-label="Close notification">&times;</button>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(function() {
    notification.classList.add('show');
  }, 10);

  // Close button handler
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', function() {
    notification.classList.remove('show');
    setTimeout(function() {
      notification.remove();
    }, 300);
  });

  // Auto close after 5 seconds
  setTimeout(function() {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(function() {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

/**
 * Email Validation Helper
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Throttle Helper
 * Limits how often a function can be called
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
