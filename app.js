const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = '0645133e-8fac-4777-a84f-fbc42d907581'; // USE YOUR KEY HERE

async function fetchObjects() {
    const url = `${ BASE_URL }/object?${ KEY }`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
  fetchObjects().then(x => console.log(x)); // { info: {}, records: [{}, {},]}



async function fetchAllCenturies() {
    const url = `${ BASE_URL }/century?${ KEY }&size=100&sort=temporalorder`;
    
    if (localStorage.getItem('centuries')) {
        return JSON.parse(localStorage.getItem('centuries'));
      }

    try {
      const response = await fetch(url);
      const data = await response.json();
      const records = data.records;
      
      localStorage.setItem('centuries', records);
      return records;
    } catch (error) {
      console.error(error);
    }
  }

fetchAllCenturies();

async function fetchAllClassifications() {
    const url = `${ BASE_URL }/classification?${ KEY }&size=100&sort=name`;
    
    if (localStorage.getItem('centuries')) {
        return JSON.parse(localStorage.getItem('centuries'));
      }

    try {
      const response = await fetch(url);
      const data = await response.json();
      const records = data.records;
      
      localStorage.setItem('centuries', records);
      return records;
    } catch (error) {
      console.error(error);
    }
  }

fetchAllClassifications();

async function prefetchCategoryLists() {
  try {
    const [
      classifications, centuries
    ] = await Promise.all([
      fetchAllClassifications(),
      fetchAllCenturies()
    ]);
// This provides a clue to the user, that there are items in the dropdown
$('.classification-count').text(`(${ classifications.length })`);

classifications.forEach(classification => {
  $('#select-classification').append($(`<option value="${ classification.name }">${ classification.name }</option>`));// append a correctly formatted option tag into
  // the element with id select-classification
});

// This provides a clue to the user, that there are items in the dropdown
$('.century-count').text(`(${ centuries.length }))`);

centuries.forEach(century => {
  $('#select-century').append($(`<option value="${ century.name }">${ century.name }</option>`));// append a correctly formatted option tag into
  // the element with id select-century
});
    
  } catch (error) {
    console.error(error);
  }
  
};

prefetchCategoryLists();

function buildSearchString() {
  $('#search').on('submit', async function (event) {
    // prevent the default
  
    try {
      // get the url from `buildSearchString`
      // fetch it with await, store the result
      // log out both info and records when you get them
    } catch (error) {
      // log out the error
    }
  });
}