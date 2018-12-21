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
