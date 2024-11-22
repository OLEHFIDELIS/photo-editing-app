const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button");
previewImg = document.querySelector(".preview-img img");
chooseImgBtn = document.querySelector(".chose-image");

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
    })
})

fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());