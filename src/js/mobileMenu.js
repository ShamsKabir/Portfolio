export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!mobileMenuBtn || !mobileMenu) return;

  const toggleMobileMenu = () => {
    const isOpen = mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open");
    mobileMenuBtn.classList.toggle("active");

    // Update ARIA attributes
    mobileMenuBtn.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.setAttribute("aria-hidden", String(isOpen));
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove("open");
    mobileMenuBtn.classList.remove("active");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  };

  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close when tapping/clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // Close on mobile link click (replaces the old inline onclick handler)
  mobileMenu.addEventListener("click", (e) => {
    const clicked = e.target.closest("[data-close-mobile-menu]");
    if (clicked) closeMobileMenu();
  });
}