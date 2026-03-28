export function initTerminal() {
  const terminalLines = [
    { text: "$ whoami", color: "#cbd5e1" },
    {
      text: "→ Shams Kabir | Software Engineering Undergrad",
      color: "#94a3b8",
    },
    { text: "$ npm run skills", color: "#f8fafc" },
    { text: "✦ [C, C++, SQL, HTML, CSS]", color: "#8892b0" },
    { text: "$ git status", color: "#94a3b8" },
    { text: "▸ Learning. Building. Growing.", color: "#e2e8f0" },
  ];

  let isTyping = false;

  async function runTerminal() {
    const container = document.getElementById("terminal");
    if (!container) return;

    // Prevent multiple instances
    if (isTyping) return;
    isTyping = true;

    // Reset terminal
    container.innerHTML = "";

    for (const line of terminalLines) {
      const div = document.createElement("div");
      div.style.color = line.color;
      container.appendChild(div);

      // Typewriter effect
      for (const char of line.text) {
        div.textContent += char;
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      // Pause between lines
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Reset and loop
    isTyping = false;
    await new Promise((resolve) => setTimeout(runTerminal, 1000));
  }

  runTerminal();
}