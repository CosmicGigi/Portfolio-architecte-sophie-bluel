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

  // Initialize the application
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
      const [works, categories] = await Promise.all([
        fetchWorks(),
        fetchCategories(),
      ]);
      renderGallery(works);
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
    window.location.reload();
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
    const works = await fetchWorks();
    works.forEach((work) => {
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
        await renderModalGallery();
        const works = await fetchWorks();
        renderGallery(works);
      });
    });
  }

  async function populateCategorySelect() {
    const categorySelect = document.getElementById("category");
    try {
      const categories = await fetchCategories();
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
    const imageInput = document.getElementById("image");
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
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        await renderGallery();
        await renderModalGallery();
        closeModal();
      } else {
        throw new Error("Erreur lors de l'ajout de la photo");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }
});
