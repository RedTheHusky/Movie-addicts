// window.onload = function() {
//   var movie = new Movie();
//   movie.regenerateMovies().then(function(response) {
//     console.log("Complet regeneration", response);
//   });
// };


var movies = new Movies();
var myWorker = new Worker('../views/worker.js');
//myWorker.postMessage({importScript:"../models/Movies.js"});
//myWorker.postMessage({importScript:"../models/Movie.js"});
//myWorker.postMessage({importScript:"../views/jquery.min.js"});
getMovies();
function getMovies(skip) {
  movies.getAll(skip).then(function() {
    console.log("getAllList", movies.items);
    displayMovies(movies.items);
	myWorker.postMessage({movies_items:movies.items});
	myWorker.postMessage({movies_skip:skip});
    displayPagination(movies.pagination);
  });
}

function displayMovies(response) {
  console.log("displayMovies");
  var template = document.getElementById("template");
  var moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";
  // var regenerateMoviesContainer = document.getElementById("regenerate-movies");
  console.log("display movies response=", response);
	if(response) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	response.forEach(function(movie,index){//element, index
		var moviesClone = template.cloneNode(true);
		// set a unique id for each movie
		moviesClone.id = "movie_" + movie._id;
		// populate the cloned template
		var movieTitleElement = moviesClone.querySelector(".movie-title");
		movieTitleElement.innerHTML = movie.Title;

		var movieYearElement = moviesClone.querySelector(".movie-year");
		movieYearElement.innerHTML = movie.Year;

		var movieRuntimeElement = moviesClone.querySelector(".movie-runtime");
		movieRuntimeElement.innerHTML = movie.Runtime;

		var movieGenreElement = moviesClone.querySelector(".movie-genre");
		movieGenreElement.innerHTML = movie.Genre;

		var moviePosterElement = moviesClone.querySelector(".movie-poster");
		moviePosterElement.src = movie.Poster;

		var getMovieDetailsButton =  moviesClone.querySelector(".movie-details");
		let id=movie._id;
		let me=movie;
		getMovieDetailsButton.addEventListener(
		  "click",
		  function getMovieDetailsOnClick() {

			window.location = "movieDetails.html?_id=" + id;
		  });
		moviesClone.style.display="initial";
		moviesContainer.appendChild(moviesClone);


		let editButton = moviesClone.querySelector(".movie-edit");
		editButton.addEventListener("click", function(){
		  event.target.disabled = "true";
		  editMovie(me);
		  event.target.disabled = false;
		});


		let deleteButton = moviesClone.querySelector(".movie-delete");
			deleteButton.addEventListener("click", function(){
			deleteMovieOnClick(me,index);
		});
	});
	
	//old for
	/*for (let i = 0; i < response.length; i++) {
		var moviesClone = template.cloneNode(true);
		// set a unique id for each movie
		moviesClone.id = "movie_" + response[i]._id;
		// populate the cloned template
		var movieTitleElement = moviesClone.querySelector(".movie-title");
		movieTitleElement.innerHTML = response[i].Title;

		var movieYearElement = moviesClone.querySelector(".movie-year");
		movieYearElement.innerHTML = response[i].Year;

		var movieRuntimeElement = moviesClone.querySelector(".movie-runtime");
		movieRuntimeElement.innerHTML = response[i].Runtime;

		var movieGenreElement = moviesClone.querySelector(".movie-genre");
		movieGenreElement.innerHTML = response[i].Genre;

		var moviePosterElement = moviesClone.querySelector(".movie-poster");
		moviePosterElement.src = response[i].Poster;

		var getMovieDetailsButton = moviesClone.querySelector(".movie-details");
		let id=response[i]._id;
		let me=response[i];
		getMovieDetailsButton.addEventListener(
		  "click",
		  function getMovieDetailsOnClick() {

			window.location = "movieDetails.html?_id=" + id;
		  });
		moviesClone.style.display="initial";
		moviesContainer.appendChild(moviesClone);


		let editButton = moviesClone.querySelector(".movie-edit");
		editButton.addEventListener("click", function(){
		  event.target.disabled = "true";
		  editMovie(me);
		  event.target.disabled = false;
		});


		let deleteButton = moviesClone.querySelector(".movie-delete");
		deleteButton.addEventListener("click", function(){
		  deleteMovieOnClick(me,i);
		});
		  

	};*/

};

function displayPagination(response) {
  //console.log("response pagination", response)
  var templatePages = document.getElementById("pagination-template");
  var pagesContainer = document.getElementById("pagination");
  pagesContainer.innerHTML = "";
  for ( let i=1; i<= response.numberOfPages; i++) {
    var pagesClone = templatePages.cloneNode(true);
    var pageButtonElement = pagesClone.querySelector(".pages-btn");
    pageButtonElement.innerHTML = i;
    pagesContainer.appendChild(pagesClone);
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

              displayMovies(movies.items);
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
 displayMovies(movies.items);
});
}





