// Fonction pour récupérer les travaux depuis l'API
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

// Idem pour deleteWork