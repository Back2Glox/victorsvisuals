// script.js - Handles the interactive gallery (lightbox), category filtering.
// Image comparison slider functionality is now handled by img-comparison-slider library.

document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded and DOM content loaded.");

    // --- Lightbox Elements ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentImageIndex = 0; // To keep track of the currently displayed image

    // --- Gallery Filter Elements ---
    const filterButtons = document.querySelectorAll('.filter-button');
    const galleryGrid = document.querySelector('.gallery-grid');

    // --- Lightbox Functions ---

    // Function to open the lightbox
    function openLightbox(index) {
        console.log("Opening lightbox for index:", index);
        // Ensure that we only open images from the currently visible items
        const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        currentImageIndex = visibleItems.indexOf(galleryItems[index]); // Get index within visible items

        if (currentImageIndex === -1) {
            console.warn("Attempted to open a hidden gallery item.");
            return; // If clicked item is hidden, do nothing
        }

        updateLightboxImage(visibleItems); // Load and display the image from visible items

        // Add 'active' class to show the lightbox with a fade-in effect
        lightboxOverlay.classList.add('active');
        // Prevent body scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    }

    // Function to close the lightbox
    function closeLightbox() {
        console.log("Closing lightbox.");
        lightboxOverlay.classList.remove('active'); // Remove 'active' class to hide lightbox
        // Allow body scrolling again
        document.body.style.overflow = '';
    }

    // Function to update the image and caption in the lightbox
    function updateLightboxImage(visibleItems = null) {
        const itemsToNavigate = visibleItems || Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));

        // Ensure the index is within bounds for the currently navigable items
        if (currentImageIndex < 0) {
            currentImageIndex = itemsToNavigate.length - 1; // Loop to last image
        } else if (currentImageIndex >= itemsToNavigate.length) {
            currentImageIndex = 0; // Loop to first image
        }

        const currentItem = itemsToNavigate[currentImageIndex];
        const fullSrc = currentItem.getAttribute('data-full-src');
        const caption = currentItem.getAttribute('data-caption');

        lightboxImage.src = fullSrc;
        lightboxImage.alt = caption; // Set alt text for accessibility
        lightboxCaption.textContent = caption;
        console.log("Lightbox image updated to:", fullSrc);
    }

    // --- Gallery Filter Functions ---

    // Function to filter images
    function filterGallery(filterCategory) {
        console.log("Filtering gallery by:", filterCategory);
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (filterCategory === 'all' || itemCategory === filterCategory) {
                item.classList.remove('hidden'); // Show item
            } else {
                item.classList.add('hidden'); // Hide item
            }
        });

        // Optional: Scroll to top of gallery when a filter is applied
        // Check if galleryGrid exists before attempting to scrollIntoView
        if (galleryGrid) {
            galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // --- Event Listeners ---

    // Lightbox Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            openLightbox(index); // Open lightbox with the clicked image's index
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex--;
        updateLightboxImage();
    });
    lightboxNext.addEventListener('click', () => {
        currentImageIndex++;
        updateLightboxImage();
    });

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) { // Only close if clicking on the overlay itself
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex--;
                updateLightboxImage();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex++;
                updateLightboxImage();
            }
        }
    });

    // Gallery Filter Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');

            const filterCategory = button.getAttribute('data-filter');
            filterGallery(filterCategory);
        });
    });

    // Initial filter when the page loads (to show 'all' by default)
    filterGallery('all');

    // No need for custom image comparison initialization. The library handles itself.
    console.log("Image comparison slider initialized by library (if present).");
});
