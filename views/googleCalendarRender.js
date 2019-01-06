let googleCalendarRender={
	init:function(options={}) {
		console.groupCollapsed('init');
		this.modal="";
		this.root={id:'',dom:'',jquery:''};
		this.statusLog={inputError:[]};
		this.buttonsList;
		if(options.root){
			this.root.id = options.root;
			if(this.root.id){
				this.root.dom=document.getElementById(this.root.id);
				this.root.jquery=$('#'+this.root.id); 
			}
			if(options.addModal2Root){
				this.addModal2Root(options.addModal2Root);
				this.modal.modal.dom.querySelector(".modal-header").style.display="none";
				this.modal.modal.dom.querySelector(".modal-content").classList.add("modal-lg");
				this.modal.setElement([{selector:".modal-title", task:"inner", value:"Calendar"},{selector:".modal-body", task:"inner", value:`<iframe src="https://calendar.google.com/calendar/embed?src=en.romanian%23holiday%40group.v.calendar.google.com&ctz=Europe%2FBucharest" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>`}]);
			}
		}
		console.groupEnd();
	},
	addModal2Root:function(options={}) {
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
		this.modal= new Modal({root:this.root.id});
		if(!options.addSkip){
			this.modal.addModal2Root(options.modal);
		}
		console.groupEnd();
	},
	showModal:function(){
		this.modal.show();
	},
	hideModal:function(){
		this.modal.hide();
	}

}