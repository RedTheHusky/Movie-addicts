/*Worker for background sync
This will periodically check if movies database has changed 
if it did change based from the information it gathered it will trigger the host tread to update its movies or movie display
*/
let timerForCheckingModificationl={mcycle:60000,obj:'',mfire:60000, mcount:0}; //this is 900000 ms == 15 minutes
let mode=0; //1-all 2-special
let movies={main:{items:[],pagination:{}},background:{items:[],pagination:{}}, settings:{skip:0,take:10,searchParam:{}}};
let movie={main:{},background:{},id:''};
let movieUrl='https://ancient-caverns-16784.herokuapp.com/movies'
let urlMovies='';
let stats={
	received:0, sent:0,
	called:{mode:0,movies:{reset:0,items:0,pagination:0,skip:0,searchparam:0,category:0},movie:{details:0,id:0},timer:{start:0,stop:0,mcycle:0,mfire:0}},
	xhttp:{calls:0, success:0, failure:0},
	checkup:{up2Date:0,modified:0}
};

self.onmessage = function (msg) {
    //console.groupCollapsed('onmessage');
	//console.log("msg=",msg);
		stats.received++;

		if(msg.data.mode){
			console.log('got mode');
			stats.called.mode++;
			mode=msg.data.mode;
			console.log("mode=",mode);
			buildUrlMovies();
		}
		//movies
		if(msg.data.movies){
			if(msg.data.movies.reset){
				//console.log('we got movies.reset');
				stats.called.movies.reset++;
				movies={main:{items:[],pagination:{}},background:{items:[],pagination:{}}, settings:{skip:0,take:10,searchParam:'',category:''}};
			}
			if(msg.data.movies.items){
				console.log('items');
				stats.called.movies.items++;
				movies.main.items=msg.data.movies.items;
				console.log("items=",movies.main.items);
			}
			if(msg.data.movies.pagination){
				console.log('got pagination');
				stats.called.movies.pagination++;
				movies.main.pagination=msg.data.movies.pagination;
				console.log("pagination=",movies.main.pagination);
			}
			if(msg.data.movies.skip){
				console.log('got skip');
				stats.called.movies.skip++;
				movies.settings.skip=msg.data.movies.skip;
				console.log("skip=",movies.settings.skip);
				buildUrlMovies();
			}
			if(msg.data.movies.searchparam){
				console.log('got searchparam');
				stats.called.movies.searchparam++;
				movies.settings.searchParam=msg.data.movies.searchparam;
				console.log("searchParam=",movies.settings.searchParam);
				buildUrlMovies();
			}
			if(msg.data.movies.take){
				console.log('got take');
				stats.called.movies.take++;
				movies.settings.take=msg.data.movies.take;
				console.log("take=",movies.settings.take);
				buildUrlMovies();
			}
		}
		if(msg.data.movie){
			if(msg.data.movie.details){
				console.log('got movie_details');
				stats.called.movie.details++
				movie.main=msg.data.movie.details;
				console.log("movies.main=",movies.main);
				buildUrlMovies();
			}
			if(msg.data.movie.id){
				console.log('got movie_id');
				stats.called.movie.id++
				movie.id=msg.data.movie.id;
				console.log("movies.id=",movies.id);
				buildUrlMovies();
			}
		}
		//timer
		if(msg.data.timer){
			//console.log('we got timer4Check');
			//console.log("value=",msg.data.timer4Check);
			if(msg.data.timer.command==="start"){
				console.log('got timer Start');
				console.warn("Timer start is disabled");
				//stats.called.timer.start++;
				//startTimerInterval();
			}else
			if(msg.data.timer.command==="stop"){
				console.log('got timer Stop');
				stats.called.timer.stop++;
				stopTimerInterval();
			}
			if(msg.data.timer.mcycle){
				console.log('got timer Mcycle');
				stats.called.timer.mcycle++;
				stats.called.timer4Check++;
				timerForCheckingModificationl.mcycle=msg.data.timer.mcycle;
				console.log("timerForCheckingModificationl.mcycle=",timerForCheckingModificationl.mcycle);
			}
			if(msg.data.timer.mfire){
				console.log('got timer Mfire');
				stats.called.timer.mfire++;
				stats.called.timer4Check++;
				timerForCheckingModificationl.mfire=msg.data.timer.mfire;
				console.log("timerForCheckingModificationl.mfire=",timerForCheckingModificationl.mfire);
			}
		}
		
		//get
		if(msg.data.get){
			//console.log('we got get');
			//console.log("value=",msg.data.get);
			if(msg.data.get==="stats"){
				let tmp={};
				function addMain(key){
					tmp[key]=stats[key];
				}
				addMain("received"); addMain("sent");
				addMain("called"); addMain("xhttp");addMain("checkup");
				reply({stats:tmp,timer:timerForCheckingModificationl,movies:movies,movie:movie});
			}
		}
	//console.groupEnd();   
}

