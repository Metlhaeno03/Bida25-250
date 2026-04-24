console.log("Javascript is connected!");
// 1. Initialize the map, centered on Palapye, Botswana
const map = L.map('map').setView([-22.55, 27.13], 6);

// 2. Load the map imagery from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. Add your featured spots
const customIcon = L.icon({
    iconUrl: 'food-pin.png',  
    iconSize: [40, 40],       
    iconAnchor: [20, 40],   
    popupAnchor: [0, -40]   
});
const spot1 = L.marker([-22.55, 27.13]).addTo(map);
spot1.bindPopup("<b>Palapye Food Market</b><br>Try the traditional Seswaa here!").openPopup();

const spot2 = L.marker([-24.62, 25.92]).addTo(map);
spot2.bindPopup("<b>Gaborone Central</b><br>Amazing sunset dining experiences.");

const spot3 = L.marker([-19.98, 23.41]).addTo(map);
spot3.bindPopup("<b>Maun Gateway</b><br>Perfect spot before heading into the Delta.");


// 4. --- THE NEW SEARCH FUNCTIONALITY ---

// Grab the input and button from the HTML
const searchInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');

// Listen for a click on the search button
searchBtn.addEventListener('click', function() {
    const query = searchInput.value; // Get the text the user typed
    
    // If they clicked search but didn't type anything, do nothing
    if (query === "") return; 

    // Ask OpenStreetMap's free database for the coordinates
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                // Get the latitude and longitude of the very first result
                const lat = data[0].lat;
                const lon = data[0].lon;
                
                // Fly the map to the new location! The '12' is the zoom level.
                map.flyTo([lat, lon], 12);
                
                // Optional: Drop a temporary pin so they see exactly what they searched for
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`You searched for: <b>${query}</b>`)
                    .openPopup();
            } else {
                alert("Location not found! Try searching for a specific city or town.");
            }
        })
        .catch(error => {
            console.error("Error finding location:", error);
        });
});

// --- 5. CONNECT LISTINGS TO THE MAP ---

// Group our markers together so the buttons know how to find them
const allSpots = {
    'spot1': spot1,
    'spot2': spot2,
    'spot3': spot3
};

// The function that runs when a "View on Map" button is clicked
function focusOnSpot(spotId) {
    const selectedMarker = allSpots[spotId];
    
    // Fly to the marker's exact coordinates. '14' is a nice close-up zoom level!
    map.flyTo(selectedMarker.getLatLng(), 14);
    
    // Open the popup bubble automatically
    selectedMarker.openPopup();
}
// --- HIGHLIGHT THE ACTIVE NAVIGATION LINK ---

// 1. Grab all the navigation boxes
const navLinks = document.querySelectorAll('.nav-box');

// 2. Get the exact URL of the page we are currently looking at
const currentUrl = window.location.href;

// 3. Loop through all the links
navLinks.forEach(link => {
    
    // Check if the link's destination matches the current page URL
    if (link.href === currentUrl) {
        // If it matches, make it Twilight Blue!
        link.classList.add('active');
    } 
    
    // This extra line ensures "Home" lights up if you are just at the root domain (like 127.0.0.1:5500/)
    else if (currentUrl.endsWith('/') && link.getAttribute('href') === 'index.html') {
        link.classList.add('active');
    }
});

// =========================================
// DYNAMIC FOOD SPOTS DATABASE & LOGIC
// =========================================

// 1. The Database: Store all your restaurants here!
const foodDatabase = {
    'spot1': {
        name: "Palapye Food Market",
        address: "Main Intersection, Palapye",
        hours: "8:00 AM - 6:00 PM",
        reviews: "⭐⭐⭐⭐⭐ (120 Reviews)",
        description: "A vibrant community market and the absolute best place to try traditional Seswaa cooked over an open fire.",
        bgClass: "bg-spot-palapye", // The background CSS class
        menu: [
            "Traditional Seswaa & Pap - P60",
            "Morogo (Wild Spinach) - P25",
            "Fresh Ginger Beer - P15"
        ],
        photos: [
            "https://via.placeholder.com/150/36454F/FFFFFF?text=Dish+1", 
            "https://via.placeholder.com/150/36454F/FFFFFF?text=Dish+2",
            "https://via.placeholder.com/150/36454F/FFFFFF?text=Dish+3"
        ] // Replace these URLs with your actual image paths like 'images/food1.jpg'
    },
    'spot2': {
        name: "Gaborone Central Grill",
        address: "CBD, Gaborone",
        hours: "11:00 AM - 10:00 PM",
        reviews: "⭐⭐⭐⭐ (85 Reviews)",
        description: "Experience amazing sunset dining with a mix of modern and traditional plates right in the heart of the capital.",
        bgClass: "bg-spot-gaborone",
        menu: [
            "Flame-Grilled Beef - P120",
            "Chakalaka & Wors - P80",
            "Craft Lemonade - P30"
        ],
        photos: [
            "https://via.placeholder.com/150/2c4c7c/FFFFFF?text=Dish+1",
            "https://via.placeholder.com/150/2c4c7c/FFFFFF?text=Dish+2"
        ]
    }
};

// 2. The Logic: This runs when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Look at the URL to see if there is an ID (e.g., Food spot.html?id=spot1)
    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('id');

    // If an ID exists AND it matches something in our database...
    if (spotId && foodDatabase[spotId]) {
        const data = foodDatabase[spotId];

        // Change the background image class dynamically
        document.body.className = data.bgClass;

        // Inject the text data
        document.getElementById('spot-title').textContent = data.name;
        document.getElementById('spot-address').textContent = data.address;
        document.getElementById('spot-hours').textContent = data.hours;
        document.getElementById('spot-reviews').textContent = data.reviews;
        document.getElementById('spot-desc').textContent = data.description;

        // Inject the Menu items list
        const menuList = document.getElementById('spot-menu');
        menuList.innerHTML = ""; // Clear out any old data
        data.menu.forEach(item => {
            menuList.innerHTML += `<li>${item}</li>`;
        });

        // Inject the Photos
        const photoGallery = document.getElementById('spot-photos');
        photoGallery.innerHTML = ""; // Clear out any old data
        data.photos.forEach(photoUrl => {
            photoGallery.innerHTML += `<img src="${photoUrl}" alt="Food image" style="width:150px; margin-right:10px; border-radius:8px;">`;
        });
    }
});

// script.js

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

  // =========================================
// HAMBURGER MENU TOGGLE LOGIC
// =========================================

// Grab the button and the navigation menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinksMenu = document.getElementById('nav-links');

// When the button is clicked, toggle the 'show-menu' class on and off
if (hamburgerBtn && navLinksMenu) {
    hamburgerBtn.addEventListener('click', () => {
        navLinksMenu.classList.toggle('show-menu');
    });
}