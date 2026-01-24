const form = document.getElementById("shorten-form");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const urlInput = document.getElementById("url-input");
  const url = urlInput.value.trim();

  if (!url) {
    result.textContent = "Please enter a URL.";
    return;
  }

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const text = await response.text();
      result.textContent = `Error: ${text}`;
      return;
    }

    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = `Request failed: ${error.message}`;
  }
});
