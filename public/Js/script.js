const fileInput = document.querySelector(".file-input"),
redoFilterBtn = document.querySelector(".save-image"),
resetFilterBtn = document.querySelector(".reset-filter"),
rotateOptions = document.querySelectorAll(".rotate button"),
filterValue = document.querySelector(".slider .value"),
filterSlider = document.querySelector(".slider input"),
filterName = document.querySelector(".filter-info .name"),
filterOptions = document.querySelectorAll(".filter button"),
previewImg = document.querySelector(".preview-img img"),
chooseImgBtn = document.querySelector(".chose-image");

const saveState = () => {
    undoStack.push({
        brightness,
        saturation,
        inversion,
        grayscale,
        rotate,
        flipHorizontal,
        flipVertical
    });
    // Clear redo stack on a new action
    redoStack = [];
};

let undoStack = [];
let redoStack = [];

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}
const loadImage = () => {
    let file = fileInput.files[0]
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        document.querySelector(".container1").classList.remove("disable")
    })
}
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active")
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }

    })
})

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`
    const selectedFilter = document.querySelector(".filter .active");
    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value
    } else {
        grayscale = filterSlider.value
    }
    applyFilters();
}

rotateOptions.forEach(option => {
   option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;  
        } else if (option.id === "right") {
            rotate += 90;  
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }else {
            flipVertical = flipVertical === 1 ? -1 : 1; 
        }
        applyFilters();
   })
});

const resetFilter = () => {
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1; 
    if (brightness) {
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`
    } else if (saturation) {
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
    } else if (inversion) {
        filterSlider.value = 0;
        filterValue.innerText = 0;  
    } else {
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
    }
    applyFilters();
}

const redoFilter = () => {
    brightness = filterSlider.value; saturation = filterSlider.value; inversion = filterSlider.value; grayscale = filterSlider.value;
    rotate = 0; flipHorizontal = 1; flipVertical = 1; 
    applyFilters();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter,);
resetFilterBtn.addEventListener("click", resetFilter);
redoFilterBtn.addEventListener("click", redoFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());