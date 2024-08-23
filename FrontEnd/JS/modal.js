// import { fetchWorks, fetchCategories, deleteWork } from "./api.js"
document.addEventListener('DOMContentLoaded', () => {
  const authValid = document.getElementById("authvalid");
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('.close');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const backToGalleryBtn = document.getElementById('backToGalleryBtn');
  const galleryView = document.getElementById('galleryView');
  const addPhotoView = document.getElementById('addPhotoView');
  const modal = document.getElementById('modal');
  const modalGallery = document.getElementById('modalGallery');
  const addPhotoForm = document.getElementById('addPhotoForm');


  initializeAuthUI();
  initializeGalleryAndFilters();

  authValid.addEventListener('click', handleAuthClick);
  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  addPhotoBtn.addEventListener('click', () => toggleView('addPhotoView'));
  backToGalleryBtn.addEventListener('click', () => toggleView('galleryView'));

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  async function initializeGalleryAndFilters() {
    try {
      const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
      renderGallery(works);
      renderCategoryFilters(categories);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  function initializeAuthUI() {
    const authToken = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole');

    if (authToken) {
      configureLogoutButton();
      if (userRole === 'admin') {
        showAdminFeatures();
      }
    } else {
      configureLoginButton();
      hideAdminFeatures();
    }
  }
//verifier ici nomoination fonction
  function configureLoginButton() {
    authValid.innerHTML = "login";
    authValid.href = 'login.html';
    authValid.style.fontWeight = 'normal';
    authValid.style.fontSize = '16.8px';
    authValid.style.padding = '0 10px';
  }

  function configureLogoutButton() {
    authValid.innerHTML = "logout";
    authValid.href = "login.html";
    authValid.style.fontSize = '16.8px';
    authValid.style.padding = '0 10px';
  }
//cache modifier fontawesome
  function hideAdminFeatures() {
    openModalBtn.style.display = 'none';
  }

  function handleAuthClick() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    configureLoginButton();
    hideAdminFeatures();
    window.location.reload();
  }

  function openModal() {
    modal.style.display = 'block';
    renderModalGallery();
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function toggleView(viewId) {
    galleryView.style.display = viewId === 'galleryView' ? 'block' : 'none';
    addPhotoView.style.display = viewId === 'addPhotoView' ? 'block' : 'none';
  }

  async function renderModalGallery() {
    modalGallery.innerHTML = '';
    const works = await fetchWorks();
    works.forEach(work => {
      const workElement = document.createElement('div');
      workElement.classList.add('modal-work');
      workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <p>${work.title}</p>
        <button class="deleteWorkBtn" data-id="${work.id}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      modalGallery.appendChild(workElement);
    });

    document.querySelectorAll('.deleteWorkBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const workId = e.target.closest('.deleteWorkBtn').dataset.id;
        await deleteWork(workId);
        await renderModalGallery();
        const works = await fetchWorks();
        renderGallery(works);
      });
    });
  }

  function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    if (options.classes) options.classes.forEach(cls => element.classList.add(cls));
    if (options.attributes) Object.keys(options.attributes).forEach(attr => element.setAttribute(attr, options.attributes[attr]));
    if (options.textContent) element.textContent = options.textContent;
    if (options.type) element.type = options.type;
    return element;
  }
});

function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  populateCategorySelect();
  renderModalGallery();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const addPhotoForm = document.getElementById('addPhotoForm');
  
  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', handleAddPhoto);
  }

  setupModal();
});

async function populateCategorySelect() {
  const categorySelect = document.getElementById('category');
  try {
    const categories = await fetchCategories();
    categorySelect.innerHTML = '';

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du peuplement des catégories:', error);
  }
}

function setupModal() {
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = modal.querySelector('.close');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const backToGalleryBtn = document.getElementById('backToGalleryBtn');
  const galleryView = document.getElementById('galleryView');
  const addPhotoView = document.getElementById('addPhotoView');

  openModalBtn.addEventListener('click', openModal);

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  addPhotoBtn.addEventListener('click', () => {
    galleryView.style.display = 'none';
    addPhotoView.style.display = 'block';
  });

  backToGalleryBtn.addEventListener('click', () => {
    galleryView.style.display = 'block';
    addPhotoView.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const addPhotoForm = document.getElementById('addPhotoForm');
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');

  if (imageInput) {
    imageInput.addEventListener('change', handleImagePreview);
  }

  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', handleAddPhoto);
  }

  setupModal();
});

function handleImagePreview(event) {
  const file = event.target.files[0];
  const addPhotoButton = document.getElementById('addPhoto');
  
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      addPhotoButton.style.backgroundImage = `url(${e.target.result})`;
      addPhotoButton.style.backgroundSize = 'cover';
      addPhotoButton.style.backgroundPosition = 'center';
      
      addPhotoButton.style.width = '129px';  
      addPhotoButton.style.height = '169px';

    }
    
    reader.readAsDataURL(file);
  } else {
    addPhotoButton.style.backgroundImage = '';
    addPhotoButton.style.backgroundSize = '';
    addPhotoButton.style.backgroundPosition = '';
  }
}


function openModal() {
  const modal = document.getElementById('modal');
  const galleryView = document.getElementById('galleryView');
  const addPhotoView = document.getElementById('addPhotoView');

  modal.style.display = 'block';
  
  galleryView.style.display = 'block';
  addPhotoView.style.display = 'none';

  populateCategorySelect();
}