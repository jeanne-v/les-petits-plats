import { recipes as allRecipes } from "./recipes.js";
const recipesContainer = document.getElementById("recipes-container");
const mainSearchInput = document.getElementById("main-search-input");
const ingredientsListEl = document.getElementById("ingredients-list");
const appliancesListEl = document.getElementById("appliances-list");
const ustensilsListEl = document.getElementById("ustensils-list");

const activeFilterTagsContainer = document.getElementById("active-filter-tags-container");

let matchKeywordRecipes = [];
let matchKeywordAndFiltersRecipes = [];

let recipesIngredients = [];
let recipesAppliances = [];
let recipesUstensils = [];

let activeFilters = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

matchKeywordRecipes = allRecipes;
matchKeywordAndFiltersRecipes = matchKeywordRecipes;
renderRecipes(matchKeywordAndFiltersRecipes);
initAllFilters();

function renderRecipes(recipesData) {
  recipesContainer.innerHTML = recipesData
    .map((recipe) => {
      const ingredientsHtml = recipe.ingredients
        .map((ingredient) => {
          return `
            <div>
                <p>${ingredient.ingredient}</p>
                <p class="text-grey">${ingredient.quantity ? ingredient.quantity : ""}${
            ingredient.unit ? ingredient.unit : ""
          }</p>
            </div>
            `;
        })
        .join("");

      return `
        <article class="bg-white rounded-3xl overflow-hidden shadow-[0px_4px_34px_30px_rgba(0,_0,_0,_0.04)]">
            <div class="relative">
                <img class="aspect-[380/253] object-cover" src="assets/${recipe.image}" alt=""/>
                <p class="text-xs bg-yellow py-1 px-4 w-fit absolute top-5 right-5 rounded-2xl">
                    ${recipe.time}min
                </p>
            </div>
            <div class="px-6 pt-8 pb-15">
                <h2 class="font-anton text-lg">${recipe.name}</h2>
                <div class="mt-7">
                    <h3 class="uppercase text-grey font-bold text-xs">Recette</h3>
                    <p class="mt-4 text-sm xl:max-h-19 overflow-hidden leading-[19px]">
                        ${recipe.description}
                    </p>
                </div>
                <div class="mt-8">
                    <h3 class="uppercase text-grey font-bold text-xs">Ingredients</h3>
                    <div class="text-sm mt-4 grid grid-cols-2 gap-5 leading-[19px]">
                        ${ingredientsHtml}
                    </div>
                </div>
            </div>
        </article>`;
    })
    .join("");
}

function getMatchKeywordRecipes(keyword) {
  const lowerCaseKeyWord = keyword.toLowerCase();
  return allRecipes.filter((recipe) => {
    if (recipe.name.toLowerCase().includes(lowerCaseKeyWord)) {
      return true;
    }
    if (recipe.description.toLowerCase().includes(lowerCaseKeyWord)) {
      return true;
    }
    return recipe.ingredients.some((ingredient) => {
      return ingredient.ingredient.toLowerCase().includes(lowerCaseKeyWord);
    });
  });
}

function getFilteredRecipes(recipesData) {
  return recipesData.filter((recipe) => {
    const doesRecipeMatchIngredientsFilter = activeFilters.ingredients.every(
      (ingredient) => {
        return recipe.ingredients.find(
          (ingrObj) => ingrObj.ingredient.toLowerCase() === ingredient
        );
      }
    );
    if (!doesRecipeMatchIngredientsFilter) {
      return false;
    }
    const doesRecipeMatchAppliancesFilter = activeFilters.appliances.every(
      (appliance) => {
        return recipe.appliance.toLowerCase() === appliance;
      }
    );
    if (!doesRecipeMatchAppliancesFilter) {
      return false;
    }

    const doesRecipeMatchUstensilsFilter = activeFilters.ustensils.every((ustensil) => {
      return recipe.ustensils.find(
        (ustensilItem) => ustensilItem.toLowerCase() === ustensil
      );
    });
    if (!doesRecipeMatchUstensilsFilter) {
      return false;
    }

    return true;
  });
}

function renderNoRecipesFoundMsg(keyword) {
  recipesContainer.innerHTML = `
  <div class="col-span-full text-center">
    <p>Aucune recette ne contient ‘${keyword}’. Vous pouvez chercher « tarte aux pommes», «poisson», etc</p>
  </div>`;
}

function renderFilterList(filterListEl, contentArr) {
  filterListEl.innerHTML = contentArr
    .map((currentItem) => {
      return `
      <li>
        <button data-value="${currentItem}" class="filter-btn text-sm cursor-pointer block leading-none px-4 py-2 hover:bg-yellow w-full text-left first-letter:capitalize">
          ${currentItem}
        </button>
      </li>`;
    })
    .join("");
}

function renderActiveFilterTags() {
  let html = "";
  Object.entries(activeFilters).forEach(([filterType, filterArr]) => {
    if (filterArr.length > 0) {
      filterArr.forEach((filter) => {
        html += `
        <div class="bg-yellow flex items-center gap-12 pt-4 pl-4 pb-4 pr-1 rounded-xl">
          <p class="text-sm first-letter:capitalize">${filter}</p>
          <button alt="retirer le filtre" class="remove-filter-btn cursor-pointer px-3 py-1" data-filter-type="${filterType}" data-filter-value="${filter}">
            <img class="w-[10px] h-[10px]" src="assets/close.svg" />
          </button>
        </div>`;
      });
    }
  });
  activeFilterTagsContainer.innerHTML = html;
}

function getRecipesIngredientsArray(recipesData) {
  const ingredientsSet = new Set();
  recipesData.forEach((recipe) => {
    recipe.ingredients.forEach((ingredientObj) => {
      const ingredient = ingredientObj.ingredient.toLowerCase();
      if (!activeFilters.ingredients.includes(ingredient)) {
        ingredientsSet.add(ingredient);
      }
    });
  });
  return [...ingredientsSet];
}

