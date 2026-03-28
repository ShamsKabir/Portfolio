export function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements that should animate in on scroll
  const animateElements = document.querySelectorAll(".bento-card, .education-entry");
  animateElements.forEach((el) => observer.observe(el));
}