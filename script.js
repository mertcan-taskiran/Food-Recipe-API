const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const searchTxt = document.getElementById('search-input');
const txtResult = document.querySelector('.showtxtResult');

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
txtResult.classList.remove("showRecipe");
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
});

searchTxt.addEventListener("keypress", function(event) {
    if (event.key === "Enter") { 
        event.preventDefault();
        searchBtn.click();
    }
});

// Meal List
function getMealList(){

    let searchInputTxt = document.getElementById('search-input').value.trim();

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {

        let html = "";

        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "yemek">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Tarif</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        }else{           
            html = "Üzgünüz. Aradığınız bulunamadı :(";
            mealList.classList.add('notFound');
            searchTxt.value = "";
        }

        mealList.innerHTML = html;
        txtResult.classList.add("showRecipe");
        txtResult.innerHTML = searchTxt.value;
        searchTxt.value = "";
    });
}

// Tarif
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipe(data.meals))
    }
}

function mealRecipe(meal){

    meal = meal[0];
    
    html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <p class="mealArea">${meal.strArea}</p>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Talimatlar:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Youtube videosu için tıklayınız.</a>
        </div>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}