function getRecipesAppliancesArray(recipesData) {
  const appliancesSet = new Set();
  recipesData.forEach((recipe) => {
    const appliance = recipe.appliance.toLowerCase();
    if (!activeFilters.appliances.includes(appliance)) {
      appliancesSet.add(appliance);
    }
  });
  return [...appliancesSet];
}

function getRecipesUstensilsArray(recipesData) {
  const ustensilsSet = new Set();
  recipesData.forEach((recipe) => {
    recipe.ustensils.forEach((ustensilItem) => {
      const ustensil = ustensilItem.toLowerCase();
      if (!activeFilters.ustensils.includes(ustensil)) {
        ustensilsSet.add(ustensil);
      }
    });
  });
  return [...ustensilsSet];
}

function getMatchKeywordArray(arr, keyword) {
  const lowerCaseKeyWord = keyword.toLowerCase();
  return arr.filter((item) => {
    return item.includes(lowerCaseKeyWord);
  });
}

function initAllFilters() {
  recipesIngredients = getRecipesIngredientsArray(matchKeywordAndFiltersRecipes);
  renderFilterList(ingredientsListEl, recipesIngredients);
  recipesAppliances = getRecipesAppliancesArray(matchKeywordAndFiltersRecipes);
  renderFilterList(appliancesListEl, recipesAppliances);
  recipesUstensils = getRecipesUstensilsArray(matchKeywordAndFiltersRecipes);
  renderFilterList(ustensilsListEl, recipesUstensils);
}

function handleFilterTagsUpdate() {
  renderActiveFilterTags();
  matchKeywordAndFiltersRecipes = getFilteredRecipes(matchKeywordRecipes);
  renderRecipes(matchKeywordAndFiltersRecipes);
  initAllFilters();
}

const filterBtns = Array.from(document.getElementsByClassName("dropdown-btn"));
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("open");
  });
});

mainSearchInput.addEventListener("input", () => {
  if (mainSearchInput.value === "") {
    matchKeywordRecipes = allRecipes;
    matchKeywordAndFiltersRecipes = matchKeywordRecipes;
    renderRecipes(matchKeywordAndFiltersRecipes);
    initAllFilters();
    activeFilterTagsContainer.innerHTML = "";
  } else if (mainSearchInput.value.trim().length >= 3) {
    matchKeywordRecipes = getMatchKeywordRecipes(mainSearchInput.value.trim());
    matchKeywordAndFiltersRecipes = matchKeywordRecipes;
    if (matchKeywordAndFiltersRecipes.length > 0) {
      renderRecipes(matchKeywordAndFiltersRecipes);
      initAllFilters();
      activeFilterTagsContainer.innerHTML = "";
    } else {
      renderNoRecipesFoundMsg(mainSearchInput.value.trim());
    }
  }
});

document.addEventListener("click", (e) => {
  if (
    document.querySelector("#ingredients-filter.open") &&
    !e.target.closest("#ingredients-filter")
  ) {
    document.getElementById("ingredients-filter").classList.remove("open");
    return;
  }
  if (
    document.querySelector("#appliances-filter.open") &&
    !e.target.closest("#appliances-filter")
  ) {
    document.getElementById("appliances-filter").classList.remove("open");
    return;
  }
  if (
    document.querySelector("#ustensils-filter.open") &&
    !e.target.closest("#ustensils-filter")
  ) {
    document.getElementById("ustensils-filter").classList.remove("open");
    return;
  }
  if (e.target.classList.contains("filter-btn")) {
    const value = e.target.dataset.value;
    const filterType = e.target.closest("ul").dataset.content;
    activeFilters[filterType].push(value);
    e.target.closest(".filter-dropdown").classList.remove("open");
    e.target.closest(".filter-dropdown").querySelector(".dropdown-input").value = "";
    handleFilterTagsUpdate();
    return;
  }

  if (e.target.closest(".remove-filter-btn")) {
    const filterType = e.target.closest(".remove-filter-btn").dataset.filterType;
    const filterValue = e.target.closest(".remove-filter-btn").dataset.filterValue;
    const index = activeFilters[filterType].findIndex(
      (currentItem) => currentItem === filterValue
    );
    activeFilters[filterType].splice(index, 1);
    handleFilterTagsUpdate();
  }
});

const filterInputs = Array.from(document.getElementsByClassName("dropdown-input"));
filterInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.name === "ingredients-filter" && input.value !== "") {
      const filteredIngredientsArray = getMatchKeywordArray(
        recipesIngredients,
        input.value
      );
      renderFilterList(ingredientsListEl, filteredIngredientsArray);
      return;
    }
    if (input.name === "ingredients-filter" && input.value === "") {
      renderFilterList(ingredientsListEl, recipesIngredients);
      return;
    }
    if (input.name === "appliances-filter" && input.value !== "") {
      const filteredAppliancesArray = getMatchKeywordArray(
        recipesAppliances,
        input.value
      );
      renderFilterList(appliancesListEl, filteredAppliancesArray);
      return;
    }
    if (input.name === "appliances-filter" && input.value === "") {
      renderFilterList(appliancesListEl, recipesAppliances);
      return;
    }
    if (input.name === "ustensils-filter" && input.value !== "") {
      const filteredUstensilsArray = getMatchKeywordArray(recipesUstensils, input.value);
      renderFilterList(ustensilsListEl, filteredUstensilsArray);
      return;
    }
    if (input.name === "ustensils-filter" && input.value === "") {
      renderFilterList(ustensilsListEl, recipesUstensils);
      return;
    }
  });
});
