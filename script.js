// script.js - Handles the interactive gallery (lightbox) functionality

document.addEventListener('DOMContentLoaded', () => {
    // Get all gallery items (the clickable image links)
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Get lightbox elements
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentImageIndex = 0; // To keep track of the currently displayed image

    // Function to open the lightbox
    function openLightbox(index) {
        currentImageIndex = index; // Set the current image index
        updateLightboxImage(); // Load and display the image

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
    function updateLightboxImage() {
        // Ensure the index is within bounds
        if (currentImageIndex < 0) {
            currentImageIndex = galleryItems.length - 1; // Loop to last image if going before first
        } else if (currentImageIndex >= galleryItems.length) {
            currentImageIndex = 0; // Loop to first image if going after last
        }

        const currentItem = galleryItems[currentImageIndex];
        const fullSrc = currentItem.getAttribute('data-full-src');
        const caption = currentItem.getAttribute('data-caption');

        lightboxImage.src = fullSrc;
        lightboxImage.alt = caption; // Set alt text for accessibility
        lightboxCaption.textContent = caption;
    }

    // Event Listeners for Gallery Items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the default link behavior (navigating to #)
            openLightbox(index); // Open lightbox with the clicked image's index
        });
    });

    // Event Listeners for Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex--;
        updateLightboxImage();
    });
    lightboxNext.addEventListener('click', () => {
        currentImageIndex++;
        updateLightboxImage();
    });

    // Close lightbox when clicking outside the image container
    lightboxOverlay.addEventListener('click', (e) => {
        // Check if the click occurred directly on the overlay, not on the container or its children
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Keyboard navigation (Escape key to close, arrow keys for prev/next)
    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay.classList.contains('active')) { // Only respond if lightbox is open
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
});
