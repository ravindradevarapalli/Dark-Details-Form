const API_LIST = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian";
const API_LOOKUP = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const searchBox = document.getElementById("searchBox");
const recipesContainer = document.getElementById("recipesContainer");
const recipeDetails = document.getElementById("recipeDetails");

let allRecipes = [];

async function fetchRecipes() {
  const res = await fetch(API_LIST);
  const data = await res.json();
  allRecipes = data.meals;
  displayRecipes(allRecipes);
}

function displayRecipes(recipes) {
  recipesContainer.innerHTML = "";
  recipes.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h4>${meal.strMeal}</h4>
    `;
    card.onclick = () => fetchRecipeDetails(meal.idMeal);
    recipesContainer.appendChild(card);
  });
}

async function fetchRecipeDetails(id) {
  const res = await fetch(API_LOOKUP + id);
  const data = await res.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }

  recipeDetails.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${
      meal.strMealThumb
    }" style="width:100%; max-width:400px; border-radius:8px;" />
    <h3>Ingredients</h3>
    <ul>${ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
  `;
  recipeDetails.classList.remove("hidden");
}

searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const filtered = allRecipes.filter((meal) =>
    meal.strMeal.toLowerCase().includes(query)
  );
  displayRecipes(filtered);
  recipeDetails.classList.add("hidden");
});

// Load on start
fetchRecipes();
