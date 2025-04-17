document.addEventListener("DOMContentLoaded", function () {
    // Counter animation for the stats section
    let movingPart = document.getElementById("moving-part");
    let value = 452; // Starting last 3 digits
    let regex; // Will be set based on search type

    function updateCounter() {
        value++;
        if (value > 999) value = 0; // Reset when reaching 999
        movingPart.textContent = String(value).padStart(3, '0'); // Ensure 3 digits
    }

    // Update counter every 500ms (as in the original code)
    setInterval(updateCounter, 500);

    // Alternative counter with random increments (from second script)
    let counter = 452;
    setInterval(function() {
        counter += Math.floor(Math.random() * 5) + 1;
        if (counter > 999) counter = 400;
        movingPart.textContent = String(counter).padStart(3, '0');
    }, 2000);

    // Initialize search form elements
    const searchTypeSelect = document.getElementById('query');
    const searchButton = document.getElementById('searchButton');
    const searchQueryInput = document.getElementById('email');
    const errorMessage = document.getElementById('emailError');
    const inputHintElem = document.getElementById('inputHint');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const searchForm = document.querySelector('.search-form');
    const searchError = document.getElementById('searchError');
    
    // Mobile menu elements
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Update input hint based on search type
searchTypeSelect.addEventListener('change', function () {
    updateInputHint();
});

function updateInputHint() {
    const searchType = searchTypeSelect.value;
    let hint = '';
    searchQueryInput.value = '';
    searchQueryInput.type = "text";

    switch (searchType) {
        case 'mail':
            regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            hint = 'Enter email address (e.g., example@gmail.com)';
            break;
        case 'name':
            regex = /^[a-zA-Z ]{2,30}$/;
            hint = 'Enter a name or nickname (e.g., John Doe)';
            break;
        case 'phone':
            regex = /^\+?\d{7,15}$/;
            hint = 'e.g., +14155552671 or +919876543210';
            searchQueryInput.type = "number";
            break;
        case 'domain':
            regex = /^@?\w+([.-]?\w+)*(\.\w{2,3})+$/;
            hint = 'Enter a domain (e.g., @domain.com)';
            break;
        default:
            hint = 'Please select a search type';
    }

    // Show hint *inside* the input field
    searchQueryInput.placeholder = hint;

    // Optional: also update the external hint paragraph if still needed
    // inputHintElem.textContent = hint;
}

    // Initialize input hint
    updateInputHint();

    // Mobile menu toggle
    hamburgerMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('show-menu');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburgerMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.remove('show-menu');
        }
    });

    // Search button click event
    searchButton.addEventListener('click', function () {
        const searchType = searchTypeSelect.value;
        const searchQuery = searchQueryInput.value.trim();
        
        // Check if a search type is selected
        if (searchType === 'select') {
            errorMessage.textContent = "Please select a search type";
            errorMessage.style.display = 'block';
            return;
        }
        
        // Validate input against the regex pattern
        let isSearchable = regex && regex.test(searchQuery);
        
        if (!isSearchable) {
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.display = 'flex';
        
        // Call search function
        searchBreachData(searchType, searchQuery);
    });

    // Reset error message on input
    searchQueryInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });

    // Search breach data via API
    function searchBreachData(type, query) {
        // Actual API call
        callBreachAPI(type, query)
            .then(response => {
                // Hide loading indicator
                loadingIndicator.classList.add('hidden');
                loadingIndicator.style.display = 'none';
                
                // Process and display results
                processSearchResults(response);
            })
            .catch(error => {
                console.error("Error during search:", error);
                loadingIndicator.classList.add('hidden');
                loadingIndicator.style.display = 'none';
                // errorMessage.textContent = "An error occurred. Please try again.";
                errorMessage.textContent = "We're experiencing high demand. Kindly try again shortly.";
                errorMessage.style.display = 'block';
            });
    }

    // Process search results
    function processSearchResults(response) {
        const searchResultsContainer = document.querySelector('#search-results');
        const breachInfoElement = document.querySelector('.breach-info h1');
        const breachInfoText = document.querySelector('.breach-info p');
        
        // Check if response is valid and has a List property
        if (!response || typeof response !== 'object' || !response.List) {
            searchResultsContainer.style.display = 'none';
            return;
        }
        
        const list = response.List;
        let breachCount = Object.keys(list).length;
        
        // Check for "No results found" case
        if (list.hasOwnProperty("No results found") || breachCount === 0) {
            breachCount = 0;
        }

        // Update breach info section
        breachInfoElement.innerHTML = `Your data found in <span style="color: red;">${breachCount} Breaches</span>`;
        
        if (breachCount === 0) {
            breachInfoText.innerText = '';
        } else {
            breachInfoText.innerText = "We found your information in a leaked database circulating on the dark web.";
        }

        // Show results section and display breach details
        document.querySelector('.breach-info').classList.remove('hidden');
        searchResultsContainer.style.display = 'block';
        
        // Display the breach details
        displayResults(response);
    }

    // Display breach results
    function displayResults(results) {
        const breachResultsContainer = document.querySelector('.breachresults');
        const breachinfo = document.querySelector('.breach-info');
        const searchResultsContainer = document.querySelector('#search-results');
        const unlockButton = document.getElementById('unlock-all-details');
        
        // Clear previous results
        breachResultsContainer.innerHTML = '';
        
        // Check if results are valid
        if (!results || typeof results !== 'object' || !results.List || Object.keys(results.List).length === 0) {
            searchResultsContainer.style.display = 'none';
            return;
        }
        
        // Display the search results container
        searchResultsContainer.style.display = 'block';
        
        // Process each breach result
        Object.keys(results.List).forEach((key) => {
            const section = results.List[key];
            const breachCard = document.createElement('div');
            
            if (key === 'No money') {
                breachCard.classList.add('breach-item', 'col-sm-12', 'mx-0', 'my-0', 'py-0');
                unlockButton.innerHTML = "<span class='icon-phone me-2 font-13'></span> Contact Us";
                breachinfo.style = 'display:none;';
                breachCard.innerHTML = `
                    <div class="text-center whitetext w-100">
                        <h4>⚠️ Something went wrong. Please try again later</h4>
                    </div>
                `;
            } else {
                // Get compromised data keys
                const compromisedDataKeys = (section.Data && Array.isArray(section.Data) && section.Data.length > 0)
                    ? Object.keys(section.Data[0]).join(', ')
                    : '--';
                
                // Create paragraph elements for each compromised data key
                const compromisedDataParagraphs = compromisedDataKeys.split(', ')
                    .map(word => `<p class="compromised-data-key">${word}</p>`)
                    .join('');
                
                // Create breach card
                breachCard.classList.add('breach-item', 'col-sm-6', 'mx-0', 'my-0', 'pt-0');
                breachCard.innerHTML = `
                <div class="breach-info card p-3 shadow mt-0">
                    <div class="breach-data">
                        <h3>Compromised Data:</h3>
                        <div class="compromised-data-container d-flex gap-2 flex-wrap">${compromisedDataParagraphs || '--'}</div>
                    </div>
        
                    <div class="breach-description" style="display: block;">
                        <h4>${key}</h4>
                        <p><strong>Info Leak:</strong> ${section.InfoLeak || '--'}</p>
                    </div>
                </div>
                `;
            }
            
            // Add the breach card to the container
            breachResultsContainer.appendChild(breachCard);
        });
        
        // Scroll to the results
        if (window.innerWidth <= 500) {
            breachResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.scrollBy(0, 961); // Adjusted from 1100 to 500 for better experience
        } else {
            breachResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.scrollBy(0, 729); 
        }
        
        // Add event listener for unlock button
        unlockButton.addEventListener('click', () => {
            const breachDescriptions = document.querySelectorAll('.breach-description');
            const dataLists = document.querySelectorAll('ul');
            
            breachDescriptions.forEach(description => {
                description.style.display = 'block';
            });
            
            dataLists.forEach(dataList => {
                dataList.style.display = 'block';
            });
            
            unlockButton.style.display = 'none';
        });
    }

    // Real API call function
    async function callBreachAPI(type, query) {
        try {
            // API endpoint - replace with your actual endpoint
            const url = 'http://127.0.0.1:5001/bot'; // Change to your real API endpoint
            
            // Request data
            const data = {
                "token": "972670989:NY6wiwTu", // Replace with your actual API token
                "query": query,
                "type": type,
                "limit": 1000,
                "lang": "en"
            };

            // Make API request
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add any authentication headers if needed
                    // "Authorization": "Bearer YOUR_API_KEY"
                },
                body: JSON.stringify(data)
            });

            // Check for HTTP errors
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            // Parse and return JSON response
            const responseData = await response.json();
            
            // Check if the API returns the data in a specific format
            // Adjust this based on your actual API response structure
            return responseData.msg || responseData;
            
        } catch (error) {
            console.error("API Error:", error.message);
            throw error;
        }
    }
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('searchButton').click();
        }
    });
});