let search4Movie={
	init:function(options={root:"body",setRoot:true,addEvents:true}) {
		console.groupCollapsed('init');
		this.initDone=true;
		if(!(typeof options === 'object')){options={}};
		
		this.main={id:'',dom:'',jquery:''};
		this.basicSearch={tag:"Title",value:""};
		this.searchParameters={};

		if(options.setRoot){
			this.main.id=options.root||"body";
			this.setRoot(options.setRoot);
			if(options.addEvents){
				this.addEvents();
			}
			if(options.addModal){
				this.addModal();
				if(options.addModalEvents){
					this.addModalEvents();
				}
			}
		}
		
		console.groupEnd();
	},
	setRoot:function(options={}) {
		console.groupCollapsed('setRoot');
		if(!(typeof options === 'object')){options={}};
		if(options.root){
			this.main.id = options.root;
		}
		console.log('root=',this.main.id);
		if(this.main.id){
			this.main.dom=document.querySelector(this.main.id);
			this.main.jquery=$(this.main.id); 
		}
		
		console.log('dom=',this.main.dom);
		console.log('jquery=',this.main.jquery);
		console.groupEnd();
	},
	isElement:function(o){
		//checks if o is an HTML element 
		//console.groupCollapsed('isElement');
		//console.log('o=',o);
		var r=(
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
		//console.log('r=',r);
		//console.groupEnd();
		return r;
	},
	addEvents:function(){
		console.groupCollapsed('addEvents');
		let me=this;
		let jquery=this.main.jquery;
		jquery.find("#search-category").change(function() {
			console.groupCollapsed('search-category.change');
		  var selected = $(this).children("option:selected").val();
		  console.log("selected=",selected);
		  me.changeCategory(selected);
		  console.groupEnd();
		});
		jquery.find("#search-do").click(function() {
			console.groupCollapsed('search-do.click');
		    me.doSearch();
		    console.groupEnd();
		});
		jquery.find("#search-value").keyup(function(event) {
			console.groupCollapsed('search-value.keyup');
			if (event.keyCode === 13) {
				console.log("enter hit");
				me.doSearch();
			}else{
				console.log('value=',event.target.value);
				me.doDynamicSearch();
			}
			console.groupEnd();
		});
		jquery.find("#refresh-page").click(function(event) {
			console.groupCollapsed('refresh-page.keyup');
			me.refreshPage();
			console.groupEnd();
		});
		jquery.find("#reset-page").click(function(event) {
			console.groupCollapsed('reset-page.keyup');
			me.resetPage();
			console.groupEnd();
		});
		console.groupEnd();
	},
	changeCategory:function(option=""){
		console.groupCollapsed('changeCategory');
		console.log('option=',option);
		let jquery=this.main.jquery;
			if(option==="Type"||option===5){
				jquery.find("#search-value").attr("placeholder","Type");
				this.basicSearch.tag="Type";
			}
			else if(option==="Country"||option===4){
				jquery.find("#search-value").attr("placeholder","Country");
				this.basicSearch.tag="Country";
			}
			else if(option==="Genre"||option===3){
				jquery.find("#search-value").attr("placeholder","Genre");
				this.basicSearch.tag="Genre";
			}
			else if(option==="Year"||option===2){
				jquery.find("#search-value").attr("placeholder","Year");
				this.basicSearch.tag="Year";
			}
			else if(option==="Title"||option===1){
				jquery.find("#search-value").attr("placeholder","Title");
				this.basicSearch.tag="Title";
			}
		console.groupEnd();
	},
	doSearch:function(){
		console.groupCollapsed('doSearch');
		let me=this;
		this.basicSearch.value=this.main.jquery.find("#search-value").val().trim();
		this.basicSearch.value=this.basicSearch.value.trim();
		console.log('basicSearch=',this.basicSearch);
		this.searchParameters={};
		this.searchParameters[this.basicSearch.tag]=this.basicSearch.value;
		if(movies){
			movies.getAllwSearch ({skip:0,take:10},this.searchParameters).then(
				function(resolved){
					console.log('resolved=',resolved);
					console.log('resolved.results.length=',resolved.results.length);
					if(resolved.results.length===0){
						me.searchParameters={};
						if(getMovies){
							getMovies();
						}
						if(alertElements&&alertElements["notification"]){
							alertElements["notification"].setType("danger");
							alertElements["notification"].setElement([{selector:".alert-body",task:"inner",value:"No movies with this search parameters have been found!"},"show"]); 
							alertElements["notification"].slideup(options={a:2000,b:500,c:500,d:500})
						}
					}else{
						if(displayMovies){
							displayMovies(movies.items);
						}
						if(alertElements&&alertElements["notification"]){
							alertElements["notification"].setType("success");
							alertElements["notification"].setElement([{selector:".alert-body",task:"inner",value:"Found movies"},"show"]); 
							alertElements["notification"].slideup(options={a:2000,b:500,c:500,d:500})
						}
					}
				},
				function(rejected){
					console.log('rejected=',rejected);
					me.searchParameters={};
					if(displayMovies){
						displayMovies(movies.items);
					}
					if(alertElements&&alertElements["notification"]){
						alertElements["notification"].setType("danger");
						alertElements["notification"].setElement([{selector:".alert-body",task:"inner",value:error.responseJSON.message},"show"]); 
						alertElements["notification"].slideup(options={a:2000,b:500,c:500,d:500})
					}
				}
			);
		}
		console.groupEnd();
	},
	addModal:function(){
		console.groupCollapsed('addModal');
		this.modal= new Modal({root:this.main.id});
		let content=`<div class="modal-dialog"><form name=formAuth" action="">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Advanced Search</h4>
      </div>
      <div class="modal-body">

			<div class='form-group'>
				<input type="text" name="Title" placeholder='Title' value="" autocomplete="title" class="title text-input form-control">
			</div>
			<div class='form-group'>
				<input type="text" name="Year" placeholder='Year' value="" autocomplete="year" class="year text-input form-control">
			</div>
			<div class='form-group'>
				<input type="text" name="Genre" placeholder='Genre' value="" autocomplete="genre" class="genre text-input form-control">
			</div>
			<div class='form-group'>
				<input type="text" name="Country" placeholder='Country' value="" autocomplete="country" class="country text-input form-control">
			</div>
			<div class='form-group'>
				<input type="text" name="Type" placeholder='Type' value="" autocomplete="type" class="type text-input form-control">
			</div>
      </div>
      <div class="modal-footer">
		
		<button type="button" class="btn btn-primary bt-doAdvancedSearch" data-dismiss="modal">Search</button>
		<button type="button" class="btn btn-danger bt-close" data-dismiss="modal">Close</button>
      </div>
    </div>

  </form></div>`;
		this.modal.content=content;
		this.modal.add2Root();
		console.groupEnd();
	},
	addModalEvents:function(){
		console.groupCollapsed('addModalEvents');
		let me=this;
		let jquery=this.main.jquery;
		jquery.find("#search-openadvance").click(function(){
			console.groupCollapsed('search-openadvance.click');
			me.modal.show();
			console.groupEnd();
		});
		jquery.find(".bt-doAdvancedSearch").click(function(){
			console.groupCollapsed('bt-doAdvancedSearch.click');
			me.doAdvancedSearch();
			console.groupEnd();
		});
		console.groupEnd();
	},
	doAdvancedSearch:function(){
		console.groupCollapsed('doAdvancedSearch');
		let me=this;
		this.searchParameters={};
		this.modal.dom.querySelectorAll("input").forEach(function(input){
			if(input.value){
				me.searchParameters[input.getAttribute("name")]=input.value;
			}
		});
	
		console.log('searchParameters=',this.searchParameters);
		
		if(movies){
			movies.getAllwSearch ({skip:0,take:10},this.searchParameters).then(
				function(resolved){
					console.log('resolved=',resolved);
					console.log('resolved.results.length=',resolved.results.length);
					if(resolved.results.length===0){
						me.searchParameters={};
						if(getMovies){
							getMovies();
						}
						if(alertElements&&alertElements["notification"]){
							alertElements["notification"].setType("danger");
							alertElements["notification"].setElement([{selector:".alert-body",task:"inner",value:"No movies with this search parameters have been found!"},"show"]); 
							alertElements["notification"].slideup(options={a:2000,b:500,c:500,d:500})
						}
					}else{
						me.searchParameters={};
						if(displayMovies){
							displayMovies(movies.items);
						}
						if(alertElements&&alertElements["notification"]){
							alertElements["notification"].setType("success");
							alertElements["notification"].setElement([{selector:".alert-body",task:"inner",value:"Found movies"},"show"]); 
							alertElements["notification"].slideup(options={a:2000,b:500,c:500,d:500})
						}
					}
				},
				function(rejected){
					console.log('rejected=',rejected);
					if(alertElements&&alertElements["notification"]){
						alertElements["notification"].setType("danger");
						alertElements["notification"].setElement([{selector:".alert-body",task:"inner",value:error.responseJSON.message},"show"]); 
						alertElements["notification"].slideup(options={a:2000,b:500,c:500,d:500})
					}
				}
			);
		}
		console.groupEnd();
	},
	toggleDropdown:function(){
		console.groupCollapsed('toggleDropdown');
		console.log(this.main.jquery.find('.dropdown').find('[data-toggle=dropdown]'));
		this.main.jquery.find('.dropdown').find('[data-toggle=dropdown]').dropdown('toggle');
		//this.main.jquery.find('.dropdown').dropdown('toggle');
		console.groupEnd();
	},
	doDynamicSearch:function(){
		console.groupCollapsed('doDynamicSearch');
		let me=this;
		let jquery=this.main.jquery;
		let send={};send[this.basicSearch.tag]=jquery.find("#search-value").val().trim();
		if(movies){
			movies.getAllwSearch ({skip:0,take:5},send).then(
				function(resolved){
					console.log('resolved=',resolved);
					console.log('resolved.results.length=',resolved.results.length);
					let html="";
					if(resolved.results.length===0){
						html+=`<a class="dropdown-item" role="menuitem"><i class="fas fa-search" style='padding-right:5px;'></i>No such movie found</a>`;
					}else{
						resolved.results.forEach(function(movie,i){
							console.log("response[", i,"]=",movie);
							html+=`<a class="dropdown-item" role="menuitem" href="movieDetails.html?_id=${movie._id}"><i class="fas fa-film" style='padding-right:5px;'></i>${movie.Title}</a>`;
						});
						html+=`<div class="dropdown-divider"></div>`;
						html+=`<a class="dropdown-item" role="menuitem" onclick="search4Movie.doSearch()"><i class="fas fa-search" style='padding-right:5px;'></i>To see more, do a search.</a>`;
					}
					jquery.find("#dropdown-content").html(html);
					me.show();
				},
				function(rejected){
					console.log('rejected=',rejected);
				}
			);
		}
		console.groupEnd();
	},
	show:function(){
		console.groupCollapsed('show');
		let jquery=this.main.jquery;
		let isVisible=jquery.find('.dropdown-menu').is(':visible');
		let isHidden=jquery.find('.dropdown-menu').is(':hidden');
		console.log("isVisible:",isVisible);
		console.log("isHidden:",isHidden);
		if(!isVisible){
			console.log("do");
			this.toggleDropdown();
		}
		console.groupEnd();
	},
	hide:function(){
		console.groupCollapsed('hide');
		let jquery=this.main.jquery;
		let isVisible=jquery.find('.dropdown-menu').is(':visible');
		let isHidden=jquery.find('.dropdown-menu').is(':hidden');
		console.log("isVisible:",isVisible);
		console.log("isHidden:",isHidden);
		if(isVisible){
			console.log("do");
			this.toggleDropdown();
		}
		console.groupEnd();
	},
	refreshPage:function(){
		console.groupCollapsed('refreshPage');
		getMovies();
		console.groupEnd();
	},
	resetPage:function(){
		console.groupCollapsed('resetPage');
		this.searchParameters={};
		this.main.jquery.find("#search-value").val("");
		getMovies();
		console.groupEnd();
	}
}