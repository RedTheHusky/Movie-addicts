imageFileUploader is easy to use.

Steps for Uploading
	1)You need to do is initialize it: imageFileUploader.init();
	2)Create the dom element, it needs to look like this: <input class='fileInput' type="file" accept=".jpg, .jpeg, .png, .gif">
		It needs to be tagName input
		It needs to have type file
		And it needs to have accept only images that a browser can easily decode/encode 
	3)To upload a file you use the function: fileUppload.fileUppload({element:element,event:event||""})
		The event is for debug console purpose, can be an empty string. Just will show in console who triggered it, like was it an button or something else 
		The element needs to refer to the dom input element that you created at step 2.
	Thats all for it to upload

Steps for receiving the address where the file was uploaded.
	1) Create a function
	function doAfterSuccessImageUpload(data={}){//can't change the name as the imageFileUploader will look for that function name to sent its data
		console.log('data=',data);
		//depending from the server responding, the response can be json or just text
		if(typeof data.response !="object"){  
			//converts the response to json
			var obj = JSON.parse(data.response); 
			console.log('obj=',obj);
			console.log('address=',obj.address);
			//your action on what to do with the address
		}else{
			//already is json so no need conversion
			console.log('address=',data.response.address);
			//your action on what to do with the address
		}
	}
Additionally, the imageFileUploader is an object and you can check it's elements 