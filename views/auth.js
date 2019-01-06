
let authAlert;
let auth2Pages={ 
	init:function(){
		console.groupCollapsed('init');
		this.addEvent();
		this.display();
		console.groupEnd();
	},
	addEvent:function(){
		console.groupCollapsed('addEvent');
		if(document.querySelector("#btnUserAuth")){
			console.log('add button event');
			let me=this;
			document.querySelector("#btnUserAuth").addEventListener("click",function(event){
				event.preventDefault();
				console.groupCollapsed('btnUserAuth:click');
				if(Auth.getAccessToken()){
					console.log('loged in');
					Auth.userLogOut()
					.then(
						function(resolve){
							console.log('AuthRegister.userLogOut response:resolver=',resolve);	
							if(typeof doAfterSuccessLogOut !=="undefined"){
								console.log("trigger doAfterSuccessLogOut");
								try {
									authAlert.addAlert2Root();
									authAlert.setType('success');
									me.display();
									authAlert.setElement([{selector:".alert-body",task:"inner",value:"Successfully loged out."},"show"]);
									authAlert.slideup();
									doAfterSuccessLogOut({response:resolve});
								}
								catch(err) {
									console.warn('error at function call:',err)
								}
							}else{
								console.log("use internal response");
								location.reload();	
							}
						},
						function(reject){
							console.warn('AuthRegister.userLogOut response:reject=',reject);
							if(typeof doAfterFailedLogOut !=="undefined"){
								console.log("trigger doAfterSuccessLogOut");
								try {
									authAlert.addAlert2Root();
									authAlert.setType('danger');
									authAlert.setElement([{selector:".alert-body",task:"inner",value:"Failed to log out."},"show"]);
									authAlert.slideup();
									doAfterFailedLogOut({response:reject});
								}
								catch(err) {
									console.warn('error at function call:',err)
								}
							}else{
								console.log("use internal response");
								
							}
						}
					);
				}else{
					console.log('not loged in');
					authModal.show();
				}
				console.groupEnd();
			});
		}else{
			console.warn("button not found, can't add event");
			console.groupEnd();
		}
	},
	display:function(){
		console.groupCollapsed('display');
		if(Auth.getAccessToken()){
			console.log('loged in');
			if(document.querySelector("#labelUserName")){
				document.querySelector("#labelUserName").innerText="You are logged in as "+Auth.getAccessName();
			}
			if(document.querySelector("#btnUserAuth")){
				document.querySelector("#btnUserAuth").innerText="Log out";
			}
		}else{
			console.log('not loged in');
			if(document.querySelector("#labelUserName")){
				document.querySelector("#labelUserName").innerText="No user is loged in";
			}
			if(document.querySelector("#btnUserAuth")){
				document.querySelector("#btnUserAuth").innerText="Log in";
			}
		}
	}

}

