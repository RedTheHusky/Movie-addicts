let movies = new Movies();

let modalElements={};let alertElements={};let backgroundSync;let backgroundNotification;let imageUploader;extraLoad();

getMovies();
function extraLoad(){
	console.groupCollapsed('extraLoad');
	console.groupCollapsed('notification');
		modalElements["notification"]= new Modal({root:"modalRoot",addModal2Root:true});
		alertElements["notification"]= new Alert({root:"alertRoot",addModal2Root:true});
		jokeSocialMediaCall.init({root:"modalRoot",addModal2Root:true,addEvents:true});
		googleCalendarRender.init({root:"modalRoot",addModal2Root:true,add2Head:true});
	console.groupEnd();
	console.groupCollapsed('auth');
		authModal.init({root:"modalRoot",addModal2Root:true,add2Head:true,addEvents:true});
		authAlert=new Alert({root:"alertRoot",addAlert2Root:true});
		auth2Pages.init();
	console.groupEnd();
	console.groupCollapsed('submit');
		modalElements["submit"]= new movieModal({root:"modalRoot"});
		modalElements["submit"].addModal2Root();
		modalElements["submit"].addEvents();
	console.groupEnd();
	console.groupCollapsed('backgroundSyncLoad');
		if(Worker){
			if(location.protocol==="file:"||location.protocol==="file"){
				console.warn('cannot do worker do to invalid protocol');
				console.groupEnd();
				return;
			}
			backgroundSync = new Worker('../workers/backgroundSync.js');
			backgroundNotification = new Worker('../workers/backgroundNotification.js');
			console.log('backgroundSync loaded');
		}else{
			console.warn('backgroundSync not loaded');
		}
		
	console.groupEnd();
	console.groupCollapsed('imageUploaderLoad');
		imageFileUploader.init();
		if(document.querySelectorAll(".fileInput")){
			document.querySelectorAll(".fileInput").forEach(function(element,i){
				element.addEventListener("change", function(){
					console.groupCollapsed('ileInput[',i,']');
					imageFileUploader.fileUppload({event:event,element:element});
					console.groupEnd();
				});
			});
		}
	console.groupEnd();
	//googleCalendarRender.showModal();
	console.groupEnd();
}
function getMovies(skip) {
  movies.getAll(skip).then(function() {
    console.log("getAllList", movies.items);
	if(Worker&&backgroundSync){
		console.log("sending data to backgroundSync");
		backgroundSync.postMessage({mode:1,movies:{skip:skip}});
	}
   displayMovies();
   displayPagination();

  });
console.groupEnd();
}
jQuery.loadScript = function (url, callback_s,callback_f) {
    return jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback_s,
		fail: callback_f,
        async: true
    });
}
var url_to_someScript='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
if (typeof someObject == 'undefined') $.loadScript(url_to_someScript, 
	function(r){
	   console.groupCollapsed('loadScript['+url_to_someScript+']');
	   console.log('r=',r);
	   console.groupEnd();   
	},
	function (f){
		console.groupCollapsed('loadScript_failed['+url_to_someScript+']');
		 console.groupEnd();   
	}
);
function displayMovies() {
	console.groupCollapsed('displayMovies');
	var template = document.getElementById("template");
	var moviesContainer = document.getElementById("movies");
	moviesContainer.innerHTML = "";
	// var regenerateMoviesContainer = document.getElementById("regenerate-movies");
	console.log("display movies.items=", movies.items);
	if(movies.items) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	movies.items.forEach(function(movie,index){//element, index
		console.groupCollapsed('movie[',index,']');
		console.log('movie=',movie);
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
		if(!movie.getMovie){
			console.warn("No movie.getMovie!");
		}
		moviesClone.querySelector(".movie-edit").addEventListener("click", function(){
		  event.target.disabled = "true";
		  editMovie(movie);
		  event.target.disabled = false;
		});
		moviesClone.querySelector(".movie-delete").addEventListener("click", function(){
			deleteMovieOnClick(movie,index);
		});
		console.groupEnd(); 
	});
	 
	if(Worker&&backgroundSync){
		console.log("sending data to backgroundSync");
		backgroundSync.postMessage({mode:1,movies:{items:movies.items,pagination:movies.pagination},timer:{command:'start'}});
	}
	console.groupEnd();   
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
    movie.getMovie().then(
		function(response) {
			console.log("success getMovie");
			console.log("response=",response);
			modalElements["submit"].displayEdit({response:response,movie:movie});
			//displaySubmitt({mode:"edit",response:response,movie:movie});
		}
	);
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
			if(event.data.update.items){
				console.log("updated movies.items");
				if(event.data.update.items.length){
					movies.items=[];
					event.data.update.items.forEach(function(item,index){
						var movie = new Movie(item);
						movies.items.push(movie);
					});
				}
				
			}
			if(event.data.update.pagination){
				console.log("updated movies.pagination");
				movies.pagination=event.data.update.pagination;
			}
		}else
		if(event.data.display){
			console.log("do display");
			displayMovies();
			if(backgroundNotification){
				console.log("sending data to backgroundNotification");
				backgroundNotification.postMessage({notification:{body:"Updated displayed movies."}});
			}
		}
	console.groupEnd();   
	}
}


