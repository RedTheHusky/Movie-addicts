let timerForCheckingModificationl={milliseconds:'60000',obj:''};
let moviesItems=[];
let moviesItemsGet=[];
let moviesSkip=0;
let moviesTake=10;
let moviesSearchParam='';
let moviesCategory='';
let movieUrl='https://ancient-caverns-16784.herokuapp.com/movies'
let urlMovies='';
self.onmessage = function (msg) {
    console.groupCollapsed('onmessage');
	console.log("msg=",msg);
		if(msg.data.importScript){
			console.log('we got importScript');
			console.log("value=",msg.data.importScript);
			importScripts(msg.data.importScript);
		}else
		if(msg.data.movies_items){
			console.log('we got movies_items');
			moviesItems=msg.data.movies_items;
			console.log("value=",moviesItems);
			buildUrlMovies();
			doTimerInterval(); 
		}else
		if(msg.data.movies_skip){
			console.log('we got movies_skip');
			moviesSkip=msg.data.movies_skip;
			console.log("value=",moviesSkip);
			buildUrlMovies();
			doTimerInterval(); 
		}else
		if(msg.data.movies_searchparam){
			console.log('we got movies_searchparam');
			moviesSearchParam=msg.data.movies_searchparam;
			console.log("value=",moviesSearchParam);
			buildUrlMovies();
			doTimerInterval(); 
		}if(msg.data.movies_skip){
			console.log('we got movies_category');
			moviesCategory=msg.data.movies_category;
			console.log("value=",moviesCategory);
			buildUrlMovies();
			doTimerInterval(); 
		}
	console.groupEnd();   
}

function doTimerInterval(){
	console.groupCollapsed('doTimerInterval');
	if(timerForCheckingModificationl['obj']){
		console.log('removing old');
		clearInterval(timerForCheckingModificationl['obj']);
	}
	console.log('adding new');
	timerForCheckingModificationl['obj']=setInterval(doAjaxCheckup, timerForCheckingModificationl['milliseconds']);
	console.groupEnd();
}
function buildUrlMovies(){
	console.groupCollapsed('buildUrlMovies');
	if (!moviesCategory || !moviesSearchParam) {
        urlMovies = movieUrl + `?take=${moviesTake}&skip=${moviesSkip}`;
    } else {
        urlMovies = movieUrl + `?${moviesCategory}=${moviesSearchParam}&take=${take}&skip=${skip}`;
    }
	console.log('urlMovies=',urlMovies)
	console.groupEnd();
}
function doAjaxCheckup(){
	console.groupCollapsed('doAjaxCheckup');
	console.log('urlMovies=',urlMovies)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  //console.log("response=",xhttp.responseText);
		  var obj = JSON.parse(xhttp.responseText);
		  console.log("response=",obj);
		  createCatche(obj.results);
		  checkifTheyAreTheSame();
		}
	};
	xhttp.open("GET",urlMovies, true);
	xhttp.send();
	console.groupEnd();
}
function createCatche(response){
	console.groupCollapsed('createCatche');
	console.log("input=",response);
	moviesItemsGet=[];
	response.forEach(function(one,index){//element, index
		console.log("[",index,"]=",one);
		let movie={};
		movie._id = one._id;
		movie.Title = one.Title;
		movie.Year = one.Year;
		movie.Runtime = one.Runtime;
		movie.Genre = one.Genre;
		movie.Director = one.Director;
		movie.Writer = one.Writer;
		movie.Actors = one.Actors;
		movie.Plot = one.Plot;
		movie.Language = one.Language;
		movie.Country = one.Country;
		movie.Poster = one.Poster;
		movie.imdbRating = one.imdbRating;
		moviesItemsGet.push(movie);
	});
	
	console.log("result=",moviesItemsGet);
	console.groupEnd();
}
function checkifTheyAreTheSame(){
	console.groupCollapsed('checkifTheyAreTheSame');
	function isObjEquivalent(a, b) {
		console.groupCollapsed('isObjEquivalent');
		var aProps = Object.getOwnPropertyNames(a);
		var bProps = Object.getOwnPropertyNames(b);
		if (aProps.length != bProps.length) {
			console.groupCollapsed('invalud lenght');
			console.log('aProps.length=',aProps.length);
			console.log('bProps.length=',bProps.length);
			console.groupEnd();
			console.groupEnd();
			return false;
		}

		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i];
			if (a[propName] != b[propName]) {
				console.groupCollapsed('invalud property');
				console.log('Props.propName=',propName);
				console.log('aProps.value=',a[propName]);
				console.log('bProps.value=',b[propName]);
				console.groupEnd();
				console.groupEnd();
				return false;
			}
		}
		console.groupEnd();
		return true;
	}
	console.log("moviesItems=",moviesItems);
	console.log("moviesItemsGet=",moviesItemsGet);
	console.log("moviesItems.length=",moviesItems.length);
	console.log("moviesItemsGet.length=",moviesItemsGet.length);
	if(moviesItems.length!=moviesItemsGet.length){
		console.log("array lenght invalid");
		console.log("result=false");
	}else{
		let ok=true;
		let i=0;
		while(i<moviesItems.length&&ok){
			console.groupCollapsed('['+i+']');
			console.log("moviesItems=",moviesItems[i]);
			console.log("moviesItemsGet=",moviesItemsGet[i]);
			if(isObjEquivalent(moviesItems[i],moviesItemsGet[i])){
				console.log("isObjEquivalent=true");
			}else{
				console.log("isObjEquivalent=false");
				ok=false;
			}
			i++
			console.groupEnd();
		}
		if(ok){
			console.log("result=true");
		}else{
			console.log("result=false");
		}
		
	}
	console.groupEnd();
}