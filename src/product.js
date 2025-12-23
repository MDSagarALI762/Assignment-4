const apiurl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

let allFoods = [];

async function getfoodapi() {
  const res = await fetch(apiurl);
  const data = await res.json();
  allFoods = data.meals;

  renderFoods(allFoods);
}

// render cards
function renderFoods(foodData) {
  const cards = document.getElementById("products");
  cards.innerHTML = "";
  hideLoading(); // important

  if (foodData.length === 0) {
    cards.innerHTML = `
      <div class="col-span-full text-center text-gray-500 text-xl mt-10">
        No data found
      </div>
    `;
    return;
  }

  foodData.map((meal) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardImg = document.createElement("img");
    cardImg.classList.add("img");
    cardImg.src = meal.strMealThumb;

    const cardDetails = document.createElement("div");
    cardDetails.classList.add("card-details");

    const cardTitle = document.createElement("h4");
    cardTitle.innerText = meal.strMeal;
    cardTitle.classList.add("card-title");

    const cardDesc = document.createElement("p");
    cardDesc.innerText = meal.strInstructions.slice(0, 80);

    const cardBtn = document.createElement("button");
    cardBtn.innerText = "View Details";
    cardBtn.classList.add("card-btn");

    cardDetails.append(cardTitle, cardDesc, cardBtn);
    card.append(cardImg, cardDetails);
    cards.appendChild(card);

    cardBtn.addEventListener("click", () => showModal(meal.idMeal));
  });
}

// modal function
async function showModal(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const food = data.meals[0];

  const modalRoot = document.getElementById("modal-root");

  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal flex flex-col">
        <img src="${food.strMealThumb}" class="img mb-4" />
        <h2 class="card-title mb-2">${food.strMeal}</h2>
        <p class="text-sm text-gray-600 max-h-60 overflow-y-auto mb-4">
          ${food.strInstructions}
        </p>
        <div class="flex justify-end">
          <button class="modal-close-btn bg-yellow-500 text-white px-4 py-2 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.querySelector(".modal-close-btn").addEventListener("click", () => {
    modalRoot.innerHTML = "";
  });
}

// live search
document.getElementById("search-input").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  showLoading();

  setTimeout(() => {
    if (value === "") {
      renderFoods(allFoods);
    } else {
      const filteredFoods = allFoods.filter((food) =>
        food.strMeal.toLowerCase().includes(value)
      );
      renderFoods(filteredFoods);
    }
  }, 300); //small delay for UX
});

getfoodapi();
const loading = document.getElementById("loading");

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}
// scroll to top button
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.classList.remove("hidden");
  } else {
    scrollBtn.classList.add("hidden");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
