// localStorage.clear();

// import { userToken } from "./login.js";
// console.log(userToken);

const bodyElement = document.querySelector("body");
bodyElement.style.backgroundColor = "#fffef8";
const gallery = document.querySelector(".gallery");
let works = window.localStorage.getItem("works");
let categories = window.localStorage.getItem("categories");
let token = window.localStorage.getItem("token");
console.log(token);

if (works === null) {
    // Récupération des travaux depuis l'API
    const responseWorks = await fetch("http://localhost:5678/api/works/");
    works = await responseWorks.json();
    const worksStringified = JSON.stringify(works);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", worksStringified);
} else {
    works = JSON.parse(works);
}

if (categories === null) {
    // Récupération des catégories depuis l'API
    const responseCategories = await fetch("http://localhost:5678/api/categories/");
    categories = await responseCategories.json();
    const categoriesStringified = JSON.stringify(categories);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("categories", categoriesStringified);
} else {
    categories = JSON.parse(categories);
}

// Fonction pour générer les travaux dans la galerie
function generateWorks(array) {
    gallery.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const work = array[i];
        const workElement = document.createElement("figure");
        workElement.dataset.categoryId = work.categoryId;
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;
        gallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
    }
}
generateWorks(works);

// Création du menu filtres
const filtersContainer = document.createElement("div");
filtersContainer.setAttribute("style", "display : flex; justify-content : center; align-items : center; gap : 10px; width : 100%; margin-bottom: 40px;");
filtersContainer.setAttribute("class", "filters");
gallery.insertAdjacentElement("beforebegin", filtersContainer);
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
    generateWorks(works);
});
filtersContainer.appendChild(buttonAll);

// Fonction pour générer les boutons filtres
function generateButtons() {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
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
        filtersContainer.appendChild(buttonElement);
        }
    }
generateButtons();

// Ajout de la fonction de filtrage sur les boutons filtres
const buttonsFilter = document.querySelectorAll(".filter");
let filteredWorks;
for (let i = 0; i < buttonsFilter.length; i++) {
    const buttonFilter = buttonsFilter[i];
    buttonFilter.addEventListener("click", function() {
        filteredWorks = works.filter(function (work) {
            return work.categoryId === i + 1;
        });
        generateWorks(filteredWorks);
    });
}