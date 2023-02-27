// email: sophie.bluel@test.tld
// password: S0phie 

// export let userToken;

let userToken;

const formLogin = document.querySelector("#login form");
const inputEmail = document.querySelector("form input[type='email']");
const inputPassword = document.querySelector("form input[type='password']");
const submitLogin = document.querySelector("form input[type='submit']");

inputEmail.addEventListener("blur", function () {
    inputEmail.reportValidity();
});

formLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    const loginData = {
        email : inputEmail.value,
        password : inputPassword.value,
    };
    console.log(inputEmail.value);
    console.log(inputPassword.value);
    console.log(loginData);
    const loginDataString = JSON.stringify(loginData);
    console.log(loginDataString);

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: loginDataString
    })
    .then(function (response) {
        console.log(response);
        console.log(response.status);
    
        if (response.status === 200) {
            response = response.json();
            console.log(response);
            response.then(function (result) {
            console.log(result);
            console.log(result.token);
            userToken = result.token;
            console.log(userToken);
            window.localStorage.setItem("token", userToken);
            document.location.href="index.html"; 
            })
        } else {
            console.log("Fail.");
            alert("Email ou mot de passe incorrect. ");
        }
    })
});