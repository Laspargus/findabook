const apikey = window.prompt("Insert your OpenMovieApiKey");

const searchMovie = (searchValue) => {
  let url = `https://www.omdbapi.com/?apikey=${apikey}&s=${searchValue}`;
  getMovies(url);
};

const getMovies = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => displayPreview(response.Search))
    .catch((error) => console.error("error:", error));
};

const searchSpecificMovie = (imdbId) => {
  let urlOne = `https://www.omdbapi.com/?apikey=${apikey}&i=${imdbId}`;
  getSpecificMovie(urlOne);
};

const getSpecificMovie = (urlOne) => {
  fetch(urlOne)
    .then((response) => response.json())
    .then((response) => {
      displayModale(response);
    })
    .catch((error) => console.error("error:", error));
};

const displayPreview = (data) => {
  document.querySelector("#movieList").innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let date = data[i].Year;
    let title = data[i].Title;
    let image = data[i].Poster;
    let imdbId = data[i].imdbID;

    document.querySelector("#movieList").innerHTML += `
    <div class="card mb-3">
    <div class="row no-gutters">
      <div class="col-md-3">
      <img style="width:150px" src="${image}" class="card-img" alt="${title}" />
      </div>
      <div class="col-md-7">
        <div class="card-body">
          <p class="card-text">
          ${title}
          </p>
          <p class="card-text">
            <small class="text-muted">${date}</small>
          </p>
        </div>
      </div>
      <div class="pt-5 col-md-2">
        <button id="${imdbId}" onclick="searchSpecificMovie(this.id)" class="btn btn-warning mb-2">Read More</button>
      </div>
    </div>
  </div>
    `;
  }
};

const displayModale = (data) => {
  console.log(data);
  let date = data.Year;
  let title = data.Title;
  let image = data.Poster;
  let description = data.Plot;

  document.getElementById("movieContent").innerHTML = `
  <div class="mb-3">
    <div class="row no-gutters">
      <div class="col-md-5">
      <img style="width:350px" src="${image}" class="card-img" alt="${title}" />
      </div>
      <div class="col-md-7">
        <div class="card-body">
          <h3 class="card-text">
          ${title}
          </h3>
          <p class="card-text">
          ${description}
          </p>
          <p class="card-text">
            <small class="text-muted">${date}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
  `;

  console.log(date, title, image, description);

  let myModal = document.getElementById("myModal");
  myModal.style.display = "block";

  let span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    myModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == myModal) {
      myModal.style.display = "none";
    }
  };
};

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = document.querySelector("input[type='text']").value;
  searchMovie(searchValue);
});
