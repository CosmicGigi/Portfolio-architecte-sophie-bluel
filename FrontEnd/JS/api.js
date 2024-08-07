/// Fonction pour récupérer les travaux depuis l'API
// export async function fetchWorks() {
async function fetchWorks() {
    // Ajouter des try / catch
    const resp = await fetch('http://localhost:5678/api/works');
    return resp.json();
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    // Ajouter des try / catch
    const resp = await fetch('http://localhost:5678/api/categories');
    return resp.json();
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
      if (!resp.ok) throw new Error('Erreur lors de la suppression');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  // revoir api categories et travaux (try catch), les corriger dans modal etc, ajouter import/export