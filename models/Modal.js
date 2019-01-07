//component based on the idea of Modules 
//need to replace this with Modules and not Models but can't figure out why import is not working 
//allows optionally dynamically loading the bootstrap resources 
//allows multiple modal to exist on the same page just by creating a new instant of the class as each modal gets its own unique id
//the setElement. setElements, setContent only affects the dom elements of the instant class that its called from

class Modal {
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
		this.main={id:'',dom:'',jquery:''};
		this.main.id="modal_"+uuidv4();
		this.loaded={css:true,js:true};
		this.content=`<button type="button" id="${this.main.id}_toggle" class="btn btn-primary" style="display:none" data-toggle="modal" data-target="#${this.main.id}"></button>
		<div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title" >Modal Header</h4>
        </div>
        <div class="modal-body" >
          <p>Some text in the modal.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
      
    </div>`;
		console.log('options=',options);
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
			if(options.addModal2Root){
				this.addModal2Root(options.addModal2Root);
			}
		}
		if(options.add2Head){
			this.add2Head(options.add2Head);
		}
		if(options.loadMode&&(options.loadMode==="n"||options.loadMode===0)){
			//console.log("not included in dom's heade");
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
			//console.log("included in dom's head");
			this.loaded.css=true;
			this.loaded.js=true;
		}else
		if(options.loadMode&&(options.loadMode==="h"||options.loadMode===4)){
			//console.log("not included in dom's heade");
			this.loaded.css=false;
			this.loaded.js=false;
		}
		if(loadMode==='a'||loadMode==='c'||loadMode===1||loadMode===3){
			//console.groupCollapsed('dynamicallyLoadStylesheet');
			var css = document.createElement("link");  
			css.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";  
			css.setAttribute("rel","stylesheet");
			document.head.appendChild(css);  
			if (css.addEventListener) {
				css.addEventListener('load', function() {
					console.log("CSS Done");
					me.loaded.css=true;
					if(options.callback&&me.loaded.js){
						//console.log("Do callback");
						options.callback();
					}
				}, false);   
			};    
			//console.groupEnd();
		}
		if(loadMode==='a'||loadMode==='s'||loadMode===1||loadMode===2){
			//console.groupCollapsed('dynamicallyLoadScript');
			var script = document.createElement("script");  
			script.src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";  
			document.head.appendChild(script);  
			if (script.addEventListener) {
				script.addEventListener('load', function() {
					console.log("script Done");
					me.loaded.js=true;
					if(options.callback&&me.loaded.css){
						//console.log("Do callback");
						options.callback();
					}
				}, false);   
			};    
			//console.groupEnd();
		}
		console.groupEnd();
	}
	addModal2Root(options={}) {
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
		//console.log('modal=',$('#'+this.main.id)[0]);
		if($('#'+this.main.id)[0]){
			console.warn("already exists");
			console.groupEnd();
			return false;
		}
		if(this.root.dom&&this.isElement(this.root.dom)){
			console.log('Dom element does exists');
						this.main.dom="";this.main.jquery="";
			this.main.dom = document.createElement("div");
			this.main.dom.classList.add("modal");this.main.dom.classList.add("fade");
			this.main.dom.setAttribute("id", this.main.id);
			this.main.dom.setAttribute("role", "dialog");
			this.main.dom.innerHTML = this.content;
			this.root.dom.appendChild(this.main.dom);	
			this.main.jquery=$('#'+this.main.id); 
			//console.log('dom=',this.main.dom);
			//console.log('jquery=',this.main.jquery);
			console.log('Modal created');
			this.main.jquery.on('hidden.bs.modal', function(){
				console.log('Modal cleared if it contains a form');
				if($(this).find('form')&&$(this).find('form')[0]&&$(this).find('form')[0].reset){$(this).find('form')[0].reset();}
			});
		}else{
			console.warn('Dom element does not exists');
		}
		console.groupEnd();
	}
	removeModal4Root(){
		console.groupCollapsed('removeModal4Root');
		if(this.main.dom){
			this.main.dom.innerHTML="";
			this.main.dom.parentNode.removeChild(this.main.dom);
			this.main.dom="";
			this.main.jquery="";
		}
		console.groupEnd();
	}
	setElement(options=[]){
		console.groupCollapsed('setElement');
		if(!(typeof options === 'object')){options=[]};
		if(!this.main.dom){
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
				//console.log("element:",me.main.dom.querySelector(option.selector));
				if(option.task==="inner"){
					//console.log("set: inner");
					me.main.dom.querySelector(option.selector).innerHTML=option.value;
					//console.log("get:",me.main.dom.querySelector(option.selector));
				}else
				if(option.task==="attribute-add"){
					//console.log("set: attribute-add");
					me.main.dom.querySelector(option.selector).setAttribute(option.name,option.value);
					//console.log("get:",me.main.dom.querySelector(option.selector));
				}else
				if(option.task==="attribute-remove"){
					//console.log("set: attribute-remove");
					me.main.dom.querySelector(option.selector).removeAttribute(option.name);
					//console.log("get:",me.main.dom.querySelector(option.selector));
				}else
				if(option.task==="class-add"){
					//console.log("set: class-add");
					me.main.dom.querySelector(option.selector).classList.add(option.value);
					//console.log("get:",me.main.dom.querySelector(option.selector));
				}else
				if(option.task==="class-remove"){
					//console.log("set: class-remove");
					me.main.dom.querySelector(option.selector).classList.remove(option.value);
					//console.log("get:",me.main.dom.querySelector(option.selector));
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
		if(!($('#'+this.main.id))){
			console.warn("no modal defined");
			console.groupEnd();
			return false;
		}
		//console.log("ok");
		console.groupEnd();
		return true;
	}
	toggle(option="toggle"){
		console.groupCollapsed('toggle');
		if(!(typeof option === 'string')){option="toggle"};
		if(!this.checkifRead()){
			console.warn("not ready");
			console.groupEnd();
			return;
		}
		console.log('option=',option);
		if(option!="toggle"&&option!="show"&&option!="hide"){
			console.warn("not a valid option");
			console.groupEnd();
			return;
		}
		if(this.main.jquery&&this.main.jquery.modal){
			this.main.jquery.modal(option);
		}else{
			console.warn("No way to toggle it!");
		}
		console.groupEnd();
	}
	show(){
		console.groupCollapsed('show');
		this.toggle('show');
		console.groupEnd();
	}
	hide(){
		console.groupCollapsed('hide');
		this.toggle('hide');
		console.groupEnd();
	}
	isElement(o){
		//checks if o is an HTML element 
		//console.groupCollapsed('isElement');
		//console.log('o=',o);
		var r=(
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
		//console.log('r=',r);
		//console.groupEnd();
		return r;
	}
	getElements(selector=""){
		console.groupCollapsed('getElements');
		if(!(typeof selector === 'string')){selector="toggle"};
		if(!this.main.dom){
			console.warn("There is no master dom to do querySelectorAll!");
			console.groupEnd();
			return [];
		}
		let elements=this.main.dom.querySelectorAll(selector);
		console.log('elements=',elements);
		console.groupEnd();
		return elements;
	}
}