let imageFileUploader={
	init:function(options={}) {
		console.groupCollapsed('init');
		this.file="";
		this.converted="";
		this.statusLog={fileReadEvent:{status:0,file:"",converted:"",error:""},fileUploadEvent:{status:0,error:"",resolve:"",reject:""}};
		this.mode=1;
		console.groupEnd();
	},
	fileUppload:function(options={}) {
		console.groupCollapsed('fileUppload');
		let me=this;
		me.statusLog.fileReadEvent={status:0,file:"",converted:"",error:""};
		function errorcall(str=""){
			me.statusLog.fileReadEvent.status=-1;
			me.statusLog.fileReadEvent.error=str;
			if(typeof doAfterFailedConvertingImage2Base64 !=="undefined"){
				//console.log("trigger doAfterSuccessConvertingImage2Base64");
				try {
					doAfterFailedConvertingImage2Base64({obj:me,message:str});
				}
				catch(err) {
					console.warn('error at function call:',err)
				}
			}else{
				//console.log("use internal");
			}
		}
		var isError = false;
		//console.log('options=',options);
		if(!options.element){
			console.warn("No element defined");
			errorcall("noElementDefined");
			//console.groupEnd();
			return false;
		}
		//console.log('options.event=',options.event);
		let element=options.element;
		if(element.tagName!="input"&&element.getAttribute("type")!="file"){
			console.warn("Invalid attributes");
			errorcall("invalidAttributes");
			//console.groupEnd();
			return false;
		}
		let input=element;
		//console.log('input=',input);
		if ( input.files && input.files[0] ) {
			let file = input.files[0]; // The file
			me.statusLog.fileReadEvent.file=file;
			if ("path" in file) {
			  //console.log("file_path: ",file.path);
			}
			if ("name" in file) {
			  //console.log("file_name: ",file.name);
			}
			if ("size" in file) {
			  //console.log("file_size: ",file.size);
			}
			var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
			if (allowedExtensions.exec(file.name)) {
			  //console.log("file_extensionbvalid: ", true);
			} else {
			  //console.log("file_extensionbvalid: ", false);
			  errorcall("fileExtensionInvalid");
			  isError = true;
			}
			if (!isError) {
				var reader = new FileReader();
				reader.onload = function(e) {
					console.groupCollapsed('fileRead');
					console.log('e.target.result.length=',e.target.result.length);
					if(me.mode===2||me.mode===3){
						//console.log('get image base64');
						me.statusLog.fileReadEvent.status=1;
						me.statusLog.fileReadEvent.converted=e.target.result;
						if(typeof doAfterSuccessConvertingImage2Base64 !=="undefined"){
							console.log("trigger doAfterSuccessConvertingImage2Base64");
							try {
								doAfterSuccessConvertingImage2Base64({obj:me,file:file,result:e.target.result});
							}
							catch(err) {
								console.warn('error at function call:',err)
							}
						}else{
							console.log("use internal");
						}
					}
					if(me.mode===1||me.mode===3){
						//console.log('do upload of base64');
						me.upload({file:file,result:e.target.result});
						
					}
					console.groupEnd();
				};
			  reader.readAsDataURL(file);
			}
		} else {
			// Handle errors here
			console.warn( "file not selected" );
			errorcall("fileNotSelected");
			isError = true;
		}
		console.groupEnd();
	},
	upload:function(data={}){
		console.groupCollapsed('upload');
		//https://127.0.0.1/webdevelope/server/movies/imageUploader.php/upload
		//https://goriest-fastener.000webhostapp.com/movie/imageUploader.php/upload
		let me=this;
		me.statusLog.fileUploadEvent={status:0,error:"",resolve:"",reject:""};
		if(!data||!data.result){
			console.warn("nothing to send!");
			me.statusLog.fileUploadEvent.status=-1;
			me.statusLog.fileUploadEvent.error="nothing2Send";
			//console.groupEnd();
			returnl
		}
		//console.log("file=",data.file);
		//console.log("result.length=",data.result.length);
		$.ajax({
            method: "POST",
            url:"https://goriest-fastener.000webhostapp.com/movie/imageUploader.php/upload" ,
            data: {
                img:data.result
            }
        }).done(function( resolve ) {
			//console.log('HttpRequest:','success=',resolve);
			me.statusLog.fileUploadEvent.status=1;
			me.statusLog.fileUploadEvent.resolve=resolve;
			if(typeof doAfterSuccessImageUpload !=="undefined"){
				//console.log("trigger doAfterSuccessImageUpload");
				try {
					doAfterSuccessImageUpload({obj:me,response:resolve});
				}
				catch(err) {
					console.warn('error at function call:',err)
				}
			}
			//return{resolve};
		})
		.fail(function(reject) {
			//console.warn('HttpRequest:','fail=',reject);
			me.statusLog.fileUploadEvent.status=-1;
			me.statusLog.fileUploadEvent.error="rejected";
			me.statusLog.fileUploadEvent.reject=reject;
			if(typeof doAfterFailedImageUpload !=="undefined"){
				//console.log("trigger doAfterFailedImageUpload");
				try {
					doAfterFailedImageUpload({obj:me,response:resolve});
				}
				catch(err) {
					console.warn('error at function call:',err)
				}
			}
			//return{reject};
		});
		console.groupEnd();
	}
}
