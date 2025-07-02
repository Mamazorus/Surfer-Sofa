const lenis = new Lenis({
  autoRaf: true,
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault(); // Empêche le comportement par défaut du lien

      // Récupère l'élément cible (section)
      const targetId = this.getAttribute('href').substring(1); // Retire le "#"
      const targetElement = document.getElementById(targetId);

      // Fait défiler la page de manière fluide vers l'élément cible
      if (targetElement) {
          targetElement.scrollIntoView({
              behavior: 'smooth', // Rend le scroll fluide
              block: 'start' // Aligne la section en haut de l'écran
          });
      }
  });
});