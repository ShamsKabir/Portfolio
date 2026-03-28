export function initClock() {
  let timeOffset = 0;

  // Sync time with API
  async function syncTime() {
    try {
      const response = await fetch(
        "https://worldtimeapi.org/api/timezone/Asia/Dhaka",
      );
      if (!response.ok) throw new Error("Time sync failed");

      const data = await response.json();
      timeOffset = new Date(data.datetime).getTime() - Date.now();
    } catch (error) {
      console.warn("Time sync failed, using local time:", error.message);
      timeOffset = 0;
    }
  }

  // Update clock display
  function updateClock() {
    const clockTime = document.getElementById("clock-time");
    const clockTimeMobile = document.getElementById("clock-time-mobile");
    const dayElement = document.getElementById("clock-day");
    const dayElementMobile = document.getElementById("clock-day-mobile");

    const now = new Date(Date.now() + timeOffset);

    // Format time (12-hour with blinking colon)
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const timeHTML = `${hours.toString().padStart(2, "0")}<span class="clock-colon">:</span>${minutes} ${ampm}`;

    // Update displays
    if (clockTime) clockTime.innerHTML = timeHTML;
    if (clockTimeMobile) clockTimeMobile.innerHTML = timeHTML;

    // Update day
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayName = dayNames[now.getDay()];

    if (dayElement) dayElement.textContent = dayName;
    if (dayElementMobile) dayElementMobile.textContent = dayName;
  }

  syncTime().then(() => {
    updateClock();
    setInterval(updateClock, 1000);
  });
}