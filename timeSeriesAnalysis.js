var trainingData;
var testingData;

var timeInterval=10;
var dates=[];
var separatedData={};
var timeseriesdata={};

var visData={};
visData["columns"]=[];

window.onload=function(){
	//prepare data to be processed
		trainingData = JSON.parse(window.localStorage.getItem("trainingSet"));
		testingData=JSON.parse(window.localStorage.getItem("testingSet"));
		
		$('#selectText').empty();
		if(jQuery.isEmptyObject(trainingData)!=true){
			$.each(trainingData, function(key, value) {
				$('#selectText').append($('<option>', {
					text: key
				}));
			});
		}
		if(jQuery.isEmptyObject(testingData)!=true){
			$.each(testingData, function(key, value) {
				$('#selectText').append($('<option>', {
					text: key
				}));
			});
		}
		
		$('.demo').sidr({
		  name: 'sidr', // Name for the sidr. Default: 'sidr'
		  speed: 200, // How long the animation will run. Default: 200
		  side: 'left', // Left or right, the location for the sidebar. Default: 'left'
		  source: null, // A jQuery selector, an url or a callback function.
		  renaming: true, // When filling the sidr with existing content, choose to rename or not the classes and ids.
		  body: 'body' // For doing the page movement the 'body' element is animated by default, you can select another element to animate with this option.
		});
		
		$('#expandedMenu').click();
		
		$('#initialMenu').hide();
}

function beginTimeSeriesAnalysis(){
	visData["columns"]=[];
	var tempObject={};
	var cls=$('#selectText').val();
	if(cls=="testing"){
		tempObject=testingData[cls];
	}else{
		tempObject=trainingData[cls];
	}
	separatedData=separateDataByDate(tempObject);
	beginTimeSeriesAnalysisOfaDay();
}

function separateDataByDate(tempObject){
	var separated={};
	dates=[];
	var tempCls;
	$.each(tempObject, function(key, value) {
		var splitTimestamp = key.split(' ');
		if(dates.indexOf(splitTimestamp[0])<0){
			dates.push(splitTimestamp[0]);
			tempCls=splitTimestamp[0];
			separated[tempCls]={};
		}
		var date = new Date(splitTimestamp[0] + 'T' + splitTimestamp[1]);
		separated[tempCls][date.getTime()]=value;
	});
	return separated;
}

function beginTimeSeriesAnalysisOfaDay(){
	timeInterval = prompt("Please specify time interval (in minutes)");
	//var cls=$('#selectDate').val();
	if(timeInterval==""){timeInterval=0.1;}
	
	for(var index in dates){
		var cls=dates[index];
		var tempObject=separatedData[cls];
		timeseriesdata=combineDataBasedOnTimeInterval(tempObject);
		var tempList=[];
		tempList.push(cls);
		$.each(timeseriesdata, function(key, value) {
			stemWord=false;
			deleteCommonWord=false;
			var tempArray=wordFrequency(value);
			var sum=0;
			for(var word in tempArray){
				sum+=tempArray[word][1];
			}
			tempList.push(sum);
		});
		visData["columns"].push(tempList);
	}
	draw(visData);
}

function combineDataBasedOnTimeInterval(tempObject){
	var separatedByTimeInterval={};
	var tempCls=0;
	var timestamp=Object.keys(tempObject)[0];
	separatedByTimeInterval[tempCls]="";
	$.each(tempObject, function(key, value) {
		if((key-timestamp)>timeInterval*60*1000){
			tempCls++;
			separatedByTimeInterval[tempCls]="";
			timestamp=key;
		}
		separatedByTimeInterval[tempCls]=separatedByTimeInterval[tempCls]+" "+value;
	});
	return separatedByTimeInterval;
}

function draw(data){
	var chart = c3.generate({
		bindto: '#chart',
		data: data
	});
}








