const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=0645133e-8fac-4777-a84f-fbc42d907581'; // USE YOUR KEY HERE

async function fetchObjects() {
    const url = `${ BASE_URL }/object?${ KEY }`;
    onFetchStart();
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error(error);
    }finally {
      onFetchEnd();
    }
  }
  
  fetchObjects().then(x => console.log(x)); // { info: {}, records: [{}, {},]}



async function fetchAllCenturies() {
    const url = `${ BASE_URL }/century?${ KEY }&size=100&sort=temporalorder`;
    onFetchStart();
  try {
    const response = await fetch(url);
    const data = await response.json();
    const records = data.records;

    return records;
  } catch (error) {
    console.error(error);
  }finally {
    onFetchEnd();
  }
}

fetchAllCenturies();

async function fetchAllClassifications() {
    const url = `${ BASE_URL }/classification?${ KEY }&size=100&sort=name`;
    onFetchStart();

    try {
      const response = await fetch(url);
      const data = await response.json();
      const records = data.records;
      
      
      return records;
    } catch (error) {
      console.error(error);
    }finally {
      onFetchEnd();
    }
  }

fetchAllClassifications();

async function prefetchCategoryLists() {
  onFetchStart();
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
  }finally {
    onFetchEnd();
  }
  
};

prefetchCategoryLists();

function buildSearchString() {

  const classification=`(${ $('#select-classification').val() })`;
  const century=`(${ $('#select-century').val() })`;
  const keywords=`keyword=${ $('#keywords').val() }`;
  // #select-classification
  // #select-century
  // #keywords
  //https://api.harvardartmuseums.org/object?apikey=YOUR_KEY_HERE&classification=Photographs&century=19th century&keyword=face
  let string = `${ BASE_URL }/object?${ KEY }&${ classification }&${ century }&${ keywords }`;
  return string;

  };

  


  $('#search').on('submit', async function (event) {
    // prevent the default
    event.preventDefault();
    onFetchStart();
  
  try {
    const response = await fetch(buildSearchString());
    const { records, info } = await response.json();  
    updatePreview(records, info);
  } catch (error) {
    console.error(error);
  } finally {
    onFetchEnd();
  }
});
  
  function onFetchStart() {
    $('#loading').addClass('active');
  }
  
  function onFetchEnd() {
    $('#loading').removeClass('active');
  }

  $('#preview').on('click', '.object-preview', function renderFeature(record) {
    record.preventDefault(); // they're anchor tags, so don't follow the link
    // find the '.object-preview' element by using .closest() from the target
    // recover the record from the element using the .data('record') we attached
    // log out the record object to see the shape of the data
    return $(`<div class="object-feature">
  <header>
    <h3>Object Title</h3>
    <h4>Object Dating</h4>
  </header>
  <section class="facts">
    <span class="title">Fact Name</span>
    <span class="content">Fact Content</span>
    <span class="title">Fact Name</span>
    <span class="content">Fact Content</span>
    <!-- And so on.. -->
  </section>
  <section class="photos">
    <img src="image url" />
    <img src="image url" />
    <!-- And so on.. -->
  </section>
  </div>`);
    
  });

  $('#preview .next, #preview .previous').on('click', async function () {
    onFetchStart();
  
    try {
      const url = $(this).data('url');
      const response = await fetch(url);
      const { records, info } = await response.json();  
      
      updatePreview(records, info);
    } catch (error) {
      console.error(error);
    } finally {
      onFetchEnd();
    }
  });

  $('#feature').on('click', 'a', async function (event) {
    const href = $(this).attr('href');
  
    if (href.startsWith('mailto:')) {
      return;
    }
  
    event.preventDefault();
  
    onFetchStart();
    try {
      let result = await fetch(href);
      let { records, info } = await result.json();
      updatePreview(records, info);
    } catch (error) {
      console.error(error)
    } finally {
      onFetchEnd();
    }
  });

  

function renderFeature(record) {
  /**
   * We need to read, from record, the following:
   * HEADER: title, dated
   * FACTS: description, culture, style, technique, medium, dimensions, people, department, division, contact, creditline
   * PHOTOS: images, primaryimageurl
   */

  // build and return template

  const { 
    title, 
    dated,
    images,
    primaryimageurl,
    description,
    culture,
    style,
    technique,
    medium,
    dimensions,
    people,
    department,
    division,
    contact,
    creditline,
  } = objectRecord;

  return $(`<div class="object-feature">
<header>
      <h3>${ title }<h3>
      <h4>${ dated }</h4>
    </header>
    <section class="facts">
      ${ factHTML('Description', description) }
      ${ factHTML('Culture', culture, 'culture') }
      ${ factHTML('Style', style) }
      ${ factHTML('Technique', technique, 'technique' )}
      ${ factHTML('Medium', medium ? medium.toLowerCase() : null, 'medium') }
      ${ factHTML('Dimensions', dimensions) }
      ${ 
        people 
        ? people.map(
            person => factHTML('Person', person.displayname, 'person')
          ).join('')
        : ''
      }
      ${ factHTML('Department', department) }
      ${ factHTML('Division', division) }
      ${ factHTML('Contact', `<a target="_blank" href="mailto:${ contact }">${ contact }</a>`) }
      ${ factHTML('Credit', creditline) }
    </section>
    <section class="photos">
      ${ photosHTML(images, primaryimageurl) }
    </section>
  </div>`);
}

function renderPreview(record) {
  // grab description, primaryimageurl, and title from the record
  const {
    description,
    primaryimageurl,
    title,
  } = record;
  /*
  Template looks like this:

  <div class="object-preview">
    <a href="#">
      <img src="image url" />
      <h3>Record Title</h3>
      <h3>Description</h3>
    </a>
  </div>

  Some of the items might be undefined, if so... don't render them

  With the record attached as data, with key 'record'
  */
  return $(`<div class="object-preview">
  <a href="#">
  ${
    primaryimageurl && title
    ? `<img src="${ primaryimageurl }" /><h3>${ title }<h3>`
    : title
    ? `<h3>${ title }<h3>`
    : description
    ? `<h3>${ description }<h3>`
    : `<img src="${ primaryimageurl }" />`
  }
  </a>
</div>`).data('record', record);
  // return new element
}


function updatePreview(records, info) {
  const root = $('#preview');

  // grab the results element, it matches .results inside root
  // empty it
  // loop over the records, and append the renderPreview

  if (info.next) {
    root.find('.next')
      .data('url', info.next)
      .attr('disabled', false);
  } else {
    root.find('.next')
      .data('url', null)
      .attr('disabled', true);
  }
  
  if (info.prev) {
    root.find('.previous')
      .data('url', info.prev)
      .attr('disabled', false);
  } else {
    root.find('.previous')
      .data('url', null)
      .attr('disabled', true);
  }
  
  const resultsElement = root.find('.results');
  resultsElement.empty();

  records.forEach(record => {
    resultsElement.append(
      renderPreview(record)
    );
  });
}