//component based on the idea of Modules 
//need to replace this with Modules and not Models but can't figure out why import is not working 
let authModal={
	init:function(options={}) {
		console.groupCollapsed('init');
		if(!(typeof options === 'object')){options={}};
		function uuidv4() {
		  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		  });
		}
		this.root={id:'',dom:'',jquery:''};
		this.modal="";
		this.widgetId=-1;
		this.id=uuidv4();
		this.profile={mode:1,eye:0,protocol:'',mouseEye:0};
		this.statusLog={inputError:[]};
		this.settings={nameLength_min:6,nameLength_max:36,passwordLength_min:6,passwordLength_max:36, classList:{invalid:"error-content"}};
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
			if(options.addModal2Root){
				this.addModal2Root(options.addModal2Root);
				if(options.addEvents){
					this.addEvents();
				}
			}
		}
		if(options.add2Head){
			this.add2Head(options.add2Head);
		}
		this.profile.protocol=location.protocol;
		console.log('profile.protocol=',this.profile.protocol);
		console.groupEnd();
	},
	add2Head:function(options={}){
		console.groupCollapsed('add2Head');
		if(!(typeof options === 'object')){options={}};
		let script={};
		script['recaptcha']=document.createElement("script");  
		let me=this;
		script['recaptcha'].src = "https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit";  
		document.head.appendChild(script['recaptcha']); 
		if (script['recaptcha'].addEventListener) {
			script['recaptcha'].addEventListener('load', function() {
				console.log("script Done recaptcha");
			}, false);   
		}; 
		console.groupEnd();		
	},
	addModal2Root:function(options={}) {
		//generates and appends the modal html elements to the rootdoom
		console.groupCollapsed('addModal2Root');
		if(!(typeof options === 'object')){options={}};
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
        <h4 class="modal-title">User Log In</h4>
      </div>
      <div class="modal-body">
			<div class='loginOrRegister'>
				<div class='form-group'>
					<input type="text" name="username" placeholder='Username' value="" autocomplete="username" class="text-input form-control inputKeyupCheck">
				</div>
				<div class='form-group register-group' style="display:none">
					<input type="text" name="email" placeholder='Email' value="" autocomplete="email" class="text-input form-control register-input inputKeyupCheck">
				</div>
				<div class='form-group' style="display:block">
					<input type="password" name="password" value="" autocomplete="password" placeholder='Password' class="text-input form-control inputKeyupCheck" style="display:inline; width:90%"><button type="button" class="btn btn-warning btn-eye2Password" style="display:inline;"><img id="passwordEye" src="../static/password_eyes.png" alt="password_eyes" height="20" width="20"></button>
				</div>
				<div class='form-group register-group' style="display:none">
					<input type="password" name="inputConfirmPassword" autocomplete="new-password" value="" placeholder='Retype your Password' class="text-input form-control register-input inputKeyupCheck" >
				</div>
				<div class='form-group register-group' id="add_g-recaptcha_here_${this.id}" style="display:none">
					
				</div>
			</div>
			<div class='notification' style="display:none">

			</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger bt-close" data-dismiss="modal">Close</button>
		<button type="button" class="btn btn-primary bt-loginOrRegister">Log In</button>
		<button type="button" class="btn btn-secondary bt-newuserOrback">New</button>
		<button type="button" class="btn btn-secondary bt-closenotification" style="display:none">Retry</button>
      </div>
    </div>

  </form></div>`;
		this.modal.content=content;
		if(!options.addSkip){
			this.modal.addModal2Root(options.modal);
		}
		console.groupEnd();
	},
	displayLogIn:function(){
		console.groupCollapsed('displayLogIn');
		this.inputClear();
		this.profile.mode=1;
		this.modal.modal.dom.querySelectorAll('.register-group').forEach(function(element,index){
			element.style.display="none";
		});
		this.modal.modal.dom.querySelectorAll('.register-input').forEach(function(element,index){
			element.value="";
		});
		this.modal.modal.dom.querySelector('.modal-title').innerHTML="User Log In";
		this.modal.modal.dom.querySelector('.bt-newuserOrback').innerHTML="New";
		this.modal.modal.dom.querySelector('.bt-loginOrRegister').innerHTML="Log In";
		console.groupEnd();
	},
	displayRegister:function(){
		console.groupCollapsed('displayRegister');
		this.inputClear();
		this.profile.mode=2;
		if(this.profile.protocol!=="file:"){
			console.log('Its on a network');
			console.log('widgetId=',this.widgetId);
			if(this.widgetId===-1){
				let me=this;
				this.widgetId=grecaptcha.render('add_g-recaptcha_here_'+me.id, {
				  'sitekey' : '6LefgYEUAAAAAN1Loro_VTlFvcOcDvYfscJ1dlMH',
				  'callback' :'recaptchaSuccess',
				  'expired-callback' :'recaptchaExpired',
				  'error-callback' : 'recaptchaError'
				});
			}else{
				console.log('No need to render it');
			}
			
		}else{
			console.warn('Its not on network, disabling g-recaptcha requirement');
		}
		this.modal.modal.dom.querySelectorAll('.register-group').forEach(function(element,index){
			element.style.display="block";
		});
		this.modal.modal.dom.querySelector('.modal-title').innerHTML="New User Register";
		this.modal.modal.dom.querySelector('.bt-newuserOrback').innerHTML="Back";
		this.modal.modal.dom.querySelector('.bt-loginOrRegister').innerHTML="Register";
		
		console.groupEnd();
	},
	addEvents:function(){
		console.groupCollapsed('addEvents');
		console.groupCollapsed('4Buttons');
		let me=this;
		this.modal.modal.dom.querySelector('.bt-close').addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-close:click');
			me.inputClear();
			me.eye2PasswordToggle(-1);
			me.displayNotificationUndo();
			console.groupEnd();
		});
		this.modal.modal.dom.querySelector('.bt-closenotification').addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-closenotification:click');
			me.displayNotificationUndo();
			console.groupEnd();
		});
		this.modal.modal.dom.querySelector(".btn-eye2Password").addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-eye2Password:click');
			me.eye2PasswordToggle(2);
			console.groupEnd();
		});
		this.modal.modal.dom.querySelector(".bt-newuserOrback").addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-newuserOrback:click');
			if(me.profile.mode===1){
				me.displayRegister();
			}else{
				me.displayLogIn();
			}
			console.groupEnd();
		});
		this.modal.modal.dom.querySelector(".bt-loginOrRegister").addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-loginOrRegister');
			if(me.profile.mode===1){
				console.log('perform log in');
				me.callLogIn();
			}else{
				console.log('perform register ');
				me.callRegister();
			}
			console.groupEnd();
		});
		console.groupEnd();
		console.groupCollapsed('4Input');
		function inputKeyupEvent(element){
			console.groupCollapsed('inputKeyupEvent');
			console.log('element=',element);
			element.addEventListener("keyup",function(event){
				if(element.name.toLowerCase().includes("password")){
					me.inputKeyupCheck({element:element,type:'password'});
				}else
				if(element.name.toLowerCase().includes("name")){
					me.inputKeyupCheck({element:element,type:'name'});
				}else
				if(element.name.toLowerCase().includes("email")){
					me.inputKeyupCheck({element:element,type:'email'});
				}
				console.groupEnd();
			});
			console.groupEnd();
		}
		this.modal.modal.dom.querySelectorAll('.inputKeyupCheck').forEach(function(element,index){
			inputKeyupEvent(element);
		});
		console.groupEnd();
		console.groupCollapsed('4Mouseover');
			this.modal.modal.dom.querySelector(".btn-eye2Password").addEventListener("mouseover", function(event){
				event.preventDefault();
				console.groupCollapsed('passwordEye:mouseover');
				me.profile.mouseEye=true;
				me.eye2PasswordToggle(1);
				console.groupEnd();
			});
			this.modal.modal.dom.querySelector(".btn-eye2Password").addEventListener("mouseleave", function(event){
				event.preventDefault();
				console.groupCollapsed('passwordEye:mouseleave');
				me.profile.mouseEye=false;
				me.eye2PasswordToggle(0);
				console.groupEnd();
			});
		console.groupEnd();
		console.groupEnd();
	},
	eye2PasswordToggle:function(mode=0){
		console.groupCollapsed('eye2PasswordToggle');
		if(mode===-1){//reset
			console.log('resets profile eye');
			this.profile.eye=false;
		}
		if(mode===2||mode===20||mode===21){
			if(mode===20){//force hide
				this.profile.eye=true;
			}
			if(mode===21){//force show
				this.profile.eye=false;
			}
			if(this.profile.eye){
				console.log('hide');
				this.profile.eye=false;
				this.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'password');
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-warning");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-info");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-success");
			}else{
				console.log('show');
				this.profile.eye=true;
				this.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'text');
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-warning");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-info");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-success");
			}
		}else
		if(mode===1){
			if(!this.profile.eye){
				console.log('show');
				this.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'text');
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-warning");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-info");
			}
		}else{
			if(!this.profile.eye){
				console.log('hide');
				this.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'password');
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-warning");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-info");
				this.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-success");
			}
		}
		console.groupEnd();
	},
	inputClear:function(){
		console.groupCollapsed('inputClear');
		let me=this;
		this.modal.modal.dom.querySelectorAll('.text-input').forEach(function(element,index){
			element.value="";
			element.classList.remove(me.settings.classList.invalid);
		});
		console.groupEnd();
	},
	inputKeyupCheckClear:function(){
		console.groupCollapsed('inputKeyupCheck');
		let me=this;
		this.modal.modal.dom.querySelectorAll('.inputKeyupCheck').forEach(function(element,index){
			element.classList.remove(me.settings.classList.invalid);
		});
		console.groupEnd();
	},
	inputKeyupCheck:function(options={}){
		console.groupCollapsed('inputKeyupCheck');
		console.log('options:',options);
		if(!options.element){
			console.warn('invali');
			console.groupEnd();
			return;
		}
		if(options.type){
			if(options.type==='name'){
				if(options.element.value.length<this.settings.nameLength_min){
					console.warn('name to small');
					options.element.classList.add(this.settings.classList.invalid);
				}else
				if(options.element.value.length>this.settings.nameLength_max){
					console.warn('name to big');
					options.element.classList.add(this.settings.classList.invalid);
				}else{
					options.element.classList.remove(this.settings.classList.invalid);
				}
			}else
			if(options.type==='password'){
				if(options.element.value.length<this.settings.passwordLength_min){
					console.warn('password to small');
					options.element.classList.add(this.settings.classList.invalid);
				}else
				if(options.element.value.length>this.settings.passwordLength_max){
					console.warn('password to big');
					options.element.classList.add(this.settings.classList.invalid);
				}else{
					options.element.classList.remove(this.settings.classList.invalid);
				}
			}else
			if(options.type==='email'){
				if(!this.validateEmail(options.element.value)){
					console.warn('invalid email');
					options.element.classList.add(this.settings.classList.invalid);
				}else{
					options.element.classList.remove(this.settings.classList.invalid);
				}
			}
		}
		console.groupEnd();
	},
	validateEmail:function(email) {
		console.groupCollapsed('validateEmail');
		console.log('email=',email);
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var result=re.test(String(email).toLowerCase());
		console.log('result=',result);
		console.groupEnd();
		return result;
	},
	inputCheck:function(){
		console.groupCollapsed('inputCheck');
		console.log('profile.mode=',this.profile.mode);
		var errorLog=[];
		if(this.modal.modal.dom.querySelector('input[name="username"]').value.length<this.settings.nameLength_min){
			console.warn('name too small');
			errorLog.push('name too small');
		}
		if(this.modal.modal.dom.querySelector('input[name="username"]').value.length>this.settings.nameLength_max){
			console.warn('name too big');
			errorLog.push('name too big');
		}
		if(this.modal.modal.dom.querySelector('input[name="password"]').value.length<this.settings.passwordLength_min){
			console.warn('password too small');
			errorLog.push('password too small');
		}
		if(this.modal.modal.dom.querySelector('input[name="password"]').value.length>this.settings.passwordLength_max){
			console.warn('password too big');
			errorLog.push('password too big');
		}
		if(this.profile.mode===2){
			console.log('registry requirements');
			if(this.modal.modal.dom.querySelector('input[name="inputConfirmPassword"]').value!=this.modal.modal.dom.querySelector('input[name="password"]').value){
				console.warn('password not a match');
				errorLog.push('password not a match');
			}
			if(!this.validateEmail(this.modal.modal.dom.querySelector('input[name="email"]').value)){
				console.warn('email is not valid');
				errorLog.push('email is not valid');
			}
			if(this.profile.protocol!=="file:"){
				console.log('Its on a network');
				if(!grecaptcha.getResponse()){
					console.warn('reCaptcha not verified');
					errorLog.push('reCaptcha not verified');
				}	
			}else{
				console.warn('Its not on network, disabling g-recaptcha requirement');
			}
		}
		this.statusLog.inputError=errorLog;
		if(errorLog.length>0){
			console.warn('has error, will not commence ajax');
			console.warn('errorLog=',errorLog);
			let errorMessage="";
			errorLog.forEach(function(e,i){errorMessage+=`<p>${e}</p>`});
			if(this.profile.mode===1){
				this.displayNotification({type:-1,title:"A problem at User Log In",body:"<p>The following problems have occurred:</p>"+errorMessage});
			}else
			if(this.profile.mode===2){
				this.displayNotification({type:-1,title:"A problem at New User Registering",body:"<p>The following problems have occurred:</p>"+errorMessage});
			}
			console.warn('return:false');
			console.groupEnd();
			return false;
			
		}
		console.log('return:true');
		console.groupEnd();
		return true;
	},
	displayNotificationUndo:function(){
		console.groupCollapsed('displayNotificationUndo');
		this.modal.modal.dom.querySelector('.loginOrRegister').style.display="";
		this.modal.modal.dom.querySelector('.notification').style.display="none";
		this.modal.modal.dom.querySelector('.bt-loginOrRegister').style.display="";
		this.modal.modal.dom.querySelector('.bt-newuserOrback').style.display="";
		this.modal.modal.dom.querySelector('.bt-closenotification').style.display="none";
		console.groupEnd();
	},
	displayNotification:function(options={}){
		console.groupCollapsed('displayNotification');
		console.log("options=",options);	
		if(options.type){
			if(options.type===1){//processing
				this.modal.modal.dom.querySelector('.bt-closenotification').style.display="none";
			}else
			if(options.type===-1){//failed
				this.modal.modal.dom.querySelector('.bt-closenotification').style.display="";
			}
		}
		if(options.body){
			this.modal.modal.dom.querySelector('.notification').innerHTML=options.body;
		}
		/*if(options.title){
			this.modal.modal.dom.querySelector('.modal-title').innerHTML=options.title;
		}*/
		this.modal.modal.dom.querySelector('.bt-loginOrRegister').style.display="none";
		this.modal.modal.dom.querySelector('.bt-newuserOrback').style.display="none";
		this.modal.modal.dom.querySelector('.loginOrRegister').style.display="none";
		this.modal.modal.dom.querySelector('.notification').style.display="block";
		console.groupEnd();
	},
	callLogIn:function(){
		console.groupCollapsed('callLogIn');
		if(this.inputCheck()){
			var data={};
			data.username=this.modal.modal.dom.querySelector('input[name="username"]').value;
			data.password=this.modal.modal.dom.querySelector('input[name="password"]').value;
			console.log('data=',data);
			let me=this;
			this.statusLog.callResponse={status:0,mode:1,data:data,response:""};
			this.displayNotification({type:1,body:"<p>Please wait</p>"});
			Auth.userLogIn(data)
			.then(
				function(resolve){
					console.log('AuthRegister.userLogIn response:resolve=',resolve);
					me.statusLog.callResponse.status=1;me.statusLog.callResponse.response=resolve;
					me.close();
					if(typeof doAfterSuccessLogin !=="undefined"){
						console.log("trigger doAfterSuccessLogin");
						try {
							authAlert.addAlert2Root();
							authAlert.setType('success');
							auth2Pages.display();
							authAlert.setElement([{selector:".alert-body",task:"inner",value:"Successfully loged in."},"show"]);
							authAlert.slideup();
							doAfterSuccessRegister({obj:me,response:resolve});
						}
						catch(err) {
							console.warn('error at function call:',err)
						}
					}else{
						console.log("use internal response");
						me.doAfterSuccessResponse();
					}
					
				},
				function(reject){
					console.log('AuthRegister.userLogIn response:reject=',reject);
					me.statusLog.callResponse.status=-1;me.statusLog.callResponse.response=reject;
					if(typeof doAfterFailedLogin !=="undefined"){
						me.close();
						console.log("trigger doAfterFailedLogin");
						try {
							//authAlert.setType('danger');
							//authAlert.setElement([{selector:".alert-body",task:"inner",value:"Failed to log in."},"show"]);
							doAfterFailedLogin({obj:me,response:reject});
						}
						catch(err) {
							console.warn('error at function call:',err)
						}
					}else{
						console.log("use internal response");
						reject.called="Log in";
						me.doAfterRejectedResponse(reject);
					}
					
				}
			)
		}else{
			console.warn('aborded');
			console.groupEnd();
		}
	},
	callRegister:function(){
		console.groupCollapsed('callRegister');
		if(this.inputCheck()){
			var data={};
			data.username=this.modal.modal.dom.querySelector('input[name="username"]').value;
			data.password=this.modal.modal.dom.querySelector('input[name="password"]').value;
			//the movie api does not require email, so it's pointless to add one 
			console.log('data=',data);
			this.displayNotification({type:1,body:"<p>Please wait</p>"});
			let me=this;
			this.statusLog.callResponse={status:0,mode:2,data:data,response:""};
			Auth.userRegister(data)
			.then(
				function(resolve){
					console.log('AuthRegister.userRegister response:resolve=',resolve);
					me.statusLog.callResponse.status=1;me.statusLog.callResponse.response=resolve;
					me.close();
					if(typeof doAfterSuccessRegister !=="undefined"){
						console.log("trigger doAfterSuccessRegister");
						try {
							authAlert.addAlert2Root();
							authAlert.setType('success');
							auth2Pages.display();
							authAlert.setElement([{selector:".alert-body",task:"inner",value:"Successfully registered."},"show"]);
							authAlert.slideup();
							doAfterSuccessRegister({obj:me,response:resolve});
						}
						catch(err) {
							console.warn('error at function call:',err)
						}
						
					}else{
						console.log("use internal response");
						me.doAfterSuccessResponse();
					}
					
				},function(reject){
					console.log('AuthRegister.userRegister response:reject=',reject);
					reject.called="Register";
					me.statusLog.callResponse.status=-1;me.statusLog.callResponse.response=reject;
					if(typeof doAfterFailedRegister !=="undefined"){
						console.log("trigger doAfterFailed");
						me.close();
						try {
							//authAlert.setType('danger');
							//authAlert.setElement([{selector:".alert-body",task:"inner",value:"Failed to registered."},"show"]);
							doAfterFailedRegister({obj:me,response:reject});
						}
						catch(err) {
							console.warn('error at function call:',err)
						}
					}else{
						console.log("use internal response");
						me.doAfterRejectedResponse(reject);
					}
				}
			);
		}else{
			console.warn('aborded');
			console.groupEnd();
		}
	},
	doAfterSuccessResponse:function(){
		console.log('success');
		location.reload();	
	},
	doAfterRejectedResponse:function(response=""){
		console.groupCollapsed('doAfterRejectedResponse');
		if(response.status){
			console.warn('status:',response.status);
		}
		let errorMessage;
		if(response.responseJSON&&response.responseJSON.message){
			errorMessage=response.responseJSON.message;
		}else
		if(response.message){
			errorMessage=response.message;
		}
		if(this.profile.mode===1){
			this.displayNotification({type:-1,title:"A problem at User Log In",body:"<p>The following problems have occurred:</p>"+errorMessage});
		}else
		if(this.profile.mode===2){
			this.displayNotification({type:-1,title:"A problem at New User Registering",body:"<p>The following problems have occurred:</p>"+errorMessage});
		}
		console.groupEnd();
	},
	show:function(){
		console.groupCollapsed('show');
		this.modal.show();
		console.groupEnd();
	},
	hide:function(){
		console.groupCollapsed('hide');
		this.modal.hide();
		console.groupEnd();
	},
	open:function(){
		console.groupCollapsed('open');
		this.inputClear();
		this.eye2PasswordToggle(-1);
		this.displayNotificationUndo();
		this.modal.show();
		console.groupEnd();
	},
	close:function(){
		console.groupCollapsed('close');
		this.modal.hide();
		this.inputClear();
		this.eye2PasswordToggle(-1);
		this.displayNotificationUndo();
		console.groupEnd();
	}
}
