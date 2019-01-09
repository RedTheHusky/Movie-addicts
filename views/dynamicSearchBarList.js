let dynamicSearchBarList={
	init:function(options={root:"body",add2Root:true}) {
		console.groupCollapsed('init');
		function uuidv4() {
		  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		  });
		}
		this.initDone=true;
		this.hasMovie=false;
		this.main={id:'',dom:'',jquery:''};
		this.root={id:'',dom:'',jquery:''};
		this.main.id=uuidv4();
		console.log("options=",options);
		if(options.root){
			this.root.id=options.root;
			if(this.root.id){
				console.log('add root');
				this.root.dom=document.querySelector(this.root.id);
				this.root.jquery=$(this.root.id); 
				console.log('root.dom=',this.root.dom);
				console.log('root.jquery=',this.root.jquery);
				if(options.add2Root){
					this.add2Root(options.add2Root);
				}
			}
		}
		console.groupEnd();
	},
	add2Root:function(options={}) {
		//generates and appends the modal html elements to the rootdoom
		console.groupCollapsed('add2Root');
		if(!this.initDone)this.init();
		if(!(typeof options === 'object')){options={}};
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				console.log('add root');
				this.root.dom=document.querySelector(this.root.id);
				this.root.jquery=$(this.root.id); 
				console.log('root.dom=',this.root.dom);
				console.log('root.jquery=',this.root.jquery);
			}
		}
		console.log('root=',this.root);
		//console.log('modal=',$('#'+this.main.id)[0]);
		if($('#'+this.main.id)[0]){
			console.warn("already exists");
			console.groupEnd();
			return false;
		}
		
		if(this.root.dom&&this.isElement(this.root.dom)){
			console.log('Dom element does exists');
			this.main.dom="";this.main.jquery="";
			this.main.dom = document.createElement("div");
			this.main.dom.classList.add("dropdown");
			this.main.dom.setAttribute("id", this.main.id);
			this.main.dom.innerHTML = `
						<button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" style="display:none">Trigger<span class="caret"></span></button>
						<ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
						</ul>`
			this.root.dom.appendChild(this.main.dom);	
			this.main.jquery=$('#'+this.main.id); 
			console.log('Created');
		}else{
			console.warn('Dom element does not exists');
		}
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
	setDropDownToggle:function(selector=""){
		console.groupCollapsed('setDropDownToggle');
		console.log('selector=',selector);
		if(!this.initDone)this.init();
		let me=this;
		if($(selector)){
			$(selector).on('click', function (e) {
				console.groupCollapsed('toggle by click');
				e.stopPropagation();
				console.log("e=",e);
				console.log("element=",me.main.jquery);
				console.log("element=",me.main.jquery.find('.dropdown'));
				console.log("element=",me.main.jquery.find('.dropdown').find('[data-toggle=dropdown]'));
				me.main.jquery.find('.dropdown').find('[data-toggle=dropdown]').dropdown('toggle');
				//me.main.jquery.dropdown('toggle');me.main.jquery.find('.dropdown').dropdown('toggle');
				console.groupEnd();
			});
		}
		console.groupEnd();
	},
	toggle:function(){
		console.log("toggle");
		if(!this.initDone)this.init();
		this.main.jquery.find('[data-toggle=dropdown]').dropdown('toggle');
	},
	show:function(){
		console.groupCollapsed('show');
		if(!this.initDone)this.init();
		let isVisible=this.main.jquery.find('.dropdown-menu').is(':visible');
		let isHidden=this.main.jquery.find('.dropdown-menu').is(':hidden');
		console.log("isVisible:",isVisible);
		console.log("isHidden:",isHidden);
		if(!isVisible){
			console.log("do");
			this.main.jquery.find('[data-toggle=dropdown]').dropdown('toggle');
		}
		console.groupEnd();
	},
	hide:function(){
		console.groupCollapsed('hide');
		if(!this.initDone)this.init();
		let isVisible=this.main.jquery.find('.dropdown-menu').is(':visible');
		let isHidden=this.main.jquery.find('.dropdown-menu').is(':hidden');
		console.log("isVisible:",isVisible);
		console.log("isHidden:",isHidden);
		if(isVisible){
			console.log("do");
			this.main.jquery.find('[data-toggle=dropdown]').dropdown('toggle');
		}
		console.groupEnd();
	},
	setInputEvent:function(selector=""){
		console.groupCollapsed('setInputEvent');
		console.log('selector=',selector);
		if(!this.initDone)this.init();
		let me=this;
		if(document.querySelector(selector)){
			console.log('found');
			/*$(selector).keyup(function (e) {
				console.groupCollapsed('input');
				console.log("target=",e.target);
				console.log("value=",e.target.value);
				console.groupEnd();
			});*/
			document.querySelector(selector).addEventListener("keyup",function(event){
				console.groupCollapsed('input');
				me.getMovies({variables:"&Title="+event.target.value});
				console.groupEnd();
			});
			//tried focus, select 
			document.querySelector(selector).addEventListener("click", function(event){
				console.groupCollapsed('click');
				if(me.hasMovie){
					setTimeout(function(){console.log("time");me.show();}, 1000);
				}
				console.groupEnd();
			});
		}
		console.groupEnd();
	},
	getMovies:function(options={variables:""}){
		console.groupCollapsed('getMovies');
		console.log('options=',options);
		let moviesRootUrl = "https://ancient-caverns-16784.herokuapp.com/";
		var me = this;
		let address=moviesRootUrl + "movies?take=5";
		if(options.variables){
			address+=options.variables
		}else{
			console.groupEnd();
			return false;
		}
		console.log('address=',address);
		console.groupEnd();
		return $.get(address).then(
			function(response) {
				console.groupCollapsed('getMovies:success');
				console.log("success=", response);
				let countFromOtherPages=(response.pagination.numberOfPages-1)*5;
				let countCurrent=0;
				response=response.results;
				countCurrent=response.length;
				let countPosibilTotal=countFromOtherPages+countCurrent;
				if(response.length===0){
					me.hasMovie=false;
					let html=`<li class="divider"></li>`;
					html+=`<li class="searcg-items search-items-none">There is no movie to show</li>`;
					html+=`<li class="divider"></li>`;
					if(me.main.dom.querySelector(".dropdown-menu")){
						console.log('render:',html);
						me.main.dom.querySelector(".dropdown-menu").innerHTML=html;
						me.hasMovie=false;
						me.show();
					}
				}else{
					let html=`<li class="divider"></li>`;
					html+=`<li role="presentation" class="search-items-count">Qucik finds</li>`;
					html+=`<li class="divider"></li>`;
					response.forEach(
						function(movie,i){
						console.log("response[", i,"]=",movie);
							html+=`<li role="presentation" class="search-item search-item-${i}"><a role="menuitem" tabindex="-1" href="movieDetails.html?_id=${movie._id}"><i class="fas fa-film" style='padding-right:5px;'></i>${movie.Title}</a></li>`;
						}
					);
					//<li role="presentation"><a role="menuitem" tabindex="-1" href="#">HTML</a></li>
					html+=`<li class="divider"></li>`;
					html+=`<li role="presentation" class="search-items-all"><i class="fas fa-search" style='padding-right:5px;'></i>To see more, do a search.</li>`
					html+=`<li class="divider"></li>`;
					
					if(me.main.dom.querySelector(".dropdown-menu")){
						console.log('render:',html);
						me.main.dom.querySelector(".dropdown-menu").innerHTML=html;
						me.hasMovie=true;
						me.show();
					}
				}
				console.groupEnd();
				
			},
			function(response) {
				console.warn("failed=", response);
			}
		);		
	}
	

}