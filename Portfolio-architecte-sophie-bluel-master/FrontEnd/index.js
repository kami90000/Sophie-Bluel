// Déclaration et initialisation des variables
const gallery = document.querySelector(".gallery");
let elementTableau;

// Fonction asynchrone pour récupérer les données depuis l'API
async function getWork() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const json = await response.json();
    elementTableau = json;
    ajoutGallerie(json);
  } catch (error) {
    console.log(error);
  }
}

// Appel de la fonction pour récupérer les données
getWork();

// Fonction pour ajouter les éléments de la galerie à partir des données JSON
function ajoutGallerie(json) {
  gallery.innerHTML = "";
  json.forEach((element) => {
    const figure = `<figure>
      <img src=${element.imageUrl} alt=${element.title}>
      <figcaption>${element.title}</figcaption>
    </figure>`;
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = figure + gallery.innerHTML;
  });
}
// Récupération des boutons de catégorie
const btnAll = document.querySelector(".all");
const btnObject = document.querySelector(".object");
const btnAppart = document.querySelector(".appart");
const btnHotels = document.querySelector(".hotel_and_restaurant");
let category = window.localStorage.getItem("categoryId");

// Fonction générique pour filtrer et mettre à jour la galerie en fonction de la catégorie sélectionnée
const filtrerEtMettreAJourGalerie = (categoryId) => {
    const projectFiltrees = elementTableau.filter(
      (el) => el.categoryId === categoryId
    );
    console.log(projectFiltrees);
    document.querySelector(".gallery").innerHTML = "";
    ajoutGallerie(projectFiltrees);
  };
  
  // Écouteurs d'événements pour les boutons de catégorie
  btnAll.addEventListener("click", () => {
    const projectFiltrees = elementTableau.filter((el) => el.categoryId);
    document.querySelector(".gallery").innerHTML = "";
    ajoutGallerie(projectFiltrees);
  });
  
  btnObject.addEventListener("click", () => {
    filtrerEtMettreAJourGalerie(1);
  });
  
  btnAppart.addEventListener("click", () => {
    filtrerEtMettreAJourGalerie(2);
  });
  
  btnHotels.addEventListener("click", () => {
    filtrerEtMettreAJourGalerie(3);
  });
  
  // Gestion des modales
  
  // Vérification de l'existence d'un token
  const token = localStorage.token;
  const editPart = document.querySelectorAll(".edit");
  const editTop = document.querySelector(".edit-top");
  const btnFilter = document.querySelector(".btn-filter");
  const login = document.querySelector("#login");
  if (token) {
    // Affichage des éléments d'édition si un token existe
    editPart.forEach((editPart) => {
      editPart.style = "display: flex;";
      editTop.style = "display: block;";
    });
    btnFilter.style = "display:none;";
    login.innerHTML = "<li>logout</li>";
  }
  
  // Déconnexion de l'utilisateur en cliquant sur le bouton de login/logout
  login.addEventListener("click", () => {
    if (token) {
      localStorage.removeItem("token");
    }
  });
  
  // Gestion des modales d'édition et d'ajout
  
  // Récupération des éléments de la modale d'édition
  const editBtn = document.querySelector(".edit-project");
  const modale = document.querySelector(".modale");
  const overlay = document.querySelector(".overlay");
  const cross = document.querySelector(".cross");
  
  // Récupération des éléments de la modale d'ajout
  const modaleAdd = document.querySelector(".modale-add");
  const closeMod = document.querySelector(".cross-add");
  
  // Fermeture des modales en cliquant sur l'overlay ou la croix
  overlay.addEventListener("click", () => {
    if (overlay) {
      modale.style = "display: none;";
      overlay.style = "display: none;";
      modaleAdd.style = "display: none;";
    }
  });
  
  cross.addEventListener("click", () => {
    if (cross) {
      modale.style = "display: none;";
      overlay.style = "display: none;";
    }
  });
  
  closeMod.addEventListener("click", () => {
    if (closeMod) {
      modale.style = "display: none;";
      overlay.style = "display: none;";
      modaleAdd.style = "display: none;";
    }
  });
  
  // Fonction pour ajouter les éléments de la modale d'édition à partir des données JSON
  function ajoutGallerieModale(json) {
    const projectContainer = document.querySelector(".picture-container");
    projectContainer.textContent = ""; // Vider le contenu existant
    json.forEach((element) => {
      const figure = `<figure class="picture">
        <div class="i-container"><i id=${element.id} class="fa-solid fa-trash-can corbeil" style="color: #fff;"></i></div>
        <img class="img-delete" src=${element.imageUrl} alt=${element.title}>
        <p>éditer</p>
      </figure>`;
  
      projectContainer.innerHTML += figure; // Ajouter chaque image
    });
    const deleteBtns = document.querySelectorAll(".corbeil");
    const btns = [...deleteBtns];
  
    btns.forEach((btn) =>
      btn.addEventListener("click", () => deletWorks(btn.id))
    );
  }
  
  // Suppression d'un projet en utilisant l'API
  async function deletWorks(id) {
    console.log(id);
    const response = await fetch(
      "http://" + window.location.hostname + `:5678/api/works/${id}`,
      {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getWork();
  }
  
  // Mise à jour de la galerie d'images et affichage de la modale d'édition
  editBtn.addEventListener("click", async () => {
    if (editBtn) {
      try {
        const response = await fetch("http://localhost:5678/api/works");
        const json = await response.json();
        ajoutGallerieModale(json);
      } catch (error) {
        console.log(error);
      }
      modale.style = "display: flex;";
      overlay.style = "display: block;";
    }
  });
  
  // Affichage de la modale d'ajout en cliquant sur le bouton correspondant
  const addPic = document.querySelector(".add-pic");
  const arrowLeft = document.querySelector(".arrow-left");
  
  arrowLeft.addEventListener("click", () => {
    if (arrowLeft) {
      modale.style = "display: flex;";
      overlay.style = "display: block;";
      modaleAdd.style = "display: none;";
    }
  });
  
  addPic.addEventListener("click", () => {
    if (addPic) {
      modaleAdd.style = "display: flex;";
      modale.style = "display: none;";
    }
  });
  
  // Vérification de la taille du fichier ajouté avant l'envoi
  let uploadField = document.getElementById("addPic");
  uploadField.onchange = function () {
    if (uploadField.files[0].size > 5000000) {
      alert("Fichier trop volumineux !");
      uploadField.value = "";
    }
  };
  // Gestion de l'input categorie pour y insérer toutes les categories presente
  const selectCategory = document.querySelector("#categorySelect");
  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();
      // Parcours du tableau de catégories et génération des options du select
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        selectCategory.add(option);
      });
    } catch (error) {
      console.log(error);
    }
  }
  fetchCategories();
  
  // Gestion du formulaire d'ajout de photos/img/titre et categorie
  const formAdd = document.querySelector(".form-add");
  formAdd.addEventListener("submit", AddPicture);
  const titleForm = document.querySelector("#text");
  const categoryForm = document.querySelector("#categorySelect");
  const addAPic = document.querySelector("#addPic");
  const submitBtn = document.querySelector(".btn-submit");
  
  // Vérification de la validité des champs du formulaire avant soumission
  formAdd.addEventListener("change", (event) => {
    event.preventDefault(); // Empêcher la soumission du formulaire
    if (titleForm !== "" && categoryForm !== "") {
      submitBtn.style.background = "#1D6154";
      submitBtn.style.cursor = "pointer";
    } else {
      // Afficher un message d'erreur ou effectuer d'autres actions si les champs ne sont pas bien remplis
      submitBtn.style.backgroundColor = "";
      alert("Veuillez remplir tous les champs du formulaire.");
    }
  });
  
  // Gestion de la preview de l'image lors de l'ajout
  let imgPreview = "";
  const divImg = document.querySelector(".preview-image");
  
  function addImg() {
    const addAPic = document.getElementById("addPic");
    addAPic.addEventListener("change", (e) => {
      //"change" pour détecter les modifications dans un élément de type file
      imgPreview = e.target.files[0];
      const img = URL.createObjectURL(addAPic.files[0]);
      const previewImg = document.createElement("img"); // Créez un nouvel élément img
      previewImg.className = "import-pictures";
      previewImg.src = img;
      previewImg.alt = "image insérée"; // alt pour définir l'attribut alt de l'image
      previewImg.style.visibility = "visible";
      divImg.appendChild(previewImg); // Ajout de l'élément img à la div .preview-image
    });
  }
  
  // Fonction pour ajouter des images via la modale, FormData est utilisé pour envoyer les données du formulaire dans une requête HTTP.
  async function AddPicture(e) {
    e.preventDefault();
    const image = addAPic.files[0];
    const categorie = categoryForm.value;
    const title = titleForm.value;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", categorie);
    formData.append("title", title);
    const reponse = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    getWork();
  }
  
  addImg();
  