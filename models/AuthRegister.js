
class AuthRegister extends Auth{	
	static userRegister(options={}){
		console.groupCollapsed('userRegister');
		var HttpAddress_Get=this.baseURL()+"/auth/register";
		console.log('HttpAddress_Get',HttpAddress_Get);
		KeyHelper.keySave({name:'accessUsername',value:options.username});
		console.groupEnd(); 
		return $.ajax({
			url: HttpAddress_Get,
			method: 'POST',
			data: { 'username':options.username,'password':options.password}})
			.then(function(response) {
					console.log('GetHttpRequest:','success=',response);
					if(response&&response.authenticated){
						KeyHelper.keySave({name:'accessToken',value:response.accessToken});
						return{message:response};
					}
					
				},
				function(response) {
					console.warn('GetHttpRequest:','fail=',response);
					if(response){
						return{response:response};
					}else{
						return{message:'Unknown Error'};
					}
				}	
			);	
	}
	static userLogIn(options={}){
		console.groupCollapsed('userLogIn');
		var HttpAddress_Get=this.baseURL()+"/auth/login";
		console.log('HttpAddress_Get',HttpAddress_Get);
		KeyHelper.keySave({name:'accessUsername',value:options.username});
		console.groupEnd(); 
		return $.ajax({
			url: HttpAddress_Get,
			method: 'POST',
			data: { 'username':options.username,'password':options.password}})
			.then(function(response) {
					console.log('GetHttpRequest:','success=',response);
					if(response&&response.authenticated){
						if(!KeyHelper.keySave({name:'accessToken',value:response.accessToken})){
							return{message:"Problem with handling storage"};
						}else{
							return{message:response};
						}
					}
				},
				function(response) {
					console.warn('GetHttpRequest:','fail=',response);
					if(response){
						return{response:response};
					}else{
						return{message:'Unknown Error'};
					}
				}
			);
		
	}
}

