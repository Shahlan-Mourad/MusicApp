import MusicService from "./music-service.js";
import { renderPagination } from "./music-groups.js";

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL =
    "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
  const service = new MusicService(API_BASE_URL);
  const albumsList = document.getElementById("albums-list");
  const pagination = document.getElementById("albums-pagination");
  let currentPage = 0;
  let totalPages = 0;
  const itemsPerPage = 15;

  loadAlbums();

  async function loadAlbums() {
    try {
      albumsList.innerHTML = `<div class='col-12 text-center'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Laddar...</span></div></div>`;
      const data = await service.getAlbums(currentPage, itemsPerPage);
      totalPages = data.pageCount;
      displayAlbums(data.pageItems);
      updatePagination();
    } catch {
      albumsList.innerHTML = '<div class="alert alert-danger">Kunde inte ladda album.</div>';
      pagination.innerHTML = "";
    }
  }

  function displayAlbums(albums) {
    if (!albums || albums.length === 0) {
      albumsList.innerHTML = `<div class='col-12'><div class='alert alert-info'>Inga album hittades för denna sida.</div></div>`;
      return;
    }
    albumsList.innerHTML = albums.map(album => `
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="list-card">
          <i class="bi bi-disc text-success icon"></i>
          <span>${album.name}</span>
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
        loadAlbums();
      },
      paginationElement: pagination
    });
  }
}); 