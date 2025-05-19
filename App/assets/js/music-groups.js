'use strict';
import MusicService from "./music-service.js";

// Exportera funktionen på toppnivå
export function renderPagination({currentPage, totalPages, onPageChange, paginationElement}) {
  let paginationHTML = "";
  const maxVisible = 5;
  const sideCount = 1;
  if (totalPages <= 1) {
    paginationElement.innerHTML = "";
    return;
  }
  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 0 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
    </li>`;
  // First page
  if (currentPage > sideCount + 1) {
    paginationHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="0">1</a></li>
      <li class="page-item disabled"><span class="page-link">...</span></li>
    `;
  }
  // Main page numbers
  let start = Math.max(currentPage - 2, 0);
  let end = Math.min(currentPage + 2, totalPages - 1);
  if (start <= sideCount) start = 0;
  if (end >= totalPages - sideCount - 1) end = totalPages - 1;
  for (let i = start; i <= end; i++) {
    if (i === 0 && currentPage > sideCount + 1) continue; // Avoid duplicate 1
    if (i === totalPages - 1 && currentPage < totalPages - sideCount - 2) continue; // Avoid duplicate last
    paginationHTML += `
      <li class="page-item ${currentPage === i ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
      </li>`;
  }
  // Last page
  if (currentPage < totalPages - sideCount - 2) {
    paginationHTML += `
      <li class="page-item disabled"><span class="page-link">...</span></li>
      <li class="page-item"><a class="page-link" href="#" data-page="${totalPages - 1}">${totalPages}</a></li>
    `;
  }
  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages - 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
    </li>`;
  paginationElement.innerHTML = paginationHTML;
  paginationElement.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const newPage = parseInt(e.target.dataset.page);
      if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
        onPageChange(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

// DOM-element, Waits for the DOM to be fully loaded before executing the script.
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL =
    "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
  const service = new MusicService(API_BASE_URL); // Creates an instance of MusicService.

  // Grabs references to the DOM elements.
  const bandsContainer = document.getElementById("bands-container");
  const pagination = document.getElementById("pagination");
  const loadingIndicator = document.getElementById("loading-indicator");
  const errorContainer = document.getElementById("error-container");

  // Get all bands
  let currentPage = 0;
  let totalPages = 0;
  const itemsPerPage = 15;
  let totalItems = 0;

  loadBands(); // Loads the initial list of bands.

  // Fetches band data from the API and updates the UI accordingly.
  async function loadBands() {
    try {
      showLoading(true);
      hideError();

      const data = await service.getMusicGroups(currentPage, itemsPerPage);
      totalItems = data.dbItemsCount; // Stores the total number of items in the database.
      totalPages = data.pageCount; // Stores the total number of pages.

      displayBands(data.pageItems);
      updatePagination();
    } catch (error) {
      showError(error.message);
    } finally {
      showLoading(false);
    }
  }

  // Updates the bandsContainer with the list of bands received from the API.
  function displayBands(bands) {
    if (!bands || bands.length === 0) {
      // Displays an alert if no bands are found.
      bandsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        Inga musikgrupper hittades för denna sida.
                    </div>
                </div>`;
      return;
    }
    let html = '<div class="row">';
    bands.forEach((band) => {
      // Constructs HTML for each band entry.
      html += `
                <div class="col-12 col-md-6 col-lg-4 mb-3">
                    <div class="list-card">
                        <i class="bi bi-music-note-beamed text-primary icon"></i>
                        <span>${band.name || "Okänt namn"}</span>
                        <a href="details.html?id=${
                          band.musicGroupId
                        }" class="btn btn-outline-primary btn-sm ms-auto">Visa detaljer</a>
                    </div>
                </div>
            `;
    });
    html += "</div>";
    bandsContainer.innerHTML = html; // Inserts generated HTML into the container.
  }

  // Byt ut updatePagination mot anrop till renderPagination
  function updatePagination() {
    renderPagination({
      currentPage,
      totalPages,
      onPageChange: (newPage) => {
        currentPage = newPage;
        loadBands();
      },
      paginationElement: pagination
    });
  }

  // Shows or hides the loading indicator.
  function showLoading(show) {
    loadingIndicator.style.display = show ? "block" : "none";
    bandsContainer.style.display = show ? "none" : "block";
  }

  // Displays an error message.
  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  }

  // Hides the error message.
  function hideError() {
    errorContainer.style.display = "none";
  }
});
