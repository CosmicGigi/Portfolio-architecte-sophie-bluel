async function fetchWorks() {
  try {
    const resp = await fetch("http://localhost:5678/api/works");
    return resp.json();
  } catch (error) {
    console.log("Erreur lors du chargement", error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const resp = await fetch("http://localhost:5678/api/categories");
    return resp.json();
  } catch (error) {
    console.log("Erreur lors du chargement", error);
    return [];
  }
}

async function authenticateUser(email, password) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("userRole", data.role);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erreur dans l’identifiant ou le mot de passe", error);
    return false;
  }
}

async function handleAddPhoto(event) {
  event.preventDefault();

  const addPhotoForm = document.getElementById("addPhotoForm");
  const formData = new FormData(addPhotoForm);

  try {
    const response = await fetch(`http://localhost:5678/api/works/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("authToken"),
      },
    });

    if (response.ok) {
      console.log("Image uploadée avec succès !");
      await renderModalGallery();
      toggleView("galleryView");
    } else {
      console.error("Erreur lors de l'ajout de l'image.");
    }
  } catch (error) {
    console.error("Erreur", error);
  }
}
