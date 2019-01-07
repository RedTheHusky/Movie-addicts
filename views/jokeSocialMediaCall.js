let jokeSocialMediaCall={
	init:function(options={root:"body",addModal2Root:true}) {
		//console.groupCollapsed('init');
		this.initDone=true;
		this.modal="";
		this.root={id:'',dom:'',jquery:''};
		//this.statusLog={inputError:[]};
		this.buttonsList;
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
			if(options.addModal2Root){
				this.addModal2Root(options.addModal2Root);
				if(options.addEvents){
					this.addEvents();
				}
			}
		}
		
		//console.groupEnd();
	},
	addModal2Root:function(options={}) {
		//generates and appends the modal html elements to the rootdoom
		//console.groupCollapsed('addModal2Root');
		if(!this.initDone)this.init();
		if(!(typeof options === 'object')){options={}};
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
		}
		//console.log('root=',this.root);
		this.modal= new Modal({root:this.root.id});
		if(!options.addSkip){
			this.modal.addModal2Root(options.modal);
		}
		//console.groupEnd();
	},
	addEvents:function(){
		//console.groupCollapsed('addEvents');
		if(!this.initDone)this.init();
		//console.groupCollapsed('4Buttons');
		this.buttonsList=document.querySelectorAll('.jokesocialmediacall');
		//let listToAdd=['facebook','instagram','twitch','twitter','youtube'];
		let me=this;
		this.buttonsList.forEach(function(element,i){
			element.addEventListener("click", function(event){
				event.preventDefault();
				//console.groupCollapsed('click');
				//console.log('element=',element);
				//let element_has="";
				/*OPTIONAL : if we want them to have different title or body based on listToAdd
				listToAdd.forEach(function(x,i){
					let classC=element.classList;
					//console.log('classC=',classC);
					classC.forEach(function(y,j){
						if(y.includes(x)) {
							element_has=x;
						}
					});
				});*/
				//if(!element_has){
					me.modal.setElement([{selector:".modal-title", task:"inner", value:"Opps."},{selector:".modal-body", task:"inner", value:"Would open the page if there was any to open. :3"}]);
				//}
				me.showModal();
				//console.groupEnd();
			});
		});
		//console.groupEnd();
		//console.groupEnd();
	},
	showModal:function(){
		if(!this.initDone)this.init();
		this.modal.show();
	},
	hideModal:function(){
		if(!this.initDone)this.init();
		this.modal.hide();
	}

}