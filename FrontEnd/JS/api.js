// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    const resp = await fetch('http://localhost:5678/api/works');
    return resp.json();
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    const resp = await fetch('http://localhost:5678/api/categories');
    return resp.json();
}