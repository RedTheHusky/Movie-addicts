function Movies() {
  this.items = [];
  this.pagination = {};
}
// const moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/";
Movies.prototype.getAll = function(skip="0") {
  var me = this;
  return $.get(moviesRootUrl + "movies?take=10&skip=" + skip).then(function(response) {
    me.items=[];
    me.pagination=response.pagination;
    response=response.results;
    for (var i = 0; i < response.length; i++) {
      var movie = new Movie(response[i]);
      me.items.push(movie);
    };
    console.log("me.items=", me.items);

  });
};
Movies.prototype.getAllwSearch = function(defaultParams={skip:0,take:10}, serachParams={}) {
	var me = this; var address=moviesRootUrl + "movies?take="+defaultParams.take||10+"&skip=" + defaultParams.skip||0
	for (var key in serachParams){ 
		let arrayOfKeysApproved=["Title","Year","Runtime","Genre","Language","Country","Poster","imdbRating","imdbVotes","imdbID","Type"];
		if(arrayOfKeysApproved.indexOf(key) > -1){
			address+="&"+key+"="+serachParams[key];
		}
	}
	console.log("address=",address);
	return $.get(address)
	.done(function(response) {
		console.log("found=",response);
		if(response.results.length>0){
			me.items=[];
			me.pagination=response.pagination;
			response=response.results;
			for (var i = 0; i < response.length; i++) {
				var movie = new Movie(response[i]);
				me.items.push(movie);
			};  
		}
		return response;
	})
	.fail(function(response) {
		console.log("notfound=",response);
		return response;
	});
};