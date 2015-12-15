var trainingData;
var testingData;
var trainingDataCombined;
var testingDataCombined;

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
		
		trainingDataCombined=prepareData(trainingData);
		testingDataCombined=prepareData(testingData);
		
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

function beginSentimentAnalysis(){
	var totalValence=0;
	var numOfWords=0;
	deleteCommonWord=false;
	
	if($('#selectText').val()==null){
			alert("Please load data before you count!");
			return;
		}else if($('#selectText').val()=="testing"){
			var str=testingDataCombined[$('#selectText').val()];
		}else{
			var str=trainingDataCombined[$('#selectText').val()];
		}
		
	var wordsAndFreq_sentiment=wordFrequency(str);
	for (var i in wordsAndFreq_sentiment){
		if(wordsAndFreq_sentiment[i][0] in wordSentiment){
			totalValence+=wordSentiment[wordsAndFreq_sentiment[i][0]]*wordsAndFreq_sentiment[i][1];
			numOfWords+=wordsAndFreq_sentiment[i][1];
		}else{
			if(stemmer(wordsAndFreq_sentiment[i][0],true) in stemmedWordSentiment){
				totalValence+=stemmedWordSentiment[stemmer(wordsAndFreq_sentiment[i][0],true)]*wordsAndFreq_sentiment[i][1];
				numOfWords+=wordsAndFreq_sentiment[i][1];
			}else{
				totalValence+=5*wordsAndFreq_sentiment[i][1];
				numOfWords+=wordsAndFreq_sentiment[i][1];
			}
		}
	}
	search(str);
	//alert("The average affective value of the document is:\n" + (totalValence/numOfWords).toFixed(2) + "\n(>5.30: positive\n5.30-5.20: moderately positive or neutral\n5.20-5.00: moderately negative orneutral\n<5.00: negative)");
	Alert.render("The average affective value of the document is:<br>" + (totalValence/numOfWords).toFixed(2) + "<br>(>5.30: positive\n5.30-5.20: moderately positive or neutral<br>5.20-5.00: moderately negative or neutral<br><5.00: negative)");
	
}

function search(searchInput) {
		var sa = new SentimentAnalysis(),
		totalPosScoreEl = document.getElementById('totalPosScore'),
		totalNegScoreEl = document.getElementById('totalNegScore');
		
		sa.sa(searchInput, function(totalPosScore, totalNegScore) {
			console.log("totalPosScore: " + totalPosScore + ", totalNegScore: " + totalNegScore);
			var sum=totalNegScore+totalPosScore;
			totalPosScoreEl.width = totalPosScore / sum*1000;
			totalNegScoreEl.width = totalNegScore / sum*1000;
			$('#totalPosScoreDiv span:first').html("Pos: ");
			$('#totalNegScoreDiv span:first').html("Neg: ");
			$('#totalPosScoreDiv span:last').html(totalPosScore.toFixed(2));
			$('#totalNegScoreDiv span:last').html(totalNegScore.toFixed(2));
		});
		
	}

	var SentimentAnalysis = (function() {
		
		// Constructor
		function SentimentAnalysis() {
			
		}
		
		SentimentAnalysis.prototype = {
			
			sa: function(text, callback) {
				
				text = text.replace(new RegExp("([0-9\\W_]+)", "g"), " ").replace(new RegExp("[\\s\\n\\r\\t\\f\\v\\0 ]+", "g"), " ").toLowerCase();
				//console.log(text);
				var words = text.split(' '),
				
				totalPosScore = 0,
				totalNegScore = 0,
				cacheScore = {},
				regexNot = new RegExp(".*(?:not|n't)");
				
				for(var i = 0, leni = words.length; i < leni; i++) {
					
					var word = words[i],
					regexWord = new RegExp("[ \"]" + word + ".*?#");
					
					if(word==""){continue;}
					
					if(cacheScore[word] === undefined) {
						for(var j = 0, lenj = sentiWordNet.length; j < lenj; j++) {
							var senti = sentiWordNet[j];
							if(senti.SynsetTerms.match(regexWord)) {
								if(cacheScore[word] !== undefined) {
									cacheScore[word] = { PosScore: parseFloat(cacheScore[word].PosScore + senti.PosScore), NegScore: parseFloat(cacheScore[word].NegScore + senti.NegScore)};
								}
								else {
									cacheScore[word] = { PosScore: senti.PosScore, NegScore: senti.NegScore};
								}
							}
						}
					}
					if(cacheScore[word] !== undefined) {
						if(words[i - 1] && words[i - 1].match(regexNot)) {
							totalPosScore = totalPosScore + parseFloat(cacheScore[word].NegScore);
							totalNegScore = totalNegScore + parseFloat(cacheScore[word].PosScore);
						}
						else {
							totalPosScore = totalPosScore + parseFloat(cacheScore[word].PosScore);
							totalNegScore = totalNegScore + parseFloat(cacheScore[word].NegScore);
						}
					}
						
				}
				
				callback(totalPosScore, totalNegScore);
				
			}
			
		};
		
		return SentimentAnalysis;
		
	})();