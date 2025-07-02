const lenis = new Lenis({
  autoRaf: true,
});

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


const cta = document.querySelector('.cta-devis');
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

  // Calcul des distances aux coins et aux milieux des côtés
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

// Optionnel : remise à zéro complète après transition (évite un ripple visible hors bouton)
ripple.addEventListener('transitionend', () => {
  if (ripple.style.opacity === '0') {
    ripple.style.left = '50%';
    ripple.style.top = '50%';
  }
});

