function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "classes") {
      value.forEach((className) => element.classList.add(className));
    } else if (key === "attributes") {
      Object.entries(value).forEach(([attr, val]) =>
        element.setAttribute(attr, val)
      );
    } else {
      element[key] = value;
    }
  });
  return element;
}

function renderGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  const uniqueWorks = new Set();
  works.forEach((work) => {
    const workKey = `${work.imageUrl}-${work.title}`;
    if (!uniqueWorks.has(workKey)) {
      uniqueWorks.add(workKey);

      const workElement = createElement("figure", { classes: ["work"] });
      const img = createElement("img", {
        attributes: { src: work.imageUrl, alt: work.title },
      });
      const figCaption = createElement("figcaption", {
        textContent: work.title,
      });

      workElement.appendChild(img);
      workElement.appendChild(figCaption);
      gallery.appendChild(workElement);
    }
  });
}

function renderCategoryFilters(categories) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";

  const uniqueCategories = new Set();

  const createCategoryButton = (name, onClickHandler, id = null) => {
    const button = createElement("button", { textContent: name });
    if (id) {
      button.id = id;
    }

    button.addEventListener("click", onClickHandler);
    return button;
  };

  filters.appendChild(
    createCategoryButton(
      "Tous",
      () => filterGalleryByCategory(null),
      "activeBtn"
    )
  );

  categories.forEach((category) => {
    const categoryKey = category.name;
    if (!uniqueCategories.has(categoryKey)) {
      uniqueCategories.add(categoryKey);

      filters.appendChild(
        createCategoryButton(category.name, () =>
          filterGalleryByCategory(category.id)
        )
      );
    }
  });
}

function filterGalleryByCategory(categoryId) {
  const filteredWorks =
    categoryId === null
      ? allWorks
      : allWorks.filter((work) => work.categoryId === categoryId);
  renderGallery(filteredWorks);
}

let allWorks = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    allWorks = await fetchWorks();
    const categories = await fetchCategories();
    renderGallery(allWorks);
    renderCategoryFilters(categories);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});

window.allWorks = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    window.allWorks = await fetchWorks();
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});
