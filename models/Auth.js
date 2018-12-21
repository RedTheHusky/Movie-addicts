
class Auth{	
	static baseURL(){return "https://ancient-caverns-16784.herokuapp.com";}	
	static getAccessToken(){
		console.groupCollapsed('getAccessToken');
		let token=KeyHelper.keyRead('accessToken');
		if(token){
			console.log('found token=',token);	
			console.groupEnd(); 
			return token;
		}else{
			console.warn('no token found');	
			console.groupEnd(); 
			return false;
		}
		
	}
	static getAccessName(){
		console.groupCollapsed('getAccessName');
		let username=KeyHelper.keyRead('accessUsername');
		if(username){
			console.log('found username=',username);	
			console.groupEnd(); 
			return username;
		}else{
			console.warn('no username found');	
			console.groupEnd(); 
			return false;
		}
	}
	static userLogOut(){
		console.groupCollapsed('userLogOu');
		var HttpAddress_Get=this.baseURL()+"/auth/logout";
		console.log('HttpAddress_Get',HttpAddress_Get);
		var token=this.getAccessToken();
		console.groupEnd(); 
		return $.ajax({
		url: HttpAddress_Get,
		method: 'GET',
		headers: {'X-Auth-Token' : token} })
		.then(function(response) {
			console.log('GetHttpRequest:','success=',response);
			KeyHelper.keyRemove('accessUsername');
			KeyHelper.keyRemove('accessToken');
			return {message:response};
			
			},
			function(response) {
				console.warn('GetHttpRequest:','fail=',response);
				if(response){
					return {response:response} ;
				}else{
					return {message:'Unknown Error'} ;
				}
			}
		)
	}
	
}

