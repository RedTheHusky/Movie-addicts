var domElements={};
var domImputElements={};
var profile={mode:1,page:'',search:'',protocol:''}; //mode: 1- login 2-register
var settings={nameLength_min:6,nameLength_max:36,passwordLength_min:6,passwordLength_max:36};
var widgetId=-1;
function addDomElements(){
	console.groupCollapsed('addDomElements');
	function add(name){
		domElements[name]= document.getElementById(name);
	}
	function addInput(name){
		domImputElements[name]= document.getElementById(name);
	}
	add("authLoginOrRegister");
	add("sectionUserAcc");
	add("back4Register");
	add("btnBack2LogIn");
	add("modeLabel");
	addInput("inputUsername");
	add("email2Register");
	addInput("inputEmail");
	addInput("inputPassword");
	add("password2Register");
	addInput("inputConfirmPassword");
	add("recaptcha2Register");
	add("btnGo2Register");
	add('btnLogInOrRegister');
	add("statusLogInOrRegister");
	console.log('domElements=',domElements);
	console.groupEnd();
}
function displayDomElement(){
	console.groupCollapsed('displayDomElement');
	if(AuthRegister.getAccessToken()){
		console.log('loged in');
		domElements["authLoginOrRegister"].style.display="none";
	}else{
		console.log('not loged in');
		domElements["authLoginOrRegister"].style.display="initial";
	}
	console.groupEnd();
}
function resetInputFields(){
	console.groupCollapsed('resetInputFields');
	let colorClass="auth-border-color-red";
	domImputElements["inputUsername"].value="";
	domImputElements["inputEmail"].value="";
	domImputElements["inputPassword"].value="";
	domImputElements["inputConfirmPassword"].value="";
	domImputElements["inputUsername"].classList.remove(colorClass);
	domImputElements["inputEmail"].classList.remove(colorClass);
	domImputElements["inputPassword"].classList.remove(colorClass);
	domImputElements["inputConfirmPassword"].classList.remove(colorClass);
	console.groupEnd();
}
function displayDomRegister(){
	console.groupCollapsed('displayDomRegister');
	if(profile.protocol!=="file:"){
		console.log('Its on a network');
		console.log('widgetId=',widgetId);
		if(widgetId===-1){
			widgetId=grecaptcha.render('add_g-recaptcha_here', {
			  'sitekey' : '6LefgYEUAAAAAN1Loro_VTlFvcOcDvYfscJ1dlMH',
			  'callback' : 'recaptchaSuccess',
			  'expired-callback' : 'recaptchaExpired',
			  'error-callback' : 'recaptchaError'
			});
		}else{
			console.log('No need to render it');
		}
		domElements['btnLogInOrRegister'].style.display="none";
	}else{
		console.warn('Its not on network, disabling g-recaptcha requirement');
	}	
	domElements["back4Register"].style.display="initial";
	domElements["modeLabel"].innerHTML="User Register";
	domElements["email2Register"].style.display="initial";
	domElements["password2Register"].style.display="initial";
	domElements["recaptcha2Register"].style.display="initial";
	domElements["btnGo2Register"].style.display="none";
	domElements["statusLogInOrRegister"].style.display="initial";
	domElements['btnLogInOrRegister'].innerHTML="Sign Up";
	console.groupEnd();
}
function recaptchaSuccess(response=''){
	console.groupCollapsed('recaptchaSuccess');
	domElements['btnLogInOrRegister'].style.display="initial";
	console.log('response=',response);
	console.groupEnd();
}
function recaptchaExpired(response=''){
	console.groupCollapsed('rrecaptchaExpired');
	domElements['btnLogInOrRegister'].style.display="none";
	console.log('response=',response);
	console.groupEnd();
}
function recaptchaError(response=''){
	console.groupCollapsed('recaptchaExpired');
	domElements['btnLogInOrRegister'].style.display="none";
	console.log('response=',response);
	console.groupEnd();
}
function displayNewUserButton(){
	console.groupCollapsed('displayDomRegister');
	displayDomLogIn();
	console.groupEnd();
}
function displayDomLogIn(){
	console.groupCollapsed('displayDomLogIn');
	domElements["back4Register"].style.display="none";
	domElements['btnLogInOrRegister'].style.display="initial";
	domElements["modeLabel"].innerHTML="User LogIn";
	domElements["email2Register"].style.display="none";
	domElements["password2Register"].style.display="none";
	domElements["recaptcha2Register"].style.display="none";
	domElements["btnGo2Register"].style.display="initial";
	domElements["statusLogInOrRegister"].style.display="initial";
	domElements['btnLogInOrRegister'].innerHTML="Sign In";
	console.groupEnd();
}
function addEvents(){
	console.groupCollapsed('addEvents');
	console.log('4Buttons');
	domElements["btnGo2Register"].addEventListener("click", function(event){
		event.preventDefault();
		console.groupCollapsed('btnGo2Register:click');
		resetInputFields();
		displayDomRegister();
		profile.mode=2;
		console.groupEnd();
	});
	domElements["btnBack2LogIn"].addEventListener("click", function(event){
		event.preventDefault();
		console.groupCollapsed('btnBack2LogIn:click');
		resetInputFields();
		displayDomLogIn();
		profile.mode=1;
		console.groupEnd();
	});
	domElements["btnLogInOrRegister"].addEventListener("click", function(event){
		event.preventDefault();
		console.groupCollapsed('btnLogInOrRegister:click');
		if(profile.mode===1){//login
			callLogIn();
		}else
		if(profile.mode===2){//register
			callRegister();
		}
		console.groupEnd();
	});
	console.groupCollapsed('4Input');
	for (let key in domImputElements){ //simple for with if in it for checking if all the newTitle, newYear, ect have a value
		if(domImputElements[key]){
			console.log('key:',key,' does exists');
			domImputElements[key].addEventListener("keyup",function(event){
				console.groupCollapsed(key+':keyup');
				if(key.toLowerCase().includes("password")){
					inputKeyupCheck({key:key,type:'password'});
				}else
				if(key.toLowerCase().includes("name")){
					inputKeyupCheck({key:key,type:'name'});
				}else
				if(key.toLowerCase().includes("email")){
					inputKeyupCheck({key:key,type:'email'});
				}
				console.groupEnd();
			});
		}else{
			console.warn('key:',key,' does not exists');
		}
	}
	console.groupEnd();
	console.groupEnd();
}
function inputKeyupCheck(options={}){
	console.groupCollapsed('inputKeyupCheck');
	console.log('options:',options);
	let colorClass="auth-border-color-red";
	if(!options.key||!domImputElements[options.key]){
		console.warn('invalid key');
		console.groupEnd();
		return;
	}
	let domElement=domImputElements[options.key];
	if(options.type){
		if(options.type==='name'){
			if(domElement.value.length<settings.nameLength_min){
				console.warn('name to small');
				domElement.classList.add(colorClass);
			}else
			if(domElement.value.length>settings.nameLength_max){
				console.warn('name to big');
				domElement.classList.add(colorClass);
			}else{
				domElement.classList.remove(colorClass);
			}
		}else
		if(options.type==='password'){
			if(domElement.value.length<settings.passwordLength_min){
				console.warn('password to small');
				domElement.classList.add(colorClass);
			}else
			if(domElement.value.length>settings.passwordLength_max){
				console.warn('password to big');
				domElement.classList.add(colorClass);
			}else{
				domElement.classList.remove(colorClass);
			}
		}else
		if(options.type==='email'){
			if(!validateEmail(domElement.value)){
				console.warn('invalid email');
				domElement.classList.add(colorClass);
			}else{
				domElement.classList.remove(colorClass);
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
function getURLDatas(){
	console.groupCollapsed('getURLDatas');
	function getUrlParameter(name) {
	  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	  var results = regex.exec(location.search);
	  return results === null
		? ""
		: decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	profile.protocol=location.protocol;
	console.log('profile.protocol=',profile.protocol);
	profile.page=getUrlParameter('page');
	profile.search=getUrlParameter('search');
	console.log('profile.page:',profile.page);
	console.log('profile.search:',profile.search);
	console.groupEnd();
}
function init() {
	console.groupCollapsed('init');
	addDomElements();
	getURLDatas();
	addEvents();
	displayDomElement();
	console.groupEnd();
}
init();

function displayErrorLabelStatus(message=""){
	console.groupCollapsed('displayLabelStatus');
	console.log('message:',message);
	domElements["statusLogInOrRegister"].innerText=message;
	console.groupEnd();
}
function inputCheck(){
	console.groupCollapsed('inputCheck');
	console.log('profile.mode=',profile.mode);
	var errorLog=[];
	if((profile.mode===1&&(!domImputElements["inputUsername"]||!domImputElements["inputPassword"]))||(profile.mode===2&&(!domImputElements["inputUsername"]||!domImputElements["inputPassword"]||!domImputElements["inputConfirmPassword"]||!domImputElements["inputEmail"]))){
		console.warn('a field is empyte');
		errorLog.push('a field is empyte');
	}
	if(domImputElements["inputUsername"].value.length<settings.nameLength_min){
		console.warn('name to small');
		errorLog.push('name to small');
	}
	if(domImputElements["inputUsername"].value.length>settings.nameLength_max){
		console.warn('name to big');
		errorLog.push('name to big');
	}
	if(domImputElements["inputPassword"].value.length<settings.passwordLength_min){
		console.warn('password to small');
		errorLog.push('password to small');
	}
	if(domImputElements["inputPassword"].value.length>settings.passwordLength_max){
		console.warn('password to big');
		errorLog.push('password to big');
	}
	if(profile.mode===2){
		console.log('registry requirements');
		if(domImputElements["inputPassword"].value!=domImputElements["inputConfirmPassword"].value){
			console.warn('password not a match');
			errorLog.push('password not a match');
		}
		if(!validateEmail(domImputElements["inputEmail"].value)){
			console.warn('password not a match');
			errorLog.push('password not a match');
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
	if(errorLog.length>0){
		console.warn('has error, will not commence ajax');
		console.warn('errorLog=',errorLog);
		if(profile.mode===1){
			displayErrorLabelStatus("LogIn aborted do to conditions: "+errorLog.toString());
		}else
		if(profile.mode===2){
			displayErrorLabelStatus("Registration aborted do to conditions: "+errorLog.toString());
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
		data.username=domImputElements["inputUsername"].value;
		data.password=domImputElements["inputPassword"].value;
		console.log('data=',data);
		AuthRegister.userLogIn(data)
		.then(
			function(result){
				console.log('AuthRegister.userLogIn response:resolve=',result);
				doAfterResponse(result);			
			},function(result){
				console.log('AuthRegister.userLogIn response:reject=',result);
				doAfterResponse(result);			
			}
		);
	}else{
		console.warn('aborded');
		console.groupEnd();
	}
}
function callRegister(){
	console.groupCollapsed('callRegister');
	if(inputCheck()){
		var data={};
		data.username=domImputElements["inputUsername"].value;
		data.password=domImputElements["inputPassword"].value;
		console.log('data=',data);
		AuthRegister.userRegister(data)
		.then(
			function(result){
				console.log('AuthRegister.userRegister response:resolve=',result);
				doAfterResponse(result);		
			},function(result){
				console.log('AuthRegister.userRegister response:reject=',result);
				doAfterResponse(result);		
			}
		);
	}else{
		console.warn('aborded');
		console.groupEnd();
	}
}
function doAfterResponse(messageFromApi){
	console.groupCollapsed('doAfterResponse');
	console.log('messageFromApi',messageFromApi);
	if(messageFromApi.error){
		console.warn('error');
		if(messageFromApi.error.responseJSON&&messageFromApi.error.responseJSON.message){
			displayLabelStatus(messageFromApi.error.responseJSON.message);
		}else{
			displayErrorLabelStatus(messageFromApi.error);
		}
	}else if(messageFromApi.message){
		console.warn('success');
		if(profile.page){
			console.groupEnd();window.location = profile.page+profile.search;
		}else{
			console.groupEnd();window.location = "home.html";	
		}		
	}
	console.groupEnd();
}
