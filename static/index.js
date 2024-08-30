document
  .getElementById("apiKeyForm")
  .addEventListener("submit", async function (params) {
    params.preventDefault(); // prevent the form from submitting normally

    const apiKey = document.getElementById("api_id").value;
    localStorage.setItem("API_KEY", apiKey);
    window.location.href = "/content";
  });

function copyToClipboard() {
  const code = document.querySelector(".copy-command code").innerText;
  navigator.clipboard.writeText(code);
}
