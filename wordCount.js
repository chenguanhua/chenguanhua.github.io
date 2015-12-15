
var WINDOW_WIDTH=512;
var WINDOW_HEIGHT=384;
var canvas,ctx;

var trainingData;
var testingData;
var trainingDataCombined;
var testingDataCombined;

window.onload=function(){
		//obtain canvas parameters
		canvas = document.getElementById('wordle');
		ctx = canvas.getContext("2d");

		canvas.width = WINDOW_WIDTH;
		canvas.height = WINDOW_HEIGHT;
		
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
		
		trainingDataCombined=prepareData(trainingData);
		testingDataCombined=prepareData(testingData);
		
		teachAs(trainingDataCombined);
		
		$('#wordCount, #wordle').hide();
		
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
	
function beginCount(){
		
		if($('#selectText').val()==null){
			alert("Please load data before you count!");
			return;
		}else if($('#selectText').val()=="testing"){
			var str=testingDataCombined[$('#selectText').val()];
		}else{
			var str=trainingDataCombined[$('#selectText').val()];
		}
		
		//calculate word frequency and display
		stemWord=false;
		deleteCommonWord=true;
		$('#wordCount').html(JSON.stringify(wordFrequency(str).sort(function(a,b){return b[1]-a[1]})).split("],").join("]<br/>"));
		
		//preparing wordle
		ctx.clearRect(0,0,canvas.width,canvas.height);
		var elemCount=0;
		$("#wordle3d #container").empty();
		newArray.forEach(function(obj){
		  if(elemCount<30){
			  ctx.save();
				ctx.font=Math.log(obj[1])/Math.log(3)*10+"px Arial";
				ctx.fillStyle = getRandomColor(obj[1]);
				ctx.textAlign = "center";
				ctx.fillText(obj[0],Math.random()*(WINDOW_WIDTH-100)+50,Math.random()*(WINDOW_HEIGHT-100)+50);
			  ctx.restore();
			  elemCount++;
			  
			  if(elemCount<11){
				var tempColor="red";
			  }else if(elemCount>=11 && elemCount<21){
				var tempColor="blue";
			  }else{
			    var tempColor="green";
			  }
			  var tempDiv=$("<div>"+obj[0]+"<br>"+obj[1]+"</div>").css({
				'font-size':'3vw',
				'text-align':'center',
				'border': '2px solid '+getRandomColor(),
				'background':'rgba(233,233,233,0.5)',
				'color':tempColor
			  }).hover(function() {
				$(this).css({'transform': 'scale(1.2)',
							 'box-shadow':10+'px '+10+'px '+ 15+'px #CCC',
							 'z-index':2});
				}, function() {
					initWordle($(this));
				});
			  $("#wordle3d #container").append(initWordle(tempDiv));

		  }
		});	
	}
	
	function getRandomColor() {
		return "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.random()+")";
	}
	
function beginTesting(){
		if(jQuery.isEmptyObject(testingData)){
			alert("Testing data is empty!");
			return;
		}
		//alert(guess(testingDataCombined["testing"]));
		Alert.render(guess(testingDataCombined["testing"]));
	}
	
		$('#wordle3d #container div').hover(function() {
			$(this).css({'transform': 'scale(1.2)',
						 'box-shadow':10+'px '+10+'px '+ 15+'px #CCC',
						 'z-index':2});
		}, function() {
			initWordle($(this));
		});
		
		function initWordle(ui){
			var x=Math.random()*($('#container').width()/1.5)+$('#container').width()/10;
			var y=Math.random()*($('#container').height()/1.5)+$('#container').height()/10;
			var z=(Math.random()*1200-1000);
			//var x=400,y=300;
			ui.css({ 'left': x + 'px', 
							  'top': y+ 'px', 
							  'transform': 'translateZ(' +z + 'px)',
							  'width':256+'px',
							  'padding':10+'px '+10+'px '+ 15 +'px',
							  'box-shadow':'none',
							  'transition':0.5+'s',
							  'z-index':1});
			return ui;
		}