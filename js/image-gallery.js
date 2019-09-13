$(document).ready(loadPhotoData)

let photoDataArray = []
let filteredPhotos = []
let searchTerm = ""
let photoHTML = ""

function loadPhotoData() {
    $.getJSON("data.json", function (data) {
        photoDataArray = data.photos.photo
        filterAndDisplayPhotos(photoDataArray)
    })
}

function filterAndDisplayPhotos(array) {
    filteredPhotos = filterPhotos(array)
    displayPhotos(filteredPhotos)
}

function filterPhotos(array) {
    console.log("filterPhotos: invoked")
    return array.filter(searchFilter)
}

function searchFilter(photo) {
    console.log("searchFilter: invoked")
    if (searchTerm) {
        return photo.title.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
}

function displayPhotos(array) {
    console.log("displayPhotos: invoked")
    photoHTML = ""
    array.forEach(function(photo) {
        photoHTML += '<div class="picbox"><figure><img src="' + photo.url_sq_cdn + '" class="frame" onclick="document.location=this.src"><figcaption>' + photo.title + '</figcaption></figure></div>'
    })
    $('#photos').html(photoHTML)
}

function search(event) {
    if (event.key) {
        searchTerm = document.getElementById("myInput").value
        console.log("search: Enter pressed: searchTerm = ", searchTerm)
        filterAndDisplayPhotos(photoDataArray)
    }
}
