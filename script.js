// script.js - Handles the interactive gallery (lightbox), category filtering, and image comparison slider functionality

document.addEventListener('DOMContentLoaded', () => {
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

    // --- Image Comparison Slider Elements ---
    const comparisonContainer = document.getElementById('nightchrome-comparison');
    let comparisonOverlay, comparisonHandle; // Will be set if container exists

    // --- Lightbox Functions ---

    // Function to open the lightbox
    function openLightbox(index) {
        // Ensure that we only open images from the currently visible items
        const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        currentImageIndex = visibleItems.indexOf(galleryItems[index]); // Get index within visible items

        if (currentImageIndex === -1) return; // If clicked item is hidden, do nothing

        updateLightboxImage(visibleItems); // Load and display the image from visible items

        // Add 'active' class to show the lightbox with a fade-in effect
        lightboxOverlay.classList.add('active');
        // Prevent body scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active'); // Remove 'active' class to hide lightbox
        // Allow body scrolling again
        document.body.style.overflow = '';
    }

    // Function to update the image and caption in the lightbox
    function updateLightboxImage(visibleItems = null) {
        // Use visibleItems if provided (e.g., when opening lightbox or navigating filters)
        // Otherwise, default to all galleryItems (e.g., for arrow navigation within lightbox)
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
    }

    // --- Gallery Filter Functions ---

    // Function to filter images
    function filterGallery(filterCategory) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (filterCategory === 'all' || itemCategory === filterCategory) {
                item.classList.remove('hidden'); // Show item
            } else {
                item.classList.add('hidden'); // Hide item
            }
        });

        // Optional: Scroll to top of gallery when a filter is applied
        galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Image Comparison Slider Functions ---

    // Function to initialize the slider
    function initializeImageComparison(container) {
        if (!container) return; // Exit if container doesn't exist

        comparisonOverlay = container.querySelector('.comparison-overlay');
        comparisonHandle = container.querySelector('.comparison-handle');

        let isDragging = false;

        // Function to update the slider position
        function slide(clientX) {
            const containerRect = container.getBoundingClientRect();
            let x = clientX - containerRect.left; // X position relative to container

            // Clamp x to be within container bounds
            if (x < 0) x = 0;
            if (x > containerRect.width) x = containerRect.width;

            const percentage = (x / containerRect.width) * 100;

            // The overlay's width determines how much of the 'before' image is visible
            comparisonOverlay.style.width = `${percentage}%`;
            // The handle's left position moves with the overlay's edge
            comparisonHandle.style.left = `${percentage}%`;
            
            // The image inside the overlay should stay fixed at 0% relative to its container (the overlay)
            // It will be clipped by the overlay's changing width.
            // No need to adjust its 'left' property dynamically.
        }

        // Mouse events for desktop
        comparisonHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            container.classList.add('dragging'); // Add class to prevent text selection during drag
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.classList.remove('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                slide(e.clientX);
            }
        });

        // Touch events for mobile
        comparisonHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
            container.classList.add('dragging');
            e.preventDefault(); // Prevent scrolling on touch devices
        }, { passive: false }); // Use passive: false to allow preventDefault

        document.addEventListener('touchend', () => {
            isDragging = false;
            container.classList.remove('dragging');
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length > 0) {
                slide(e.touches[0].clientX);
                e.preventDefault(); // Prevent scrolling
            }
        }, { passive: false });
        
        // Initial positioning: Set slider to the middle initially
        const initialX = container.getBoundingClientRect().left + container.getBoundingClientRect().width / 2;
        slide(initialX); 
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

    // Initialize image comparison slider if it exists on the page
    if (comparisonContainer) {
        initializeImageComparison(comparisonContainer);
    }
});
