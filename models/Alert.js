//component based on the idea of Modules 
//need to replace this with Modules and not Models but can't figure out why import is not working 
//allows optionally dynamically loading the bootstrap resources 
//allows multiple modal to exist on the same page just by creating a new instant of the class as each modal gets its own unique id
//the setElement. setElements, setContent only affects the dom elements of the instant class that its called from

class Alert {
	constructor(options={}) {
		console.groupCollapsed('constructor');
		if(!(typeof options === 'object')){options={}};
		function uuidv4() {
		  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		  });
		}
		this.root={id:'',dom:'',jquery:''};
		this.modal={id:'',dom:'',jquery:''};
		this.modal.id="alert_"+uuidv4();
		this.loaded={css:true,js:true};
		this.content=`<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<div class="alert-body">Some text</div>`;
		console.log('options=',options);
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
			if(options.addModal2Root){
				this.addAlert2Root(options.addModal2Root);
			}
		}
		if(options.add2Head){
			this.add2Head(options.add2Head);
		}
		if(options.loadMode&&(options.loadMode==="n"||options.loadMode===0)){
			console.log("not included in dom's heade");
			this.loaded.css=false;
			this.loaded.js=false;
		}
		if(options.content){
			this.content=options.content;
		}
		console.groupEnd();
	}

	add2Head(options={}){
		//optionally dynamically adding the bootstrap files if not added to the head 
		console.groupCollapsed('add2Head');
		if(!(typeof options === 'object')){options={}};
		let loadMode='a';
		if(options.loadMode){
			loadMode=options.loadMode;
		}
		console.log('loadMode=',loadMode);
		let me=this;
		/*loadMode options:
			a/1)all, loads both the css and js
			c/3) loads just css
			s/2) loads just js
			n/0) not included in dom's heade
			h/4) included in dom's head
		*/
		if(options.loadMode&&(options.loadMode==="n"||options.loadMode===0)){
			console.log("included in dom's head");
			this.loaded.css=true;
			this.loaded.js=true;
		}else
		if(options.loadMode&&(options.loadMode==="h"||options.loadMode===4)){
			console.log("not included in dom's heade");
			this.loaded.css=false;
			this.loaded.js=false;
		}
		if(loadMode==='a'||loadMode==='c'||loadMode===1||loadMode===3){
			console.groupCollapsed('dynamicallyLoadStylesheet');
			var css = document.createElement("link");  
			css.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";  
			css.setAttribute("rel","stylesheet");
			document.head.appendChild(css);  
			if (css.addEventListener) {
				css.addEventListener('load', function() {
					console.log("CSS Done 1");
					me.loaded.css=true;
					if(options.callback&&me.loaded.js){
						console.log("Do callback");
						options.callback();
					}
				}, false);   
			};    
			console.groupEnd();
		}
		if(loadMode==='a'||loadMode==='s'||loadMode===1||loadMode===2){
			console.groupCollapsed('dynamicallyLoadScript');
			var script = document.createElement("script");  
			script.src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";  
			document.head.appendChild(script);  
			if (script.addEventListener) {
				script.addEventListener('load', function() {
					console.log("script Done 1");
					me.loaded.js=true;
					if(options.callback&&me.loaded.css){
						console.log("Do callback");
						options.callback();
					}
				}, false);   
			};    
			console.groupEnd();
		}
		console.groupEnd();
	}
	addAlert2Root(options={}) {
		//generates and appends the modal html elements to the rootdoom
		console.groupCollapsed('addModal2Root');
		if(!(typeof options === 'object')){options={}};
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
		}
		console.log('root=',this.root);
		console.log('modal=',$('#'+this.modal.id)[0]);
		if($('#'+this.modal.id)[0]){
			console.warn("already exists");
			console.groupEnd();
			return false;
		}
		if(this.root.dom&&this.isElement(this.root.dom)){
			console.log('Dom element does exists');
			this.modal.dom = document.createElement("div");
			this.modal.dom.classList.add("alert");this.modal.dom.classList.add("alert-info");this.modal.dom.classList.add("fade");this.modal.dom.classList.add("in");
			//this.modal.dom.classList.add("alert-dismissible");
			this.modal.dom.setAttribute("id", this.modal.id);
			this.modal.dom.setAttribute("role", "alert");
			this.modal.dom.setAttribute("style", "display:none");
			this.modal.dom.innerHTML = this.content;
			this.root.dom.appendChild(this.modal.dom);	
			this.modal.jquery=$('#'+this.modal.id); 
			this.alertType="info";
			console.log('dom=',this.modal.dom);
			console.log('jquery=',this.modal.jquery);
		}else{
			console.warn('Dom element does not exists');
		}
		console.groupEnd();
	}
	removeModal4Root(){
		console.groupCollapsed('removeModal4Root');
		if(this.modal.dom){
			this.modal.dom.innerHTML="";
			this.modal.dom.parentNode.removeChild(this.modal.dom);
			this.modal.dom="";
			this.modal.jquery="";
		}
		console.groupEnd();
	}
	setElement(options=[]){
		console.groupCollapsed('setElement');
		if(!(typeof options === 'object')){options=[]};
		if(!this.modal.dom){
			console.warn('No modal to select');
			console.groupEnd();
			return;
		}
		console.log("options=",options);
		let me=this;
		options.forEach(function(option,index){//element, index
			console.groupCollapsed('option[',index,']');
			console.log('option=',option);
			if(option==="show"){
				me.show();
			}else
			if(option==="hide"){
				me.hide();
			}else
			if(option==="toggle"){
				me.toggle();
			}else
			if(!option.selector){
				console.warn('No selector for: ', index);
			}else
			if(!me.root.dom.querySelector(option.selector)){
				console.warn('No element for: ', index);
			}else{
				console.log("element:",me.modal.dom.querySelector(option.selector));
				if(option.task==="inner"){
					console.log("set: inner");
					me.modal.dom.querySelector(option.selector).innerHTML=option.value;
					console.log("get:",me.modal.dom.querySelector(option.selector));
				}else
				if(option.task==="attribute-add"){
					console.log("set: attribute-add");
					me.modal.dom.querySelector(option.selector).setAttribute(option.name,option.value);
					console.log("get:",me.modal.dom.querySelector(option.selector));
				}else
				if(option.task==="attribute-remove"){
					console.log("set: attribute-remove");
					me.modal.dom.querySelector(option.selector).removeAttribute(option.name);
					console.log("get:",me.modal.dom.querySelector(option.selector));
				}else
				if(option.task==="class-add"){
					console.log("set: class-add");
					me.modal.dom.querySelector(option.selector).classList.add(option.value);
					console.log("get:",me.modal.dom.querySelector(option.selector));
				}else
				if(option.task==="class-remove"){
					console.log("set: class-remove");
					me.modal.dom.querySelector(option.selector).classList.remove(option.value);
					console.log("get:",me.modal.dom.querySelector(option.selector));
				}else{
					console.warn('No task for: ', index);
				}
			}
			console.groupEnd();
		});
		console.groupEnd();
	}
	checkifRead(option="a"){
		console.groupCollapsed('checkifRead');
		if(!(typeof option === 'string')){option="a"};
		console.log("option=",option);
		if((option==="a"||option==="c")&&!this.loaded.css){
			console.warn("stylesheet not loaded");
			console.groupEnd();
			return false;
		}
		if((option==="a"||option==="s")&&!this.loaded.js){
			console.warn("script not loaded");
			console.groupEnd();
			return false;
		}
		if((option==="a"||option==="r")&&(!this.root.dom||!this.isElement(this.root.dom))){
			console.warn("no root defined");
			console.groupEnd();
			return false;
		}
		if(!($('#'+this.modal.id))){
			console.warn("no modal defined");
			console.groupEnd();
			return false;
		}
		console.log("ok");
		console.groupEnd();
		return true;
	}
	show(options=""){
		console.groupCollapsed('show');
		this.modal.jquery.show(options);
		console.groupEnd();
	}
	hide(){
		console.groupCollapsed('hide');
		this.modal.jquery.hide();
		console.groupEnd();
	}
	setType(option){
		console.groupCollapsed('setType');
		console.log('option=',option);
		this.alertType=option;
		//let typeList=["alert-primary", "alert-secondary", "alert-success","alert-danger","alert-warning","alert-info","alert-light","alert-dark"];
		let removeList=[];
		let addClass="";
		if(option==="primary"||option===1){
			removeList=[ "alert-secondary", "alert-success","alert-danger","alert-warning","alert-info","alert-light","alert-dark"];
			addClass="alert-primary";
		}else
		if(option==="secondary"||option===2){
			removeList=["alert-primary","alert-success","alert-danger","alert-warning","alert-info","alert-light","alert-dark"];
			addClass="alert-secondary";
		}else
		if(option==="success"||option===3){
			removeList=["alert-primary", "alert-secondary","alert-danger","alert-warning","alert-info","alert-light","alert-dark"];
			addClass="alert-success";
		}else
		if(option==="danger"||option===4){
			removeList=["alert-primary", "alert-secondary", "alert-success","alert-warning","alert-info","alert-light","alert-dark"];
			addClass="alert-danger";
		}else
		if(option==="warning"||option===5){
			removeList=["alert-primary", "alert-secondary", "alert-success","alert-danger","alert-info","alert-light","alert-dark"];
			addClass="alert-warning";
		}else
		if(option==="info"||option===6){
			removeList=["alert-primary", "alert-secondary", "alert-success","alert-danger","alert-warning","alert-light","alert-dark"];
			addClass="alert-info";
		}else
		if(option==="light"||option===7){
			removeList=["alert-primary", "alert-secondary", "alert-success","alert-danger","alert-warning","alert-info","alert-dark"];
			addClass="alert-light";
		}else
		if(option==="dark"||option===8){
			removeList=["alert-primary", "alert-secondary", "alert-success","alert-danger","alert-warning","alert-info","alert-light"];
			addClass="alert-dark";
		}else{
			removeList=["alert-primary", "alert-secondary", "alert-success","alert-danger","alert-warning","alert-info","alert-light","alert-dark"];
		}
		let me=this;
		console.log('removeList=',removeList);
		console.log('addClass=',addClass);
		removeList.forEach(function(c,i){me.modal.dom.classList.remove(c)});
		if(addClass)this.modal.dom.classList.add(addClass);
		console.groupEnd();
	}
	isElement(o){
		//checks if o is an HTML element 
		console.groupCollapsed('isElement');
		console.log('o=',o);
		var r=(
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
		console.log('r=',r);
		console.groupEnd();
		return r;
	}
	slideup(options={a:2000,b:500,c:500,d:500}){
		console.groupCollapsed('slideup');
		console.log("options=",options);
		let me=this;
		try {
		  this.modal.jquery.fadeTo(options.a, options.b).slideUp(options.c, function(){
				me.modal.jquery.slideUp(options.d);
			});
		}
		catch(err) {
		  console.warn("err=",err);
		}
		console.groupEnd();
	}
}