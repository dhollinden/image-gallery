$(document).ready(loadPhotoData)

let photoArray = []
let filteredPhotos = []
let searchTerm = ''
let photoHTML = ''
let itemsPerPage = 25
let numPages = ''
let page = 1

function loadPhotoData() {
    $.getJSON("data.json", function (data) {
        photoArray = data.photos.photo
        filterAndDisplay(photoArray)
    })
}

function filterAndDisplay(array) {
    filteredPhotos = filterBySearchTerm(array)
    photoPage = paginatePhotos(filteredPhotos, page)
    displayPhotos(photoPage)
}

function filterBySearchTerm(array) {
    return array.filter(function (photo) {
        if (searchTerm) return photo.title.toLowerCase().includes(searchTerm.toLowerCase())
        return true // if no search term, return true for all photos
    })
}

function paginatePhotos(array, page) {
    numPages = Math.ceil(array.length / itemsPerPage)
    console.log('paginatePhotos: numPages = ', numPages)
    page = filteredPhotos.filter(function (photo, i) {
        return i >= (page - 1) * itemsPerPage && i < page * itemsPerPage
    })
    document.getElementById("search-display").innerHTML = "Displaying " + page.length + " of " + array.length  + " images"
    paginateButtons()
    return page
}

function paginateButtons() {
    if (page === 1) {
        document.getElementById('prev').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('prev').disabled = true
        document.getElementById('first').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('first').disabled = true
    }
    else {
        document.getElementById('prev').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('prev').disabled = false
        document.getElementById('first').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('first').disabled = false
    }
    if (page === numPages) {
        document.getElementById('next').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('next').disabled = true
        document.getElementById('last').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('last').disabled = true
    }
    else {
        document.getElementById('next').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('next').disabled = false
        document.getElementById('last').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('last').disabled = false
    }
    document.getElementById('pageXOfY').innerHTML = '&nbsp;&nbsp;page ' + page + ' of ' + numPages + '&nbsp;&nbsp;'
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
    image.parentElement.parentElement.style.display = 'none'
}

function search(event) {
    if (event.key) {
        searchTerm = document.getElementById("myInput").value
        page = 1
        console.log("search: searchTerm = ", searchTerm)
        filterAndDisplay(photoArray)
    }
}

function toPage(action) {
    if (action === 'next') page += 1
    if (action === 'prev') page -= 1
    if (action === 'first') page = 1
    if (action === 'last') page = numPages
    filterAndDisplay(photoArray)
}
