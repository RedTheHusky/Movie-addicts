function addUserAuth(){ 
	console.groupCollapsed('addUserAuth');
	var domUserAuthElements={};
	var data={};
	var dataEncode={};
	function getCurrentPageAddressWithParameters(){
		console.groupCollapsed('getCurrentPageWithParameters');
		var path = window.location.pathname;
		var page = path.split("/").pop();
		console.log('page=',page );
		var search=location.search;
		console.log("search=", search);
		data.page=page;
		data.search=search;
		dataEncode.page=page;
		dataEncode.search=encodeURIComponent(search);
		console.log("data=", data);
		console.log("dataEncode=", dataEncode);
		console.groupEnd();	
	}
	console.groupCollapsed('adding doms');
	function add(name){
		domUserAuthElements[name]= document.getElementById(name);
	}
	add("sectionUserAuth");
	add("labelUserAuthStatus");
	add("divUserAuthUsername");
	add("labelUserName");
	add("btnUserAuth");
	console.log('domUserAuthElements=',domUserAuthElements);
	console.groupEnd();	
	if(domUserAuthElements["btnUserAuth"]){
		console.log('add button event');
		getCurrentPageAddressWithParameters();
		domUserAuthElements["btnUserAuth"].addEventListener("click",function(event){
			event.preventDefault();
			console.groupCollapsed('btnUserAuth:click');
			if(Auth.getAccessToken()){
				console.log('loged in');
				Auth.userLogOut()
				.then(
					function(resolve){
						console.log('AuthRegister.userLogOut response:resolver=',resolve);	
						window.location = data.page+data.search;
					},
					function(reject){
						console.log('AuthRegister.userLogOut response:reject=',reject);	
						if(reject.response&&reject.response.responseJSON&&reject.response.responseJSON.message){
							alert(reject.response.responseJSON.message);	
						}else if(reject.message){
							alert(reject.message);	
						}
					}
				);
			}else{
				console.log('not loged in');
				modalElements["auth"].show();
				/*let wlocation="auth.html?page="+dataEncode.page+'&search='+dataEncode.search;
				console.log('location=',wlocation);
				window.location = wlocation;	*/
			}
			console.groupEnd();
		});
	}else{
		console.warn("button not found, can't add event");
	}
	
	console.groupCollapsed('display');
	if(Auth.getAccessToken()){
		console.log('loged in');
		for (var key in domUserAuthElements){
			if(domUserAuthElements[key]){
				console.log("dom["+key+"]->ok");
				if(key==="labelUserAuthStatus"){
					domUserAuthElements[key].innerText="User loged in";
				}else
				if(key==="divUserAuthUsername"){
					domUserAuthElements[key].style.display="initial";
				}else
				if(key==="labelUserName"){
					domUserAuthElements[key].innerText=Auth.getAccessName();
				}else
				if(key==="btnUserAuth"){
					domUserAuthElements[key].innerText="Log out";
				}else
				if(key==="sectionUserAuth"){
					domUserAuthElements[key].style.display="initial";
				}
			}else{
				console.warn("domUserAuthElements["+key+"]->nothing");
			}
		}
	}else{
		console.log('not loged in');
		for (var key in domUserAuthElements){
			if(domUserAuthElements[key]){
				console.log("dom["+key+"]->ok");
				if(key==="labelUserAuthStatus"){
					domUserAuthElements[key].innerText="No user loged in";
				}else
				if(key==="divUserAuthUsername"){
					domUserAuthElements[key].style.display="none";
				}else
				if(key==="labelUserName"){
					domUserAuthElements[key].innerText="";
				}else
				if(key==="btnUserAuth"){
					domUserAuthElements[key].innerText="Log in/Register";
				}else
				if(key==="sectionUserAuth"){
					domUserAuthElements[key].style.display="initial";
				}
			}else{
				console.warn("dom["+key+"]->nothing");
			}
		}
	}
	console.groupEnd();
	console.groupEnd();	
}
addUserAuth(); 