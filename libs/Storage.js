class SessionStorage{
	static save(options={}){
		//console.groupCollapsed('sessionStorageSave');
		try {
			//console.log('name=',options.name);
			//console.log('value=',options.value);
			if(typeof options.name === 'undefined'||options.name.length<1){
				console.warn('Faile no name');
				//console.groupEnd();
				return false;
			}
			sessionStorage.setItem(options.name, options.value);
			//console.log('set');
			//console.groupEnd();
			return true;
		}
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}
	}
	static read(name){
		//console.groupCollapsed('sessionStorageRead');
		try {
			//console.log('name=',name);
			if(name.length<1){
				console.warn('Faile no name');
				//console.groupEnd();
				return false;
			}
			var out=sessionStorage.getItem(name);
			//console.log('out=',out);
			//console.groupEnd();
			return out;
		}
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}
	}
	static remove(name=''){
		//console.groupCollapsed('sessionStorageDelete');
		try {
			//console.log('name=',name);
			if(typeof name === 'undefined'||name.length<1){
				console.warn('Faile no name');
				//console.groupEnd();
				return false;
			}
			sessionStorage.removeItem(name);
			return true;
		}
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}
	}	
	static storageAvailable() {
		try {
			var storage = window['sessionStorage'],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			//console.log('sessionStoragestorageAvailable:','true');
			return true;
		}
		catch(e) {
			//console.log('sessionStoragestorageAvailable:','false');
			return e instanceof DOMException && (
				
				// everything except Firefox
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				// acknowledge QuotaExceededError only if there's something already stored
				storage.length !== 0;
		}
	}
}
class CookieStorage{
	static save(options={}){
		//console.groupCollapsed('CookieStorageSaveCookie');
		try {
			//console.log('name=',options.name);
			//console.log('value=',options.value);
			//console.log('days=',options.days);
			//console.log('path=',options.path);
			//console.log('noEncode=',options.noEncode);
			var send="";
			if(typeof options.name === 'undefined'||options.name.length<1){
				console.warn('Faile no name');
				//console.groupEnd();
				return false;
			}
			send+=options.name;
			if(options.noEncode===true){
				send+="=" + options.value;
			}else{
				send+="=" + encodeURIComponent(options.value);
			}
			if(options.days&&options.days>1){
				var d = new Date();
				d.setTime(d.getTime() + (options.days*24*60*60*1000));
				send+=";expires="+ d.toUTCString();
			}
			if(options.path&&1<=options.path.length){
				send+=";path=/"+options.path;
			}
			//console.log('saveCookie=',send);
			//console.groupEnd();
			document.cookie = send;
			return true;
		}
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}
	}
	static remove(options={}){
		//console.groupCollapsed('CookieStorageDeleteCookie');
		try {
			//console.log('name=',options.name);
			//console.log('path=',options.path);
			if(typeof options.name === 'undefined'||options.name.length<1){
				console.warn('Faile no name');
				//console.groupEnd();
				return false;
			}
			var send=options.name + "=" + "" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
			if(options.path&&1<=options.path.length){
				send+=";path=/"+options.path;
			}
			//console.log('removeCookie=',send);
			//console.groupEnd();
			document.cookie = send;	
			return true;
		}	
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}		
	}
	static read(name='',noDecode=false) {
		//console.groupCollapsed('CookieStorageReadCookie');
		try {
			//console.log('name=',name);
			if(typeof name === 'undefined'||name.length<1){
				console.warn('Faile no name');
				//console.groupEnd();
				return false;
			}
			name = name + "="; 
			if(!noDecode){
				var cookieData = decodeURIComponent(document.cookie);
			}else{
				var cookieData = document.cookie;
			}
			
			//console.log('cookieData=',cookieData);
			var ca = cookieData.split(';');
			for(var i = 0; i <ca.length; i++){
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0){
					var value=c.substring(name.length, c.length);
					//console.log('value=',value);
					//console.groupEnd();
					return value;
				}
			}
			console.warn('Not found');
			//console.groupEnd();
			return '';
		}
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}
	}
	static  storageAvailable(){
		//console.groupCollapsed('storageAvailable');
		let r=this.ifEnabled();
		//console.groupEnd();
		return r;
	}
	static ifEnabled() {
		//console.groupCollapsed('CookieStorageifEnabled');
		try {
			this.save({name:"IfEnabledCookie_test", value:"test", days:2});
			var cookie=this.read("IfEnabledCookie_test");
			if(cookie){
				this.remove({name:"IfEnabledCookie_test"}); 
				//console.log('Enabled');
				//console.groupEnd();
				return true;
			}else{
				this.remove({name:"IfEnabledCookie_test"});
				console.warn('NotEnabled');
				//console.groupEnd();
				return false;
			}
		}
		catch(e) {
			//console.error(e);
			//console.groupEnd();
			return false;
		}
	}
}

class KeyHelper {
	static keyRead(name){
		console.groupCollapsed('keyReade');
		console.log('name=',name);
		let value=false;
		if(typeof SessionStorage != 'undefined'&&SessionStorage.storageAvailable()){
			console.log('Using session storage');
			value=SessionStorage.read(name);
		}else
		if(typeof CookieStorage != 'undefined'&&CookieStorage.storageAvailable()){
			console.log('Using cookie storage');
			value=CookieStorage.read(name);
		}else{
			console.warn('There is no storage to use');
		}	
		console.log('return=',value);
		console.groupEnd(); 
		return value;
	}
	static keySave(options={}){
		console.groupCollapsed('keySave');
		console.log('options:',options);
		let value=false;
		if(typeof SessionStorage != 'undefined'&&SessionStorage.storageAvailable()){
			console.log('Using session storage');
			value=SessionStorage.save(options);
		}else
		if(typeof CookieStorage != 'undefined'&&CookieStorage.storageAvailable()){
			console.log('Using cookie storage');
			value=CookieStorage.save(options);
		}else{
			console.warn('There is no storage to use');
		}	
		console.log('return=',value);
		console.groupEnd(); 
		return value;
	}
	static keyRemove(name){
		console.groupCollapsed('keyRemove');
		console.log('name=',name);
		let value=false;
		if(typeof SessionStorage != 'undefined' &&SessionStorage.storageAvailable()){
			console.log('Using session storage');
			value=SessionStorage.remove(name);
		}else
		if(typeof CookieStorage != 'undefined' &&CookieStorage.storageAvailable()){
			console.log('Using cookie storage');
			value=CookieStorage.remove(name);
		}else{
			console.warn('There is no storage to use');
		}	
		console.log('return=',value);
		console.groupEnd(); 
		return value;
	}
}