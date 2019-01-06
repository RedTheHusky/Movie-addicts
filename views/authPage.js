let widgetId=-1;
let profile={mode:1,eye:0,protocol:'',mouseEye:0};;
let statusLog={inputError:[]};
let settings={nameLength_min:6,nameLength_max:36,passwordLength_min:6,passwordLength_max:36, classList:{invalid:"error-content"}};
let modalNotification;		
		
function displayLogIn(){
	console.groupCollapsed('displayLogIn');
	inputClear();
	profile.mode=1;
	document.querySelectorAll('.register-group').forEach(function(element,index){
		element.style.display="none";
	});
	document.querySelectorAll('.register-input').forEach(function(element,index){
		element.value="";
	});
	document.querySelector('.menu-title').innerHTML="User Log In";
	document.querySelector('.bt-newuserOrback').innerHTML="New";
	document.querySelector('.bt-loginOrRegister').innerHTML="Log In";
	console.groupEnd();
}
function displayRegister(){
	console.groupCollapsed('displayRegister');
	inputClear();
	profile.mode=2;
	if(profile.protocol!=="file:"){
		console.log('Its on a network');
		console.log('widgetId=',widgetId);
		if(widgetId===-1){
			widgetId=grecaptcha.render('add_g-recaptcha_here', {
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
	document.querySelectorAll('.register-group').forEach(function(element,index){
		element.style.display="block";
	});
	document.querySelector('.menu-title').innerHTML="New User Register";
	document.querySelector('.bt-newuserOrback').innerHTML="Back";
	document.querySelector('.bt-loginOrRegister').innerHTML="Register";
	console.groupEnd();
}
function eye2PasswordToggle(mode=0){
	console.groupCollapsed('eye2PasswordToggle');
	if(mode===-1){//reset
		console.log('resets profile eye');
		profile.eye=false;
	}
	if(mode===2||mode===20||mode===21){
		if(mode===20){//force hide
			profile.eye=true;
		}
		if(mode===21){//force show
			profile.eye=false;
		}
		if(profile.eye){
			console.log('hide');
			profile.eye=false;
			document.querySelector('input[name="password"]').setAttribute('type', 'password');
			document.querySelector(".btn-eye2Password").classList.add("btn-warning");
			document.querySelector(".btn-eye2Password").classList.remove("btn-info");
			document.querySelector(".btn-eye2Password").classList.remove("btn-success");
		}else{
			console.log('show');
			profile.eye=true;
			document.querySelector('input[name="password"]').setAttribute('type', 'text');
			document.querySelector(".btn-eye2Password").classList.remove("btn-warning");
			document.querySelector(".btn-eye2Password").classList.remove("btn-info");
			document.querySelector(".btn-eye2Password").classList.add("btn-success");
		}
	}else
	if(mode===1){
		if(!profile.eye){
			console.log('show');
			document.querySelector('input[name="password"]').setAttribute('type', 'text');
			document.querySelector(".btn-eye2Password").classList.remove("btn-warning");
			document.querySelector(".btn-eye2Password").classList.add("btn-info");
		}
	}else{
		if(!profile.eye){
			console.log('hide');
			document.querySelector('input[name="password"]').setAttribute('type', 'password');
			document.querySelector(".btn-eye2Password").classList.add("btn-warning");
			document.querySelector(".btn-eye2Password").classList.remove("btn-info");
			document.querySelector(".btn-eye2Password").classList.remove("btn-success");
		}
	}
	console.groupEnd();
}
function inputClear(){
	console.groupCollapsed('inputClear');
	let me=this;
	document.querySelectorAll('.text-input').forEach(function(element,index){
		element.value="";
		element.classList.remove(settings.classList.invalid);
	});
	console.groupEnd();
}
function inputKeyupCheckClear(){
	console.groupCollapsed('inputKeyupCheck');
	let me=this;
	document.querySelectorAll('.inputKeyupCheck').forEach(function(element,index){
		element.classList.remove(settings.classList.invalid);
	});
	console.groupEnd();
}
function inputKeyupCheck(options={}){
	console.groupCollapsed('inputKeyupCheck');
	console.log('options:',options);
	if(!options.element){
		console.warn('invali');
		console.groupEnd();
		return;
	}
	if(options.type){
		if(options.type==='name'){
			if(options.element.value.length<settings.nameLength_min){
				console.warn('name to small');
				options.element.classList.add(settings.classList.invalid);
			}else
			if(options.element.value.length>settings.nameLength_max){
				console.warn('name to big');
				options.element.classList.add(settings.classList.invalid);
			}else{
				options.element.classList.remove(settings.classList.invalid);
			}
		}else
		if(options.type==='password'){
			if(options.element.value.length<settings.passwordLength_min){
				console.warn('password to small');
				options.element.classList.add(settings.classList.invalid);
			}else
			if(options.element.value.length>settings.passwordLength_max){
				console.warn('password to big');
				options.element.classList.add(settings.classList.invalid);
			}else{
				options.element.classList.remove(settings.classList.invalid);
			}
		}else
		if(options.type==='email'){
			if(!validateEmail(options.element.value)){
				console.warn('invalid email');
				options.element.classList.add(settings.classList.invalid);
			}else{
				options.element.classList.remove(settings.classList.invalid);
			}
		}
	}
	console.groupEnd();
}
function validateEmail(email) {
	console.groupCollapsed('validateEmail');
	console.log('email=',email);
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var result=re.test(String(email).toLowerCase());
	console.log('result=',result);
	console.groupEnd();
	return result;
}
function inputCheck(){
	console.groupCollapsed('inputCheck');
	console.log('profile.mode=',profile.mode);
	var errorLog=[];
	if(document.querySelector('input[name="username"]').value.length<settings.nameLength_min){
		console.warn('name too small');
		errorLog.push('name too small');
	}
	if(document.querySelector('input[name="username"]').value.length>settings.nameLength_max){
		console.warn('name too big');
		errorLog.push('name too big');
	}
	if(document.querySelector('input[name="password"]').value.length<settings.passwordLength_min){
		console.warn('password too small');
		errorLog.push('password too small');
	}
	if(document.querySelector('input[name="password"]').value.length>settings.passwordLength_max){
		console.warn('password too big');
		errorLog.push('password too big');
	}
	if(profile.mode===2){
		console.log('registry requirements');
		if(document.querySelector('input[name="inputConfirmPassword"]').value!=document.querySelector('input[name="password"]').value){
			console.warn('password not a match');
			errorLog.push('password not a match');
		}
		if(!validateEmail(document.querySelector('input[name="email"]').value)){
			console.warn('email is not valid');
			errorLog.push('email is not valid');
		}
		if(profile.protocol!=="file:"){
			console.log('Its on a network');
			if(!grecaptcha.getResponse()){
				console.warn('reCaptcha not verified');
				errorLog.push('reCaptcha not verified');
			}	
		}else{
			console.warn('Its not on network, disabling g-recaptcha requirement');
		}
	}
	statusLog.inputError=errorLog;
	if(errorLog.length>0){
		console.warn('has error, will not commence ajax');
		console.warn('errorLog=',errorLog);
		let errorMessage="";
		errorLog.forEach(function(e,i){errorMessage+=`<p>${e}</p>`});
		if(profile.mode===1){
			displayNotification({type:-1,title:"A problem at User Log In",body:"<p>The following problems have occurred:</p>"+errorMessage});
		}else
		if(this.profile.mode===2){
			displayNotification({type:-1,title:"A problem at New User Registering",body:"<p>The following problems have occurred:</p>"+errorMessage});
		}
		console.warn('return:false');
		console.groupEnd();
		return false;
		
	}
	console.log('return:true');
	console.groupEnd();
	return true;
}

function callLogIn(){
	console.groupCollapsed('callLogIn');
	if(inputCheck()){
		var data={};
		data.username=document.querySelector('input[name="username"]').value;
		data.password=document.querySelector('input[name="password"]').value;
		console.log('data=',data);
		statusLog.callResponse={status:0,mode:1,data:data,response:""};
		displayNotification({type:1,title:"LogIn",body:"<p>Please wait</p>"});
		Auth.userLogIn(data)
		.then(
			function(resolve){
				console.log('AuthRegister.userLogIn response:resolve=',resolve);
				statusLog.callResponse.status=1;statusLog.callResponse.response=resolve;
				doAfterSuccessResponse();
			},
			function(reject){
				console.log('AuthRegister.userLogIn response:reject=',reject);
				statusLog.callResponse.status=-1;statusLog.callResponse.response=reject;
				reject.called="Log in";
				doAfterRejectedResponse(reject);
			}
		)
	}else{
		console.warn('aborded');
		console.groupEnd();
	}
}
function callRegister(){
	console.groupCollapsed('callRegister');
	if(inputCheck()){
		var data={};
		data.username=document.querySelector('input[name="username"]').value;
		data.password=document.querySelector('input[name="password"]').value;
		//the movie api does not require email, so it's pointless to add one 
		console.log('data=',data);
		displayNotification({type:1,title:"Register",body:"<p>Please wait</p>"});
		statusLog.callResponse={status:0,mode:2,data:data,response:""};
		Auth.userRegister(data)
		.then(
			function(resolve){
				console.log('AuthRegister.userRegister response:resolve=',resolve);
				statusLog.callResponse.status=1;statusLog.callResponse.response=resolve;
				doAfterSuccessResponse();				
			},function(reject){
				console.log('AuthRegister.userRegister response:reject=',reject);
				reject.called="Register";
				statusLog.callResponse.status=-1;statusLog.callResponse.response=reject;
				doAfterRejectedResponse(reject);
			}
		);
	}else{
		console.warn('aborded');
		console.groupEnd();
	}
}
function doAfterSuccessResponse(){
	console.log('success');
	location.assign("home.html");
}
function doAfterRejectedResponse(response=""){
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
	if(profile.mode===1){
		displayNotification({type:-1,title:"A problem at User Log In",body:"<p>The following problems have occurred:</p>"+errorMessage});
	}else
	if(profile.mode===2){
		displayNotification({type:-1,title:"A problem at New User Registering",body:"<p>The following problems have occurred:</p>"+errorMessage});
	}
	console.groupEnd();
}
function displayNotification(options={}){
	console.groupCollapsed('displayNotification');
	console.log("options=",options);	
	modalNotification.setElement([{selector:".modal-title", task:"inner", value:options.title||"(unknown)"},{selector:".modal-body", task:"inner", value:options.body||"(unknown)"},"show"]);
	console.groupEnd();
}
function addEvents(){
	console.groupCollapsed('addEvents');
	console.groupCollapsed('4Buttons');
	document.querySelector('.bt-back').addEventListener("click", function(event){
		event.preventDefault();
		history.back();
		console.groupEnd();
	});
	document.querySelector(".btn-eye2Password").addEventListener("click", function(event){
		event.preventDefault();
		console.groupCollapsed('.bt-eye2Password:click');
		eye2PasswordToggle(2);
		console.groupEnd();
	});
	document.querySelector(".bt-newuserOrback").addEventListener("click", function(event){
		event.preventDefault();
		console.groupCollapsed('.bt-newuserOrback:click');
		if(profile.mode===1){
			displayRegister();
		}else{
			displayLogIn();
		}
		console.groupEnd();
	});
	document.querySelector(".bt-loginOrRegister").addEventListener("click", function(event){
		event.preventDefault();
		console.groupCollapsed('.bt-loginOrRegister');
		if(profile.mode===1){
			console.log('perform log in');
			callLogIn();
		}else{
			console.log('perform register ');
			callRegister();
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
				inputKeyupCheck({element:element,type:'password'});
			}else
			if(element.name.toLowerCase().includes("name")){
				inputKeyupCheck({element:element,type:'name'});
			}else
			if(element.name.toLowerCase().includes("email")){
				inputKeyupCheck({element:element,type:'email'});
			}
			console.groupEnd();
		});
		console.groupEnd();
	}
	document.querySelectorAll('.inputKeyupCheck').forEach(function(element,index){
		inputKeyupEvent(element);
	});
	console.groupEnd();
	console.groupCollapsed('4Mouseover');
		document.querySelector(".btn-eye2Password").addEventListener("mouseover", function(event){
			event.preventDefault();
			console.groupCollapsed('passwordEye:mouseover');
			profile.mouseEye=true;
			eye2PasswordToggle(1);
			console.groupEnd();
		});
		document.querySelector(".btn-eye2Password").addEventListener("mouseleave", function(event){
			event.preventDefault();
			console.groupCollapsed('passwordEye:mouseleave');
			profile.mouseEye=false;
			eye2PasswordToggle(0);
			console.groupEnd();
		});
	console.groupEnd();
	console.groupEnd();
}
function init(){
	console.groupCollapsed('init');
	profile.protocol=location.protocol;
	modalNotification= new Modal({root:"modalRoot",addModal2Root:true,});
	addEvents();
	console.groupEnd();
}
init();