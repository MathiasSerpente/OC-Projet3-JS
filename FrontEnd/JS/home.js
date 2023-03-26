let works = [];
let categoriesOfWorks = [];
let categories = [];
let categoriesSet = new Set();
let filteredWorks= [];
let figureAddedToGallery = new Object();
let token = window.localStorage.getItem("token");

// Sélection du bandeau Admin et de ses éléments
const controlsModalContainer = document.querySelector(".controls-modal-container");
const editButtons = document.querySelectorAll(".edit-button");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const applyButton = document.querySelector(".apply-button");
// Sélection de la fenêtre modale et de l'overlay
const modalEditGallery = document.querySelector("#modal-edit-gallery");
const overlay = document.querySelector(".overlay");
// Sélection de la page Gallerie et de ses éléments 
const modalWrapperGallery = document.querySelector(".modal-wrapper-gallery");
const modalCloseGalleryButton = document.querySelector(".modal-close-gallery-button");
const modalGallery = document.querySelector(".modal-gallery"); 
const newPhotoButton = document.querySelector(".new-photo-button");
// Sélection de la page Ajouter une photo et de ses éléments
const modalWrapperAddPhoto = document.querySelector(".modal-wrapper-add-photo");
const modalCloseAddPhotoButton = document.querySelector(".modal-close-add-photo-button");
const modalPreviousButton = document.querySelector(".modal-previous-button");
const modalForm = document.querySelector(".modal-form");
const modalInputImage = document.querySelector("#modal-input-image");
const modalInputDescription = document.querySelector("#modal-input-description");
const modalInputCategory = document.querySelector("#modal-input-category");
const inputs = [modalInputImage, modalInputDescription, modalInputCategory];
const imagePreview = document.querySelector("#image-preview");
const modalInputImageContainerHiddenElements = document.querySelectorAll(".hide");
const modalButtonValidForm = document.querySelector(".validate-button");
const closeModalElements = document.querySelectorAll(".close-modal");
// Sélection du titre Mes Projets
const titleWorks = document.querySelector("#portfolio h2");
// Sélection des lien login/logout
const loginLink = document.querySelector(".login-link");
const logoutLink = document.querySelector(".logout-link");
// Sélection du menu filtre et de la gallerie
const filtersContainer = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");

// Fonciton pour récupérer les Works et les Categories sur l'API
function fetchWorksAndCategories() {
    fetch("http://localhost:5678/api/works")
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        works = response;
    })
    .then(function () {
        categoriesOfWorks = works.map(function (work) {
            return work.category;
        });
    })
    .then(function () {
        for (const categoryOfWork of categoriesOfWorks){
            const categoryofWorkJSON = JSON.stringify(categoryOfWork);
            if (!categoriesSet.has(categoryofWorkJSON)) {
                categories.push(categoryOfWork);
            }
            categoriesSet.add(categoryofWorkJSON);
        }
    })
    .catch(error => console.log(error.message));
}

// Fonction pour générer la gallerie de la fenêtre modale
function generateWorksModalGallery(array) {
    modalGallery.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const work = array[i];
        const workCard = document.createElement("li");
        workCard.innerHTML =   `<img src="${work.imageUrl}" alt="${work.title}">
                                <div class="work-card-icons">
                                    <button class="enlarge-button"><a href="${work.imageUrl}" class="enlarge-link"><i class="fa-solid fa-up-down-left-right"></i></a></button>
                                    <button class="trash-button" id="trash-${work.id}"><i class="fa-regular fa-trash-can"></i></button>
                                </div>
                                <button class="edit-work">éditer</button>`;
        workCard.classList.add("work-card");
        workCard.setAttribute("data-id", `${work.id}`);
        modalGallery.appendChild(workCard);
        const workTrashButton = document.querySelector(`#trash-${work.id}`);
        workTrashButton.addEventListener("click", function () {
            fetch(`http://localhost:5678/api/works/${work.id}`, { 
                method: "delete", 
                headers: { 
                    "Authorization": `Bearer ${token}`
                },
                body: work.id
            })
            .then(function (response) {
                if (response.status === 204) {
                    const removedElements = document.querySelectorAll(`[data-id="${work.id}"]`);
                    for (const removedElement of removedElements) {
                        removedElement.remove();
                    }
                    fetchWorksAndCategories();
                } else {
                    alert("La photo n'a pu être supprimée.");
                }
            })
            .catch(error => console.log(error.message));
        });
    }
}

