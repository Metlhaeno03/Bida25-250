// Initialize Leaflet map
var savannaMap = L.map('savannaMap').setView([-24.6282, 25.9231], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(savannaMap);

 // directory.js

// Load JSON data
fetch('foodspots.json')
  .then(response => response.json())
  .then(spots => {
    const container = document.getElementById('directory-container');

    spots.forEach(spot => {
      const listing = document.createElement('div');
      listing.className = 'listing';

      // Build photo gallery
      let photosHTML = '';
      if (spot.photos) {
        spot.photos.forEach(photo => {
          photosHTML += `<img src="${photo}" alt="${spot.name} photo">`;
        });
      }

      // Build menu list
      let menuHTML = '<ul class="menu-list">';
      if (spot.menu) {
        spot.menu.forEach(item => {
          menuHTML += `<li>${item}</li>`;
        });
      }
      menuHTML += '</ul>';

      listing.innerHTML = `
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">${spot.name}</h5>
            <p class="card-text text-muted">${spot.description}</p>

            <div class="photos">
              <h6>Food Photos</h6>
              <div class="photo-gallery">${photosHTML}</div>
            </div>

            <div class="menu">
              <h6>Menu Items</h6>
              ${menuHTML}
            </div>

            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm mt-2 view-map">View on Map</button>
              <a href="${spot.link}" class="btn btn-outline-secondary btn-sm mt-2">View More</a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(listing);
    });
  })
.catch(error => console.error('Error loading food spots:', error));
