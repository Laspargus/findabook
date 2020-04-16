const apikey = window.prompt("Insert your OpenMovieApiKey");

////FUNCTION TO GET VIDEO TRAILER
const getMovieDbUrl = (imdbId) => {
  let url = `https://api.themoviedb.org/3/movie/${imdbId}/videos?api_key=c5d88044659a5ab6d5965a2c9ef028e0&language=en-US`;
  fetch(url)
    .then((response) => response.json())
    .then((response) => findYouTubeId(response.results))
    .catch((error) => console.error("error:", error));
};

const findYouTubeId = (data) => {
  console.log(data[0].key);
  let youtubeId = data[0].key;
  document.querySelector("#video").innerHTML = `
  <iframe
    width="400"
    height="300"
    src="https://www.youtube.com/embed/${youtubeId}"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>`;
};

////FUNCTION TO GET LIST OF MOVIES
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

////// FUNCTION TO GET SPECIFIC MOVIE
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

///// FUNCTION TO DISPLAY LIST OF MOVIES
const displayPreview = (data) => {
  document.querySelector("#movieList").innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let date = data[i].Year;
    let title = data[i].Title;
    let image = data[i].Poster;
    let imdbId = data[i].imdbID;

    document.querySelector("#movieList").innerHTML += `
    <div class="not-visible previewMovie card mb-3">
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
  let observer = new IntersectionObserver(
    (observables) => {
      observables.forEach((observable) => {
        if (observable.intersectionRatio > 0.9) {
          observable.target.classList.remove("not-visible");
        }
      });
    },
    { threshold: [0.9] }
  );

  let movies = document.querySelectorAll(".previewMovie");
  movies.forEach((movie) => observer.observe(movie));
};

///////// FUNCTION TO GET MODAL

const displayModale = (data) => {
  console.log(data);
  let date = data.Year;
  let title = data.Title;
  let image = data.Poster;
  let description = data.Plot;
  let imdbId = data.imdbID;

  console.log(imdbId);

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
          <p id="video" class="card-text">
          </p>
        </div>
      </div>
    </div>
  </div>
  `;

  let myModal = document.getElementById("myModal");
  let video = document.querySelector("#video");
  myModal.style.display = "block";

  let span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    myModal.style.display = "none";
    video.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == myModal) {
      myModal.style.display = "none";
      video.style.display = "none";
    }
  };
  getMovieDbUrl(imdbId);
};

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = document.querySelector("input[type='text']").value;
  searchMovie(searchValue);
});
