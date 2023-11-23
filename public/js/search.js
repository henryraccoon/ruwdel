document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.querySelector('#btn-search');
  const systemRadio = document.querySelector('#system-radio');
  const classRadio = document.querySelector('#class-radio');
  const dateRadio = document.querySelector('#date-radio');
  const input = document.querySelector('#search-input');
  const resultsContainer = document.querySelector('.results-section');

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

  searchButton.addEventListener('click', async () => {
    try {
      let res = {};
      if (systemRadio.checked) {
        res = await axios({
          method: 'GET',
          url: `http://192.168.56.101:5000/api/v1/systems/system/${input.value}`,
        });
      }
      if (classRadio.checked) {
        res = await axios({
          method: 'GET',
          url: `http://192.168.56.101:5000/api/v1/systems/class/${input.value}`,
        });
      }
      if (dateRadio.checked) {
        res = await axios({
          method: 'GET',
          url: `http://192.168.56.101:5000/api/v1/systems/date?Date=${input.value}`,
        });
      }

      resultsContainer.innerHTML = '';

      res.data.data.systems.forEach((result) => {
        const resultBox = createResultBox(result);
        resultsContainer.appendChild(resultBox);
      });
    } catch (error) {
      console.error(error);
    }
  });
});
