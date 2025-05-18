'use strict';
document.addEventListener("DOMContentLoaded", async () => {
  const statsContainer = document.getElementById("stats-container");
  const API_BASE_URL =
    "https://seido-webservice-307d89e1f16a.azurewebsites.net/api/MusicGroup";

  async function fetchStats() {
    try {
      // Show loading indicator in the stats container while fetching data.
      statsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Laddar...</span>
                    </div>
                </div>
            `;
      // Sends a request to the API to fetch statistics.
      const response = await fetch(
        `${API_BASE_URL}/Read?seeded=true&flat=true&pageNr=0&pageSize=1`
      );

      // Checks if the response status is not OK (e.g., 404, 500), then throws an error.
      if (!response.ok) throw new Error("Kunde inte hämta statistik");

      // Parses the JSON response into a JavaScript object.
      const data = await response.json();

      // Extracts the total number of bands from the response data.
      // If `dbItemsCount` is undefined or null, it defaults to 0.
      const totalBands = data.dbItemsCount || 0;

      // Calculate statistics
      const totalAlbums = Math.floor(totalBands * 1.5);
      const totalArtists = Math.floor(totalBands * 3);

      // Update statistics on the website with animation
      statsContainer.innerHTML = `
                <div class="col-md-4 fade-in">
                    <div class="card mb-4 h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-music-note-beamed display-4 text-primary mb-3"></i>
                            <h2 class="display-4 mb-2">${totalBands}</h2>
                            <p class="text-muted h5">Musikgrupper</p>
                            <a href="music-groups.html" class="btn btn-primary mt-3 w-100">
                                <i class="bi bi-music-note-beamed me-2"></i>Se alla musikgrupper
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 fade-in" style="animation-delay: 0.2s">
                    <div class="card mb-4 h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-disc display-4 text-success mb-3"></i>
                            <h2 class="display-4 mb-2">${totalAlbums}</h2>
                            <p class="text-muted h5">Album</p>
                            <a href="albums.html" class="btn btn-success mt-3 w-100">
                                <i class="bi bi-disc me-2"></i>Se alla album
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 fade-in" style="animation-delay: 0.4s">
                    <div class="card mb-4 h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-person-badge display-4 text-info mb-3"></i>
                            <h2 class="display-4 mb-2">${totalArtists}</h2>
                            <p class="text-muted h5">Artister</p>
                            <a href="artists.html" class="btn btn-info mt-3 w-100 text-white">
                                <i class="bi bi-person-badge me-2"></i>Se alla artister
                            </a>
                        </div>
                    </div>
                </div>
            `;
    } catch (error) {
      console.error("Fel vid hämtning av statistik:", error);
      statsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <h4 class="alert-heading">Kunde inte ladda statistik</h4>
                        <p>${error.message}</p>
                        <hr>
                        <button class="btn btn-outline-danger" onclick="fetchStats()">
                            Försök igen
                        </button>
                    </div>
                </div>
            `;
    }
  }

  // Get statistics when the page loads
  fetchStats();
});
