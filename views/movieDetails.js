var movie = new Movie();
var backgroundSync;
var modalElements={};
function backgroundSyncLoad(){
	console.groupCollapsed('backgroundSyncLoad');
	if(Worker){
		backgroundSync = new Worker('../workers/backgroundSync.js');
		console.log('backgroundSync loaded');
	}else{
		console.warn('backgroundSync not loaded');
	}
	console.groupEnd();
}
function modalLoad(){
	console.groupCollapsed('modalLoad');
	modalElements["notification"]= new Modal({root:"modalRoot"});
	modalElements["notification"].addModal2Root();
	modalElements["auth"]= new authModal({root:"modalRoot"});
	modalElements["auth"].addModal2Root();
	modalElements["auth"].add2Head();
	modalElements["auth"].displayLogIn();
	modalElements["auth"].addEvents();
	console.groupEnd();
}
backgroundSyncLoad();
modalLoad();
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
	if(Worker&&backgroundSync){
		console.log("sending data to backgroundSync");
		backgroundSync.postMessage({
			mode:2,
			movie:{
				details:{
					_id:movie._id,
					Title : movie.Title,
					Year : movie.Year,
					Runtime : movie.Runtime,
					Genre : movie.Genre,
					Director : movie.Director,
					Writer: movie.Writer,
					Actors : movie.Actors,
					Plot : movie.Plot,
					Language : movie.Language,
					Country : movie.Country,
					Poster : movie.Poster,
					imdbRating : movie.imdbRating
				},
				id:movie._id
			},
			timer:{command:'start'}}
		);
	}
		
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function doStats(){
	if(Worker&&backgroundSync){
		console.log("sending data to backgroundSync");
		backgroundSync.postMessage({get:"stats"});
	}
}
if(Worker&&backgroundSync){
	console.log("receiving data to backgroundSync");
	backgroundSync.onmessage = function(event) {
		console.groupCollapsed('backgroundSync.onmessage');
		console.log("event:",event);
		console.log("data:",event.data);
		if(event.data.update){
			if(event.data.update.details){
				console.log("updated movie details");
				movie._id = event.data.update.details._id;
				movie.Title = event.data.update.details.Title;
				movie.Year = event.data.update.details.Year;
				movie.Runtime = event.data.update.details.Runtime;
				movie.Genre = event.data.update.details.Genre;
				movie.Director = event.data.update.details.Director;
				movie.Writer = event.data.update.details.Writer;
				movie.Actors = event.data.update.details.Actors;
				movie.Plot = event.data.update.details.Plot;
				movie.Language = event.data.update.details.Language;
				movie.Country = event.data.update.details.Country;
				movie.Poster = event.data.update.details.Poster;
				movie.imdbRating = event.data.update.details.imdbRating;
			}
		}else
		if(event.data.display){
			console.log("do display");
			displayMovie();
		}
		console.groupEnd();   
	}
}
