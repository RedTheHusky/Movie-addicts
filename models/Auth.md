To call functions from it, use the class name Auth
Example Auth.functionname(parameterIfNeeded)

Useful functions: 
	getAccessToken()	
		-Returns the access token or returns a false. 
		-Reads the key 'accessToken' from session storage
		-If session storage is not available then it reads the cookies.

	getAccessName()		
		-Returns the name of the user who loged in or returns a false. 
		-Reads the key 'accessUsername' from session storage
		-If session storage is not available then it reads the cookies.

	userLogOut()		
		-Logs out the user.
		-At success log out from the server, it deletes the keys 'accessToken' and 'accessUsername'
Requires: 
	-jquery
	-Storage.js