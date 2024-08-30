let currentPage = 1;
const pageSize = 9;
let currentCategory = "home";

async function fetchData(section, page = 1) {
  console.log(`Fetching data for section: ${section}, page: ${page}`);
  const apiKey = localStorage.getItem("API_KEY");
  if (!apiKey) {
    alert("API key was not Found. Please set it First");
    window.location.href = "/";
    return;
  }
  const dataElement = document.querySelector(".content");
  dataElement.innerHTML = `<img style="vertical-align: middle;" src="assets/f398c8e928e0886d86c00e7770ccab78-ezgif.com-resize.gif" alt="loading.gif">Loading data...`;

  try {
    const response = await fetch(
      `/data/${section}?page=${page}&size=${pageSize}`,
      {
        headers: {
          api: apiKey,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not OK: " + response.statusText);
    }
    const data = await response.json();
    console.log("Received data:", data);
    renderData(data);
    document.getElementById("data").textContent = "";
    buttons(data);
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    document.getElementById("data").textContent = "Error fetching data.";
  }
}

function setupCategoryNavigation() {
  const categoryLinks = document.querySelectorAll(".category-nav a");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const category = e.target.dataset.category;
      console.log(`Category clicked: ${category}`);
      currentPage = 1; // Reset to first page when changing categories
      currentCategory = category;
      await fetchData(category, currentPage);

      // Update active state
      categoryLinks.forEach((l) => l.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
}

function renderData(data) {
  const contentDiv = document.querySelector(".content");
  contentDiv.innerHTML = ""; // Clear previous content
  contentDiv.textContent = data.newContent;
  // Create a container for the results
  const resultContainer = document.createElement("ul");
  resultContainer.classList.add("container");

  // Iterate over  the results array and create list items
  data.results.forEach((result) => {
    const listItem = document.createElement("li");
    listItem.classList.add("article-item");
    // Debugging logs to check the structure
    console.log(`Result :`, result);

    // Check if the properties exist before accessing them
    const title = result.title || "Unfinished Article";
    const byline = result.byline || "Unknown Author";
    const abstract = result.abstract || result.title || "No abstract";
    const url = result.url || "#";
    let image = "Image couldn't load";

    // Check if multimedia array exists and has items
    if (result.multimedia && result.multimedia.length > 0) {
      // Loop through the multimedia array
      for (let i = 0; i < result.multimedia.length; i++) {
        if (result.multimedia[i].format === "Large Thumbnail") {
          // If format is "Large Thumbnail", set the image URL
          image = result.multimedia[i].url;
          break; // Exit loop once we find the desired format
        }
      }
    }

    listItem.innerHTML = `
          <div class = "item article-image" >
          <img loading= "lazy" src="${image}" alt="Image"> <br>
          </div>
          <div class= "item article-title"> 
          <h5 >${title}</h5><br>
          </div>
          <div class="item article-abstract">
                    <p> ${abstract}</p><br>
                    </div>
          <div class="item article-author">
            <p>${byline}</p> <br>
          </div>
          <div class = "item article-url">
          <a href="${url}" target="_blank">Read Full article..</a><br>
          </div>
    
    
        `;

    resultContainer.appendChild(listItem);
  });

  // Append the result container to the content div
  contentDiv.appendChild(resultContainer);
}

async function buttons(data) {
  // Create and display pagination controls
  const paginationDiv = document.querySelector(".pagination");
  paginationDiv.innerHTML = ""; // Clear previous pagination controls

  if (data.current_page > 1) {
    const prevButton = document.createElement("button");

    prevButton.textContent = "Previous";
    prevButton.onclick = async () => {
      await fetchData(currentCategory, currentPage);
      currentPage--;

      document.documentElement.scrollTop = 0;
    };
    paginationDiv.appendChild(prevButton);
  }

  if (data.current_page < data.total_pages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = async () => {
      await fetchData(currentCategory, currentPage);
      currentPage++;

      document.documentElement.scrollTop = 0;
    };
    paginationDiv.appendChild(nextButton);
  }
}

window.onload = () => {
  setupCategoryNavigation();
  fetchData("home"); // Fetch default section data
};
