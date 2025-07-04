// Smooth scroll avec Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Curseur personnalisé
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Effet hover sur les éléments cliquables
const clickableElements = document.querySelectorAll('a, button, .cta-devis');

clickableElements.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
  });
});

// Ripple effect sur tous les boutons .cta-devis
document.querySelectorAll('.cta-devis').forEach(cta => {
  const ripple = cta.querySelector('.ripple');

  cta.addEventListener('mouseenter', (e) => {
    const rect = cta.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.opacity = '1';

    ripple.offsetWidth; // reset animation

    const distTopLeft = Math.hypot(x, y);
    const distTopRight = Math.hypot(rect.width - x, y);
    const distBottomLeft = Math.hypot(x, rect.height - y);
    const distBottomRight = Math.hypot(rect.width - x, rect.height - y);
    const distMidTop = y;
    const distMidBottom = rect.height - y;
    const distMidLeft = x;
    const distMidRight = rect.width - x;

    const maxDist = Math.max(
      distTopLeft, distTopRight, distBottomLeft, distBottomRight,
      distMidTop, distMidBottom, distMidLeft, distMidRight
    );

    const size = (maxDist + 20) * 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
  });

  cta.addEventListener('mouseleave', () => {
    ripple.style.opacity = '0';
    ripple.style.width = '0';
    ripple.style.height = '0';
  });

  ripple.addEventListener('transitionend', () => {
    if (ripple.style.opacity === '0') {
      ripple.style.left = '50%';
      ripple.style.top = '50%';
    }
  });
});

// Gestion responsive du curseur
function handleCursorResponsive() {
  if (window.innerWidth >= 930) {
    document.body.classList.add('custom-cursor');
    cursor.style.display = 'block';
  } else {
    document.body.classList.remove('custom-cursor');
    cursor.style.display = 'none';
  }
}

// Initial check
handleCursorResponsive();

// Re-check on resize
window.addEventListener('resize', handleCursorResponsive);

// Menu burger
const burger = document.querySelector('.burger-icon');
const burgerMenu = document.querySelector('.burger-menu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  burgerMenu.classList.toggle('active');
});

// Fermer le menu en cliquant à l'extérieur
document.addEventListener('click', (event) => {
  const isClickInsideBurger = burger.contains(event.target);
  const isClickInsideMenu = burgerMenu.contains(event.target);

  if (!isClickInsideBurger && !isClickInsideMenu && burgerMenu.classList.contains('active')) {
    burgerMenu.classList.remove('active');
    burger.classList.remove('active');
  }
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('.burger-menu-links a').forEach(link => {
  link.addEventListener('click', () => {
    burgerMenu.classList.remove('active');
    burger.classList.remove('active');
  });
});

// Carousel
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.carousel-indicator');
const track = document.querySelector('.carousel-track');
const carouselWrapper = document.querySelector('.carousel-wrapper');
let autoSlideInterval;
let isAutoSliding = true;

function updateCarousel() {
  const translateX = -currentSlideIndex * 100;
  track.style.transform = `translateX(${translateX}%)`;
  
  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlideIndex);
  });
}

function changeSlide(direction) {
  currentSlideIndex += direction;
  
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  
  updateCarousel();
}

function currentSlide(index) {
  currentSlideIndex = index - 1;
  updateCarousel();
}

function startAutoSlide() {
  if (isAutoSliding) {
    autoSlideInterval = setInterval(() => {
      changeSlide(1);
    }, 5000);
  }
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function resumeAutoSlide() {
  if (isAutoSliding) {
    startAutoSlide();
  }
}

// Event listeners pour pause/resume
carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
carouselWrapper.addEventListener('mouseleave', resumeAutoSlide);

// Démarrer le carrousel automatique
startAutoSlide();

// Support du clavier
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (e.key === 'ArrowRight') {
    changeSlide(1);
  }
});

// Support tactile pour mobile
let touchStartX = 0;
let touchEndX = 0;

carouselWrapper.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  stopAutoSlide();
});

carouselWrapper.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  resumeAutoSlide();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      changeSlide(1); // Swipe left - next slide
    } else {
      changeSlide(-1); // Swipe right - previous slide
    }
  }
}

// Fonctions globales pour les boutons onclick du carousel
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;