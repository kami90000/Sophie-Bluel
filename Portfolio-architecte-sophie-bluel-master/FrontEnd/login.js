// Sélection de l'élément du formulaire de connexion
const connect = document.querySelector("input[type=submit]");

// Ajout d'un écouteur d'événement au clic sur le bouton de connexion
connect.addEventListener("click", function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre de manière conventionnelle
  loginUser(); // Appelle la fonction pour se connecter à l'API
});

// Fonction asynchrone pour gérer la connexion de l'utilisateur
async function loginUser() {
  // Récupération des valeurs des champs email et password
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // URL de l'API pour la connexion
  const url = "http://localhost:5678/api/users/login";

  // Envoi de la requête POST à l'API pour se connecter
  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Si la réponse est réussie, redirige l'utilisateur vers la page principale
        window.location.href = "./index.html";
        return response.json();
      } else {
        alert("Email ou mot de passe erronés");
      }
    })
    .then((data) => {
      // Stockage du token dans le localStorage
      localStorage.setItem("token", data.token);
      console.log(data.token);
    })
    .catch((error) => console.error(error));

  // Vérification de la présence du token dans le localStorage
  const token = localStorage.token;
  if (token) {
    // Envoi du token avec les requêtes à l'API
    fetch("http://localhost:5678/api/works", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(token);
          return response.json();
        } else {
          throw new Error("Erreur lors de la récupération des données.");
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.log(error);
        // alert(error.message);
      });
  }
}
