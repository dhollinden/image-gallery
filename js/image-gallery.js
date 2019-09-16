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
        return true
    })
}

function displayPhotos(array) {
    photoHTML = ""
    array.forEach(function(photo) {
        // photoHTML += '<div class="picbox"><figure><img src="' + photo.url_sq_cdn + '" class="frame" onclick="document.location=this.src"><figcaption>' + photo.title + '</figcaption></figure></div>'
        photoHTML += '<div class="responsive"><div class="gallery"><a target="_blank" href="' + photo.url_sq_cdn + '"><img src="' + photo.url_sq_cdn + '" onerror="imgError(this);" alt="' + photo.title + '" width="600" height="400"></a><div class="desc">' + photo.title + '</div></div></div>'
    })
    $('#photos').html(photoHTML)
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
