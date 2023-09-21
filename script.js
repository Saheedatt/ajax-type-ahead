let countries;

const data = 'https://restcountries.com/v3.1/all';
const noResultsMessage = document.getElementById('noResultsMessage');
const emptyInputMessage = document.getElementById('emptyInputMessage');

async function fetchData() {
  try {
    const response = await fetch(data);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      } else if (response.status === 500) {
        throw new Error('Internal server error');
      } else {
        throw new Error('Failed to fetch data');
      }
    }

    const fetchedData = await response.json();
    countries = fetchedData;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    displayErrorMessage('Failed to fetch data. Please try again.');
  }
}

function displayErrorMessage(message) {
        const errorContainer = document.getElementById('errorContainer');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Request failed. Please try again!';
        const header = document.querySelector('header');

        header.style.display = 'none';
        errorContainer.style.display = 'block';
}
      
function filterCountries(searchText) {
    const filteredCountries = countries.filter(country => {
        const countryName = country.name.common.toLowerCase();
        return countryName.includes(searchText.toLowerCase());
    });
    return filteredCountries;
}


function displayNoResultsMessage() {
  noResultsMessage.style.display = 'block';
}

function hideNoResultsMessage() {
  noResultsMessage.style.display = 'none';
}

function hideEmptyInputMessage() {
  emptyInputMessage.style.display = 'none';
}

function displaySuggestions() {
  const searchInput = document.getElementById('searchInput');
  const suggestionsList = document.getElementById('suggestions');
  const searchText = searchInput.value;

  suggestionsList.innerHTML = '';
  hideNoResultsMessage();
  hideEmptyInputMessage();

  if (!searchText) {
    displayEmptyInputMessage();
    return;
  }
    const filteredCountries = filterCountries(searchText);
    if (filteredCountries.length === 0) {
        displayNoResultsMessage();
        return;
    }
    filteredCountries.forEach(country => {
      const listItem = document.createElement('li');
      listItem.textContent = country.name.common;

      listItem.addEventListener('click', () => {
        searchInput.value = country.name.common;
      });
      suggestionsList.appendChild(listItem);
    });
  }
function displayEmptyInputMessage() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput.value.trim()) {
      emptyInputMessage.style.display = 'block';
    } else {
      emptyInputMessage.style.display = 'none';
    }
}

function handleRetryButtonClick() {
  const errorContainer = document.getElementById('errorContainer');
  const header = document.querySelector('header');

  errorContainer.style.display = 'none';
  header.style.display = 'block';

  fetchData();
}


document.getElementById('retryButton').addEventListener('click', handleRetryButtonClick);
document.getElementById('searchInput').addEventListener('input', displaySuggestions);
document.getElementById('searchButton').addEventListener('click', () => {
  displayEmptyInputMessage();
});

fetchData();
