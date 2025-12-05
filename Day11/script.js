document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photo-upload");
  const photoPreview = document.getElementById("photo-preview");
  const ingredientInput = document.getElementById("ingredient-input");
  const addIngredientBtn = document.getElementById("add-ingredient-btn");
  const ingredientListUl = document.getElementById("ingredient-list");
  const suggestBtn = document.getElementById("suggest-btn");
  const recipeOutput = document.getElementById("recipe-output");

  let currentIngredients = [];

  const recipeDatabase = [
    {
      name: "Simple Chicken Stir-fry",
      keywords: ["chicken", "broccoli", "soy sauce", "garlic"],
    },
    {
      name: "Basic Omelette",
      keywords: ["egg", "cheese", "milk"],
    },
    {
      name: "Tomato Pasta",
      keywords: ["pasta", "tomato", "garlic", "onion"],
    },
    {
      name: "Quick Tuna Salad Sandwich",
      keywords: ["tuna", "mayonnaise", "bread", "celery"],
    },
    {
      name: "Scrambled Eggs",
      keywords: ["egg", "milk", "butter"],
    },
    {
      name: "Grilled Cheese Sandwich",
      keywords: ["bread", "cheese", "butter"],
    },
    {
      name: "Chicken and Rice",
      keywords: ["chicken", "rice", "onion"],
    },
  ];

  photoInput.addEventListener("change", (event) => {
    photoPreview.innerHTML = "";
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Photo Preview";
        photoPreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  addIngredientBtn.addEventListener("click", addIngredient);

  ingredientInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addIngredient();
    }
  });

  suggestBtn.addEventListener("click", suggestRecipes);

  function addIngredient() {
    const ingredientName = ingredientInput.value.trim();

    if (ingredientName) {
      if (
        !currentIngredients.some(
          (ing) => ing.toLowerCase() === ingredientName.toLowerCase()
        )
      ) {
        currentIngredients.push(ingredientName);
        renderIngredientList();
        ingredientInput.value = "";
      } else {
        alert(`'${ingredientName}' is already in the list.`);
      }
    }
    ingredientInput.focus();
  }

  function removeIngredient(ingredientToRemove) {
    currentIngredients = currentIngredients.filter(
      (ing) => ing !== ingredientToRemove
    );
    renderIngredientList();
  }

  function renderIngredientList() {
    ingredientListUl.innerHTML = "";

    if (currentIngredients.length === 0) {
      ingredientListUl.innerHTML =
        "<li><em>No ingredients added yet.</em></li>";
      return;
    }

    currentIngredients.forEach((ingredient) => {
      const li = document.createElement("li");

      const textSpan = document.createElement("span");
      textSpan.textContent = escapeHtml(ingredient);

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.className = "remove-item-btn";
      removeBtn.title = `Remove ${ingredient}`;
      removeBtn.onclick = () => removeIngredient(ingredient);

      li.appendChild(textSpan);
      li.appendChild(removeBtn);
      ingredientListUl.appendChild(li);
    });
  }

  function suggestRecipes() {
    console.log(
      "Suggest Recipes button clicked. Current ingredients:",
      currentIngredients
    );
    recipeOutput.innerHTML = "";

    if (currentIngredients.length === 0) {
      recipeOutput.innerHTML =
        '<h2 class="error">Please add some ingredients first!</h2>';
      return;
    }

    const userIngredientsLower = currentIngredients.map((ing) =>
      ing.toLowerCase()
    );
    let foundRecipes = [];

    recipeDatabase.forEach((recipe) => {
      const canMake = recipe.keywords.every((keyword) =>
        userIngredientsLower.some((userIng) =>
          userIng.includes(keyword.toLowerCase())
        )
      );

      if (canMake) {
        foundRecipes.push(recipe.name);
      }
    });
    console.log("Recipes matched:", foundRecipes);

    if (foundRecipes.length > 0) {
      let outputHtml = "<h2>Recipe Suggestions:</h2><ul>";
      foundRecipes.forEach((name) => {
        outputHtml += `<li>${escapeHtml(name)}</li>`;
      });
      outputHtml += "</ul>";
      outputHtml += `<p class="info">Note: These are suggestions based on keywords. You might need other common pantry staples.</p>`;
      recipeOutput.innerHTML = outputHtml;
    } else {
      recipeOutput.innerHTML =
        '<h2 class="info">No specific recipe suggestions found based on your current ingredients. Try adding more!</h2>';
    }
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, ",")
      .replace(/'/g, "'");
  }

  renderIngredientList();
});
