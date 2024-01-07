const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 6000);
};

document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.querySelector('#btn-search');
  const searchForm = document.querySelector('#searchForm');
  const systemRadio = document.querySelector('#system-radio');
  const classRadio = document.querySelector('#class-radio');
  const dateRadio = document.querySelector('#date-radio');
  const input = document.querySelector('#search-input');
  const resultsContainer = document.querySelector('.results-section');

  // add a special behind the scenes search for clickable-table feature

  const createResultBox = (result) => {
    const resultBox = document.createElement('div');
    resultBox.className = 'result-box';

    if (result.url.startsWith('https://twitter.com/')) {
      const twitterLink = document.createElement('a');
      twitterLink.href = result.url;
      twitterLink.target = '_blank';

      const twitterIcon = document.createElement('img');
      twitterIcon.src = 'img/x.png';
      twitterIcon.alt = 'Twitter Icon';

      twitterLink.appendChild(twitterIcon);
      resultBox.appendChild(twitterLink);

      const twitterText = document.createElement('p');
      twitterText.textContent = 'Click to open X (Twitter) Post';
      resultBox.appendChild(twitterText);
    } else {
      const imageLink = document.createElement('a');
      imageLink.href = result.url;
      imageLink.target = '_blank';

      const resultImage = document.createElement('img');
      resultImage.src = result.url;
      resultImage.alt = 'Image';

      imageLink.appendChild(resultImage);
      resultBox.appendChild(imageLink);
    }

    const systemName = document.createElement('p');
    systemName.innerHTML = `<strong>System Name:</strong> ${result.system}`;
    resultBox.appendChild(systemName);

    const country = document.createElement('p');
    country.innerHTML = `<strong>Country:</strong> ${result.country}`;
    resultBox.appendChild(country);

    const status = document.createElement('p');
    status.innerHTML = `<strong>Status:</strong> ${result.status}`;
    resultBox.appendChild(status);

    const origin = document.createElement('p');
    origin.innerHTML = `<strong>Origin:</strong> ${result.origin}`;
    resultBox.appendChild(origin);

    return resultBox;
  };

  let currentPage = 1;
  const pageSize = 56;
  let totalPages = 1;

  const updateResults = async () => {
    try {
      let res = {};
      if (systemRadio.checked) {
        res = await axios({
          method: 'GET',
          url: `/api/v1/systems/system/${input.value}`,
        });
      }
      if (classRadio.checked) {
        res = await axios({
          method: 'GET',
          url: `/api/v1/systems/class/${input.value}`,
        });
      }
      if (dateRadio.checked) {
        res = await axios({
          method: 'GET',
          url: `/api/v1/systems/date?Date=${input.value}`,
        });
      }

      const results = res.data.data.systems;
      totalPages = Math.ceil(res.data.results / pageSize);

      updatePaginationControls();

      resultsContainer.innerHTML = '';

      if (currentPage === 1 && res.data.results < pageSize) {
        showAlert(
          'success',
          `Showing 1 to ${res.data.results} of ${res.data.results} results.`
        );
      } else if (currentPage === 1 && res.data.results > pageSize) {
        showAlert(
          'success',
          `Showing 1 to ${pageSize} of ${res.data.results} results.`
        );
      } else if (currentPage > 1 && res.data.results > pageSize) {
        showAlert(
          'success',
          `Showing ${pageSize * (currentPage - 1)} to ${
            pageSize * currentPage
          } of ${res.data.results} results.`
        );
      }
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      res.data.data.systems.slice(startIndex, endIndex).forEach((result) => {
        const resultBox = createResultBox(result);
        resultsContainer.appendChild(resultBox);
      });

      if (results.length > pageSize) {
        document
          .querySelector('.pagination-controls')
          .classList.remove('hidden');
      }
    } catch (error) {
      showAlert('error', error.response.data.message);
    }
  };

  const updatePaginationControls = () => {
    const currentPageElement = document.querySelector('#current-page');
    currentPageElement.textContent = currentPage;

    const prevButton = document.querySelector('#btn-prev');
    const nextButton = document.querySelector('#btn-next');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  };

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentPage = 1;
    updateResults();
  });
  searchButton.addEventListener('click', async () => {
    currentPage = 1;
    updateResults();
  });

  const prevButton = document.querySelector('#btn-prev');
  const nextButton = document.querySelector('#btn-next');

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateResults();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateResults();
    }
  });
});
