function isPalindrome(str) {
  // Normalise: lowercase, keep only alphanumerics
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Compare with reverse
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}

/* ---------- UI handling ---------- */
const input = document.getElementById("txt");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");

button.addEventListener("click", () => {
  const text = input.value;
  const ok = isPalindrome(text);

  result.textContent = ok
    ? `✅ "${text}" is a palindrome.`
    : `❌ "${text}" is not a palindrome.`;

  // Trigger animation
  result.classList.remove("show");
  void result.offsetWidth; // force reflow
  result.classList.add("show");
});

/* Optional: allow pressing Enter to trigger check */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});
