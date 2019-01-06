let notificationPopUp={
	init:function(options={}) {
		console.groupCollapsed('init');
		this.defaultNotificationData={icon:"../static/32396-popcorn-icon.png",body:"Hi",title:"Movie addicts",autoClose:true,timer:4000}
		this.permission="";
		this.called=0;
		this.list=[];
		console.groupEnd();
	},
	setDefault:function(options={}) {
		console.groupCollapsed('setDefault');
		console.log("old=",this.defaultNotificationData);
		this.defaultNotificationData=options;
		console.log("new=",this.defaultNotificationData);
		console.groupEnd();
	},
	post:function(data={}) {
		console.groupCollapsed('post');
		if (!("Notification" in window)) {
			console.warn("This browser does not support desktop notification");
			console.groupEnd();
			return;
		}
		this.called++;
		console.log('data=',data);
		console.log('defaultNotificationData=',this.defaultNotificationData);
		for (var k in this.defaultNotificationData){
			if(!data[k]){data[k]=this.defaultNotificationData[k];}
		};
		let options={};
		for (var k in data){
			if(k.toLowerCase!="title"){options[k]=data[k];}
		};
		console.log('data=',data);
		console.log('options=',options);
		let me=this;
		this.permission=Notification.permission;
		if (Notification.permission === "granted") {
			var n = new Notification(data.title,options);
			//me.list.push(n);
			setTimeout(n.close.bind(n),data.timer);
		}else if (Notification.permission !== "denied") {
			if(Notification.requestPermission){
				Notification.requestPermission().then(function (permission) {
					me.permission=permission;
					if (permission === "granted") {
						var n = new Notification(data.title,options);
						//me.list.push(n);
						setTimeout(n.close.bind(n), data.timer);
					}
				});
			}
		}
		console.groupEnd();
	}
}
