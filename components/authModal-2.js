class authModal {
	constructor(options={}) {
		console.groupCollapsed('constructor');
		this.root={id:'',dom:'',jquery:''};
		this.modal="";
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.modal.id); 
			}
			if(options.addModal2Root){
				this.addModal2Root();
			}
		}
		console.groupEnd();
	}
	add2Head(options={}){
		console.groupCollapsed('add2Head');
		var script = document.createElement("script");  
		let me=this;
		script.src = "https://www.google.com/recaptcha/api.js?onload=displayNewUserButton&render=explicit";  
		document.head.appendChild(script);  
		if (script.addEventListener) {
			script.addEventListener('load', function() {
				console.log("script Done 1");
				if(options.callback){
					console.log("Do callback");
					options.callback();
				}
			}, false);   
		};  
		console.groupEnd();		
	}
	addModal2Root(options={}) {
		//generates and appends the modal html elements to the rootdoom
		console.groupCollapsed('addModal2Root');
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
		}
		console.log('root=',this.root);
		this.modal= new Modal({root:this.root.id});
		let content=`<div class="modal-dialog"><form name=formAuth" action="">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Usre Log In</h4>
      </div>
      <div class="modal-body">
			<div class='form-group'>
                <input type="text" name="username" placeholder='Username' value="" class="text-input form-control">
            </div>
            <div class='form-group' style="display:block">
                <input type="password" name="password" value="" placeholder='Password' class="text-input form-control" style="display:inline; width:90%"><button type="button" class="btn btn-eye2Password" style="display:inline"><img id="passwordEye" src="../static/password_eyes.png" alt="password_eyes" height="25" width="20"></button>
            </div>
			<div class='form-group' >
				<input type="password" name="inputConfirmPassword" value="" placeholder='Retype your Password' class="text-input form-control" >
			</div>
			<div class='form-group' id="add_g-recaptcha_here">
				
			</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		<button type="button" class="btn btn-default bt-loginOrRegister" data-dismiss="modal">Log In</button>
		<button type="button" class="btn btn-default bt-newuserOrback" data-dismiss="modal">New</button>
      </div>
    </div>

  </form></div>`;
		this.modal.content=content;
		this.modal.addModal2Root();
		console.groupEnd();
	}
	
}