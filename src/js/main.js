import { initTerminal } from "./terminal.js";
import { initClock } from "./clock.js";
import { initGitHubStats } from "./githubStats.js";
import { initCustomCursor, initBackgroundAnimation } from "./cursorAndBackground.js";
import { initMobileMenu } from "./mobileMenu.js";
import { initFormValidation } from "./contactForm.js";
import { initScrollAnimations } from "./scrollAnimations.js";
import { initPerformanceLogging } from "./performanceLogging.js";

document.addEventListener("DOMContentLoaded", () => {
  initTerminal();
  initClock();
  initCustomCursor();
  initBackgroundAnimation();
  initMobileMenu();
  initGitHubStats();
  initFormValidation();
  initScrollAnimations();
  initPerformanceLogging();
});