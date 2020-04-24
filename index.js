let selection = [];
let recommendations = [];
console.log(selection);
let alertMessage = document.querySelector("#alert-message");

////FUNCTION TO GET LIST OF BOOKS
const searchBook = (searchValue) => {
  let url = `https://www.googleapis.com/books/v1/volumes?q=${searchValue}`;
  getBook(url);
};

const getDbBook = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => dislayTop100(response))
    .catch((error) => console.log("error:", error));
};

const getBook = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => displayPreview(response.items))
    .catch((error) => console.error("error:", error));
};

getDbBook("https://book-suggestion.herokuapp.com/books");

const selectBook = (title, author, image, isbn13, isbn10, year) => {
  alertMessage.innerHTML = "";
  alertMessage.classList.add("not-visible");

  let pair = {};
  pair["title"] = title;
  pair["author"] = author;
  pair["image"] = image;
  pair["isbn13"] = isbn13;
  pair["isbn10"] = isbn10;
  pair["year"] = year;
  let validation = true;
  console.log(selection);

  selection.forEach((item) => {
    if (item.title == title) {
      console.error("you already selected this book");
      alertMessage.classList.remove("not-visible");
      alertMessage.innerHTML = "you already selected this book";
      validation = false;
    }
  });

  if (selection.length == 5) {
    console.error("you already have 5 books");
    alertMessage.classList.remove("not-visible");
    alertMessage.innerHTML =
      "you already selected 5 books. Validate your choice.";
    validation = false;
  }

  if (validation) {
    selection.push(pair);
  }
  document.querySelector("#selection").classList.remove("not-visible");
  document.querySelector("#selection").innerHTML = "";
  displaySelection();
};

const displaySelection = () => {
  document.querySelector("#howtoremove").classList.remove("not-visible");
  for (let i = 0; i < selection.length; i++) {
    if (i == 5) {
      break;
    }
    let img = selection[i].image;
    document.querySelector("#selection").innerHTML += `
  <div class="text-center col-md-2">
  <img class="" src="${img}" onclick="deleteBook('${img}')" style="width:100px">
  </div>
    `;
  }
  if (selection.length === 5) {
    displayButton();
  }
};

const deleteBook = (img) => {
  document.querySelector("#validate-selection").classList.add("not-visible");
  for (let i = 0; i < selection.length; i++) {
    if (selection[i].image == img) {
      selection.splice(i, 1);
    }
  }
  document.querySelector("#selection").innerHTML = "";
  if (selection.length >= 1) {
    displaySelection();
  }
  console.log(selection);
};

const displayButton = () => {
  document.querySelector("#validate-selection").classList.remove("not-visible");
  document.querySelector("#validate-selection").innerHTML = `
  <button
  type="submit"
  id="validate"
  class="btn btn-warning"
  onclick="saveSelection()">Confirm Selection</button>`;
};

const saveSelection = () => {
  getSelections();
  fetch("https://book-suggestion.herokuapp.com/selections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(selection),
  })
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((error) => console.log("error:", error));
};

///// FUNCTION TO DISPLAY LIST OF MOVIES
const displayPreview = (data) => {
  document.querySelector("#bookList").innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    let year = "";
    let image = "/bookcover.png";
    let title = "";
    let author = "";
    let isbn10 = "unknown";
    let isbn13 = "unknown";

    if ("authors" in data[i].volumeInfo) {
      author = data[i].volumeInfo.authors[0];
    }

    if (data[i].volumeInfo.industryIdentifiers[0].type == "OTHER") {
      continue;
    } else {
      isbn13 = data[i].volumeInfo.industryIdentifiers[0].identifier;
      isbn10 = data[i].volumeInfo.industryIdentifiers[0].identifier;
    }

    if ("title" in data[i].volumeInfo) {
      title = data[i].volumeInfo.title.replace(/'/g, "\\'");
    }

    if ("imageLinks" in data[i].volumeInfo) {
      image = data[i].volumeInfo.imageLinks.smallThumbnail;
    } else {
      continue;
    }

    if ("publishedDate" in data[i].volumeInfo) {
      let year = data[i].volumeInfo.publishedDate;
    }

    document.querySelector("#bookList").innerHTML += `
    <div id="book${isbn13}" onclick="selectEffect(${isbn13})">
    <img class="m-3" onclick="selectBook('${title}', '${author}','${image}','${isbn13}','${isbn10}', '${year}')" src="${image}" style="width:150px">
    </div>
    `;
  }
};

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = document.querySelector("input[type='text']").value;
  searchBook(searchValue);
});

