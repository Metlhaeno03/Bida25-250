console.log("Javascript is connected!");
// =========================================
// 1. Initialize the map, centered on Gaborone
// =========================================
const map = L.map('map').setView([-24.6282, 25.9231], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Custom icon (optional)
const customIcon = L.icon({
    iconUrl: 'food-pin.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// =========================================
// 2. Load JSON data for food spots
// =========================================
fetch('foodspots.json')
  .then(response => response.json())
  .then(spots => {
    const container = document.getElementById('directory-container');
    const featuredContainer = document.getElementById('spots-container'); // for map.html featured cards

    spots.forEach(spot => {
      // --- Add marker to map ---
      const marker = L.marker(spot.coords, { icon: customIcon }).addTo(map)
        .bindPopup(`<b>${spot.name}</b><br>${spot.description}`);

      // --- Build directory card (Food spots directory.html) ---
      if (container) {
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

        // Wire "View on Map" button
        listing.querySelector('.view-map').addEventListener('click', () => {
          map.flyTo(spot.coords, 15);
          marker.openPopup();
        });
      }

      // --- Build featured card (Map.html) ---
      if (featuredContainer) {
        const card = document.createElement('div');
        card.className = 'spot-card';
        card.innerHTML = `
          <img src="${spot.photos[0]}" alt="${spot.name}">
          <div class="spot-info">
            <span class="spot-label">${spot.id}</span>
            <h3 class="spot-name">${spot.name}</h3>
            <button class="btn-view btn btn-sm btn-outline-primary">View on Map</button>
          </div>
        `;
        card.querySelector('.btn-view').addEventListener('click', () => {
          map.flyTo(spot.coords, 15);
          marker.openPopup();
        });
        featuredContainer.appendChild(card);
      }
    });
  })
  .catch(error => console.error('Error loading food spots:', error));

// =========================================
// 3. Search functionality (kept for directory)
// =========================================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('#directory-container .card').forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const description = card.querySelector('.card-text').textContent.toLowerCase();
      const match = title.includes(query) || description.includes(query);
      card.closest('.listing').style.display = match ? 'block' : 'none';
    });
  });
}

// =========================================
// 4. Navigation toggle
// =========================================
const navToggle = document.getElementById('nav-toggle');
const navlinks = document.getElementById('nav-links');
if (navToggle && navlinks) {
  navToggle.addEventListener('click', () => {
    navlinks.classList.toggle('show');
    navToggle.textContent = navlinks.classList.contains('show') ? '✖' : '☰';
  });
}

// =========================================
// 5. Highlight active nav link
// =========================================
const navLinks = document.querySelectorAll('.nav-box');
const currentUrl = window.location.href;
navLinks.forEach(link => {
  if (link.href === currentUrl) {
    link.classList.add('active');
  } else if (currentUrl.endsWith('/') && link.getAttribute('href') === 'index.html') {
    link.classList.add('active');
  }
});
