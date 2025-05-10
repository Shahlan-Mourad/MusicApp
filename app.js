// API URL
const API_BASE_URL = 'https://seido-webservice-307d89e1f16a.azurewebsites.net/api/MusicGroup';
const API_URL = `${API_BASE_URL}/Read?seeded=true&flat=true&pageSize=100`; // Hämtar 100 items för att kunna dela upp i 10 sidor

// Applikationsstatus
let currentPage = 1;
const totalPages = 10; // Fast antal sidor
const itemsPerPage = 10; // Fast antal rader per sida
let allBands = [];

// DOM-element
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const bandsContainer = document.getElementById('bands-container');
const pagination = document.getElementById('pagination');
const loadingIndicator = document.getElementById('loading-indicator');

// Initiera applikationen
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    setupNavigation();
});

function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = e.target.dataset.page;
            showPage(targetPage);
            updateActiveNav(link);
        });
    });
}

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`)?.classList.add('active');

    if (pageId === 'list') {
        loadBands();
    }
}

function updateActiveNav(activeLink) {
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    activeLink.classList.add('active');
}

// Hämta musikgrupper från API
async function loadBands() {
    try {
        showLoading(true);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.pageItems || !Array.isArray(data.pageItems)) {
            throw new Error('Ogiltigt dataformat från API');
        }

        // Ta de första 100 grupperna (10 sidor × 10 rader)
        allBands = data.pageItems.slice(0, 100);
        
        displayBands();
        updatePagination();
    } catch (error) {
        console.error('Fel:', error);
        showError(error);
    } finally {
        showLoading(false);
    }
}

// Visa musikgrupper med strikt paginering
function displayBands() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const bandsToShow = allBands.slice(startIndex, endIndex);

    if (bandsToShow.length === 0) {
        bandsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    Inga musikgrupper hittades för denna sida.
                </div>
            </div>`;
        return;
    }

    // Skapa en tabell-liknande layout med en grupp per rad
    bandsContainer.innerHTML = `
        <div class="list-group">
            ${bandsToShow.map(band => `
                <div class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${band.name || 'Okänt namn'}</h5>
                        <small>${band.id ? `ID: ${band.id}` : ''}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Uppdatera pagineringskontroller
function updatePagination() {
    let paginationHTML = '';
    
    // Föregående-knapp
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
        </li>`;

    // Sidnummer (alltid 10 sidor)
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
    }

    // Nästa-knapp
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
        </li>`;

    pagination.innerHTML = paginationHTML;

    // Lägg till event listeners
    pagination.querySelectorAll('.page-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.dataset.page);
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                displayBands(); // Använd redan hämtad data
                updatePagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function showLoading(show) {
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
    bandsContainer.style.display = show ? 'none' : 'block';
}

function showError(error) {
    bandsContainer.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
                <h4>Kunde inte ladda musikgrupper</h4>
                <p>${error.message}</p>
                <button class="btn btn-sm btn-outline-secondary mt-2" onclick="loadBands()">
                    Försök igen
                </button>
            </div>
        </div>`;
}



// Gör funktioner tillgängliga globalt
window.loadBands = loadBands;