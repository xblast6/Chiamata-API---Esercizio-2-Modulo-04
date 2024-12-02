
const API_BASE_URL = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";


function createTrackCard(track) {
    return `
        <div class="col mb-4">
            <div class="card h-100 custom-card text-dark">
                <img src="${track.album.cover_big}" class="card-img-top" alt="${track.title}">
                <div class="card-body">
                    <h5 class="card-title text-dark">${track.title}</h5>
                    <p class="card-text text-dark">
                        Artista: ${track.artist.name}<br>
                        Album: ${track.album.title}<br>
                        Durata: ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}
                    </p>
                    <a href="${track.preview}" target="_blank" class="btn btn-primary btn-sm">Ascolta Anteprima</a>
                </div>
            </div>
        </div>
    `;
}


async function searchMusic(event) {

    event.preventDefault();

  
    const searchQuery = document.getElementById('searchField').value;

  
    ['eminem', 'metallica', 'queen'].forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.add('d-none');
    });


    const searchResults = document.getElementById('searchResults');
    const searchSection = searchResults.querySelector('.row');
    searchResults.style.display = 'block';

    try {
      
        const response = await fetch(API_BASE_URL + encodeURIComponent(searchQuery));
        const data = await response.json();

      
        searchSection.innerHTML = '';

       
        if (data.data && data.data.length > 0) {
  
            const trackCards = data.data.map(createTrackCard).join('');
            searchSection.innerHTML = trackCards;
        } else {
            searchSection.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning" role="alert">
                        Nessun risultato trovato per "${searchQuery}"
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Errore durante la ricerca:', error);
        searchSection.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Errore durante la ricerca. Riprova più tardi.
                </div>
            </div>
        `;
    }
}


async function loadDefaultResults() {
    const defaultQueries = [
        { query: 'eminem', id: 'eminem' },
        { query: 'metallica', id: 'metallica' },
        { query: 'queen', id: 'queen' }
    ];

    for (const { query, id } of defaultQueries) {
        try {
            const section = document.getElementById(id);
            const row = section.querySelector(`#${id}Section`);

            const response = await fetch(API_BASE_URL + query);
            const data = await response.json();

           
            section.classList.remove('d-none');
            row.innerHTML = data.data.map(createTrackCard).join('');
        } catch (error) {
            console.error(`Errore nel caricamento di ${query}:`, error);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
   
    const searchButton = document.getElementById('button-search');
    if (searchButton) {
        searchButton.addEventListener('click', searchMusic);
    }

i
    loadDefaultResults();
});