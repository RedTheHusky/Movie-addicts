var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/auth.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
		console.groupCollapsed('install');
        console.log('Opened cache');
		console.groupEnd();   
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});


let timerForCheckingModificationl={milliseconds:'900000',obj:''}; //this is 15 minutes
let movie4MainItems=[];
let movie4MainPagination={};
let movie4BackgroundItems=[];
let movie4BackgroundPagination={};
let moviesSkip=0;
let moviesTake=10;
let moviesSearchParam='';
let moviesCategory='';
let movieUrl='https://ancient-caverns-16784.herokuapp.com/movies'
let urlMovies='';
let stats={
	received:0, sent:0,
	called:{movies_items:0,movies_pagination:0,movies_skip:0,movies_searchparam:0,movies_category:0,timer4Check:0},
	xhttp:{calls:0, success:0, failure:0},
	checkup:{up2Date:0,modified:0}
};
//status.called.movies_items status.called.movies_pagination status.called.movies_skip status.called.movies_searchparam status.called.movies_category status.called.timer4Check
//stats.xhttp.calls stats.xhttp.success stats.xhttp.failure
//stats.checkup.up2Date stats.checkup.modified
self.onmessage = function (msg) {
    console.groupCollapsed('onmessage');
	console.log("msg=",msg);
		stats.received++;
		/*if(msg.data.importScript){
			console.log('we got importScript');
			console.log("value=",msg.data.importScript);
			importScripts(msg.data.importScript);
		}else*/
		if(msg.data.movies_items){
			console.log('we got movies_items');
			stats.called.movies_items++;
			movie4MainItems=msg.data.movies_items;
			console.log("value=",movie4MainItems);
		}
		if(msg.data.movies_pagination){
			console.log('we got movies_pagination');
			stats.called.movies_pagination++;
			movie4MainPagination=msg.data.movies_pagination;
			console.log("value=",movie4MainPagination);
		}
		if(msg.data.movies_skip){
			console.log('we got movies_skip');
			stats.called.movies_skip++;
			moviesSkip=msg.data.movies_skip;
			console.log("value=",moviesSkip);
			buildUrlMovies();
		}
		if(msg.data.movies_searchparam){
			console.log('we got movies_searchparam');
			stats.called.movies_searchparam++;
			moviesSearchParam=msg.data.movies_searchparam;
			console.log("value=",moviesSearchParam);
			buildUrlMovies();
		}
		if(msg.data.movies_category){
			console.log('we got movies_category');
			stats.called.movies_category++;
			moviesCategory=msg.data.movies_category;
			console.log("value=",moviesCategory);
			buildUrlMovies();; 
		}
		if(msg.data.timer4Check){
			console.log('we got timer4Check');
			console.log("value=",msg.data.timer4Check);
			stats.called.timer4Check++;
			if(msg.data.timer4Check==="start"){
				startTimerInterval();
			}else
			if(msg.data.timer4Check==="stop"){
				stopTimerInterval();
			}
		}
		if(msg.data.get){
			console.log('we got get');
			console.log("value=",msg.data.get);
			if(msg.data.get==="stats"){
				let tmp={};
				function addMain(key){
					tmp[key]=stats[key];
				}
				addMain("received"); addMain("sent");
				addMain("called"); addMain("xhttp");addMain("checkup");
				reply({stats:tmp});
				/*function addCalled(key){
					tmp[key]=stats.called[key];
				}
				function addXhttp(key){
					tmp[key]=stats.xhttp[key];
				}
				function addCheckup(key){
					tmp[key]=stats.checkup[key];
				}
				addMain("received"); addMain("sent");
				//status.called.movies_items status.called.movies_pagination status.called.movies_skip status.called.movies_searchparam status.called.movies_category status.called.timer4Check
				addCalled("movies_items");addCalled("movies_pagination");addCalled("movies_skip");addCalled("movies_searchparam");addCalled("movies_category");addCalled("timer4Check");
				//stats.xhttp.calls stats.xhttp.success stats.xhttp.failure
				 addXhttp("calls"); addXhttp("success"); addXhttp("failure");
				//stats.checkup.up2Date stats.checkup.modified
				addCheckup("up2Date");addCheckup("modified");
				reply({stats:tmp});*/
			}
		}
	console.groupEnd();   
}

