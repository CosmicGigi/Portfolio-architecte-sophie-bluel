// api.js

// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
  try {
      const resp = await fetch('http://localhost:5678/api/works');
      return resp.json();
  } catch (error) {
      console.log('Erreur lors du chargement', error);
  }
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
  try {
      const resp = await fetch('http://localhost:5678/api/categories');
      return resp.json();
  } catch (error) {
      console.log('Erreur lors du chargement', error);
  }
}

// Fonction Delete pour travaux
async function deleteWork(workId) {
  try {
      const resp = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('authToken')
          }
      });
      
  } catch (error) {
      console.error('Erreur lors de la suppression:', error);
  }
}

// Fonction pour authentifier l'utilisateur
async function authenticateUser(email, password) {
  try {
      const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('authToken', data.token);
          sessionStorage.setItem('userRole', data.role);
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error('Erreur dans l’identifiant ou le mot de passe', error);
      return false;
  }
}

async function handleAddPhoto(event) {
    const form = event.target;
    const formData = new FormData(form);
  
    try {
        const response = await fetch(`http://localhost:5678/api/works/`, {
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
      } else {
        console.error('Erreur lors de l\'ajout du travail:', await response.text());
        alert('Erreur lors de l\'ajout de la photo');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo:', error);
      alert('Erreur lors de l\'ajout de la photo');
    }
  }