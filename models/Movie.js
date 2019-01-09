class Movie {
    constructor(option = {}) {
        this._id = option._id;
        this.Title = option.Title;
        this.Year = option.Year;
        this.Runtime = option.Runtime;
        this.Genre = option.Genre;
        this.Director = option.Director;
        this.Writer = option.Writer;
        this.Actors = option.Actors;
        this.Plot = option.Plot;
        this.Language = option.Language;
        this.Country = option.Country;
        this.Poster = option.Poster;
        this.imdbRating = option.imdbRating;
        
    }
    getMovie() {
        
        return $
            .ajax({
                //Auth: "no auth needed",
                //Headers: {"x-auth-token" : "ZGFucG9wOmRhbnBvcA=="},
                method: "GET",
                url: rootUrl + "movies/" + this._id,
            });
    }
    editMovie() {
         let token=Auth.getAccessToken()
        console.log("token=",token);
        return $
            .ajax({
                headers: {"x-auth-token" :token},
                method: "PUT",
                url: rootUrl + "movies/" + this._id,
                data: {
                    Title: this.Title,
                    Year: this.Year,
                    Runtime: this.Runtime,
                    Genre: this.Genre,
                    Director: this.Director,
                    Writer: this.Writer,
                    Actors: this.Actors,
                    Plot: this.Plot,
                    Language: this.Language,
                    Country: this.Country,
                    Poster: this.Poster,
                    imdbRating: this.imdbRating
                }
            });
    }
    deleteMovie() {
        let token=Auth.getAccessToken()
        return $
            .ajax({
                headers: {"x-auth-token" :token},
                method: "DELETE",
                url: rootUrl + "movies/" + this._id,
    }).then (function(response){return response;});
}
}



const rootUrl = "https://ancient-caverns-16784.herokuapp.com/";


const moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/";


Movie.prototype.getMovieDetails = function() {
  var me = this;
  return $.get(moviesRootUrl +"movies/" + me.id).then(function(response) {
    console.log("Movie", response);
    me._id = response._id;
    me.Title = response.Title;
    me.Year = response.Year;
    me.Runtime = response.Runtime;
    me.Genre = response.Genre;
    me.Director = response.Director;
    me.Writer = response.Writer;
    me.Actors = response.Actors;
    me.Plot = response.Plot;
    me.Language = response.Language;
    me.Country = response.Country;
    me.Poster = response.Poster;
    me.imdbRating = response.imdbRating;
  });
};


Movie.prototype.regenerateMovies = function() {
  return $.ajax({
    url: rootUrl + "/movies/all",
    method: "POST"
  });
};


