// DOM

var elSearchForm = $_('.js-search-form');
if (elSearchForm) {
  var elTitleInput = $_('.js-search-form__title-input', elSearchForm);
  var elRatingInput = $_('.js-search-form__rating-input', elSearchForm);
  var elGenreSelect = $_('.js-search-form__genre-select', elSearchForm);
  var elSortSelect = $_('.js-search-form__sort-select', elSearchForm);
}

var elSearchResults = $_('.search-results');

var elItemCardTemplate = $_('#search-result-template').content;


// DOM functions:

// Bu funksiya 1ta card ni tayyor holda qaytarib berish uchun:
var createItemCard = movie => {
  var itemCard = elItemCardTemplate.cloneNode(true);

  $_('.movie__poster', itemCard).src = movie.smallThumbnail;
  $_('.movie__poster', itemCard).alt = movie.title;
  $_('.movie__title', itemCard).textContent = movie.title;
  $_('.movie__year', itemCard).textContent = movie.year;
  $_('.movie__rating', itemCard).textContent = movie.imdbRating;
  $_('.js-movie-modal-opener', itemCard).dataset.id = movie.imdbId;
  $_('.js-movie-bookmark', itemCard).dataset.id = movie.imdbId;

  return itemCard;
};

// Sahifaga chiqarish uchun funksiya:
var showDisplay = array => {
  elSearchResults.innerHTML = '';

  var elResultsFragment = document.createDocumentFragment();

  array.forEach(object => {
    elResultsFragment.appendChild(createItemCard(object));
  });

  elSearchResults.appendChild(elResultsFragment);
};

// Takrorlanmaydigan categoriyalarni topib uni select ning ichiga option qilib joylash:

// Avval categoriyalarni saqlab turish uchun bo'sh array ochib olamiz:
var categoriesArray = []
// movies ni aylanib chiqib, undagi categoriyalarni ham aylanib chiqib, agar categoriesArray ning ichida bo'lmasa unga push qilgin deymiz:
movies.forEach(movie => {
  movie.categories.forEach(category => {
    if (!categoriesArray.includes(category)){
      categoriesArray.push(category);
    }
  });
});
// categoriesArray ni aylanib chiqib, undagi har bir category uchun option yaratib uni select ning ichiga joylab chiqamiz:
// forEach har aylanganida brouzerni bezovta qilavermasligi uchun fragment yaratib olamiz:
var categoriesFragment = document.createDocumentFragment();

categoriesArray.forEach(category => {
  var itemCategory = createElement('option', '', category);
  itemCategory.value = category;

  categoriesFragment.appendChild(itemCategory);
});

elGenreSelect.appendChild(categoriesFragment);



// EVENT LISTENERS:

elSearchForm.addEventListener('submit', evt => {
  evt.preventDefault();

  var titleInputRegExp = new RegExp(elTitleInput.value, 'gi');

  var minRating = Number(elRatingInput.value);

  var searchResults = movies.filter(movie => {
    var genre = elGenreSelect.value === `All` || movie.categories.includes(elGenreSelect.value);

    return movie.title.match(titleInputRegExp) && movie.imdbRating >= minRating && genre;
  });

  showDisplay(searchResults);
});