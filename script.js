console.log("Javascript is connected!");
// script.js

document.addEventListener("DOMContentLoaded", () => {
    
  // ==========================================
    // LOGIC FOR THE DIRECTORY PAGE
    // ==========================================
    const spotGrid = document.getElementById("spot-grid");
    const searchInput = document.getElementById("searchInput");

    if (spotGrid) {
        const renderCards = (spotsToDisplay) => {
            spotGrid.innerHTML = ""; 
            if(spotsToDisplay.length === 0) {
                spotGrid.innerHTML = `<h4 class="text-center w-100 mt-5">No food spots found. Try a different search!</h4>`;
                return;
            }
            spotsToDisplay.forEach(spot => {
                const cardHTML = `
                    <div class="col-md-4 col-sm-6">
                        <div class="card spot-card h-100">
                            <img src="${spot.image}" class="card-img-top" alt="${spot.name}">
                            <div class="card-body bg-light text-dark d-flex flex-column">
                                <h5 class="card-title fw-bold">${spot.name}</h5>
                                <p class="card-text text-muted mb-4">${spot.category} <br> ${spot.rating}</p>
                                <a href="spot-details.html?id=${spot.id}" class="btn btn-warning mt-auto w-100">View Details</a>
                            </div>
                        </div>
                    </div>
                `;
                spotGrid.innerHTML += cardHTML;
            });
        };

        // NEW: Check if the user came from the Homepage search bar
        const urlParams = new URLSearchParams(window.location.search);
        const urlQuery = urlParams.get('query');

        if (urlQuery) {
            // Fill the directory's search box with what they typed on the homepage
            if (searchInput) searchInput.value = urlQuery;
            
            // Instantly filter the cards to match their search
            const searchTerm = urlQuery.toLowerCase();
            const filteredSpots = foodSpots.filter(spot => 
                spot.name.toLowerCase().includes(searchTerm) || 
                spot.category.toLowerCase().includes(searchTerm) ||
                spot.address.toLowerCase().includes(searchTerm)
            );
            renderCards(filteredSpots);
        } else {
            // If they didn't search anything, just show all the spots normally
            renderCards(foodSpots);
        }

        // Live typing search (for when they are already on the Directory page)
        if(searchInput) {
            searchInput.addEventListener("keyup", (event) => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredSpots = foodSpots.filter(spot => 
                    spot.name.toLowerCase().includes(searchTerm) || 
                    spot.category.toLowerCase().includes(searchTerm) ||
                    spot.address.toLowerCase().includes(searchTerm)
                );
                renderCards(filteredSpots);
            });
        }
    }

    // ==========================================
    // LOGIC FOR THE INDIVIDUAL FOOD SPOT PAGE
    // ==========================================
    const dynamicSpotBody = document.getElementById("dynamic-spot-body");
    
    if (dynamicSpotBody) {
        const urlParams = new URLSearchParams(window.location.search);
        const spotId = urlParams.get('id');
        const spotData = foodSpots.find(spot => spot.id === spotId);

        if (spotData) {
            document.getElementById("spot-name").innerText = spotData.name;
            document.getElementById("spot-address").innerText = spotData.address;
            document.getElementById("spot-hours").innerText = spotData.hours;
            document.getElementById("spot-reviews").innerText = spotData.rating;
            document.getElementById("spot-description").innerText = spotData.description;
            document.getElementById("spot-main-image").src = spotData.image;
            dynamicSpotBody.style.backgroundImage = `url('${spotData.bgImage}')`;

            const menuList = document.getElementById("spot-menu-list");
            menuList.innerHTML = ""; 
            spotData.menu.forEach(item => {
                menuList.innerHTML += `<li class="list-group-item">${item}</li>`;
            });

            // INDIVIDUAL PAGE MAP LOGIC
            const spotMapContainer = document.getElementById('spot-map-container');
            if (spotMapContainer) {
                // Initialize map zoomed in on this specific spot (Zoom level 15)
                const spotMap = L.map('spot-map-container').setView([spotData.lat, spotData.lng], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(spotMap);
                
                // Add a pin for this spot
                L.marker([spotData.lat, spotData.lng]).addTo(spotMap)
                    .bindPopup(`<b>${spotData.name}</b><br>${spotData.category}`)
                    .openPopup();
            }
        }
    }

  // ==========================================
    // LOGIC FOR THE MAIN FULL-PAGE MAP
    // ==========================================
    const mainMapContainer = document.getElementById('mainMap');
    
    if (mainMapContainer) {
        // Initialize map centered roughly on Botswana (Zoom level 6)
        const mainMap = L.map('mainMap').setView([-22.3285, 24.6849], 6);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mainMap);

        // Create a "Layer Group" - this lets us easily clear pins when searching
        let markerGroup = L.layerGroup().addTo(mainMap);

        // Function to draw the pins
        const renderMapMarkers = (spotsToDisplay) => {
            markerGroup.clearLayers(); // Wipe the current pins off the map
            
            spotsToDisplay.forEach(spot => {
                const marker = L.marker([spot.lat, spot.lng]);
                marker.bindPopup(`
                    <div class="text-center">
                        <b style="font-size: 1.1em;">${spot.name}</b><br>
                        <span class="text-muted">${spot.category}</span><br>
                        <a href="spot-details.html?id=${spot.id}" class="btn btn-sm btn-warning mt-2">View Details</a>
                    </div>
                `);
                markerGroup.addLayer(marker); // Add the new pin to the group
            });
        };

        // 1. Draw all pins when the page first loads
        renderMapMarkers(foodSpots);

        // 2. Make the map search bar work live
        const mapSearchInput = document.getElementById('mapSearchInput');
        if (mapSearchInput) {
            mapSearchInput.addEventListener('keyup', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                
                // Filter the data based on what they typed
                const filteredSpots = foodSpots.filter(spot => 
                    spot.name.toLowerCase().includes(searchTerm) || 
                    spot.category.toLowerCase().includes(searchTerm) ||
                    spot.address.toLowerCase().includes(searchTerm)
                );
                
                // Redraw the map with only the matching pins
                renderMapMarkers(filteredSpots);
            });
        }
    }
}); 