export function initGitHubStats() {
  const repoCountEl = document.getElementById("repoCount");
  const followersCountEl = document.getElementById("followersCount");
  const starsCountEl = document.getElementById("starsCount");

  if (!repoCountEl || !followersCountEl || !starsCountEl) return;

  // Set loading state
  [repoCountEl, followersCountEl, starsCountEl].forEach((el) => {
    el.textContent = "...";
    el.classList.add("loading");
  });

  (async () => {
    try {
      // Fetch user data
      const userResponse = await fetch("https://api.github.com/users/ShamsKabir", {
        headers: {
          "User-Agent": "ShamsKabir-Portfolio",
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!userResponse.ok) {
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      repoCountEl.textContent = userData.public_repos;
      followersCountEl.textContent = userData.followers;

      // Fetch total stars (with pagination)
      let stars = 0;
      let page = 1;
      const maxPages = 5; // Limit to prevent infinite loops

      while (page <= maxPages) {
        const reposResponse = await fetch(
          `https://api.github.com/users/ShamsKabir/repos?page=${page}&per_page=100`,
          {
            headers: {
              "User-Agent": "ShamsKabir-Portfolio",
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!reposResponse.ok) break;

        const repos = await reposResponse.json();
        if (repos.length === 0) break;

        stars += repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        page++;
      }

      starsCountEl.textContent = stars;
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      repoCountEl.textContent = "N/A";
      followersCountEl.textContent = "N/A";
      starsCountEl.textContent = "N/A";
    } finally {
      [repoCountEl, followersCountEl, starsCountEl].forEach((el) => {
        el.classList.remove("loading");
      });
    }
  })();
}