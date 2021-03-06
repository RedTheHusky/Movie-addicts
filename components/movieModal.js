//component based on the idea of Modules 
//need to replace this with Modules and not Models but can't figure out why import is not working 
let movieSubmitFormModal= {
	init:function(options={}) {
	console.groupCollapsed('init');
		function uuidv4() {
		  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		  });
		}
		this.objName="";
		this.root={id:'',dom:'',jquery:''};
		this.modal="";
		this.widgetId=-1;
		this.id=uuidv4();
		this.profile={mode:1,notification:0,eye:0,page:'',search:'',protocol:''};
		this.settings={nameLength_min:6,nameLength_max:36,passwordLength_min:6,passwordLength_max:36, classList:{invalid:"error-content"}};
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.querySelector(this.root.id);
				this.root.jquery=$(this.root.id); 
			}
			if(options.add2Root){
				this.add2Root();
			}
		}
		console.groupEnd();
	},
	add2Root:function(options={}) {
		//generates and appends the modal html elements to the rootdoom
		console.groupCollapsed('add2Root');
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.querySelector(this.root.id);
				this.root.jquery=$(this.root.id); 
			}
		}
		console.log('root=',this.root);
		this.modal= new Modal({root:this.root.id});
		let content=`<div class="modal-dialog"><form name=formAuth" action="">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Edit movie</h4>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger bt-close" data-dismiss="modal">Close</button>
		 <button type="button" class="btn btn-default bt-save">Save</button>
      </div>
    </div>

  </form></div>`;

		this.modal.content=content;
		this.modal.add2Root();
		let fields={ Title:'',Year:'',Runtime:'',Genre:'',Director:'',Writer:'',Actors:'',Plot:'',Language:'',Country:'',Poster:'',imdbRating:''};
		let content_details="";
		for (var key in fields){ //a for cycle that creates the titleLable,newLabel and so on elements
			if(key==="Title"||key==="Year"||key==="Runtime"||key==="Director"||key==="Writer"||key==="Plot"||key==="Language"||key==="Poster"||key==="imdbRating"){
				let value=fields[key];
				if(key==="Poster"){
					content_details+=`<div class='form-group submit-group'>
				<label style="display:block" for="${key}" label${key}>${key}:</label>
				<input id="new${key}" value="${value}" class="text-input form-control input${key}"></input>
				<input class='fileInput' type="file" accept=".jpg, .jpeg, .png, .gif">
				</div>`;	
				}else{
					content_details+=`<div class='form-group submit-group'>
				<label style="display:block" for="${key}" label${key}>${key}:</label>
				<input id="new${key}" value="${value}" class="text-input form-control input${key}"></input>
				</div>`;
				}
				
			}
		}
		this.modal.setElement([{selector:".modal-body", task:"inner", value:content_details}]);
		console.groupEnd();
	},
	addEvents:function(){
		console.groupCollapsed('addEvents');
		let me=this;
		if(this.modal.main.dom.querySelector(".bt-save")){
			console.log('bt-save.register');
			this.modal.main.dom.querySelector(".bt-save").addEventListener("click", function(){
				console.groupCollapsed('btn_save-click');
				me.modal.hide();
				if(me.mode==="new"){
					me.movie=new Movie();
					
				}
				me.modal.getElements("input").forEach(function(input,index){
					console.groupCollapsed('input[',index,']');
					let id=input.id;
					console.log('id=',id);
					console.log('value=',input.value);
					let movieid=id.replace("new", "");
					console.log('moviekey=',movieid);
					if(movieid!=""){
						console.log('old value=',me.movie[movieid]);
						modalElements["submit"].movie[movieid]=input.value;	
						console.log('new value=',me.movie[movieid]);
					}
					console.groupEnd();
				});
				console.log("movie=",modalElements["submit"].movie);
				if(me.mode==="edit"){
					console.log('edit movie');
					me.movie.editMovie().then(
						function(response) {
							console.log("Movie with id " + me.movie._id + " was succesfully updated");
							if(typeof doAfterSuccessfulMovieEdit !=="undefined"){
								console.log("trigger doAfterFailedMovieEdit");
								try {
									doAfterSuccessfulMovieEdit({obj:me,response:response});
								}
								catch(err) {
									console.warn('error at function call:',err)
								}
							}
						  //displayNotification({mode:"supdated",title:me.movie.Title,message:"Movie with id " + me.movie._id + " was succesfully updated."});
						  //displayMovies();
						},
						function(reject){
							console.error("Error updating movie");
							let error={mode:"error",title:"editing movie"};
							if(reject.responseJSON&&reject.responseJSON.message){
								error.message=reject.responseJSON.message;
							}else
							if(reject.response){
								error.message=reject.response;
							}else
							if(reject){
								error.message=reject;
							}
							if(typeof doAfterFailedMovieEdit !=="undefined"){
								console.log("trigger doAfterFailedMovieEdit");
								try {
									doAfterFailedMovieEdit({obj:me,response:reject});
								}
								catch(err) {
									console.warn('error at function call:',err)
								}
							}
							//displayNotification(error);
						}
					);
				}else
				if(options.mode==="new"){
					console.log('new movie');
				}
				console.groupEnd();
			});
		}
		/*if(this.modal.main.dom.querySelector(".fileInput")){
			let me=this;
			console.log('fileInput.register');
			this.modal.main.dom.querySelector(".fileInput").addEventListener("change", function(){
				console.groupCollapsed('fileInput-click');
					me.fileuppload_triggered(this,me);
				}
			);
		}*/
		console.log("form events");
		this.modal.main.jquery.on('hidden.bs.modal', function(){
			console.log('Modal cleared if it contains a form');
			me.modal.main.dom.querySelectorAll(".text-input").forEach(function(e,i){e.value="";});
			$(this).find('form')[0].reset();
		});
		console.groupEnd();
	},
	displayAdd:function(options={}){
		console.groupCollapsed('displayAdd');
		if(options.movie){
			console.warn("Please remove movie instant");
			console.groupEnd();
			return false;
		}
		this.mode="new";
		displaySubmit(options);
		console.groupEnd();
	},
	displayEdit(options={}){
		console.groupCollapsed('displayEdit');
		if(!options.movie){
			console.warn("Request movie instant");
			console.groupEnd();
			return false;
		}
		this.mode="edit";
		this.movie=options.movie;
		this.displaySubmit(options);
		console.groupEnd();
	},
	displaySubmit:function(options={}){
		console.groupCollapsed('displaySubmit');
		let movie='';
		let response={ Title:'',Year:'',Runtime:'',Genre:'',Director:'',Writer:'',Actors:'',Plot:'',Language:'',Country:'',Poster:'',imdbRating:''};
		for (var key in response){ //!!!need to talk about the Movie.getMovie functionality for improvement
			if(options&&options.response){
				response[key]=options.response[key]||"";	
			}
		}
		
		for (var key in response){ //a for cycle that creates the titleLable,newLabel and so on elements
			if(key==="Title"||key==="Year"||key==="Runtime"||key==="Director"||key==="Writer"||key==="Plot"||key==="Language"||key==="Poster"||key==="imdbRating"){
				this.modal.setElement([{selector:".input"+key, task:"attribute-add", name:"value",value:response[key]||""}]);
			}
		}
		console.groupEnd();
		this.modal.setElement([{selector:".modal-title", task:"inner", value:"Edit movie: "+response["Title"]||""}, "show"]);
	}
}