'use strict';
import MusicService from "./music-service.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchLoading = document.getElementById("searchLoading");
  const service = new MusicService(
    "https://seido-webservice-307d89e1f16a.azurewebsites.net/api"
  );
  let searchTimeout;

  function getTypeIcon(type) {
    if (type === "musicgroup")
      return '<i class="bi bi-music-note-beamed text-primary"></i>';
    if (type === "album") return '<i class="bi bi-disc text-success"></i>';
    if (type === "artist")
      return '<i class="bi bi-person-badge text-info"></i>';
    return "";
  }

  async function searchBands(query) {
    if (!query.trim()) {
      searchResults.innerHTML = "";
      return;
    }

    try {
      searchLoading.style.display = "block";
      searchResults.innerHTML = "";

      const data = await service.getMusicGroups(0, 1000);
      const filteredBands = data.pageItems
        .filter((band) => band.name.toLowerCase().includes(query.toLowerCase()))
        .map((band) => ({
          ...band,
          type: band.type || "musicgroup",
        }));

      if (filteredBands.length === 0) {
        searchResults.innerHTML = `
          <div class="col-12 text-center">
            <p class="text-muted">Inga resultat hittades för "${query}"</p>
          </div>
        `;
        return;
      }

      const resultsHTML = `
        <div class="col-12 mb-3">
          <p class="text-muted">Hittade ${filteredBands.length} musikgrupper som matchar "${query}"</p>
        </div>
        ${filteredBands
          .map(
            (band) => `
          <div class="col-12 mb-2">
            <a href="details.html?id=${band.musicGroupId}" class="text-decoration-none">
              <div class="d-flex align-items-center border rounded p-2 bg-white shadow-sm" style="min-height:56px;">
                ${getTypeIcon(band.type)}
                <span class="ms-3 fs-5">${band.name}</span>
              </div>
            </a>
          </div>
        `
          )
          .join("")}
      `;
      
      searchResults.innerHTML = resultsHTML;
    } catch (error) {
      console.error("Sökfel:", error);
      searchResults.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            <h4 class="alert-heading">Ett fel uppstod vid sökningen!</h4>
            <p>${error.message || "Kunde inte slutföra sökningen. Kontrollera din internetanslutning och försök igen."}</p>
          </div>
        </div>
      `;
    } finally {
      searchLoading.style.display = "none";
    }
  }

  // Event listener with debounce
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchBands(e.target.value);
    }, 300);
  });
});
