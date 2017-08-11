var LogParser={
    set value(v) {
        LogParser.restartCount = 0;
		LogParser.parsedlogs=logParser(v);
		x="";
		LogParser.parsedlogs.forEach(function(vv){x+=vv.join("\n")+"\n"});
		document.querySelector("#parsedlogs").value=x;
		document.querySelector("#systeminfo").value=LogParser.parsedlogs.system.join("\n");
		console.log("done");
	}
};
function logParser(logs){
	var logObj=[];
	Object.defineProperty(logObj,"system",{value:[],writable:true,enumerable:false,configurable:true});
	var session=/\d{6}/;
	logs.split("\n").forEach(insertIntoObj);
	return logObj;
	
	function insertIntoObj(line){
		m=line.match(session);
		if(m){
			m=Number(m[0])+LogParser.restartCount*1000000;
			if(!logObj[m])logObj[m]=[];
			logObj[m].push(line);
		} else {
		    if (line.indexOf("Starting FTP Server") == -1) LogParser.restartCount++;
			logObj.system.push(line);
		}
	}
}

function Filter(){
	var user=document.querySelector("#user").value;
	var remoteip=document.querySelector("#remote_ip").value;
	var localip=document.querySelector("#local_ip").value;
	var result="";
	var check;
	LogParser.parsedlogs.forEach(function(v,i){
		check=true;
		if(user)check=check&&v.length>1&&(v[1].indexOf("USER "+user)!=-1||(v[2]&&v[2].indexOf("USER "+user)!=-1));
		if(remoteip)check=check&&(v[0].indexOf("Connected to "+remoteip+" ")!=-1);
		if(localip)check=check&&(v[0].indexOf("Local address "+localip+")")!=-1);
		if(check)result+=v.join("\n")+"\n";
		
	});
	document.querySelector("#parsedlogs").value=result;
	
}

function file2Date(filename){
    //filename="servU_20150722.log";
	r=filename.match(/(\d\d\d\d)(\d\d)(\d\d)/);
	return((new Date(r[1],r[2]-1,r[3])).toLocaleDateString('en-GB', {year: '2-digit', weekday: 'short', month: 'short', day: '2-digit' }).replace(/\s/g,"").replace(","," "));
}

function filereader(files,obj){
	var reader=new FileReader();
	reader.readAsText(files[0]);
	reader.onload = function (e) {
		obj.value=reader.result;
	}
	reader.onerror=function(){alert("error");}
	reader.onabort=function(){alert("abort");}
}
