const searchInput = document.getElementById("searchInput");
const itemList = document.getElementById("itemList");
const items = Array.from(itemList.getElementsByTagName("li"));

searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();

  let hasResults = false;
  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = "";
      hasResults = true;
    } else {
      item.style.display = "none";
    }
  });

  // Show no results message if no items match
  if (!hasResults && searchTerm) {
    if (!itemList.querySelector(".no-results")) {
      const noResults = document.createElement("li");
      noResults.className = "no-results";
      noResults.textContent = "No results found";
      itemList.appendChild(noResults);
    }
  } else {
    const noResults = itemList.querySelector(".no-results");
    if (noResults) {
      noResults.remove();
    }
  }
});
searchInput.value = "";
