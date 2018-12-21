var movies = new Movies();

getMovies();
function getMovies(skip) {
  movies.getAll(skip).then(function() {
    console.log("getAllList", movies.items);
	
    displayMovies();
    displayPagination();
  });
}

function displayMovies() {
  console.log("displayMovies");
  var template = document.getElementById("template");
  var moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";
  // var regenerateMoviesContainer = document.getElementById("regenerate-movies");
  console.log("display movies.items=", movies.items);
	if(movies.items) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	movies.items.forEach(function(movie,index){//element, index
		var moviesClone = template.cloneNode(true);
		// set a unique id for each movie
		moviesClone.id = "movie_" + movie._id;
		// populate the cloned template
		moviesClone.querySelector(".movie-title").innerHTML = movie.Title;

		moviesClone.querySelector(".movie-year").innerHTML = movie.Year;

		moviesClone.querySelector(".movie-runtime").innerHTML = movie.Runtime;

		moviesClone.querySelector(".movie-genre").innerHTML = movie.Genre;

		moviesClone.querySelector(".movie-poster").src = movie.Poster;

		moviesClone.querySelector(".movie-details").addEventListener(
		  "click",
		  function getMovieDetailsOnClick() {

			window.location = "movieDetails.html?_id=" + movie._id;
		  });
		moviesClone.style.display="initial";
		moviesContainer.appendChild(moviesClone);
		
		moviesClone.querySelector(".movie-edit").addEventListener("click", function(){
		  event.target.disabled = "true";
		  editMovie(movie);
		  event.target.disabled = false;
		});
		moviesClone.querySelector(".movie-delete").addEventListener("click", function(){
			deleteMovieOnClick(movie,index);
		});
	});
	
};

function displayPagination() {
  var templatePages = document.getElementById("pagination-template");
  var pagesContainer = document.getElementById("pagination");
  pagesContainer.innerHTML = "";
  for ( let i=1; i<= movies.pagination.numberOfPages; i++) {
    var pagesClone = templatePages.cloneNode(true);
    var pageButtonElement = pagesClone.querySelector(".pages-btn");
    pageButtonElement.innerHTML = i;
    pagesContainer.appendChild(pagesClone);
	pagesClone.style.display="initial";
	pagesClone.removeAttribute("id");
    pageButtonElement.addEventListener("click",function moveToPage(event){
      return getMovies((i-1)*10 +1);
    });
  }
}

