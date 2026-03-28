export function initPerformanceLogging() {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    // Log performance metrics (development only)
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];
        if (!perfData) return;

        console.log(
          "Page load time:",
          perfData.loadEventEnd - perfData.loadEventStart,
          "ms",
        );
        console.log(
          "DOM ready time:",
          perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          "ms",
        );
      }, 0);
    });
  }
}