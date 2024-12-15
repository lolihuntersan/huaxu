const $ = (el) => { return document.querySelector(el); };
const $all = (el) => { return document.querySelectorAll(el); };

document.addEventListener("DOMContentLoaded", () => {
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

    // Function to change the page
    function transitionToPage(directionOrIndex) {
        if (isTransitioning) return; // Prevent overlapping transitions

        const lastPage = currentPage; // Store the current page index as the last page

        if (typeof directionOrIndex === 'number') {
            // If a direction is provided, calculate the new page
            currentPage += directionOrIndex;
            currentPage = Math.max(0, Math.min(currentPage, totalPages - 1)); // Ensure the index stays within bounds
        } else {
            // If an index is provided directly, use it
            currentPage = directionOrIndex;
        }

        if (currentPage !== lastPage) {
            isTransitioning = true; // Block further transitions
            // Fade out the current page
            pages[lastPage].style.opacity = '0';

            // Fade in the next page
            setTimeout(() => {
                pages[currentPage].style.opacity = '1';
                isTransitioning = false; // Allow new transitions

                // Update navigation button active state
                navButtons.forEach(button => button.classList.remove('nav-button--active')); // Remove active class from all buttons
                navButtons[currentPage].classList.add('nav-button--active'); // Add active class to the current page button
            }, 500); // Match the fade transition duration (0.5s)
        }
    }

    // Handle navigation button clicks
    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (!isTransitioning && currentPage !== index) {
                transitionToPage(index); // Navigate to the clicked button's page
            }
        });
    });

    // Handle keyboard navigation (optional)
    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') transitionToPage(1); // Go to the next page
        if (event.key === 'ArrowUp') transitionToPage(-1); // Go to the previous page
    });

    // Handle wheel scroll navigation
    window.addEventListener('wheel', (event) => {
        if (isTransitioning) return; // Prevent multiple rapid transitions
        const direction = event.deltaY > 0 ? 1 : -1; // Determine scroll direction
        transitionToPage(direction);
    });
});