function editMovie(movie){
  console.log("editMovie.movie=",movie);

  
  var grandpa = document.getElementById("movie_"+movie._id);


  var grandpa=document.getElementById("movie_"+movie._id);

  console.log("grandpa=",grandpa);
var grandpaId = grandpa.id;
 var movieId = grandpaId.replace("movie_", "");

    movie.getMovie().then(function(response) {

        console.log(response);
        let divPopup = document.createElement("div");
        divPopup.setAttribute("class", "popup");
        grandpa.appendChild(divPopup);

        let spanPopup = document.createElement("span");
        spanPopup.setAttribute("class", "content");
        divPopup.appendChild(spanPopup);

        let popupXButton = document.createElement("div");
        popupXButton.setAttribute("class", "closeButton");
        popupXButton.innerHTML = "X";
        divPopup.appendChild(popupXButton);

        popupXButton.addEventListener("click", function(){
           //event.target.disabled = false;
           divPopup.remove();

        });
        //title edit
        let titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", response.Title);
        titleLabel.innerHTML = "<br>Title of the movie";
        spanPopup.appendChild(titleLabel);

        let newTitle = document.createElement("input");
        newTitle.setAttribute("value", response.Title);
        newTitle.setAttribute("class", "new-title");
        newTitle.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newTitle);

        //year edit
        let yearLabel = document.createElement("label");
        yearLabel.setAttribute("for", response.Year);
        yearLabel.innerHTML = "<br>Year<br>";
        spanPopup.appendChild(yearLabel);

        let newYear = document.createElement("input");
        newYear.setAttribute("value", response.Year);
        newYear.setAttribute("class", "new-year");
        newYear.setAttribute("style", "width: 50%");
        spanPopup.appendChild(newYear);

        //runtime edit
        let runtimeLabel = document.createElement("label");
        runtimeLabel.setAttribute("for", response.Runtime);
        runtimeLabel.innerHTML = "<br>Runtime<br>";
        spanPopup.appendChild(runtimeLabel);

        let newRuntime = document.createElement("input");
        newRuntime.setAttribute("value", response.Runtime);
        newRuntime.setAttribute("class", "new-runtime");
        newRuntime.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newRuntime);

        //Genre edit
        let genreLabel = document.createElement("label");
        genreLabel.setAttribute("for", response.Genre);
        genreLabel.innerHTML = "<br>Genre<br>";
        spanPopup.appendChild(genreLabel);

        let newGenre = document.createElement("input");
        newGenre.setAttribute("value", response.Genre);
        newGenre.setAttribute("class", "new-genre");
        newGenre.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newGenre);

        //Director edit
        let directorLabel = document.createElement("label");
        directorLabel.setAttribute("for", response.Director);
        directorLabel.innerHTML = "<br>Director<br>";
        spanPopup.appendChild(directorLabel);

        let newDirector = document.createElement("input");
        newDirector.setAttribute("value", response.Director);
        newDirector.setAttribute("class", "new-director");
        newDirector.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newDirector);

        //Writer edit
        let writerLabel = document.createElement("label");
        writerLabel.setAttribute("for", response.Writer);
        writerLabel.innerHTML = "<br>Writer<br>";
        spanPopup.appendChild(writerLabel);

        let newWriter = document.createElement("input");
        newWriter.setAttribute("value", response.Writer);
        newWriter.setAttribute("class", "new-writer");
        newWriter.setAttribute("style", "width: 50%");
        spanPopup.appendChild(newWriter);

        //Actors edit
        let actorsLabel = document.createElement("label");
        actorsLabel.setAttribute("for", response.Actors);
        actorsLabel.innerHTML = "<br>Actors<br>";
        spanPopup.appendChild(actorsLabel);

        let newActors = document.createElement("input");
        newActors.setAttribute("value", response.Actors);
        newActors.setAttribute("class", "new-actors");
        newActors.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newActors);

        //Plot edit
        let plotLabel = document.createElement("label");
        plotLabel.setAttribute("for", response.Plot);
        plotLabel.innerHTML = "<br>Plot<br>";
        spanPopup.appendChild(plotLabel);

        let newPlot = document.createElement("input");
        newPlot.setAttribute("value", response.Plot);
        newPlot.setAttribute("class", "new-plot");
        newPlot.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newPlot);

        //Language edit
        let languageLabel = document.createElement("label");
        languageLabel.setAttribute("for", response.Language);
        languageLabel.innerHTML = "<br>Language<br>";
        spanPopup.appendChild(languageLabel);

        let newLanguage = document.createElement("input");
        newLanguage.setAttribute("value", response.Language);
        newLanguage.setAttribute("class", "new-language");
        newLanguage.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newLanguage);

        //Country edit
        let countryLabel = document.createElement("label");
        countryLabel.setAttribute("for", response.Country);
        countryLabel.innerHTML = "<br>Country<br>";
        spanPopup.appendChild(countryLabel);

        let newCountry = document.createElement("input");
        newCountry.setAttribute("value", response.Country);
        newCountry.setAttribute("class", "new-country");
        newCountry.setAttribute("style", "width: 50%");
        spanPopup.appendChild(newCountry);

        //Poster edit
        let posterLabel = document.createElement("label");
        posterLabel.setAttribute("for", response.Poster);
        posterLabel.innerHTML = "<br>Poster<br>";
        spanPopup.appendChild(posterLabel);

        let newPoster = document.createElement("input");
        newPoster.setAttribute("value", response.Poster);
        newPoster.setAttribute("class", "new-poster");
        newPoster.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newPoster);

        //imdbRating edit
        let imdbLabel = document.createElement("label");
        imdbLabel.setAttribute("for", response.imdbRating);
        imdbLabel.innerHTML = "<br>IMDB Rating<br>";
        spanPopup.appendChild(imdbLabel);

        let newImdbRating = document.createElement("input");
        newImdbRating.setAttribute("value", response.imdbRating);
        newImdbRating.setAttribute("class", "new-imdb");
        newImdbRating.setAttribute("style", "width: 90%");
        spanPopup.appendChild(newImdbRating);

        let submitBtn = document.createElement("button");
        submitBtn.setAttribute("class", "submit-updates");
        submitBtn.innerHTML = "Submit";
        spanPopup.appendChild(submitBtn);

        submitBtn.addEventListener("click", function() {
          if (
            newTitle.value === "" ||
            yearLabel.value === "" ||
            newRuntime.value === "" ||
            newGenre.value === "" ||
            newDirector.value === "" ||
            newWriter.value === "" ||
            newActors.value === "" ||
            newPlot.value === "" ||
            newLanguage.value === "" ||
            newCountry.value === "" ||
            newPoster.value === "" ||
            newImdbRating.value === ""
          ) {
            alert("Please fill up all fields");
          } else {

              movie._id = movieId;
              movie.Title = newTitle.value;
              movie.Year = newYear.value;
              movie.Runtime = newRuntime.value;
              movie.Genre = newGenre.value;
              movie.Director = newDirector.value;
              movie.Writer = newWriter.value;
              movie.Actors = newActors.value;
              movie.Plot = newPlot.value;
              movie.Language = newLanguage.value;
              movie.Country = newCountry.value;
              movie.Poster = newPoster.value;
              movie.imdbRating = newImdbRating.value;


            movie.editMovie().then(function(response) {
				console.log("Movie with id " + movieId + " was succesfully updated");
				divPopup.remove();
				displayMovies();
            },
            function(reject){
              //  console.error("Error updating movie");
               let divDisplayError = document.createElement("div");
               divDisplayError.setAttribute("class", "display-error");
               divDisplayError.innerHTML = "Nothing to update";
               divPopup.appendChild(divDisplayError);

              
      

                
               

            });
          }
        });

      }


)
;
}





function getMovieById(event) {
  var theMovie = event.target.parentNode.parentNode;
  var theMovieId = theMovie.id;

  var movieId = theMovieId.replace("movie_", "");
  //call delete article model
  var movie = new Movie({ _id: movieId });
  return movie;
}


function deleteMovieOnClick(movie,positionInItems){ 
	movie.deleteMovie().then(function(response){
		console.log("display", response);
		movies.items.splice(positionInItems, 1);
		displayMovies();
	});
}




if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('../workers/w_home.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

