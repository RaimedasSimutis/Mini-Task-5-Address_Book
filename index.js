const contactInputForm = document.getElementById('contactInputForm');
const orderSelection = document.getElementById('orderSelection');
const searchInput = document.getElementById('searchInput');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

const deleteSelectedContacts = (elementToDelete) => {
   //getCardsFromLocalStorage()
    return elementToDelete.filter((el) => el.selected === false);
}


const contactsSearch = (arrToSearch, valueToSearch) => {
    return arrToSearch.filter((el) => el.name.includes(valueToSearch) || el.number.includes(valueToSearch));
}

const contactsSorting = (arrToSort, sortType) => {

    switch (sortType) {
        case 'byNameASC':
            arrToSort.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'byNameDESC':
            arrToSort.sort((a, b) => b.name.localeCompare(a.name));
            break;

        case 'byNumberASC':
            arrToSort.sort((a, b) => a.number.localeCompare(b.number));
            break;

        case 'byNumberDESC':
            arrToSort.sort((a, b) => b.number.localeCompare(a.number));
            
            break;
    }

    return arrToSort
}

const saveContactToLocalStorage = (arr) => {
    const contactsArrStringified = JSON.stringify(arr);
    localStorage.setItem('contacts', contactsArrStringified);
}

const getCardsFromLocalStorage = () => {
    const contactsFromStorage = localStorage.getItem('contacts');
    return (contactsFromStorage === null) ? [] : JSON.parse(contactsFromStorage);
}

const saveContact = () => {
    let contactsArr = getCardsFromLocalStorage();
    const date = new Date();
    const contact = {
        id: date.getTime(),
        name: contactInputForm[0].value,
        number: contactInputForm[1].value,
        favorite: false,
        selected: false,
    }

    contactsArr.push(contact);
    saveContactToLocalStorage(contactsSorting(contactsArr, 'byNameASC'));
    renderContacts(contactsArr);
}

const renderFavoriteContacts = (arrElement) => {
    let arrFavorites = arrElement.filter((el) => el.favorite === true);
    const favoritesOutputContainer = document.getElementById('favorites-output');
    favoritesOutputContainer.textContent = '';

    arrFavorites.forEach((element, index, fullArr) => {
        const contactContainer = document.createElement('tr');
        const contactNameCol = document.createElement('td');
        const contactName = document.createElement('p');
        const contactNumber = document.createElement('td');
        const favoriteStatus = document.createElement('td');
        const actionsCol = document.createElement('td');
        const addToFavoritesButton = document.createElement('button');

        // style
        addToFavoritesButton.classList.add('btn', 'btn-outline-warning', 'mx-1');

        contactName.textContent = element.name;
        contactNumber.textContent = element.number;
        addToFavoritesButton.textContent = element.favorite ? 'Remove from fav' : 'Add to fav';
        favoriteStatus.textContent = element.favorite;

        contactNameCol.appendChild(contactName);
        contactContainer.appendChild(contactNameCol)
        contactContainer.appendChild(contactNumber);
        contactContainer.appendChild(favoriteStatus);
        actionsCol.appendChild(addToFavoritesButton);
        contactContainer.appendChild(actionsCol)
        favoritesOutputContainer.appendChild(contactContainer);

        addToFavoritesButton.addEventListener('click', (event) => {
            if (element.favorite) {
                element.favorite = false;
            } else {
                element.favorite = true;
            }

            saveContactToLocalStorage(arrElement);
            renderFavoriteContacts(arrElement);
            renderContacts(arrElement);
        })
    });
}