function startTimerInterval(){
	console.groupCollapsed('startTimerInterval');
	if(timerForCheckingModificationl['obj']){
		console.log('removing old');
		clearInterval(timerForCheckingModificationl['obj']);
		timerForCheckingModificationl['obj']='';
	}
	if(location.protocol==="file:"){
		console.warn('Protocol is invalid. Ignoring setIterval');
		console.groupEnd();
		return;
	}
	console.log('adding new');
	timerForCheckingModificationl['obj']=setInterval(doAjaxCheckup, timerForCheckingModificationl['milliseconds']);
	console.groupEnd();
}
function stopTimerInterval(){
	console.groupCollapsed('stopTimerInterval');
	if(timerForCheckingModificationl['obj']){
		console.log('removing ');
		clearInterval(timerForCheckingModificationl['obj']);
		timerForCheckingModificationl['obj']='';
	}
	console.groupEnd();
}
function buildUrlMovies(){
	console.groupCollapsed('buildUrlMovies');
	if (!moviesCategory || !moviesSearchParam) {
        urlMovies = movieUrl + `?take=${moviesTake}&skip=${moviesSkip}`;
    } else {
        urlMovies = movieUrl + `?${moviesCategory}=${moviesSearchParam}&take=${moviesTake}&skip=${moviesSkip}`;
    }
	console.log('urlMovies=',urlMovies)
	console.groupEnd();
}
function doAjaxCheckup(){
	console.groupCollapsed('doAjaxCheckup');
	console.log('urlMovies=',urlMovies);
	if(urlMovies===''){
		buildUrlMovies();
		console.log('urlMovies=',urlMovies);
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  //console.log("response=",xhttp.responseText);
		 stats.xhttp.success++;
		  var obj = JSON.parse(xhttp.responseText);
		  console.log("response=",obj);
		  createCatche(obj);
		  if(!checkifTheyAreTheSame()){
			console.warn("They not the same, so need to send it back to main!");
			reply({update:{items:movie4BackgroundItems,pagination:movie4BackgroundPagination}});
			reply({display:true});
		  }
		}else 
		if (this.readyState == 4 && this.status !=200) {
			console.warn("Unexpected result");
			stats.xhttp.failure++;
		}
	};
	xhttp.open("GET",urlMovies, true);
	stats.xhttp.calls++;
	xhttp.send();
	console.groupEnd();
}
function createCatche(obj){
	console.groupCollapsed('createCatche');
	console.log("obj=",obj);
	let results=obj.results;
	console.log("pagination=",obj.pagination);
	console.log("results=",results);
	movie4BackgroundPagination=obj.pagination;
	movie4BackgroundItems=[];
	results.forEach(function(one,index){//element, index
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
		movie4BackgroundItems.push(movie);
	});
	
	console.log("result.items=",movie4BackgroundItems);
	console.log("result.pagination=",movie4BackgroundPagination);
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
	console.log("movie4MainItems=",movie4MainItems);
	console.log("movie4BackgroundItems=",movie4BackgroundItems);
	console.log("movie4MainItems.length=",movie4MainItems.length);
	console.log("movie4BackgroundItems.length=",movie4BackgroundItems.length);
	if(movie4MainItems.length!=movie4BackgroundItems.length){
		console.log("array lenght invalid");
		console.log("result=false");
		stats.checkup.modified++;
		console.groupEnd();
		return false;
	}else{
		let ok=true;
		let i=0;
		while(i<movie4MainItems.length&&ok){
			console.groupCollapsed('['+i+']');
			console.log("movie4MainItems=",movie4MainItems[i]);
			console.log("movie4BackgroundItems=",movie4BackgroundItems[i]);
			if(isObjEquivalent(movie4MainItems[i],movie4BackgroundItems[i])){
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
			stats.checkup.up2Date++;
			console.groupEnd();
			return true;
		}else{
			console.log("result=false");
			stats.checkup.modified++;
			console.groupEnd();
			return false;
		}
	}
}

function reply(obj={none:'none'}) {
	console.groupCollapsed('reply');
	console.log("obj=",obj);
    if (obj) { 
		stats.sent++;
		console.groupEnd();
        postMessage(obj);
    }else{
		console.groupEnd();
	} 
}