// Fonction de génération des options du select
function generateOptions(array) {
    for (let i = 0; i < array.length; i++) {
        const category = array[i];
        const optionElement = document.createElement("option");
        optionElement.innerHTML = `${category.name}`;
        optionElement.setAttribute("value", category.id);
        modalInputCategory.appendChild(optionElement);
    }
}

// Fonction pour créer un Work
function generateWork (object) {
    const workElement = document.createElement("figure");
    workElement.dataset.categoryId = object.categoryId;
    workElement.dataset.id = object.id;
    const imageElement = document.createElement("img");
    imageElement.src = object.imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = object.title;
    gallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
}

// Fonction pour générer les Works dans la galerie
function generateWorksGallery(array) {
    gallery.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const work = array[i];
        generateWork(work);
    }
}

// Fonction de création des boutons filtres
function generateButtons (array) {
    for (let i = 0; i < array.length; i++) {
        const category = array[i];
        const buttonElement = document.createElement("button");
        buttonElement.setAttribute("style", "min-width: 100px; border-radius: 40px; border: 1px solid #1d6154; background-color: #fffef8; color: #1d6154; font-family: 'Syne'; font-size: 16px; font-weight: 700;padding: 10px; cursor: pointer;");
        buttonElement.setAttribute("class", "filter");
        buttonElement.addEventListener("mouseenter", function(event) {   
            event.target.style.color = "#fffef8";
            event.target.style.backgroundColor = "#1d6154";
        });
        buttonElement.addEventListener("mouseleave", function(event) {   
            event.target.style.color = "#1d6154";
            event.target.style.backgroundColor = "#fffef8";
        });
        buttonElement.innerText= category.name;
        buttonElement.dataset.id = i + 1;
        buttonElement.addEventListener("click", function() {
                filteredWorks = works.filter(function (work) {
                    return work.categoryId === i + 1;
                });
                generateWorksGallery(filteredWorks);
            });
        filtersContainer.appendChild(buttonElement);
    }
}

// Fonction de fermeture de la modale
function closeModal() {
    modalEditGallery.style.display = "none";
    modalEditGallery.setAttribute("aria-hidden", "true");
    modalEditGallery.removeAttribute("aria-modal");
    overlay.style.display = "none";
    modalWrapperGallery.style.display = "none";
    modalWrapperGallery.style.flexDirection = "unset";
    modalWrapperAddPhoto.style.display = "none";
    modalWrapperAddPhoto.style.flexDirection = "unset";
    for (const input of inputs) {
        input.value = "";
    }
    modalButtonValidForm.setAttribute("disabled", "true");
    modalButtonValidForm.innerText = "Remplir tous les champs";
    imagePreview.setAttribute("src", "");
    for (const element of modalInputImageContainerHiddenElements) {
        element.style.display = "inline-block";
    }
}

// Display bandeau Admin, display menu filtres, switch liens login/logout
if (token !== null) {
    controlsModalContainer.style.display = "flex";
    titleWorks.style.marginTop= "100px";
    filtersContainer.style.display = "none";
    loginLink.style.display = "none";
    logoutLink.style.display = "unset";
    for (let editButton of editButtons) {
        editButton.style.display = "unset";
    }
} else {
    controlsModalContainer.style.display = "none";
    titleWorks.style.marginBottom = "0";
    titleWorks.style.marginTop= "150px";
    filtersContainer.style.display = "flex";
    filtersContainer.style.margin = "50px 0";
    loginLink.style.display = "unset";
    logoutLink.style.display = "none";
    for (let editButton of editButtons) {
        editButton.style.display = "none";
    }
};

// // Ajout fonction rafraichir gallerie  sur le bouton publier     
applyButton.addEventListener("click", function () {
    generateWorksGallery(works);
});

// Se déconnecter en appuyant sur Logout
logoutLink.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    location.reload();
});

// Création du bouton "Tous" dans le menu filtres
const buttonAll = document.createElement("button");
buttonAll.setAttribute("style", "min-width: 100px; border-radius: 40px; border: 1px solid #1d6154; background-color: #fffef8; color: #1d6154; font-family: 'Syne'; font-size: 16px; font-weight: 700;padding: 10px; cursor: pointer;");
buttonAll.addEventListener("mouseenter", function(event) {   
    event.target.style.color = "#fffef8";
    event.target.style.backgroundColor = "#1d6154";
});
buttonAll.addEventListener("mouseleave", function(event) {   
    event.target.style.color = "#1d6154";
    event.target.style.backgroundColor = "#fffef8";
});
buttonAll.innerText = "Tous";
buttonAll.addEventListener("click", function() {
    generateWorksGallery(works);
});
filtersContainer.appendChild(buttonAll);

