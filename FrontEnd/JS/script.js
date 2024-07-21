// Fonction pour créer et retourner un élément HTML avec des options
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
        if (key === 'classes') {
            value.forEach(className => element.classList.add(className));
        } else if (key === 'attributes') {
            Object.entries(value).forEach(([attr, val]) => element.setAttribute(attr, val));
        } else {
            element[key] = value;
        }
    });
    return element;
}

// Fonction pour afficher les travaux dans la galerie
function renderGallery(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    const uniqueWorks = new Set(); // Set pour garantir l'unicité des travaux
    works.forEach(work => {
        // Crée une clé unique pour chaque travail
        const workKey = `${work.imageUrl}-${work.title}`;
        if (!uniqueWorks.has(workKey)) {
            uniqueWorks.add(workKey); // Ajoute le travail au Set si unique

            const workElement = createElement('figure', { classes: ['work'] });
            const img = createElement('img', { attributes: { src: work.imageUrl, alt: work.title } });
            const figCaption = createElement('figcaption', { textContent: work.title });

            workElement.appendChild(img);
            workElement.appendChild(figCaption);
            gallery.appendChild(workElement);
        }
    });
}

// Fonction pour afficher les catégories dans le menu
function renderCategoryFilters(categories) {
    const filters = document.querySelector('.filters');
    filters.innerHTML = '';

    const uniqueCategories = new Set(); // Set pour garantir l'unicité des catégories

    const createCategoryButton = (name, onClickHandler) => {
        const button = createElement('button', { textContent: name });
        button.addEventListener('click', onClickHandler);
        return button;
    };

    // Ajoute le bouton "Tous" une seule fois
    filters.appendChild(createCategoryButton('Tous', () => filterGalleryByCategory(null)));

    categories.forEach(category => {
        const categoryKey = category.name; // Utilise le nom comme clé unique
        if (!uniqueCategories.has(categoryKey)) {
            uniqueCategories.add(categoryKey); // Ajoute la catégorie au Set si unique

            filters.appendChild(createCategoryButton(category.name, () => filterGalleryByCategory(category.id)));
        }
    });
}

// Fonction pour filtrer les travaux par catégorie
function filterGalleryByCategory(categoryId) {
    const filteredWorks = categoryId === null 
        ? allWorks 
        : allWorks.filter(work => work.categoryId === categoryId);
    renderGallery(filteredWorks);
}

// Variables globales pour stocker les données
let allWorks = [];

// Initialiser l'application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        allWorks = await fetchWorks();
        const categories = await fetchCategories();
        renderGallery(allWorks);
        renderCategoryFilters(categories);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
});