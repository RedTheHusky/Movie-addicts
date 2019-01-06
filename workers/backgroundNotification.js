/*Worker for background notification
This will periodically check if movies database has changed 
if it did change based from the information it gathered it will trigger the host tread to update its movies or movie display
*/
let timerForJoke={mcycle:60000,obj:'',mfire:60000, mcount:0}; //this is 900000 ms == 15 minutes
let notificationList=[];
let defaultNotificationData={icon:"../static/32396-popcorn-icon.png",body:"Hi",title:"Movie addicts",autoClose:true,timer:4000}
let stats={
	received:0, sent:0,
	timer:{start:0,stop:0,mcycle:0,mfire:0},
	xhttp:{calls:0, success:0, failure:0},
	called:{notification:0,timer:0}
};

self.onmessage = function (msg) {
    console.groupCollapsed('onmessage');
	console.log("msg=",msg);
		stats.received++;

		if(msg.data.notification){
			console.log('we got notification');
			stats.called.notification++;
			console.log("value=",msg.data.notification);
			buildNotification(msg.data.notification);
		}
		if(msg.data.defaultNotificationData){
			console.log('we got defaultNotificationData');
			stats.called.defaultNotificationData++;
			console.log("value=",msg.data.defaultNotificationData);
			defaultNotificationData=msg.data.defaultNotificationData;
		}
		//timer
		if(msg.data.timer){
			console.log('we got timer4Check');
			console.log("value=",msg.data.timer4Check);
			if(msg.data.timer.command==="start"){
				console.log('we got timer4Start');
				stats.called.timer.start++;
				startTimerInterval();
			}else
			if(msg.data.timer.command==="stop"){
				console.log('we got timer4Stop');
				stats.called.timer.stop++;
				stopTimerInterval();
			}
			if(msg.data.timer.mcycle){
				console.log('we got timer4Mcycle');
				stats.called.timer.mcycle++;
				console.log("value=",msg.data.timer.mcycle);
				stats.called.timer4Check++;
				timerForJoke.mcycle=msg.data.timer.mcycle;
			}
			if(msg.data.timer.mfire){
				console.log('we got timer4Mfire');
				stats.called.timer.mfire++;
				console.log("value=",msg.data.timer.mfire);
				stats.called.timer4Check++;
				timerForJoke.mfire=msg.data.timer.mfire;
			}
		}
		
		//get
		if(msg.data.get){
			console.log('we got get');
			console.log("value=",msg.data.get);
			if(msg.data.get==="stats"){
				reply({stats:stats,timer:timerForJoke});
			}
		}
	console.groupEnd();   
}
function buildNotification(data={}) {
	console.groupCollapsed('buildNotification');
	console.log('data=',data);
	console.log('defaultNotificationData=',defaultNotificationData);
	for (var k in defaultNotificationData){
		if(!data[k]){data[k]=defaultNotificationData[k];}
	};
	let options={};
	for (var k in data){
		if(k.toLowerCase!="title"){options[k]=data[k];}
	};
	console.log('data=',data);
	console.log('options=',options);
	/*if (!("Notification" in window)) {
		console.warn("This browser does not support desktop notification");
	}else */
	if (Notification.permission === "granted") {
		var n = new Notification(data.title,options);
		notificationList.push(n);
		setTimeout(n.close.bind(n),data.timer);
	}else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function (permission) {
			if (permission === "granted") {
				var n = new Notification(data.title,options);
				notificationList.push(n);
				setTimeout(n.close.bind(n), data.timer);
			}
		});
	}
	console.groupEnd();
}
function startTimerInterval(){
	console.groupCollapsed('startTimerInterval');
	if(timerForJoke['obj']){
		console.log('removing old');
		clearInterval(timerForJoke['obj']);
		timerForJoke['obj']='';
	}
	console.log('adding new');
	timerForJoke.mcount=0;
	timerForJoke['obj']=setInterval(doAjaxJoke, timerForJoke['mcycle']);
	console.groupEnd();
}
function stopTimerInterval(){
	console.groupCollapsed('stopTimerInterval');
	if(timerForJoke['obj']){
		console.log('removing ');
		clearInterval(timerForJoke['obj']);
		timerForJoke['obj']='';
	}
	console.groupEnd();
}

function doAjaxJoke(){
	console.groupCollapsed('doAjaxJoke');
	timerForJoke.mcount+=timerForJoke.mcycle;
	if(timerForJoke.mcount<timerForJoke.mfire){
		console.log('waiting:',timerForJoke.mcount,'/',timerForJoke.mfire);
		console.groupEnd();
		return;
	}
	timerForJoke.mcount=0;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log("response=",xhttp.responseText);
			stats.xhttp.success++;
			var obj = JSON.parse(xhttp.responseText);
			console.log("response=",obj);
			if(typeof obj === "object"){
				var text=obj.attachments[0].text;
				console.log("text=",text);
				buildNotification({body:text});
			}
		}else 
		if (this.readyState == 4 && this.status !=200) {
			console.warn("Unexpected result");
			stats.xhttp.failure++;
		}
	};
	xhttp.open("GET","https://icanhazdadjoke.com/slack", true);
	stats.xhttp.calls++;
	xhttp.send();
	console.groupEnd();
}

function reply(obj={none:'none'}) {
	console.groupCollapsed('reply');
	console.log("obj=",obj);
    if (obj) { 
		stats.sent++;
		console.groupEnd();
        postMessage(obj);
    }else{
		console.groupEnd();
	} 
}