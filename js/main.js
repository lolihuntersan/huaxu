const $ = (el) => { return document.querySelector(el); };
const $all = (el) => { return document.querySelectorAll(el); };

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

        // Fade in the next page
        setTimeout(() => {
            pages[currentPage].style.opacity = '1';
            isTransitioning = false; // Allow new transitions

            // Set active class on the corresponding navigation button
            navButtons.forEach(button => button.classList.remove('nav-button--active')); // Remove active class from all buttons
            navButtons[currentPage].classList.add('nav-button--active'); // Add active class to the current page button
        }, 100); // Match the fade transition duration (0.5s)
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
