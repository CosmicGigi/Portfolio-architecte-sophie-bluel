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

  function configureLoginButton() {
    authValid.innerHTML = "login";
    authValid.href = 'login.html';
    authValid.style.fontWeight = 'normal';
    authValid.style.fontSize = '16.8px';
    authValid.style.padding = '0 10px';
  }

  function configureLogoutButton() {
    authValid.innerHTML = "logout";
    authValid.href = "index.html";
    authValid.style.fontSize = '16.8px';
    authValid.style.padding = '0 10px';
  }

  function showAdminFeatures() {
    openModalBtn.style.display = 'block';
    if (editionMode) editionMode.style.display = 'flex';
  }

  function hideAdminFeatures() {
    openModalBtn.style.display = 'none';
    if (editionMode) editionMode.style.display = 'none';
  }

  function handleAuthClick() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    configureLoginButton();
    hideAdminFeatures();
    window.location.reload();
  }

  async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) throw new Error('Erreur lors de la récupération des travaux');
    return response.json();
  }

  async function fetchCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
    return response.json();
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

  async function deleteWork(workId) {
    try {
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
        }
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  function showAddPhotoForm() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';
    const form = createElement('form', { id: 'addPhotoForm' });

    const titleInput = createElement('input', { attributes: { type: 'text', name: 'title', placeholder: 'Titre' } });
    const categorySelect = createElement('select', { attributes: { name: 'category' } });
    const fileInput = createElement('input', { attributes: { type: 'file', name: 'image' } });
    const submitBtn = createElement('button', { textContent: 'Valider', type: 'submit' });

    form.appendChild(titleInput);
    form.appendChild(categorySelect);
    form.appendChild(fileInput);
    form.appendChild(submitBtn);

    form.addEventListener('submit', handleAddPhoto);
    modalContent.appendChild(form);

    populateCategorySelect(categorySelect);
  }

  async function populateCategorySelect(categorySelect) {
    try {
      const categories = await fetchCategories();
      categories.forEach(category => {
        const option = createElement('option', { value: category.id, textContent: category.name });
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  }

  async function handleAddPhoto(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
        }
      });
      if (response.ok) {
        const newWork = await response.json();
        const works = await fetchWorks();
        renderGallery(works);
        closeModal();
      } else {
        throw new Error('Erreur lors de l\'ajout du travail');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo:', error);
      
    }
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

async function handleAddPhoto(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
      }
    });
    
    if (response.ok) {
      const newWork = await response.json();
      alert('Photo ajoutée avec succès');
      
    
      const works = await fetchWorks();
      renderGallery(works);
    } else {
      throw new Error('Erreur lors de l\'ajout du travail');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error);
    alert('Erreur lors de l\'ajout de la photo');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addPhotoForm = document.getElementById('addPhotoForm');
  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', handleAddPhoto);
  }
});

function openModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  renderModalGallery();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

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

async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

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

async function handleAddPhoto(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
      }
    });

    if (response.ok) {
      alert('Photo ajoutée avec succès');
      const works = await fetchWorks();
      renderGallery(works);
      closeModal();
    } else {
      console.error('Erreur lors de l\'ajout du travail:', await response.text());
      alert('Erreur lors de l\'ajout de la photo');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error);
    alert('Erreur lors de l\'ajout de la photo');
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

  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    populateCategorySelect();
  });

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

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}