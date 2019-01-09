
// window.onload = function() {
//   var movie = new Movie();
//   movie.regenerateMovies().then(function(response) {
//     console.log("Complet regeneration", response);
//   });
// };

var movies = new Movies();
let modalElements={};let alertElements={};let backgroundSync;extraLoad();//added by Tamas
function extraLoad(){ //added by Tamas
  //here it loads the blank modal & alert notification, but also the components for authentication, image uploading and background sysnc
  console.groupCollapsed('extraLoad');
  console.log('notification');
  modalElements["notification"]= new Modal({root:"#modalRoot",add2Root:true});
  alertElements["notification"]= new Alert({root:"#alertRoot",add2Root:true});
  jokeSocialMediaCall.init({root:"modalRoot",add2Root:true,addEvents:true});
  notificationPopUp.init();
  console.log('auth');
  authModal.init({root:"#modalRoot",add2Root:true,add2Head:true,addEvents:true});
  authAlert=new Alert({root:"#alertRoot",add2Root:true});
  auth2Pages.init();
	console.log('submit');
	movieSubmitFormModal.init({root:"#modalRoot"});
	movieSubmitFormModal.add2Root();
	movieSubmitFormModal.addEvents();
	console.log('dynamicSearchBarList');
	dynamicSearchBarList.init({root:"#searchDiv",add2Root:true});
	//dynamicSearchBarList.setDropDownToggle("#search-btn");
	dynamicSearchBarList.setInputEvent("input[name='search']");															 
  console.log('backgroundSyncLoad');
  if(Worker){
    if(location.protocol==="file:"||location.protocol==="file"){
      console.warn('cannot do worker do to invalid protocol');
      console.groupEnd();
      return;
    }
    backgroundSync = new Worker('../workers/backgroundSync.js');
    console.log('backgroundSync loaded');
  }else{
    console.warn('backgroundSync not loaded');
  }
  
  console.log('imageUploaderLoad');
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
  console.log('ect');
  console.groupEnd();
}

getMovies();
function getMovies(skip) {
  movies.getAll(skip).then(function() {
    console.log("getAllList", movies.items);
  if(Worker&&backgroundSync){ //added by Tamas
    console.log("sending data to backgroundSync");
    backgroundSync.postMessage({mode:1,movies:{skip:skip}});
  }
    displayMovies(movies.items);
    displayPagination(movies.pagination);
    searchYear();
    searchGenre();
  });
}

function displayMovies(response) {
  console.log("displayMovies");
  var template = document.getElementById("template");
  if(Auth.getAccessToken()){
    template.querySelector(".movie-edit").removeAttribute("style");
    template.querySelector(".movie-delete").removeAttribute("style");
  }else{
    template.querySelector(".movie-edit").style.display="none";
    template.querySelector(".movie-delete").style.display="none";
  }
  var moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";
  // var regenerateMoviesContainer = document.getElementById("regenerate-movies");
  console.log("display movies response=", response);
  for (let i = 0; i < response.length; i++) {
    var moviesClone = template.cloneNode(true);
    // set a unique id for each movie
    moviesClone.id = "movie_" + response[i]._id;
    moviesClone.classList.add('new-movie');
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
        editMovie(me);
      
    });


    let deleteButton = moviesClone.querySelector(".movie-delete");
    deleteButton.addEventListener("click", function(){
      deleteMovieOnClick(me,i);
    });

    

  };

  if(Worker&&backgroundSync){//added by Tamas
    console.log("sending data to backgroundSync");
    backgroundSync.postMessage({mode:1,movies:{items:movies.items,pagination:movies.pagination},timer:{command:'start'}});
  }

};

function displayPagination(response) {
  //console.log("response pagination", response)
  var templatePages = document.getElementById("pagination-template");
  var pagesContainer = document.getElementById("pagination");
  pagesContainer.innerHTML = "";
  for ( let i=1; i<= response.numberOfPages; i++) {
    var pagesClone = templatePages.cloneNode(true);
    pagesClone.removeAttribute("style");
    pagesClone.removeAttribute("id");
    var pageButtonElement = pagesClone.querySelector(".pages-btn");
    pageButtonElement.innerHTML = i;
    pagesContainer.appendChild(pagesClone);
    pageButtonElement.addEventListener("click",function moveToPage(event){
      return getMovies((i-1)*10 +1);
    });
  }
}

// ALEXXXXXXX Search
var inputText = document.querySelector("[name=search]");
var searchSelected = document.querySelector(".search-select");
var searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener("click", searchMovie);

function searchMovie() {
  // var searchSelectedValue = searchSelected.value;
  var inputTextValue = inputText.value;
  console.log("SEARCH BUTTON");
  if (inputTextValue) {
    removeTemplateMovies();
    movies.getAll(10, 0, inputTextValue).then(function () {
      displayMovies(movies.items);
    });
  } else {
    removeTemplateMovies();
    movies.getAll(10, 0).then(function () {
      displayMovies(movies.items);
    });
  }}

  function removeTemplateMovies() {
    var movieDiv = document.getElementsByClassName('new-movie');
    while (movieDiv[0]) {
      movieDiv[0].parentNode.removeChild(movieDiv[0]);
    }
  }
///////////////////////////////////// Search Year

