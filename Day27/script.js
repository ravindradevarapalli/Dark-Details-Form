// Array of motivational quotes with categories
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "success",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "courage",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "courage",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "courage",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "dreams",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
    category: "learning",
  },
  {
    text: "You learn more from failure than from success.",
    author: "Unknown",
    category: "learning",
  },
  {
    text: "It's not whether you get knocked down, it's whether you get up.",
    author: "Vince Lombardi",
    category: "courage",
  },
  {
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs",
    category: "success",
  },
  {
    text: "People who are crazy enough to think they can change the world, are the ones who do.",
    author: "Rob Siltanen",
    category: "dreams",
  },
  {
    text: "What we fear doing most is usually what we most need to do.",
    author: "Tim Ferriss",
    category: "courage",
  },
  {
    text: "Failure will never overtake me if my determination to succeed is strong enough.",
    author: "Og Mandino",
    category: "success",
  },
  {
    text: "We may encounter many defeats but we must not be defeated.",
    author: "Maya Angelou",
    category: "courage",
  },
  {
    text: "Knowing is not enough, we must apply. Wishing is not enough, we must do.",
    author: "Johann Wolfgang Von Goethe",
    category: "learning",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "success",
  },
  {
    text: "Excellence is not a destination; it is a continuous journey that never ends.",
    author: "Brian Tracy",
    category: "success",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "dreams",
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Robin Sharma",
    category: "dreams",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "success",
  },
];

// DOM Elements
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote-btn");
const favoriteBtn = document.getElementById("favorite-btn");
const shareTwitterBtn = document.getElementById("share-twitter-btn");
const copyBtn = document.getElementById("copy-btn");
const categorySelect = document.getElementById("category-select");
const themeBtn = document.getElementById("theme-btn");
const quoteCountSpan = document.getElementById("quote-count");
const favCountSpan = document.getElementById("fav-count");
const historyList = document.getElementById("history-list");
const favoritesList = document.getElementById("favorites-list");
const tabBtns = document.querySelectorAll(".tab-btn");

let currentQuote = {};
let quoteHistory = JSON.parse(localStorage.getItem("quoteHistory")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentCategory = "all";

// Initialize theme
const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) {
  document.body.classList.add("dark-mode");
  themeBtn.textContent = "☀️ Light Mode";
}

// Function to filter quotes by category
function getQuotesByCategory() {
  if (currentCategory === "all") {
    return quotes;
  }
  return quotes.filter((q) => q.category === currentCategory);
}

// Function to get a random quote
function getRandomQuote() {
  const filteredQuotes = getQuotesByCategory();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  currentQuote = filteredQuotes[randomIndex];
  displayQuote();
  addToHistory(currentQuote);
  updateFavoriteButton();
}

// Function to display the quote
function displayQuote() {
  quoteText.textContent = currentQuote.text;
  authorText.textContent = `- ${currentQuote.author}`;

  // Add animation
  quoteText.style.animation = "none";
  setTimeout(() => {
    quoteText.style.animation = "fadeIn 0.6s ease-out";
  }, 10);
}

// Function to add quote to history
function addToHistory(quote) {
  const quoteString = `${quote.text} - ${quote.author}`;
  // Remove duplicate if exists
  quoteHistory = quoteHistory.filter((q) => q !== quoteString);
  // Add to beginning
  quoteHistory.unshift(quoteString);
  // Keep only last 10
  quoteHistory = quoteHistory.slice(0, 10);
  localStorage.setItem("quoteHistory", JSON.stringify(quoteHistory));
  updateHistoryDisplay();
  updateStats();
}

// Function to add/remove from favorites
function toggleFavorite() {
  const quoteString = `${currentQuote.text} - ${currentQuote.author}`;
  const index = favorites.indexOf(quoteString);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(quoteString);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButton();
  updateStats();
  updateFavoritesDisplay();
}

// Function to update favorite button appearance
function updateFavoriteButton() {
  const quoteString = `${currentQuote.text} - ${currentQuote.author}`;
  const isFavorite = favorites.includes(quoteString);

  if (isFavorite) {
    favoriteBtn.textContent = "♥ Remove from Favorites";
    favoriteBtn.style.background = "#e74c3c";
    favoriteBtn.style.color = "white";
    favoriteBtn.style.borderColor = "#e74c3c";
  } else {
    favoriteBtn.textContent = "♡ Add to Favorites";
    favoriteBtn.style.background = "";
    favoriteBtn.style.color = "";
    favoriteBtn.style.borderColor = "";
  }
}

// Function to update stats
function updateStats() {
  quoteCountSpan.textContent = `Total: ${quoteHistory.length}`;
  favCountSpan.textContent = `Favorites: ${favorites.length}`;
}

// Function to display history
function updateHistoryDisplay() {
  if (quoteHistory.length === 0) {
    historyList.innerHTML =
      '<p class="empty-message">No history yet. Generate your first quote!</p>';
    return;
  }

  historyList.innerHTML = quoteHistory
    .map(
      (quote, index) => `
    <div class="list-item">
      <span class="list-item-text" title="${quote}">${quote}</span>
      <button class="list-item-remove" onclick="removeFromHistory(${index})">✕</button>
    </div>
  `
    )
    .join("");
}

// Function to display favorites
function updateFavoritesDisplay() {
  if (favorites.length === 0) {
    favoritesList.innerHTML =
      '<p class="empty-message">No favorites yet. Add quotes to favorites!</p>';
    return;
  }

  favoritesList.innerHTML = favorites
    .map(
      (quote, index) => `
    <div class="list-item">
      <span class="list-item-text" title="${quote}">${quote}</span>
      <button class="list-item-remove" onclick="removeFromFavorites(${index})">✕</button>
    </div>
  `
    )
    .join("");
}

// Function to remove from history
function removeFromHistory(index) {
  quoteHistory.splice(index, 1);
  localStorage.setItem("quoteHistory", JSON.stringify(quoteHistory));
  updateHistoryDisplay();
  updateStats();
}

// Function to remove from favorites
function removeFromFavorites(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesDisplay();
  updateStats();
  updateFavoriteButton();
}

// Function to share on Twitter
function shareOnTwitter() {
  const tweetText = `"${currentQuote.text}" - ${currentQuote.author}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;
  window.open(twitterUrl, "_blank");
}

// Function to copy quote to clipboard
function copyQuote() {
  const quoteToClip = `"${currentQuote.text}" - ${currentQuote.author}`;
  navigator.clipboard
    .writeText(quoteToClip)
    .then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    })
    .catch(() => {
      alert("Failed to copy. Please try again.");
    });
}

// Function to toggle theme
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Event listeners
newQuoteBtn.addEventListener("click", getRandomQuote);
favoriteBtn.addEventListener("click", toggleFavorite);
shareTwitterBtn.addEventListener("click", shareOnTwitter);
copyBtn.addEventListener("click", copyQuote);
themeBtn.addEventListener("click", toggleTheme);
categorySelect.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  getRandomQuote();
});

// Tab switching
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.getAttribute("data-tab");
    // Remove active class from all tabs
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((t) => t.classList.remove("active"));
    // Add active class to clicked tab
    btn.classList.add("active");
    document.getElementById(tabName).classList.add("active");
  });
});

// Load a quote on page load
window.addEventListener("load", () => {
  getRandomQuote();
  updateHistoryDisplay();
  updateFavoritesDisplay();
  updateStats();
});

// Allow Enter key to generate new quote
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getRandomQuote();
  }
});
