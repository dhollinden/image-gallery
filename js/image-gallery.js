$(document).ready(loadPhotoData)

let photoArray = []
let filteredPhotos = []
let searchTerm = ""
let photoHTML = ""

function loadPhotoData() {
    $.getJSON("data.json", function (data) {
        photoArray = data.photos.photo
        filterAndDisplay(photoArray)
    })
}

function filterAndDisplay(array) {
    filteredPhotos = filterBySearchTerm(array)
    displayPhotos(filteredPhotos)
}

function filterBySearchTerm(array) {
    return array.filter(function (photo) {
        if (searchTerm) return photo.title.toLowerCase().includes(searchTerm.toLowerCase())
        return true // if no search term, return true for all photos
    })
}

function displayPhotos(array) {
    photoHTML = ""
    array.forEach(function(photo) {
        photoHTML += '<div class="responsive"><div class="gallery"><a target="_blank" href="' + photo.url_sq_cdn + '"><img src="' + photo.url_sq_cdn + '" onerror="imgError(this);" alt="' + photo.title + '" width="600" height="400"></a><div class="desc">' + shortTitle(photo.title) + '</div></div></div>'
    })
    $('#photos').html(photoHTML)
}

function shortTitle(title) {
    return title.slice(0, 16) + '...'
}

function imgError(image){
    console.log('imgError invoked')
    image.parentElement.parentElement.style.display = 'none'
}

function search(event) {
    if (event.key) {
        searchTerm = document.getElementById("myInput").value
        console.log("search: searchTerm = ", searchTerm)
        filterAndDisplay(photoArray)
    }
}
