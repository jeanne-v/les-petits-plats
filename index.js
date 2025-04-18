import { recipes as allRecipes } from "./recipes.js";
const recipesContainer = document.getElementById("recipes-container");
const mainSearchInput = document.getElementById("main-search-input");

let matchKeywordRecipes = [];

matchKeywordRecipes = allRecipes;
displayRecipes(matchKeywordRecipes);

function displayRecipes(recipesData) {
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

function returnFilteredRecipesByKeyword(keyword) {
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

function displayNoRecipesFoundMsg(keyword) {
  recipesContainer.innerHTML = `
  <div class="col-span-full text-center">
    <p>Aucune recette ne contient ‘${keyword}’. Vous pouvez chercher « tarte aux pommes», «poisson», etc</p>
  </div>`;
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
    displayRecipes(matchKeywordRecipes);
  } else if (mainSearchInput.value.trim().length >= 3) {
    matchKeywordRecipes = returnFilteredRecipesByKeyword(mainSearchInput.value.trim());
    if (matchKeywordRecipes.length > 0) {
      displayRecipes(matchKeywordRecipes);
    } else {
      displayNoRecipesFoundMsg(mainSearchInput.value.trim());
    }
  }
});
