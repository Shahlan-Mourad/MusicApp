import MusicService from "./music-service.js";
import { renderPagination } from "./music-groups.js";

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL =
    "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
  const service = new MusicService(API_BASE_URL);
  const artistsList = document.getElementById("artists-list");
  const pagination = document.getElementById("artists-pagination");
  let currentPage = 0;
  let totalPages = 0;
  const itemsPerPage = 15;

  loadArtists();

  async function loadArtists() {
    try {
      artistsList.innerHTML = `<div class='col-12 text-center'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Laddar...</span></div></div>`;
      const data = await service.getArtists(currentPage, itemsPerPage);
      totalPages = data.pageCount;
      displayArtists(data.pageItems);
      updatePagination();
    } catch {
      artistsList.innerHTML = '<div class="alert alert-danger">Kunde inte ladda artister.</div>';
      pagination.innerHTML = "";
    }
  }

  function displayArtists(artists) {
    if (!artists || artists.length === 0) {
      artistsList.innerHTML = `<div class='col-12'><div class='alert alert-info'>Inga artister hittades för denna sida.</div></div>`;
      return;
    }
    artistsList.innerHTML = artists.map(artist => `
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="list-card">
          <i class="bi bi-person-badge text-info icon"></i>
          <span>${artist.firstName} ${artist.lastName}</span>
        </div>
      </div>
    `).join("");
  }

  function updatePagination() {
    renderPagination({
      currentPage,
      totalPages,
      onPageChange: (newPage) => {
        currentPage = newPage;
        loadArtists();
      },
      paginationElement: pagination
    });
  }
}); 