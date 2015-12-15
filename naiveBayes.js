
// punctuation I want stripped from all text.  I'm taking the easy road at this point and assuming everything I come
// across will be 7-bit ascii.
const SYMBOLS = "!@#$%^&*()-+_=[]{}\\|;':\",.<>/?~`";

const VERY_UNLIKELY = 0.0000000001;

// There are two ways to compute joint probability. The easy way is to use the product of individual probabilities.
// The problem with this approach is that for large texts, probability tends towards extremely small values (think of
// 0.01 * 0.01 * 0.01.  The solution is to use the sum of the logarithms of the probabilities.  No chance of underflow,
// but it has the disadvange of making the normalization that takes place at the end of all class calculations kind of
// hairy and unintuitive.
const USE_LOGS = true;

function Bayes() {}
Bayes.prototype = {
  constructor : Bayes,

  // these next two structures are related to each other and simplify lookups when computing probabilities.

  // stores information relating to how many times a word has recieved a specific classification.
  words : {},
  // stores information relating to how many times a classification has been assigned to a specific word.
  classes : {__length:0},

  // learn a word. This is where the statisical information is noted.
  teach : function(wrdArray, cls) {
	if (typeof(this.classes[cls]) == "undefined")
      this.classes[cls] = {__length:0};
    if (typeof(this.classes[cls][wrdArray[0]]) == "undefined")
      this.classes[cls][wrdArray[0]] = 0;
    this.classes[cls][wrdArray[0]]+=wrdArray[1];
    this.classes[cls].__length+=wrdArray[1];
    this.classes.__length+=wrdArray[1];
  },

  // p(C|D). Take a set of unseen words and compute a probibility that the document belongs to the supplied class.
  probabilityOfClassGivenDocument : function(cls, testingTokensAndFreqs) {
    var prob = 1;
    if (USE_LOGS) prob = 0;
    for (var i in testingTokensAndFreqs) {
	  if(this.classes[cls][testingTokensAndFreqs[i][0]]==undefined){
		var temp=0;
	  }else{
		var temp=this.classes[cls][testingTokensAndFreqs[i][0]];
	  }
	  var alpha=VERY_UNLIKELY;
      var p = (temp+alpha)/(this.classes[cls].__length+Object.keys(this.classes[cls]).length-alpha);
      if (USE_LOGS)
        prob += Math.log(p);
      else
        prob *= p;
    }
    if (USE_LOGS)
      prob += Math.log(this.probabilityOfClass(cls));
    else
      prob *= this.probabilityOfClass(cls);
    return prob;
  },

  // p(C)
  probabilityOfClass: function(cls) {
    var pc = this.classes[cls].__length / this.classes.__length;
    return pc;
  },

};

var bayes = new Bayes();

// grabs text from a certain field and classifies it.
function guess(testingNotesCombined) {
  //stemWord=true;
  //deleteCommonWord=true;
  var testingTokensAndFreqs=wordFrequency(testingNotesCombined);
  var probs = new Array();
  var probSum = 0;
  for (var cls in bayes.classes) {
    if (cls == "__length") continue;
    var prob = bayes.probabilityOfClassGivenDocument(cls, testingTokensAndFreqs);
    probSum += prob;
    probs[probs.length] = {
      classification : cls,
      probability : prob,
      pc : bayes.probabilityOfClass(cls)
    };
  }
  
  // sort them highest first.
  probs.sort(function(a, b) {
    return b.probability - a.probability;
  });
  // convert to a pretty string.
  var str = "";
  for (var i = 0; i < probs.length; i++)
    //str += probs[i].classification + "(" + probs[i].probability + ")>";
	if (i==0){
		str += "This document seems most likely to belong to: " +probs[i].classification + "(" + probs[i].probability.toFixed(2) + "),<br>";
	}else if(i==probs.length-1){
		str+="and least likely to belong to:"+probs[i].classification + "(" + probs[i].probability.toFixed(2) + ").";
	}else{
		str+="and then: "+probs[i].classification + "(" + probs[i].probability.toFixed(2) + "),<br>";
	}
  return str;
}

// teach the bayes engine.
function teachAs(classesToNotesCombined) {
	bayes.classes={__length:0};
	for(var cls in classesToNotesCombined){
		doc=classesToNotesCombined[cls];
		var tokensAndFreqs=wordFrequency(doc);
		for (var i in tokensAndFreqs)
			bayes.teach(tokensAndFreqs[i], cls);
	}
	/*
	var tokensAndFreqs=new Array();
	var cls="clsTest";
		doc=$('#textInput').val();
		tokensAndFreqs=wordFrequency(doc);
		for (var i in tokensAndFreqs)
			bayes.teach(tokensAndFreqs[i], cls);
	*/
}