const selectEffect = (id, event) => {
  console.log(event);
  console.log(id);
  anime({
    targets: `#book${id}`,
    translateY: -10000,
    //borderRadius: 50,
    duration: 2000,
    easing: "linear",
    // direction: "alternate",
  });
};

dislayTop100 = (response) => {
  response.forEach((book) => {
    let image = book.image;
    let title = book.title.replace(/'/g, "\\'");
    let author = book.author.replace(/'/g, "\\'");
    let year = book.year;
    let isbn13 = book.ISBN_13;
    let isbn10 = book.ISBN_10;

    document.querySelector("#top100").innerHTML += `
  <div id=book${isbn13} onclick="selectEffect(${isbn13}, event)" class="booktop100">
    <img class="m-3" id="bookImage" src="${image}" onclick="selectBook('${title}', '${author}','${image}','${isbn13}','${isbn10}', '${year}')"  style="width:150px">
  </div>
  `;
  });
};

const getSelections = () => {
  fetch("https://book-suggestion.herokuapp.com/selections")
    .then((response) => response.json())
    .then((response) => findTwinSelections(response))
    .catch((error) => console.error("error:", error));
};

const findTwinSelections = (allDbSelections) => {
  allDbSelections.forEach((dbSelection) => {
    dbSelection.books.forEach((book) => {
      for (let i = 0; i < selection.length; i++) {
        if (book.ISBN_13 == selection[i].isbn13) {
          let newSelection = dbSelection.books.filter(
            (book) => book.ISBN_13 != selection[i].isbn13
          );
          recommendations.push(newSelection);
        }
      }
    });
  });
  if ((recommendations.length = 0)) {
    document.querySelector("#recommendation").innerHTML = `
    <div class="alert alert-warning" role="alert">
      We were not able to match your selection.
      <a class= "btn btn-warning" href="/"> Try another one </a>
    </div>
    `;
    return;
  } else {
    getFinalArray();
  }
};

const getFinalArray = () => {
  vrac = [];
  recommendations.forEach((grap) => {
    grap.forEach((book) => vrac.push(book));
  });

  var finalarray = [];
  var copy = vrac.slice(0);
  for (var i = 0; i < vrac.length; i++) {
    var myCount = 0;
    // loop over every element in the copy and see if it's the same
    for (var w = 0; w < copy.length; w++) {
      if (copy[w] == undefined) {
        continue;
      } else {
        if (vrac[i].ISBN_13 == copy[w].ISBN_13) {
          myCount++;
          delete copy[w];
        }
      }
    }
    if (myCount > 0) {
      var a = new Object();
      a.value = vrac[i];
      a.count = myCount;
      finalarray.push(a);
    }
  }
  let sortedFinalArray = finalarray.sort((a, b) =>
    a.count < b.count ? 1 : -1
  );
  console.log(sortedFinalArray);
  displayRecommendation(sortedFinalArray);
};

const displayRecommendation = (sortedFinalArray) => {
  document.querySelector("#recommendation").innerHTML += `
  <h2 class="mb-5 recommendation-title text-info">
        Here are your 5 next must-read books :
      </h2>
  `;
  for (let i = 0; i < 5; i++) {
    if (i > sortedFinalArray.length) break;

    let image = sortedFinalArray[i].value.image;
    let title = sortedFinalArray[i].value.title;
    let date = sortedFinalArray[i].value.year;
    let isbn13 = sortedFinalArray[i].value.ISBN_13;
    let author = sortedFinalArray[i].value.author;

    document.querySelector("#recommendation").innerHTML += `
    <div class="previewMovie card mb-3">
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
            <small class="text-muted">${author}</small>
          </p>  
        </div>
      </div>
      <div class="pt-5 col-md-2">
        <button id="${isbn13}" onclick="" class="btn btn-warning mb-2">Read More</button>
      </div>
    </div>
  </div>
    `;
  }
};
