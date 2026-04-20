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