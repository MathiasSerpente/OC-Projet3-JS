let userToken = null;

//Sélection du formulaire et de ses éléments input
const formLogin = document.querySelector("#login form");
const inputEmail = document.querySelector("form input[type='email']");
const inputPassword = document.querySelector("form input[type='password']");
const submitLogin = document.querySelector("form input[type='submit']");

// Vérification de la validité du mail à la perte de focus de l'input email
inputEmail.addEventListener("blur", function () {
    inputEmail.reportValidity();
});

// Envoi du formulaire et réception/stokage du token dans le localStorage
formLogin.addEventListener("submit", function (e) {
    event.preventDefault(e);

    const loginData = {
        email : inputEmail.value,
        password : inputPassword.value,
    };
    const loginDataString = JSON.stringify(loginData);

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: loginDataString
    })
    .then(function (response) {
        if (response.status === 200) {
            response = response.json();
            response.then(function (result) {
                userToken = result.token;
                window.localStorage.setItem("token", userToken);
                document.location.href="index.html"; 
            })
        } else {
            alert("Erreur dans l’identifiant ou le mot de passe.");
        }
    })
    .catch(error => console.log(error.message));
});