// Modal Triggers -> Ouverture fenêtre modale
for (let i = 0; i < modalTriggers.length; i++) {
    const modalTrigger = modalTriggers[i];
    modalTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        modalEditGallery.style.display = "flex";
        modalEditGallery.removeAttribute("aria-hidden");
        modalEditGallery.setAttribute("aria-modal", "true");
        overlay.style.display = "unset";
        modalWrapperGallery.style.display = "flex";
        modalWrapperGallery.style.flexDirection = "column";
        generateWorksModalGallery(works);
    });
}

// Page Gallerie -> Page Ajout photo
newPhotoButton.addEventListener("click", function () {
    modalWrapperGallery.style.display = "none";
    modalWrapperGallery.style.flexDirection = "unset";
    modalWrapperAddPhoto.style.display = "flex";
    modalWrapperAddPhoto.style.flexDirection = "column";
});

// Page Gallerie <- Ajout photo
modalPreviousButton.addEventListener("click", function () {
    modalWrapperAddPhoto.style.display = "none";
    modalWrapperAddPhoto.style.flexDirection = "unset";
    modalWrapperGallery.style.display = "flex";
    modalWrapperGallery.style.flexDirection = "column";
    for (const input of inputs) {
        input.value = "";
    }
    modalButtonValidForm.setAttribute("disabled", "true");
    modalButtonValidForm.innerText = "Remplir tous les champs";
    imagePreview.setAttribute("src", "");
    for (const element of modalInputImageContainerHiddenElements) {
        element.style.display = "inline-block";
    }
});

// Fermeture de la modale au click sur les triggers
for (const closeModalElement of closeModalElements) {
    closeModalElement.addEventListener("click", function () {
        closeModal();
    });
};

// Gestion du bouton Valider : disabled = "true/false"
for (const input of inputs) {
    input.addEventListener("input", function () {
        if (modalInputImage.value !== "" && modalInputDescription.value !== "" && modalInputCategory.value !== "") {
            modalButtonValidForm.removeAttribute("disabled");
            modalButtonValidForm.innerText = "Valider";
        } else {
            modalButtonValidForm.setAttribute("disabled", "true");
            modalButtonValidForm.innerText = "Remplir tous les champs";
        }
    });
};

// Affichage de l'image dans le container image input
modalInputImage.addEventListener("change", function(e) {
    const file = e.target.files[0];
    let blob = new Blob([file]);
    const imageUrl = URL.createObjectURL(blob);
    imagePreview.setAttribute("src", `${imageUrl}`);
    imagePreview.style.height = "180px";
    for (const element of modalInputImageContainerHiddenElements) {
        element.style.display = "none";
    }
});

// Envoi des données du formulaire d'Ajout de photo de la modale
modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const imageData = modalInputImage.files[0];
    const titleData = modalInputDescription.value;
    const categoryData = parseInt(modalInputCategory.value);
    let formData = new FormData();
    formData.append("title", titleData);
    formData.append("image", imageData);
    formData.append("category", categoryData);

    let dataFetch = {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData,
    };

    fetch("http://localhost:5678/api/works", dataFetch)
    .then(function (response) {
        if (response.status === 201) {
            return response.json()
        } else {
            alert("La photo n'a pu être ajoutée.");
            return
        }
    })
    .then(function (response) {
        figureAddedToGallery = response;
        generateWork(figureAddedToGallery);
    })
    .then(function () {
        fetchWorksAndCategories();
    })
    .then(function () {
        closeModal();
    })
    .catch(error => console.log(error.message));
});

// Initialisation de la page d'accueil
fetch("http://localhost:5678/api/works")
.then(function (response) {
    return response.json();
})
.then(function (response) {
    works = response;
})
.then(function () {
    categoriesOfWorks = works.map(function (work) {
        return work.category;
    });
})
.then(function () {
    for (const categoryOfWork of categoriesOfWorks){
        const categoryofWorkJSON = JSON.stringify(categoryOfWork);
        if (!categoriesSet.has(categoryofWorkJSON)) {
            categories.push(categoryOfWork);
        }
        categoriesSet.add(categoryofWorkJSON);
    }
})
.then(function () {
    generateWorksGallery(works);
})
.then(function () {
    generateButtons(categories);
})
.then(function () {
    generateWorksModalGallery(works);
})
.then(function () {
    generateOptions(categories);
})
.catch(error => console.log(error.message));
