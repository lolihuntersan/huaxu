const $ = (el) => { return document.querySelector(el); };
const $all = (el) => { return document.querySelectorAll(el); };
///////////////

document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.querySelector('#cards');
    const cards = document.querySelectorAll('.card');
    const leftBtn = document.querySelector('#left');
    const rightBtn = document.querySelector('#right');

    let currentIndex = 0; // Declare and initialize currentIndex

    // Show the current card
    function showCard(index) {
        // Hide all cards
        cards.forEach((card) => {
            card.classList.remove('active-card'); // Reset active class
        });
        
        // Show the selected card
        cards[index].classList.add('active-card');
        
        // Update data attributes to corresponding elements
        const dept = document.querySelector('#dept');
        const desc = document.querySelector('#desc');
        const discipline = document.querySelector('#discipline');
        
        dept.textContent = cards[index].getAttribute('data-dept');
        desc.textContent = cards[index].getAttribute('data-desc');
        discipline.textContent = cards[index].getAttribute('data-discipline');
    }

    // Move to the next card
    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
    }

    // Move to the previous card
    function prevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showCard(currentIndex);
    }

    // Event listeners for buttons
    rightBtn.addEventListener('click', nextCard);
    leftBtn.addEventListener('click', prevCard);

    // Initialize by showing the first card
    showCard(currentIndex);
});

////////////
const pages = $all('.pages'); // Select all sections
const navButtons = $all('.navigation__buttons'); // Select all navigation buttons
let currentPage = 0; // Keeps track of the current page index
const totalPages = pages.length; // Total number of pages
let isTransitioning = false; // Prevent multiple rapid transitions

// Initialize pages with default styles
pages.forEach((page, index) => {
    page.style.transition = 'opacity 0.5s ease'; // Add fade-in and fade-out transition
    page.style.opacity = index === currentPage ? '1' : '0'; // Show only the first page initially
    page.style.display = 'block'; // All pages are initially "block"
    page.style.position = 'absolute'; // Layer pages on top of each other
    page.style.top = '0'; // Align all pages to the top
    page.style.left = '0'; // Align all pages to the left
    page.style.width = '100%'; // Full width for each page
    page.style.height = '100vh'; // Full height for each page
    page.style.pointerEvents = index === currentPage ? 'auto' : 'none'; // Enable interaction only for the current page
});

// Transition to a page
function transitionToPage(value, type = "direction") {
    if (isTransitioning) return; // Prevent overlapping transitions

    const lastPage = currentPage; // Store the current page index as the last page

    if (type === "direction") {
        // Handle direction-based transitions (e.g., -1 for backward, 1 for forward)
        currentPage += value;
        currentPage = Math.max(0, Math.min(currentPage, totalPages - 1)); // Ensure the index stays within bounds
    } else if (type === "index") {
        // Handle index-based transitions directly
        currentPage = Math.max(0, Math.min(value, totalPages - 1)); // Ensure the index stays within bounds
    }

    if (currentPage !== lastPage) {
        isTransitioning = true; // Block further transitions
        // Fade out the current page
        pages[lastPage].style.opacity = '0';
        pages[lastPage].style.pointerEvents = 'none'; // Disable interaction with the last page

        // Fade in the next page
        setTimeout(() => {
            pages[currentPage].style.opacity = '1';
            pages[currentPage].style.pointerEvents = 'auto'; // Enable interaction with the current page
            isTransitioning = false; // Allow new transitions

            // Set active class on the corresponding navigation button
            navButtons.forEach(button => button.classList.remove('nav-button--active')); // Remove active class from all buttons
            navButtons[currentPage].classList.add('nav-button--active'); // Add active class to the current page button
        }, 50); // Match the fade transition duration (0.5s)
    } else {
        // If no page change, allow transitions again
        isTransitioning = false;
    }
}


// Handle navigation button clicks
navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (!isTransitioning && currentPage !== index) {
            transitionToPage(index, "index"); // Navigate to the clicked button's page
        }
    });
});

// Handle keyboard navigation (optional)
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') transitionToPage(1, "direction"); // Go to the next page
    if (event.key === 'ArrowUp') transitionToPage(-1, "direction"); // Go to the previous page
});

// Handle wheel scroll navigation
window.addEventListener('wheel', (event) => {
    if (isTransitioning) return; // Prevent multiple rapid transitions
    const direction = event.deltaY > 0 ? 1 : -1; // Determine scroll direction
    transitionToPage(direction, "direction");
});

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to match video
video.addEventListener('loadeddata', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
});

// Process each frame of the video
function removeBlack() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = frame.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];     // Red
    const g = data[i + 1]; // Green
    const b = data[i + 2]; // Blue

    // Check if the pixel is black (or close to black)
    if (r < 30 && g < 30 && b < 30) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }

  ctx.putImageData(frame, 0, 0);
  requestAnimationFrame(removeBlack);
}

// Start processing the video
video.addEventListener('play', () => {
  removeBlack();
});