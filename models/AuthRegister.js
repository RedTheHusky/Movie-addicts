
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
			.done(function( resolve ) {
				console.log('GetHttpRequest:','success=',resolve);
				KeyHelper.keySave({name:'accessToken',value:resolve.accessToken});
				if(!KeyHelper.keySave({name:'accessToken',value:resolve.accessToken})){
					return new Promise((resolve, reject) => {reject({message:"Problem with handling storage"})});
				}else{
					return{resolve};
				}
				
			})
			.fail(function(reject) {
				console.warn('GetHttpRequest:','fail=',reject);
				if(!reject){reject={message:"Unknown Error"};}
				return{reject};
			 });
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
			.done(function( resolve ) {
				console.log('GetHttpRequest:','success=',resolve);
				KeyHelper.keySave({name:'accessToken',value:resolve.accessToken});
				if(!KeyHelper.keySave({name:'accessToken',value:resolve.accessToken})){
					return new Promise((resolve, reject) => {reject({message:"Problem with handling storage"})});
				}else{
					return{resolve};
				}
				
			})
			.fail(function(reject) {
				console.warn('GetHttpRequest:','fail=',reject);
				if(!reject){reject={message:"Unknown Error"};}
				return{reject};
			 });
	}
}

