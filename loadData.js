 'use strict';
	
	var JsonObj=null;
	var notes=new Object();
	var testingSet=new Object();
	var trainingSet;
	var classesToNotes=new Object();
	var classesToNotesCombined=new Object();
	var testingNotesCombined=new String();
	
	window.onload=function(){
	//prepare data to be processed
		if(JSON.parse(window.localStorage.getItem("trainingSet"))!=null){
			trainingSet = JSON.parse(window.localStorage.getItem("trainingSet"));
			$('#trainingDocs').children().first().hide();
		}
		if(JSON.parse(window.localStorage.getItem("testingSet"))!=null){
			testingSet=JSON.parse(window.localStorage.getItem("testingSet"));
		}
		if(jQuery.isEmptyObject(trainingSet)==false){
			for(var item in trainingSet){
				$('#trainingDocs').append("<li>"+item+"</li>");
			}
		}
		if(jQuery.isEmptyObject(testingSet)==false){
			$('#testingDocs').empty();
			$('#testingDocs').append("<li>Testing files are ready!</li>");
		}
		
		var cw = $('#introMenu').height();
			$('#introMenu').css({'width':cw+'px'});
			$('#introContent').css({'width':$('#intro').width()-cw+'px','left':cw+'px'});
			
			$('.hover').hover(function(){
				$(this).addClass('flip');
			},function(){
				$(this).removeClass('flip');
			});
			
			$('#wrap').children().draggable({
				containment:'#wrap',
				snap:true
			});
	}
	
	function openFromDisk() {
		var fileInput = document.getElementById('invisible_file_dialog');
		fileInput.click();
	}
	
	//open file from disk
	var openFile = function(evt) {
		var files = evt.target.files; // FileList object
		if (files) {
			notes={};
			for (var i=0;i<files.length; i++) {
				var f=files[i];
				var reader = new FileReader();

				reader.onload = (function(theFile) {
					return function(e) {
						//get rid of unexpected token in json and parse
						//JsonObj = JSON.parse(correctJson(e.target.result));
						JsonObj = JSON.parse(e.target.result);
						extractNotes(JsonObj);
						//console.log(JsonObj);
					};
				})(f);

				reader.readAsText(f);
			}   
		} else {
			 alert("Failed to load files"); 
		}
		
	}
	
	//extract texts from input json
	function extractNotes(data){
		var n = data.Activities.length;

		for (var i = 0; i < n; i++) {
			var record = data.Activities[i];
			for ( var p in record) {
				if (record.hasOwnProperty(p)) {
					if (p == 'Note') {
						notes[record["Timestamp"]]=record[p];
					}
				}
			}
		}
	}
	
	function beginLearning(){
		var cls;
		if($('#invisible_file_dialog').val()==""){
		    if($('#textInput').val()==""){
				alert("Please add learning data first!");
				return;
			}else{
				cls = prompt("Please assign class label to those files");
				if (cls==null){return;}
				if(cls=="testing"){
					testingSet["testing"]=$('#textInput').val();
				}else{
					classesToNotes[cls]=$('#textInput').val();
					classesToNotesCombined[cls]=$('#textInput').val();
					trainingSet=classesToNotes;
				}
			}
		}else{
			//ask user to assign class label to input data
			cls = prompt("Please assign class label to those files");
			if (cls==null){return;}
			if(cls=="testing"){
				testingSet["testing"]=notes;
			}else{
				classesToNotes[cls]=notes;
				trainingSet=classesToNotes;
			}
			classesToNotesCombined={};
			for(var clses in classesToNotes){
				for(var key in classesToNotes[clses]){
					if(classesToNotes[clses]==undefined){
						classesToNotes[clses]="";
					}
					classesToNotesCombined[clses]=classesToNotesCombined[clses]+" "+classesToNotes[clses][key];
				}
			}
		}
		if(cls=="testing"){
			$('#testingDocs').empty();
			$('#testingDocs').append("<li>Testing files are ready!</li>");
		}else{
			$('#trainingDocs').children().first().hide();
			$('#trainingDocs').append("<li>"+cls+"</li>");
		}
		var input=$('#invisible_file_dialog');
		input.replaceWith(input.val('').clone(true));
		notes={};
		$('#displayFiles').empty();
		$('#textInput').val('');
		//teachAs();
	}
	
	function resetData(){
		localStorage.clear();
		JsonObj=null;
		notes=new Object();
		testingSet=new Object();
		trainingSet={};
		classesToNotes=new Object();
		classesToNotesCombined=new Object();
		testingNotesCombined=new String();
		$('#displayFiles').empty();
		$('#textInput').val("");
		$('#trainingDocs').empty();
		$('#testingDocs').empty();
		$('#testingDocs').append("<li>No testing files exist!</li>");
		$('#trainingDocs').append("<li>No training files exist!</li>");
	}
	
	function correctJson(str){
		var splitPoint=str.indexOf('"Note":');
		var subStr=str.substring(splitPoint+7,str.length);
		subStr=subStr.replace(/\W+/g, " ");
		return str.substring(0,splitPoint+7)+'"'+subStr+'"}]}';
	}

	$( window ).resize(function() {
		var cw = $('#introMenu').height();
		$('#introMenu').css({'width':cw+'px'});
		$('#introContent').css({'width':$('#intro').width()-cw+'px','left':cw+'px'});
	});	
		
		$('#introMenu').children().hover(function(ev){
			switch(ev.currentTarget.id) {
				case "projectIntro":
					$('#cont').html('<p>In the "Word Analysis" module, you can generate an interactive '+
									'wordle with word frequencies of your input text and classify your '+
									'testing document based on naive Bayes method.<p>')
							  .css({'color':'rgb(2,102,200)'});
					$('#wcCard').addClass("flip");
					$('#cont p').css({'margin':'3%','padding':'3%'});
					break;
				case "modulesIntro":
					$('#cont').html('<p>In the "Sentiment Analysis" module, you can calculate the weighted average '+
									'sentiment score of your input text based on a word list with affective ratings '+
									'developed by <a href="http://crr.ugent.be/archives/1003">Warriner et al.</a> '+
									'as well as the total negative and positive ratings of the same document based on '+
									'the <a href="http://sentiwordnet.isti.cnr.it">sentiWordNet</a> list.<p>')
							  .css({'color':'rgb(249,1,1)'});
					$('#cont a').css({'color':'blue'});
					$('#cont p').css({'margin':'3%','padding':'3%'});
					$('#saCard').addClass("flip");
					break;
				case "processIntro":
					$('#cont').html('<p>In the "Time-series Analysis" module, you can generate a time-series '+
									'graph of the total word count of each specified time interval. '+
									'Please note that you need to load JSON files with appropriate timestamp '+
									'format in order to do the analysis.<p>')
							  .css({'color':'rgb(242,181,15)'});
					$('#cont p').css({'margin':'3%','padding':'3%'});
					$('#tsaCard').addClass("flip");
					break;
				case "developerIntro":
					$('#cont').html("<h1>Introduction</h1>"+
									"<p>This website is a project aiming at text data mining. On this website, "+ 
									"you can generate word frequency list and interactive wordle, do classification, explore "+
									"sentiments, and implement time-series analysis of your own text data.</p>"+
									"<p>This website is developed by <a href='http://ghchen.com'>Guanhua Chen</a>.</p>")
							.css({'color':'black'});
					$('#cont a').css({'color':'blue'});
					$('#cont p').css({'margin':'3%','padding':'3%'});
					break;
				default:
					break;
			}
		},function(){
			/*$('#cont').html("<h1>Introduction</h1>"+
							"<p>This website is a project aiming at text data mining. On this website, "+ 
							"you can generate word frequency list and interactive wordle, do classification, explore "+
							"sentiments, and implement time-series analysis of your own text data.</p>")
					  .css({'color':'black'});*/
			$('.card').removeClass("flip");
		});