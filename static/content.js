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

  $(".content").html(
    '<img style="vertical-align: middle;" src="assets/f398c8e928e0886d86c00e7770ccab78-ezgif.com-resize.gif" alt="loading.gif">Loading data...'
  );

  try {
    const response = await $.ajax({
      url: `/data/${section}`,
      headers: { api: apiKey },
      data: { page: page, size: pageSize },
    });

    console.log("Received data:", response);
    renderData(response);
    $("#data").text("");
    buttons(response);
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    $("#data").text("Error fetching data.");
  }
}

function setupCategoryNavigation() {
  $(".category-nav a").on("click", async function (e) {
    e.preventDefault();
    const category = $(this).data("category");
    console.log(`Category clicked: ${category}`);
    currentPage = 1;
    currentCategory = category;
    await fetchData(category, currentPage);

    $(".category-nav a").removeClass("active");
    $(this).addClass("active");
  });
}

function renderData(data) {
  const $contentDiv = $(".content");
  $contentDiv.empty().text(data.newContent);

  const $resultContainer = $("<ul>").addClass("container");

  $.each(data.results, function (index, result) {
    console.log(`Result:`, result);

    const title = result.title || "Unfinished Article";
    const byline = result.byline || "Unknown Author";
    const abstract = result.abstract || result.title || "No abstract";
    const url = result.url || "#";
    let image = "Image couldn't load";

    if (result.multimedia && result.multimedia.length > 0) {
      const largeThumbnail = result.multimedia.find(
        (item) => item.format === "Large Thumbnail"
      );
      if (largeThumbnail) {
        image = largeThumbnail.url;
      }
    }

    const $listItem = $("<li>").addClass("article-item").html(`
      <div class="item article-image">
        <img loading="lazy" src="${image}" alt="Image"> <br>
      </div>
      <div class="item article-title"> 
        <h5>${title}</h5><br>
      </div>
      <div class="item article-abstract">
        <p>${abstract}</p><br>
      </div>
      <div class="item article-author">
        <p>${byline}</p> <br>
      </div>
      <div class="item article-url">
        <a href="${url}" target="_blank">Read Full article..</a><br>
      </div>
    `);

    $resultContainer.append($listItem);
  });

  $contentDiv.append($resultContainer);
}

function buttons(data) {
  const $paginationDiv = $(".pagination");
  $paginationDiv.empty();

  if (data.current_page > 1) {
    $("<button>")
      .text("Previous")
      .on("click", async function () {
        currentPage--;
        await fetchData(currentCategory, currentPage);
        $(document).scrollTop(0);
      })
      .appendTo($paginationDiv);
  }

  if (data.current_page < data.total_pages) {
    $("<button>")
      .text("Next")
      .on("click", async function () {
        currentPage++;
        await fetchData(currentCategory, currentPage);
        $(document).scrollTop(0);
      })
      .appendTo($paginationDiv);
  }
}

$(document).ready(function () {
  setupCategoryNavigation();
  fetchData("home");
});
