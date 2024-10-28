let currentSlideIndex = 0;
let autoSlideInterval;
const photos = [];

// Load photos and categories from Local Storage on page load
document.addEventListener("DOMContentLoaded", loadStoredPhotos);

// Function to add photos to the gallery with optional categories
function addPhotos() {
    const photoUploadInput = document.getElementById("photoUpload");
    const categoryInput = document.getElementById("categoryInput").value.trim();
    const category = categoryInput || "photo"; // Default category is 'photo' if input is empty
    const files = Array.from(photoUploadInput.files);

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const photoData = {
                src: event.target.result,
                category: category
            };
            createPhotoElement(photoData);
            savePhotoToLocalStorage(photoData); // Save photo to Local Storage
        };
        reader.readAsDataURL(file);
    });
}

// Create photo element and add it to the gallery
function createPhotoElement(photoData) {
    const photoContainer = document.createElement("div");
    photoContainer.classList.add("photo");
    photoContainer.setAttribute("data-category", photoData.category);

    const img = document.createElement("img");
    img.src = photoData.src;
    img.alt = "User Photo";
    photoContainer.appendChild(img);

    const caption = document.createElement("p");
    caption.textContent = `Category: ${photoData.category}`;
    photoContainer.appendChild(caption);

    // Add photo to the gallery
    document.getElementById("gallery").appendChild(photoContainer);

    // Add the new photo to the lightbox and slideshow
    photos.push(img);
    img.addEventListener("click", () => {
        openLightbox(photos.indexOf(img));
    });

    // Update filter buttons if category is new
    addCategoryButton(photoData.category);
}

// Add a new category button if it doesn't already exist
function addCategoryButton(category) {
    const existingButton = document.querySelector(`.filters button[data-category="${category}"]`);
    if (!existingButton) {
        const button = document.createElement("button");
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        button.setAttribute("data-category", category);
        button.onclick = () => filterGallery(category);
        document.querySelector(".filters").appendChild(button);
    }
}

// Filter photos by category
function filterGallery(category) {
    clearInterval(autoSlideInterval);
    document.querySelectorAll(".photo").forEach(photo => {
        if (category === 'all' || photo.getAttribute("data-category") === category) {
            photo.style.display = "block";
        } else {
            photo.style.display = "none";
        }
    });
}

// Save photo data to Local Storage
function savePhotoToLocalStorage(photoData) {
    let storedPhotos = JSON.parse(localStorage.getItem("photos")) || [];
    storedPhotos.push(photoData);
    localStorage.setItem("photos", JSON.stringify(storedPhotos));
}

// Load photos from Local Storage
function loadStoredPhotos() {
    const storedPhotos = JSON.parse(localStorage.getItem("photos")) || [];
    storedPhotos.forEach(photoData => {
        createPhotoElement(photoData);
    });
}

// Open lightbox and start slideshow
function openLightbox(index) {
    currentSlideIndex = index;
    document.getElementById("lightbox").style.display = "flex";
    showSlide(currentSlideIndex);
    startAutoSlide();
}

// Close lightbox
function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    clearInterval(autoSlideInterval);
}

// Navigate through slides with prev/next buttons
function changeSlide(step) {
    currentSlideIndex += step;
    if (currentSlideIndex >= photos.length) currentSlideIndex = 0;
    if (currentSlideIndex < 0) currentSlideIndex = photos.length - 1;
    showSlide(currentSlideIndex);
}

// Display the current slide
function showSlide(index) {
    document.getElementById("lightboxImage").src = photos[index].src;
}

// Start automatic slideshow
function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 3000); // Change slide every 3 seconds
}
