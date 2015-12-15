// most common words in English (https://en.wikipedia.org/wiki/Most_common_words_in_English)
const COMMON_WORDS = ("the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us").split(" ");

var newArray = [];
var stemWord=false;
var deleteCommonWord=true;
var Alert = new CustomAlert();

function loadDataToPage(){
	str("testingSet",testingSet);
	str("trainingSet",trainingSet);
}

function str(name,data){
	window.localStorage.setItem(name, JSON.stringify(data));
}

function prepareData(data){
	var dataCombined=data;+
	$.each(data, function(key, value) {
		if(typeof value=="string"){return false;}
		if(Object.keys(data[key]).length>=1){
			var str="";
			$.each(data[key], function(k, v) {
				str=str+" "+data[key][k];
			});
			dataCombined[key]=str;
		}
	});
	return dataCombined;
}

function wordFrequency(txt){
	  newArray=[];
	  txt = txt.toLowerCase();
	  txt=txt.replace(/[^a-zA-Z]/g,' ');
	  txt = txt.replace(/\s+/g,' '); // replace white space runs with a single one.
	  var wordArray = txt.replace(/\W+/g, " ").split(" ");
	  var wordObj, temp, common;
	  wordArray.forEach(function (word) {
		common=false;
		if(deleteCommonWord){
			for (var cw = 0; cw < COMMON_WORDS.length; cw++) {
				if (COMMON_WORDS[cw] == word) {
				  common = true;
				  break;
				}
			}
		}
		if(!common){
			if(stemWord){
				word=stemmer(word,true);
			}
			wordObj = newArray.filter(function (w){
			  return w[0] == word;
			});
			if (wordObj.length) {
			  wordObj[0][1] += 1;
			} else {
			  newArray.push([word,1]);
			}
		}
	  });
	  stemWord=false;
	  deleteCommonWord=true;
	  return newArray;
	}

function CustomAlert(){
    this.render = function(dialog){
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH+"px";
        dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
		dialogbox.style.zIndex=1000000;
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
    }
	this.ok = function(){
		document.getElementById('dialogbox').style.display = "none";
		document.getElementById('dialogoverlay').style.display = "none";
	}
}

function toggleMenu(objName){
		if(objName=="initialMenu"){
			$('#initialMenu').hide();
		}else{
			$('#initialMenu').show();
		}
}


	