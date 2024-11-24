const fileInput = document.querySelector(".file-input"),
saveImgBtn = document.querySelector(".save-image"),
redoFilterBtn = document.querySelector(".redo-filter"),
resetFilterBtn = document.querySelector(".reset-filter"),
rotateOptions = document.querySelectorAll(".rotate button"),
filterValue = document.querySelector(".slider .value"),
filterSlider = document.querySelector(".slider input"),
filterName = document.querySelector(".filter-info .name"),
filterOptions = document.querySelectorAll(".filter button"),
previewImg = document.querySelector(".preview-img img"),
chooseImgBtn = document.querySelector(".chose-image");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// Stacks for undo and redo
const undoStack = [];
const redoStack = [];

// Save the current state to undo stack
const saveState = () => {
    undoStack.push({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical });
    redoStack.length = 0; // Clear redo stack whenever a new change is made
}

// Apply filters to the image
const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

// Load image function
const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click()
        document.querySelector(".container1").classList.remove("disable");
    });
}

// Update filter values
const updateFilter = () => {
    saveState(); // Save current state before updating
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

// Manage filter options and slider settings
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

// Update rotation or flipping
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        saveState(); // Save current state before updating
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

// Reset filters
const resetFilter = () => {
    saveState(); // Save current state before resetting
    if (undoStack.length === 0) return;
    const lastState = undoStack.pop();
    redoStack.push({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical });
    ({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical } = lastState);
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterSlider.value = brightness;
    filterValue.innerText = `${brightness}%`;
    applyFilters();
}

// Undo the last change
const undoChange = () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack.pop();
    redoStack.push({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical });
    ({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical } = lastState);
    applyFilters();
}

// Redo the last undone change
const redoChange = () => {
    if (redoStack.length === 0) return;
    const lastState = redoStack.pop();
    undoStack.push({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical });
    ({ brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical } = lastState);
    applyFilters();
}
const saveImage = () => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the preview image
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    // Apply transformations and filters
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Convert canvas to a data URL
    const link = document.createElement("a");
    link.download = "edited-image.png"; // Set default file name
    link.href = canvas.toDataURL(); // Get image data as a base64 URL
    link.click(); // Trigger download
}

// Event listeners
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
redoFilterBtn.addEventListener("click", redoChange);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