function startTimerInterval(){
	//console.groupCollapsed('startTimerInterval');
	if(timerForCheckingModificationl['obj']){
		//console.log('removing old');
		clearInterval(timerForCheckingModificationl['obj']);
		timerForCheckingModificationl['obj']='';
	}
	if(mode!=1&&mode!=2){
		console.warn('No mode selected. Ignoring setIterval');
		//console.groupEnd();
		return;
	}
	if(location.protocol==="file:"){
		console.warn('Protocol is invalid. Ignoring setIterval');
		//console.groupEnd();
		return;
	}
	//console.log('adding new');
	timerForCheckingModificationl.mcount=0;
	timerForCheckingModificationl['obj']=setInterval(doAjaxCheckup, timerForCheckingModificationl['mcycle']);
	//console.groupEnd();
}
function stopTimerInterval(){
	//console.groupCollapsed('stopTimerInterval');
	if(timerForCheckingModificationl['obj']){
		//console.log('removing ');
		clearInterval(timerForCheckingModificationl['obj']);
		timerForCheckingModificationl['obj']='';
	}
	//console.groupEnd();
}
function buildUrlMovies(){
	//console.groupCollapsed('buildUrlMovies');
	//console.log('mode=',mode);
	urlMovies="";
	if(mode===1){
		urlMovies=movieUrl + "?take="+movies.settings.take+"&skip=" + movies.settings.skip;
		for (var key in movies.settings.searchParam){ 
			let arrayOfKeysApproved=["Title","Year","Runtime","Genre","Language","Country","Poster","imdbRating","imdbVotes","imdbID","Type"];
			if(arrayOfKeysApproved.indexOf(key) > -1){
			urlMovies+="&"+key+"="+movies.settings.searchParam[key];
			}
		}
	}else
	if(mode===2){
		urlMovies = movieUrl +"/"+movie.id;
	}
	
	//console.log('urlMovies=',urlMovies)
	//console.groupEnd();
}
function doAjaxCheckup(){
	console.log("checking4Modifications");
	//console.groupCollapsed('doAjaxCheckup');
	timerForCheckingModificationl.mcount+=timerForCheckingModificationl.mcycle;
	if(timerForCheckingModificationl.mcount<timerForCheckingModificationl.mfire){
		//console.log('waiting:',timerForCheckingModificationl.mcount,'/',timerForCheckingModificationl.mfire);
		//console.groupEnd();
		return;
	}
	timerForCheckingModificationl.mcount=0;
	//console.log('urlMovies=',urlMovies);
	if(urlMovies===''){
		buildUrlMovies();
		//console.log('urlMovies=',urlMovies);
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			stats.xhttp.success++;
			var obj = JSON.parse(xhttp.responseText);
			//console.log("response=",obj);
			createCatche(obj);
			if(!checkifTheyAreTheSame()){
				if(mode===1){
					console.warn("They not the same, so need to send it back to main!");
					reply({update:{items:movies.background.items,pagination:movies.background.pagination}});
					reply({display:true});
				}else
				if(mode===2){
					console.warn("They not the same, so need to send it back to detailsMovie!");
					reply({update:{details:movie.background}});
					reply({display:true});
				}		
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
	//console.groupEnd();
}
function createCatche(obj){
	//console.groupCollapsed('createCatche');
	//console.log("obj=",obj);
	if(mode===1){
		let results=obj.results;
		//console.log("pagination=",obj.pagination);
		//console.log("results=",results);
		movies.background.pagination=obj.pagination;
		movies.background.items=[];
		results.forEach(function(one,index){//element, index
			//console.log("[",index,"]=",one);
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
			movies.background.items.push(movie);
		});
		
		//console.log("result.items=",movies.background.items);
		//console.log("result.pagination=",movies.background.pagination);
	}
	if(mode===2){
		movie.background._id = obj._id;
		movie.background.Title = obj.Title;
		movie.background.Year = obj.Year;
		movie.background.Runtime = obj.Runtime;
		movie.background.Genre = obj.Genre;
		movie.background.Director = obj.Director;
		movie.background.Writer = obj.Writer;
		movie.background.Actors = obj.Actors;
		movie.background.Plot = obj.Plot;
		movie.background.Language = obj.Language;
		movie.background.Country = obj.Country;
		movie.background.Poster = obj.Poster;
		movie.background.imdbRating = obj.imdbRating;
		//console.log("result.movie=",movie.background);
	}
	
	//console.groupEnd();
}
function checkifTheyAreTheSame(){
	//console.groupCollapsed('checkifTheyAreTheSame');
	function isObjEquivalent(a, b) {
		//console.groupCollapsed('isObjEquivalent');
		var aProps = Object.getOwnPropertyNames(a);
		var bProps = Object.getOwnPropertyNames(b);
		if (aProps.length != bProps.length) {
			console.warn("notEquivalent->invalud lenght");
			//console.groupCollapsed('invalud lenght');
			//console.log('aProps.length=',aProps.length);
			//console.log('bProps.length=',bProps.length);
			//console.groupEnd();
			//console.groupEnd();
			return false;
		}

		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i];
			if (a[propName] != b[propName]) {
				console.warn("notEquivalent->",[propName,a[propName],b[propName]]);
				//console.groupCollapsed('invalud property');
				//console.log('Props.propName=',propName);
				//console.log('aProps.value=',a[propName]);
				//console.log('bProps.value=',b[propName]);
				//console.groupEnd();
				//console.groupEnd();
				return false;
			}
		}
		//console.groupEnd();
		return true;
	}
	
	if(mode===1){
		//console.log("movies.main.items=",movies.main.items);
		//console.log("movies.background.items=",movies.background.items);
		//console.log("movies.main.items.length=",movies.main.items.length);
		//console.log("movies.background.items.length=",movies.background.items.length);
		if(movies.main.items.length!=movies.background.items.length){
			console.warn("array lenght invalid");
			//console.log("result=false");
			stats.checkup.modified++;
			//console.groupEnd();
			return false;
		}else{
			let ok=true;
			let i=0;
			while(i<movies.main.items.length&&ok){
				//console.groupCollapsed('['+i+']');
				//console.log("movies.main.items=",movies.main.items[i]);
				//console.log("movies.background.items=",movies.background.items[i]);
				if(isObjEquivalent(movies.main.items[i],movies.background.items[i])){
					//console.log("isObjEquivalent=true");
				}else{
					//console.log("isObjEquivalent=false");
					console.warn("notEquivalent:",[movies.main.items[i],movies.background.items[i]]);
					ok=false;
				}
				i++
				//console.groupEnd();
			}
			if(ok){
				//console.log("result=true");
				stats.checkup.up2Date++;
				//console.groupEnd();
				return true;
			}else{
				//console.log("result=false");
				stats.checkup.modified++;
				//console.groupEnd();
				return false;
			}
		}
	}else
	if(mode===2){
		//console.log("movie.id=",movie.id);
		//console.log("movie.main=",movie.main);
		//console.log("movie.background=",movie.background);
		if(isObjEquivalent(movie.main,movie.background)){
			console.warn("notEquivalent:",[movie.main,movie.background]);
			//console.log("isObjEquivalent=true");
			//console.groupEnd();
			return true;
		}else{
			//console.log("isObjEquivalent=false");
			//console.groupEnd();
			return false;
		}
	}
	//console.groupEnd();
}

function reply(obj={none:'none'}) {
	//console.groupCollapsed('reply');
	//console.log("obj=",obj);
    if (obj) { 
		stats.sent++;
		//console.groupEnd();
        postMessage(obj);
    }else{
		//console.groupEnd();
	} 
}