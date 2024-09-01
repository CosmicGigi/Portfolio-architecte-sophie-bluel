document.addEventListener("DOMContentLoaded", () => {
  const authValid = document.getElementById("authvalid");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.querySelector(".close");
  const addPhotoBtn = document.getElementById("addPhotoBtn");
  const backToGalleryBtn = document.getElementById("backToGalleryBtn");
  const galleryView = document.getElementById("galleryView");
  const addPhotoView = document.getElementById("addPhotoView");
  const modal = document.getElementById("modal");
  const modalGallery = document.getElementById("modalGallery");
  const addPhotoForm = document.getElementById("addPhotoForm");
  const imageInput = document.getElementById("image");

  let allWorks = [];
  let categories = [];

  initializeAuthUI();
  initializeGalleryAndFilters();
  setupEventListeners();

  function setupEventListeners() {
    if (authValid) authValid.addEventListener("click", handleAuthClick);
    if (openModalBtn) openModalBtn.addEventListener("click", openModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (addPhotoBtn)
      addPhotoBtn.addEventListener("click", () => toggleView("addPhotoView"));
    if (backToGalleryBtn)
      backToGalleryBtn.addEventListener("click", () =>
        toggleView("galleryView")
      );
    if (imageInput) imageInput.addEventListener("change", handleImagePreview);
    if (addPhotoForm) addPhotoForm.addEventListener("submit", handleAddPhoto);

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  async function initializeGalleryAndFilters() {
    try {
      [allWorks, categories] = await Promise.all([
        fetchWorks(),
        fetchCategories(),
      ]);
      renderGallery(allWorks);
      renderCategoryFilters(categories);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }

  function initializeAuthUI() {
    const authToken = sessionStorage.getItem("authToken");
    const userRole = sessionStorage.getItem("userRole");

    if (authToken) {
      configureLogoutButton();
      if (userRole === "admin") {
        showAdminFeatures();
      }
    } else {
      configureLoginButton();
      hideAdminFeatures();
    }
  }

  function configureLoginButton() {
    authValid.innerHTML = "login";
    authValid.href = "login.html";
    authValid.style.fontWeight = "normal";
    authValid.style.fontSize = "16.8px";
    authValid.style.padding = "0 10px";
  }

  function configureLogoutButton() {
    authValid.innerHTML = "logout";
    authValid.href = "login.html";
    authValid.style.fontSize = "16.8px";
    authValid.style.padding = "0 10px";
  }

  function hideAdminFeatures() {
    openModalBtn.style.display = "none";
  }

  function showAdminFeatures() {
    openModalBtn.style.display = "block";
  }

  function handleAuthClick() {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    configureLoginButton();
    hideAdminFeatures();

    window.location.href = "login.html";
  }

  function openModal() {
    modal.style.display = "block";
    galleryView.style.display = "block";
    addPhotoView.style.display = "none";
    populateCategorySelect();
    renderModalGallery();
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function toggleView(viewId) {
    galleryView.style.display = viewId === "galleryView" ? "block" : "none";
    addPhotoView.style.display = viewId === "addPhotoView" ? "block" : "none";
  }

  async function renderModalGallery() {
    modalGallery.innerHTML = "";
    allWorks.forEach((work) => {
      const workElement = document.createElement("div");
      workElement.classList.add("modal-work");
      workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <p>${work.title}</p>
        <button class="deleteWorkBtn" data-id="${work.id}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      modalGallery.appendChild(workElement);
    });

    document.querySelectorAll(".deleteWorkBtn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const workId = e.target.closest(".deleteWorkBtn").dataset.id;
        await deleteWork(workId);

        await refreshDataAndRender();
      });
    });
  }

  async function populateCategorySelect() {
    const categorySelect = document.getElementById("category");
    try {
      categorySelect.innerHTML = "";
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors du peuplement des catégories:", error);
    }
  }

  async function deleteWork(workId) {
    try {
      const resp = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("authToken"),
        },
      });
      if (resp.ok) {
        await refreshDataAndRender();
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }

  function handleImagePreview(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById("imagePreview");
    const addPhotoLabel = document.querySelector(".add-photo-label");
    const icon = document.querySelector("#addPhoto i");
    const sizephoto = document.querySelector("#addPhoto p");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        addPhotoLabel.style.display = "none";
        icon.style.display = "none";
        sizephoto.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleAddPhoto(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const file = imageInput.files[0];

    if (!file) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("authToken"),
        },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();
        allWorks.push(newWork);

        await refreshDataAndRender();

        resetAddPhotoForm();
      } else {
        throw new Error("Erreur lors de l'ajout de la photo");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  function resetAddPhotoForm() {
    document.getElementById("title").value = "";
    document.getElementById("category").value = "";
    imageInput.value = "";

    const imagePreview = document.getElementById("imagePreview");
    imagePreview.src = "";
    imagePreview.style.display = "none";

    const addPhotoLabel = document.querySelector(".add-photo-label");
    const icon = document.querySelector("#addPhoto i");
    const sizephoto = document.querySelector("#addPhoto p");

    addPhotoLabel.style.display = "block";
    icon.style.display = "block";
    sizephoto.style.display = "block";
  }

  function filterGalleryByCategory(categoryId) {
    const filteredWorks =
      categoryId === null
        ? allWorks
        : allWorks.filter((work) => work.categoryId === parseInt(categoryId));
    renderGallery(filteredWorks);
  }

  function renderCategoryFilters(categories) {
    const filtersContainer = document.querySelector(".filters");
    filtersContainer.innerHTML =
      '<button class="filter-btn active" data-id="null">Tous</button>';

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.classList.add("filter-btn");
      button.textContent = category.name;
      button.dataset.id = category.id;
      filtersContainer.appendChild(button);
    });

    filtersContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        document
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        filterGalleryByCategory(
          e.target.dataset.id === "null" ? null : parseInt(e.target.dataset.id)
        );
      }
    });
  }

  async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }

  async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  }

  function renderGallery(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
      gallery.appendChild(figure);
    });
  }

  async function refreshDataAndRender() {
    try {
      [allWorks, categories] = await Promise.all([
        fetchWorks(),
        fetchCategories(),
      ]);
      renderGallery(allWorks);
      renderModalGallery();
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
    }
  }
});
