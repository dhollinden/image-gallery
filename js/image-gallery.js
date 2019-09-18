$(document).ready(loadPhotoData)

let photoArray = []
let cleanPhotoArray = []
let filteredPhotos = []
let searchTerm = ''
let photoHTML = ''
let itemsPerPage = 25
let numPages = ''
let page = 1
let shortTitleLength = 12

async function loadPhotoData() {
    if (localStorage.getItem("photoJSON") === null) {
        $.getJSON("data.json", function (data) {
            photoArray = data.photos.photo
        })
    } else {
        photoArray = JSON.parse(localStorage.getItem('photoJSON'))
    }
    try {
        const temp = await cleanPhotos(photoArray)
        cleanPhotoArray = temp
        filterAndDisplay(cleanPhotoArray)
    } catch (e) {
        console.log('loadPhotoData: catch error = ', e)
    }
}

async function cleanPhotos(array) {
    try {
        const temp = await remove404s(array)
        return temp
    } catch (e) {
        console.log('cleanPhotos: catch error = ', e)
    }
}

async function remove404s(array) {
    let temp = []
    for (photo of array) {
        try {
            const response = await $.ajax({
                url: photo.url_sq_cdn,
                type:'HEAD',
                error: function(error)
                {
                    console.log('remove404s: ajax error = ', error)
                },
                success: function(result)
                {
                    console.log('remove404s: success: result = ', result)
                    temp.push(photo)
                }
            });
        } catch (e) {
            console.log('remove404s: catch error = ',e)
        }
    }
    return temp
}

function filterAndDisplay(array) {
    filteredPhotos = filterBySearchTerm(array)
    currentPageOfPhotos = createPageOfPhotos(filteredPhotos, page)
    createPaginationButtons()
    displayPhotos(currentPageOfPhotos)
}

function filterBySearchTerm(array) {
    return array.filter(function (photo) {
        if (searchTerm)
            return photo.title.toLowerCase().includes(searchTerm.toLowerCase())
        return true // if no search term, return true for all photos
    })
}

function createPageOfPhotos(array, page) {
    numPages = Math.ceil(array.length / itemsPerPage)
    page = filteredPhotos.filter(function (photo, i) {
        return i >= (page - 1) * itemsPerPage && i < page * itemsPerPage
    })
    document.getElementById("search-display").innerHTML = "Displaying " + page.length + " of " + array.length  + " images"
    return page
}

function createPaginationButtons() {
    if (page === 1) {
        document.getElementById('prev').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('prev').disabled = true
        document.getElementById('first').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('first').disabled = true
        document.getElementById('prev-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('prev-below').disabled = true
        document.getElementById('first-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('first-below').disabled = true
    }
    else {
        document.getElementById('prev').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('prev').disabled = false
        document.getElementById('first').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('first').disabled = false
        document.getElementById('prev-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('prev-below').disabled = false
        document.getElementById('first-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('first-below').disabled = false
    }
    if (page === numPages) {
        document.getElementById('next').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('next').disabled = true
        document.getElementById('last').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('last').disabled = true
        document.getElementById('next-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('next-below').disabled = true
        document.getElementById('last-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small w3-disabled'
        document.getElementById('last-below').disabled = true
    }
    else {
        document.getElementById('next').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('next').disabled = false
        document.getElementById('last').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('last').disabled = false
        document.getElementById('next-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('next-below').disabled = false
        document.getElementById('last-below').className = 'w3-button w3-light-blue w3-small w3-round w3-padding-small'
        document.getElementById('last-below').disabled = false
    }
    document.getElementById('pageXOfY').innerHTML = '&nbsp;&nbsp;page ' + page + ' of ' + numPages + '&nbsp;&nbsp;'
    document.getElementById('pageXOfY-below').innerHTML = '&nbsp;&nbsp;page ' + page + ' of ' + numPages + '&nbsp;&nbsp;'
}

function displayPhotos(array) {
    photoHTML = ""
    array.forEach(function(photo) {
        photoHTML += '<div class="responsive"><div class="gallery" onclick="toggleModal(' + photo.id + ')"><img src="' + photo.url_sq_cdn + '" alt="' + photo.title + '" width="600" height="400"><div class="desc">' + shortTitle(photo.title) + '</div></div></div>'
    })
    $('#photos').html(photoHTML)
}

function shortTitle(title) {
    if (title.length > shortTitleLength)
        return title.slice(0, shortTitleLength) + '...'
    return title
}

function handleSearchEvent(event) {
    if (event.key) {
        searchTerm = document.getElementById("myInput").value
        page = 1
        console.log("search: searchTerm = ", searchTerm)
        filterAndDisplay(cleanPhotoArray)
    }
}

function handlePaginationChange(action) {
    if (action === 'next') page += 1
    if (action === 'prev') page -= 1
    if (action === 'first') page = 1
    if (action === 'last') page = numPages
    filterAndDisplay(cleanPhotoArray)
}


// ----- modal -----

function toggleModal(id) {
    console.log('toggleModal: event = ', id)
    const modalNode = document.getElementById("myModal")
    if (modalNode.style.display === 'none' || getComputedStyle(modalNode, null).display === 'none') {
        modalNode.style.display = 'block'
        populateModal(id)
    }
    else
        modalNode.style.display = 'none'
}

function populateModal(id) {
    const modalPhoto = currentPageOfPhotos.filter(function(photo) {
        return parseInt(photo.id) === id
    })[0]
    console.log('toggleModal: modalPhoto = ', modalPhoto)
    document.getElementById('modal-image-title').innerHTML = modalPhoto.title
    document.getElementById("modal-title-input").value = modalPhoto.title
    document.getElementById("modal-desc-input").value = modalPhoto.description._content
    document.getElementById('modal-pd-input').checked = modalPhoto.ispublic ? true : false
    document.getElementById('modal-image-id').innerHTML = 'ID: ' + modalPhoto.id
    document.getElementById('modal-image-owner').innerHTML = 'Owner Name: ' + modalPhoto.ownername
    document.getElementById('modal-image-dimensions').innerHTML = 'Image Dimensions: ' + modalPhoto.width_l + ' x ' + modalPhoto.height_l
    document.getElementById('modal-submit').setAttribute('onclick', 'processModalInput(' + modalPhoto.id + ')')

}

// a click outside of the modal-content div will close the modal
window.onclick = function(event) {
    const modalNode = document.getElementById("myModal")
    if (event.target == modalNode) {
        modalNode.style.display = "none";
    }
}

function processModalInput(id) {
    console.log('processForm: invoked')
    console.log('modal-title-input = ', document.getElementById("modal-title-input").value)
    cleanPhotoArray.forEach(function(photo) {
        if (photo.id == id) {
            photo.title = document.getElementById("modal-title-input").value
            photo.description._content = document.getElementById("modal-desc-input").value
            photo.ispublic = document.getElementById('modal-pd-input').checked ? 1 : 0
        }
    })
    localStorage.setItem('photoJSON', JSON.stringify(cleanPhotoArray))
    toggleModal()
    filterAndDisplay(cleanPhotoArray)
}