function searchYear() {
  var yearDiv = document.getElementById('searchDivYear');
  var buttonYearMin = document.createElement('button');
  var buttonYearMed = document.createElement('button');
  var buttonYearMax = document.createElement('button');
  var textButtonYearMin = document.createTextNode("Year < 2000");
  var textButtonYearMed = document.createTextNode("2000 - 2010");
  var textButtonYearMax = document.createTextNode("2010 < Year");
  buttonYearMin.appendChild(textButtonYearMin);
  buttonYearMin.addEventListener('click', function(){
    console.log("Year MIN clicked");
  })
  buttonYearMed.appendChild(textButtonYearMed);
  buttonYearMed.addEventListener('click', function(){
    console.log("Year MED clicked");
  })
  buttonYearMax.appendChild(textButtonYearMax);
  buttonYearMax.addEventListener('click', function(){
    console.log("Year MAX clicked");
  })
  yearDiv.appendChild(buttonYearMin);
  yearDiv.appendChild(buttonYearMed);
  yearDiv.appendChild(buttonYearMax);
  
}
///////////////////////////////////// Search Genre

function searchGenre() {
  var responseMovies = movies.items;
  var moviesGenre = []; // String Genre Array
  console.log("SEARCHHHHHHHHHH ", movies.items);
  
  for (let i=0; i<responseMovies.length; i++) {
    var responseMoviesGenre = responseMovies[i].Genre;
    getGenre();
    function getGenre(){
      var genreStringArray = responseMoviesGenre.split(", ");
      for(let i=0; i<genreStringArray.length;i++) {
        var genreString = genreStringArray[i];
        moviesGenre.push(genreString);
      }
    }
  }
  
  var genreObj = {};
  var genreArr = [];
  for (let i = 0; i < moviesGenre.length; i++) {
    if (!(moviesGenre[i] in genreObj)) {
      genreArr.push(moviesGenre[i]);
      genreObj[moviesGenre[i]] = true;
    }
  }
  
  for (let i=0; i<genreArr.length; i++) { 
    var singleGenre = genreArr[i]; //
    function addButtonGenre(singleGenre) {
    var genreDiv = document.getElementById('searchDivGenre'); // div pentru butoane
    var genreButton = document.createElement('button'); // creare buton
    var textButton = document.createTextNode(singleGenre); // nume buton (gen)
    genreButton.appendChild(textButton);
    genreDiv.appendChild(genreButton);
  
    genreButton.addEventListener("click", function() { // functie buton
        console.log("Genre button", singleGenre);
    });
  }
  
  addButtonGenre(singleGenre);
  }


}
//////////////////////ALEXXXXXXXXXXXX

function editMovie(movie){
   console.log("editMovie.movie=",movie);
    movie.getMovie().then(
		function(response) {
			console.log("success getMovie");
			console.log("response=",response);
			movieSubmitFormModal.displayEdit({response:response,movie:movie});
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
 displayMovies(movies.items);
});
}

function doAfterSuccessLogin(data={}){//added by Tamas, will run this function after successful log in
  console.groupCollapsed('doAfterSuccessLogin');
  displayEditButtons();
  console.groupEnd();
}
function doAfterSuccessRegister(data={}){//added by Tamas, will run this function after successful register
  console.groupCollapsed('doAfterSuccessRegister');
  displayEditButtons();
  console.groupEnd();

}
function doAfterSuccessLogOut(data={}){//added by Tamas, will run this function after successful log out
  console.groupCollapsed('doAfterSuccessLogOut'); 
  hideEditButtons();
  console.groupEnd();
}
function displayEditButtons(){
  document.querySelectorAll(".movie-delete").forEach(function(buttons){buttons.removeAttribute("style")});
  document.querySelectorAll(".movie-edit").forEach(function(buttons){buttons.removeAttribute("style")});
}
function hideEditButtons(){
  console.log("hide");
  document.querySelectorAll(".movie-delete").forEach(function(buttons){buttons.style.display="none";});
  document.querySelectorAll(".movie-edit").forEach(function(buttons){buttons.style.display="none";});
}
function doAfterSuccessImageUpload(data={}){//added by Tamas, will run this function after successful imate upload
  console.groupCollapsed('doAfterSuccessImageUpload');
  console.log('data=',data);
  //the data will contain information to the address of uploaded image
  //do to server side, the resposne might not be a json
  if(typeof data.response !="object"){
    //conver the result if not json
    var obj = JSON.parse(data.response);
    console.log('obj=',obj);
    console.log('address=',obj.address);
    //now we got the address of the image saved in obj.address
    notificationPopUp.post({body:"Image successfully uploaded",icon:obj.address});
    if(document.querySelector(".inputPoster")){
      document.querySelector(".inputPoster").value=obj.address;
    }
  }else{
    //we got the address of the image saved in data.response.address
    console.log('address=',data.response.address);
    notificationPopUp.post({body:"Image successfully uploaded",icon:data.response.address});
	if(document.querySelector(".inputPoster")){
      document.querySelector(".inputPoster").value=data.response.address;;
    }
  }
  
  console.groupEnd();
}
if(Worker&&backgroundSync){ //added by Tamas, allows page to refresh its movies if it changed on the database
  //not tested it with search attributes
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
      displayMovies(movies.items);
      displayPagination(movies.pagination);
      notificationPopUp.post({body:"Updated displayed movies."});
    }
  console.groupEnd();   
  }
}
