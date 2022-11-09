let btnMenu = document.querySelector(".fa-bars")
let cerrado = 0

btnMenu.addEventListener("click", function() {
    let menu = document.querySelector(".nav")

    cerrado++

    if (cerrado >= 3) {
        cerrado = 1
    }

    if (cerrado == 1) {
        menu.style.display = "block"
    } else if (cerrado == 2) {
        menu.style.display = "none"
    }
})