const renderContacts = (arrElement) => {
    const outputContainer = document.getElementById('output');
    outputContainer.textContent = '';

    arrElement.forEach((element, index, fullArr) => {
        const contactContainer = document.createElement('tr');
        const contactNameCol = document.createElement('td');
        const contactName = document.createElement('p');
        const contactNumber = document.createElement('td');
        const favoriteStatus = document.createElement('td');
        const actionsCol = document.createElement('td');
        const selectedCheckBoxCol = document.createElement('td');

        const contactDeleteButton = document.createElement('button');
        const addToFavoritesButton = document.createElement('button');
        const editContactButton = document.createElement('button');
        const selectedCheckBox = document.createElement('input');

        //for cotacts editing
        const editContactName = document.createElement('input');

        //style
        editContactName.style.display = 'none';
        contactDeleteButton.classList.add('btn', 'btn-outline-danger', 'mx-1');
        addToFavoritesButton.classList.add('btn', 'btn-outline-warning', 'mx-1');
        editContactButton.classList.add('btn', 'btn-outline-info', 'mx-1');
        selectedCheckBox.type = 'checkbox';

        //content
        contactName.textContent = element.name;
        contactNumber.textContent = element.number;
        contactDeleteButton.textContent = 'Del';
        addToFavoritesButton.textContent = element.favorite ? 'Remove from fav' : 'Add to fav';
        editContactButton.textContent = 'Edit';
        editContactName.value = element.name;
        selectedCheckBox.checked = element.selected;

        favoriteStatus.textContent = element.favorite;

        selectedCheckBoxCol.appendChild(selectedCheckBox);
        contactContainer.appendChild(selectedCheckBoxCol)
        contactNameCol.appendChild(contactName);
        contactNameCol.appendChild(editContactName);
        contactContainer.appendChild(contactNameCol)
        contactContainer.appendChild(contactNumber);
        contactContainer.appendChild(favoriteStatus);
        actionsCol.appendChild(contactDeleteButton);
        actionsCol.appendChild(addToFavoritesButton);
        actionsCol.appendChild(editContactButton);
        
        contactContainer.appendChild(actionsCol)
        
        outputContainer.appendChild(contactContainer);

        contactDeleteButton.addEventListener('click', (event) => {
            //contactContainer.remove();
            let filteredArrElement = arrElement.filter(el => el.id !== element.id)
            saveContactToLocalStorage(filteredArrElement);
            renderContacts(filteredArrElement);
            renderFavoriteContacts(filteredArrElement);
            
        })

        addToFavoritesButton.addEventListener('click', (event) => {
            if (element.favorite) {
                element.favorite = false;
            } else {
                element.favorite = true;
            }

            saveContactToLocalStorage(arrElement);
            renderFavoriteContacts(arrElement);
            renderContacts(arrElement);

        })

        editContactButton.addEventListener('click', (event) => {
            if (editContactName.style.display !== 'none') {
                editContactName.style.display = 'none';
                contactName.style.display = 'initial';
                editContactButton.textContent = 'Edit';
            } else {
                editContactName.style.display = 'initial';
                contactName.style.display = 'none';
                editContactButton.textContent = 'Save';
            }

            if (editContactName.value !== element.name) {
                element.name = editContactName.value;
                saveContactToLocalStorage(fullArr);
                renderFavoriteContacts(contactsSorting(fullArr, 'byNameASC'));
                renderContacts(contactsSorting(fullArr, orderSelection.selectedOptions[0].value));
            } 
        })

        selectedCheckBox.addEventListener('click', (event) => {
            console.log('bam');
            //console.log(event.target.checked);
            
            if (event.target.checked) {
                element.selected = true;
                
            } else {
                element.selected = false;
            }

            saveContactToLocalStorage(fullArr);

            //console.log(fullArr)

            // saveContactToLocalStorage(arrElement);
            // renderFavoriteContacts(arrElement);
            // renderContacts(arrElement);

        })
    })
}

contactInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveContact();

})

orderSelection.addEventListener('change', (e) => {
    
    renderContacts(contactsSorting(getCardsFromLocalStorage(), e.target.selectedOptions[0].value));

})

searchInput.addEventListener('input', (e) => {

    if (e.target.value) {
        renderContacts(contactsSearch(getCardsFromLocalStorage(), e.target.value));

    } else {
        renderContacts(contactsSorting(getCardsFromLocalStorage(), orderSelection.selectedOptions[0].value));
    }

})

deleteSelectedBtn.addEventListener('click', (e) => {
    
    saveContactToLocalStorage(deleteSelectedContacts(getCardsFromLocalStorage()));
    renderContacts(getCardsFromLocalStorage());


})



renderContacts(contactsSorting(getCardsFromLocalStorage(), 'byNameASC'));
//renderContacts(getCardsFromLocalStorage());
renderFavoriteContacts(getCardsFromLocalStorage());