'use strict';
import MusicService from "./music-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE_URL =
    "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
  const service = new MusicService(API_BASE_URL);
  const loadingIndicator = document.getElementById("loading-indicator");
  const errorContainer = document.getElementById("error-container");
  const bandTitle = document.getElementById("band-title");
  const bandInfo = document.getElementById("band-info");
  const bandNameBreadcrumb = document.getElementById("band-name");

  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bandId = urlParams.get("id");
  console.log("URL Parametrar:", Object.fromEntries(urlParams.entries()));
  console.log("Band ID från URL:", bandId, "Typ:", typeof bandId);

  if (!bandId) {
    showError("Ingen musikgrupp vald.");
    showLoading(false);
    return;
  }

  showLoading(true);
  hideError();

  try {
    // Get ALL bands on the first page
    const data = await service.getMusicGroups(0, 1000);
    const band = data.pageItems.find(
      (b) => String(b.musicGroupId) === String(bandId)
    );

    if (!band) {
      throw new Error(`Ingen musikgrupp hittades med ID: ${bandId}`);
    }

    // Update the page with the band's information
    bandTitle.textContent = band.name || "Okänt namn";
    bandNameBreadcrumb.textContent = band.name || "Detaljer";

    bandInfo.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>ID:</strong> ${
                          band.musicGroupId || "-"
                        }</li>
                        <li class="list-group-item"><strong>Namn:</strong> ${
                          band.name || "-"
                        }</li>
                        <li class="list-group-item"><strong>Genre:</strong> ${
                          band.strGenre || "-"
                        }</li>
                        <li class="list-group-item"><strong>Startår:</strong> ${
                          band.establishedYear || "-"
                        }</li>
                        <li class="list-group-item"><strong>Seeded:</strong> ${
                          band.seeded ? "Ja" : "Nej"
                        }</li>
                    </ul>
                </div>
            </div>
        `;
  } catch (error) {
      console.error("Detaljerad felinformation:", error);
      showError(`Ett fel uppstod: ${error.message}`);
  } finally {
      showLoading(false);
  }

  function showLoading(show) {
    loadingIndicator.style.display = show ? "block" : "none";
  }

  function showError(message) {
    errorContainer.innerHTML = `
            <div class="alert alert-danger">
                <h4 class="alert-heading">Ett fel uppstod!</h4>
                <p>${message}</p>
                <hr>
                <p class="mb-0">Kontrollera konsolen (F12) för mer detaljerad information.</p>
            </div>
        `;
    errorContainer.style.display = "block";
  }

  function hideError() {
    errorContainer.style.display = "none";
  }
});
