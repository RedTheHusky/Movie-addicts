var movie = new Movie();

movie.id = getUrlParameter("_id");
movie.getMovieDetails().then(function() {
  console.log("Movie details : ", movie);

  displayMovie(movie.id);
});

function displayMovie() {
  $(".movie-title").html(movie.Title);

  var image = document.querySelector(".movie-poster");
  image.src = movie.Poster;

  $(".movie-plot").html(movie.Plot);

  $(".movie-genre").html(movie.Genre);

  $(".movie-director").html(movie.Director);

  $(".movie-year").html(movie.Year);

  $(".movie-runtime").html(movie.Runtime);

  $(".movie-writer").html(movie.Writer);

  $(".movie-actors").html(movie.Actors);

  $(".movie-language").html(movie.Language);

  $(".movie-country").html(movie.Country);

  $(".movie-imdbRating").html(movie.imdbRating);
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
