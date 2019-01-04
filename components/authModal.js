class authModal {
	constructor(options={}) {
		console.groupCollapsed('constructor');
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
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.modal.id); 
			}
			if(options.addModal2Root){
				this.addModal2Root();
			}
		}
		this.objName=this.constructor.name;
		console.groupEnd();
	}
	add2Head(options={}){
		console.groupCollapsed('add2Head');
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
        <h4 class="modal-title">User Log In</h4>
      </div>
      <div class="modal-body">
			<div class='loginOrRegister'>
				<div class='form-group'>
					<input type="text" name="username" placeholder='Username' value="" class="text-input form-control inputKeyupCheck">
				</div>
				<div class='form-group register-group'>
					<input type="text" name="email" placeholder='Email' value="" class="text-input form-control register-input inputKeyupCheck">
				</div>
				<div class='form-group' style="display:block">
					<input type="password" name="password" value="" placeholder='Password' class="text-input form-control inputKeyupCheck" style="display:inline; width:90%"><button type="button" class="btn btn-warning btn-eye2Password" style="display:inline"><img id="passwordEye" src="../static/password_eyes.png" alt="password_eyes" height="25" width="20"></button>
				</div>
				<div class='form-group register-group' >
					<input type="password" name="inputConfirmPassword" value="" placeholder='Retype your Password' class="text-input form-control register-input inputKeyupCheck" >
				</div>
				<div class='form-group register-group' id="add_g-recaptcha_here_${this.id}">
					
				</div>
			</div>
			<div class='notification' style="display:none">

			</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
		<button type="button" class="btn btn-primary bt-loginOrRegister">Log In</button>
		<button type="button" class="btn btn-secondary bt-newuserOrback">New</button>
		<button type="button" class="btn btn-secondary bt-closenotification" style="display:none">Retry</button>
      </div>
    </div>

  </form></div>`;
		this.modal.content=content;
		this.modal.addModal2Root();
		console.groupEnd();
	}
	displayLogIn(){
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
	}
	displayRegister(){
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
	}
	getURLDatas(){
		console.groupCollapsed('getURLDatas');
		function getUrlParameter(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
			var results = regex.exec(location.search);
			return results === null
			? ""
			: decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		this.profile.protocol=location.protocol;
		console.log('profile.protocol=',this.profile.protocol);
		this.profile.page=getUrlParameter('page');
		this.profile.search=getUrlParameter('search');
		console.log('profile.page:',this.profile.page);
		console.log('profile.search:',this.profile.search);
		console.groupEnd();
	}
	addEvents(){
		console.groupCollapsed('addEvents');
		console.groupCollapsed('4Buttons');
		let me=this;
		this.modal.modal.dom.querySelector('.bt-closenotification').addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-closenotification:click');
			me.displayNotificationUndo();
			console.groupEnd();
		});
		this.modal.modal.dom.querySelector(".btn-eye2Password").addEventListener("click", function(event){
			event.preventDefault();
			console.groupCollapsed('.bt-eye2Password:click');
			me.eye2PasswordToggle(2,me);
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
				me.eye2PasswordToggle(1,me);
				console.groupEnd();
			});
			this.modal.modal.dom.querySelector(".btn-eye2Password").addEventListener("mouseleave", function(event){
				event.preventDefault();
				console.groupCollapsed('passwordEye:mouseleave');
				me.eye2PasswordToggle(0,me);
				console.groupEnd();
			});
		console.groupEnd();
		console.groupEnd();
	}
	eye2PasswordToggle(mode=0, me=""){
		console.groupCollapsed('eye2PasswordToggle');
		console.log("mode=",mode);
		if(!me)me=this;
		if(mode===2||mode===20||mode===21){
			if(mode===20){//force hide
				me.profile.eye=true;
			}
			if(mode===21){//force show
				me.profile.eye=false;
			}
			if(this.profile.eye){
				console.log('hide');
				me.profile.eye=false;
				me.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'password');
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-warning");
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-info");
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-success");
			}else{
				console.log('show');
				me.profile.eye=true;
				me.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'text');
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-warning");
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-info");
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-success");
			}
		}else
		if(mode===1){
			if(!me.profile.eye){
				console.log('show');
				me.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'text');
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-warning");
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-info");
			}
		}else{
			if(!me.profile.eye){
				console.log('hide');
				me.modal.modal.dom.querySelector('input[name="password"]').setAttribute('type', 'password');
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.add("btn-warning");
				me.modal.modal.dom.querySelector(".btn-eye2Password").classList.remove("btn-info");
			}
		}
		console.groupEnd();
	}
	inputClear(){
		console.groupCollapsed('inputClear');
		let me=this;
		this.modal.modal.dom.querySelectorAll('.text-input').forEach(function(element,index){
			element.value="";
			element.classList.remove(me.settings.classList.invalid);
		});
		console.groupEnd();
	}
	inputKeyupCheckClear(){
		console.groupCollapsed('inputKeyupCheck');
		let me=this;
		this.modal.modal.dom.querySelectorAll('.inputKeyupCheck').forEach(function(element,index){
			element.classList.remove(me.settings.classList.invalid);
		});
		console.groupEnd();
	}
	inputKeyupCheck(options={}){
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
	}
	validateEmail(email) {
		console.groupCollapsed('validateEmail');
		console.log('email=',email);
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var result=re.test(String(email).toLowerCase());
		console.log('result=',result);
		console.groupEnd();
		return result;
	}
	inputCheck(){
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
	}
	displayNotificationUndo(){
		console.groupCollapsed('displayNotificationUndo');
		this.modal.modal.dom.querySelector('.loginOrRegister').style.display="";
		this.modal.modal.dom.querySelector('.notification').style.display="none";
		this.modal.modal.dom.querySelector('.bt-loginOrRegister').style.display="";
		this.modal.modal.dom.querySelector('.bt-newuserOrback').style.display="";
		this.modal.modal.dom.querySelector('.bt-closenotification').style.display="none";
		console.groupEnd();
	}
	displayNotification(options={}){
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
		if(options.title){
			this.modal.modal.dom.querySelector('.modal-title').innerHTML=options.title;
		}
		this.modal.modal.dom.querySelector('.bt-loginOrRegister').style.display="none";
		this.modal.modal.dom.querySelector('.bt-newuserOrback').style.display="none";
		this.modal.modal.dom.querySelector('.loginOrRegister').style.display="none";
		this.modal.modal.dom.querySelector('.notification').style.display="block";
		console.groupEnd();
	}
	callLogIn(){
		console.groupCollapsed('callLogIn');
		if(this.inputCheck()){
			var data={};
			data.username=this.modal.modal.dom.querySelector('input[name="username"]').value;
			data.password=this.modal.modal.dom.querySelector('input[name="password"]').value;
			console.log('data=',data);
			let me=this;
			this.displayNotification({type:1,body:"<p>Please wait</p>"});
			AuthRegister.userLogIn(data)
			.then(
				function(resolve){
					console.log('AuthRegister.userLogIn response:resolve=',resolve);
					me.doAfterSuccessResponse();
				},function(reject){
					console.log('AuthRegister.userLogIn response:reject=',reject);
					reject.called="Log in";
					me.doAfterRejectedResponse(reject);
				}
			)
		}else{
			console.warn('aborded');
			console.groupEnd();
		}
	}
	callRegister(){
		console.groupCollapsed('callRegister');
		if(this.inputCheck()){
			var data={};
			data.username=this.modal.modal.dom.querySelector('input[name="username"]').value;
			data.password=this.modal.modal.dom.querySelector('input[name="password"]').value;
			//the movie api does not require email, so it's pointless to add one 
			console.log('data=',data);
			this.displayNotification({type:1,body:"<p>Please wait</p>"});
			let me=this;
			AuthRegister.userRegister(data)
			.then(
				function(resolve){
					console.log('AuthRegister.userRegister response:resolve=',resolve);
					if(doAfterSuccessRegister){
						console.log("trigger doAfterSuccessRegister");
						doAfterSuccessRegister({obj:me,response:resolve});
					}else{
						console.log("use internal response");
						me.doAfterSuccessResponse();
					}
					
				},function(reject){
					console.log('AuthRegister.userRegister response:reject=',reject);
					reject.called="Register";
					if(doAfterFailedRegister){
						console.log("trigger doAfterFailed");
						doAfterFailed({obj:me,response:reject});
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
	}
	doAfterSuccessResponse(){
		console.warn('success');
		if(this.profile.page){
			console.groupEnd();window.location = profile.page+profile.search;
		}else{
			console.groupEnd();window.location = "home.html";	
		}	
	}
	doAfterRejectedResponse(response=""){
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
	}
	show(){
		console.groupCollapsed('show');
		this.inputClear();
		this.displayNotificationUndo();
		this.modal.show();
		console.groupEnd();
	}
	hide(){
		console.groupCollapsed('hide');
		this.inputClear();
		this.displayNotificationUndo();
		this.modal.hide();
		console.groupEnd();
	}
}