function displaySubmitt(options={}){
	console.groupCollapsed('displaySubmitt');
	
	let movie='';
	let response={ Title:'',Year:'',Runtime:'',Genre:'',Director:'',Writer:'',Actors:'',Plot:'',Language:'',Country:'',Poster:'',imdbRating:''};
	if(options.response){ //!!!need to talk about the Movie.getMovie functionality for improvement
		response=options.response;
	}
	if(options.movie){
		modalElements["submit"].movie=options.movie;
	}
	modalElements["submit"].mode=options.mode||"";

	let content_body="<spam>";
	for (var key in response){ //a for cycle that creates the titleLable,newLabel and so on elements
		if(key==="Title"||key==="Year"||key==="Runtime"||key==="Director"||key==="Writer"||key==="Plot"||key==="Language"||key==="Poster"||key==="imdbRating"){
			let value=response[key]||"";
			content_body+=`<label style="display:block" for="${key}">${key}:</label><input id="new${key}" value="${value}" style="width: 90%"></input>`;
		}
	}
	content_body+="</spam>";
	modalElements["submit"].setElement([{selector:".modal-title", task:"inner", value:"Edit movie: "+response["Title"]||""},{selector:".modal-body", task:"inner", value:content_body}, "show"]);
	console.groupEnd();
}
function displayNotification(options={}){
	console.groupCollapsed('displayNotification')
	console.log("options=",options);
	let title=options.title||"(unknown)";
	let message=options.message||"(unknown)";
	if(!(modalElements["submit"].modal.modal.dom.getAttribute("style")==null||modalElements["submit"].modal.modal.dom.getAttribute("style").includes("display: none"))){
		console.warn("Display !=none, trying to change display.");
		modalElements["submit"].modal.hide();
	}
	modalElements["notification"].addModal2Root();
	modalElements["notification"].setElement([{selector:".modal-title", task:"inner", value:title},{selector:".modal-body", task:"inner", value:message}, "show"]);
	console.groupEnd();
}

function doAfterSuccessfulMovieEdit(options={}){
	console.groupCollapsed('doAfterSuccessfulMovieEdit');
	displayNotification({mode:"supdated",title:"Updated successfully",message:"<p>Movie '"+options.obj.movie.Title+"' (" + options.obj.movie._id + ") was successfully updated.</p>"});
	displayMovies();
	console.groupEnd();
}

function doAfterFailedMovieEdit(options={}){
	console.groupCollapsed('doAfterFailedMovieEdit');
	let message;
	if(options.response.responseJSON&&options.response.responseJSON.message){
		message=options.response.responseJSON.message;
	}else
	if(options.response.response&&options.response.response){
		message=options.response.response;
	}else
	if(options.response&&options.response.respons){
		message=options.response;
	}
	displayNotification({mode:"error",title:"Failed update",message:"<p>Error at updating movie '"+options.obj.movie.Title+"'(" + options.obj.movie._id + ").</p><p>"+message+"</p>"});
	console.groupEnd();
}

function doAfterSuccessConvertingImage2Base64(data={}){
	console.groupCollapsed('doAfterFailedMovieEdit');
	console.log("obj=",data.obj);
	console.log("file=",data.file);
	console.log("result.length=",data.result.length);
	console.groupEnd();
}

function doAfterSuccessLogin(data={}){
	console.groupCollapsed('doAfterSuccessLogin');
	//location.reload();	
	console.groupEnd();
}
function doAfterSuccessRegister(data={}){
	console.groupCollapsed('doAfterSuccessRegister');
	//location.reload();	
	console.groupEnd();
}
function doAfterSuccessLogOut(data={}){
	console.groupCollapsed('doAfterSuccessLogOut');	
	//location.reload();
	console.groupEnd();
}

function doAfterSuccessImageUpload(data={}){
	console.groupCollapsed('doAfterSuccessImageUpload');
	console.log('data=',data);
	if(typeof data.response !="object"){
		var obj = JSON.parse(data.response);
		console.log('obj=',obj);
		console.log('address=',obj.address);
		modalElements["submit"].modal.modal.dom.querySelector('#newPoster').value=obj.address;
		if(Worker&&backgroundNotification){
			console.log("sending data to backgroundNotification");
			backgroundNotification.postMessage({notification:{body:"Image success uploaded",icon:obj.address}});
		}
	}else{
		console.log('address=',data.response.address);
		modalElements["submit"].modal.modal.dom.querySelector('#newPoster').value=data.response.address;
		if(Worker&&backgroundNotification){
			console.log("sending data to backgroundNotification");
			backgroundNotification.postMessage({notification:{body:"Image success uploaded",icon:data.response.address}});
		}
	}
	
	
	console.groupEnd();
}

if(Worker&&backgroundNotification){
	console.log("sending data to backgroundNotification");
	backgroundNotification.postMessage({notification:{body:"Hi!"}});
}