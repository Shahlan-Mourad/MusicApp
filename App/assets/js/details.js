'use strict';

import MusicService from "./music-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE_URL = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
  const service = new MusicService(API_BASE_URL);
  
  // DOM-element
  const loadingIndicator = document.getElementById("loading-indicator");
  const errorContainer = document.getElementById("error-container");
  const bandTitle = document.getElementById("band-title");
  const bandInfo = document.getElementById("band-info");
  const bandNameBreadcrumb = document.getElementById("band-name");
  const artistsSection = document.getElementById("artists-section");
  const albumsSection = document.getElementById("albums-section");
  const artistsList = document.getElementById("artists-list");
  const albumsList = document.getElementById("albums-list");

  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const bandId = urlParams.get("id");

  if (!bandId) {
    showError("Ingen musikgrupp vald.");
    showLoading(false);
    return;
  }

  showLoading(true);
  hideError();

  try {
    const band = await service.getMusicGroupById(bandId);

    // Update the page title and breadcrumb
    const bandName = band.name || "Okänt namn";
    bandTitle.textContent = bandName;
    bandNameBreadcrumb.textContent = bandName;

    // Create HTML for basic information
    let html = `
      <div class="card mb-4">
        <div class="card-body">
          <h2 class="card-title mb-4">${bandName}</h2>
          <div class="row">
            <div class="col-md-6">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <strong><i class="bi bi-music-note-beamed text-primary me-2"></i>Genre:</strong> 
                  ${band.strGenre || "-"}
                </li>
                <li class="list-group-item">
                  <strong><i class="bi bi-calendar-event text-primary me-2"></i>Etableringsår:</strong> 
                  ${band.establishedYear || "-"}
                </li>
                <li class="list-group-item">
                  <strong><i class="bi bi-info-circle text-primary me-2"></i>Status:</strong> 
                  ${band.seeded ? "Seeded" : "Unseeded"}
                </li>
                <li class="list-group-item">
                  <strong><i class="bi bi-person-badge text-info me-2"></i>Antal artister:</strong> 
                  ${band.artists ? band.artists.length : 0}
                </li>
                <li class="list-group-item">
                  <strong><i class="bi bi-disc text-success me-2"></i>Antal album:</strong> 
                  ${band.albums ? band.albums.length : 0}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>`;

    bandInfo.innerHTML = html;

    // Update artists
    if (band.artists && band.artists.length > 0) {
      artistsList.innerHTML = band.artists.map(artist => `
        <div class="list-group-item">
          <div class="d-flex align-items-center">
            <i class="bi bi-person text-info me-2"></i>
            <span>${artist.firstName} ${artist.lastName}</span>
          </div>
        </div>
      `).join('');
    } else {
      artistsList.innerHTML = '<div class="list-group-item">Inga artister hittades för denna grupp.</div>';
    }

    // Update albums
    if (band.albums && band.albums.length > 0) {
      albumsList.innerHTML = band.albums.map(album => `
        <div class="list-group-item">
          <div class="d-flex align-items-center">
            <i class="bi bi-disc text-success me-2"></i>
            <span>${album.name}</span>
            ${album.releaseYear ? `<span class="ms-2 text-muted">(${album.releaseYear})</span>` : ''}
          </div>
        </div>
      `).join('');
    } else {
      albumsList.innerHTML = '<div class="list-group-item">Inga album hittades för denna grupp.</div>';
    }

  } catch (error) {
    console.error("Detaljerad felinformation:", error);
    showError(`Ett fel uppstod: ${error.message}`);
  } finally {
    showLoading(false);
  }

  // Event listeners for show/hide buttons
  document.getElementById("toggleArtists").addEventListener("click", () => {
    artistsSection.style.display = artistsSection.style.display === "none" ? "block" : "none";
  });

  document.getElementById("toggleAlbums").addEventListener("click", () => {
    albumsSection.style.display = albumsSection.style.display === "none" ? "block" : "none";
  });

  function showLoading(show) {
    loadingIndicator.style.display = show ? "block" : "none";
  }

  function showError(message) {
    errorContainer.innerHTML = `
      <div class="alert alert-danger">
        <h4 class="alert-heading">Ett fel uppstod!</h4>
        <p>${message}</p>
        <hr>
        <p class="mb-0">Vänligen försök igen senare eller kontakta support om problemet kvarstår.</p>
      </div>
    `;
    errorContainer.style.display = "block";
  }

  function hideError() {
    errorContainer.style.display = "none";
  }
});
