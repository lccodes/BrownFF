//Updates the box
//Val is the new num, which is what to update
function updateBox(val, which) {
      document.getElementById(which).value= parseFloat(val)/100;
}
//Updates the slider
//Val is the new num, which is what to update
function updateBar(val, which) {
      document.getElementById(which).value=parseFloat(val)*100;
}

//See if the numbers sum to 1
function testSubmit(){
	var els = ["firstT", "secondT", "thirdT", "fourthT", "fifthT", "sixthT", "seventhT", "eighthT", "ninthT", "tenthT"];
	var tally1 = 0;
	var tally2 = 0;
	for(i = 0; i < 8; i++){
		tally1 += parseFloat(document.getElementById(els[i]).value);
		tally2 += parseFloat(document.getElementById(els[i]+'2').value);
	}
	var one = 1;
	if(tally1 == parseFloat(one) && tally2 == parseFloat(one)){
		submit();
	}
}
//What happens when they submit
function submit(){
	localStorage.survey = "true";
	var d = new Date();
	localStorage.complete = d.toString();
	//XMLHttp thing to submit the data
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("type=survey&username="+localStorage.username+"&results="+"|2.1:"+document.getElementById("firstT").value+
		"|2.2:"+document.getElementById("secondT").value+"|2.3:"+document.getElementById("thirdT").value+
		"|2.4:"+document.getElementById("fourthT").value+"|2.5:"+document.getElementById("fifthT").value+
		"|2.6:"+document.getElementById("sixthT").value+"|2.7:"+document.getElementById("seventhT").value+
		"|2.8:"+document.getElementById("eighthT").value+"|2.9:"+document.getElementById("ninthT").value+
		"|2.10:"+document.getElementById("tenthT").value+"|3.1:"+document.getElementById("firstT2").value+
		"|3.2:"+document.getElementById("secondT2").value+"|3.3:"+document.getElementById("thirdT2").value+
		"|3.4:"+document.getElementById("fourthT2").value+"|3.5:"+document.getElementById("fifthT2").value+
		"|3.6:"+document.getElementById("sixthT2").value+"|3.7:"+document.getElementById("seventhT2").value+
		"|3.8:"+document.getElementById("eighthT2").value+"|3.9:"+document.getElementById("ninthT2").value+
		"|3.10:"+document.getElementById("tenthT2").value);
	//Back home
	chrome.browserAction.setPopup({popup: "popup.html"});
	window.location.href="popup.html";
}
//Makes sure that it all sums to 1
function dataValidator(){
	var total = 0;
	var fir = false;
	var remEls = [document.getElementById("first"), document.getElementById("second"), 
		      document.getElementById("third"), document.getElementById("fourth"),document.getElementById("fifth"),
		      document.getElementById("sixth"), document.getElementById("seventh"),document.getElementById("eighth"),
		      document.getElementById("ninth"),document.getElementById("tenth")];
	var cremEls = [document.getElementById("firstT"), document.getElementById("secondT"), 
		      document.getElementById("thirdT"), document.getElementById("fourthT"),document.getElementById("fifthT"),
		      document.getElementById("sixthT"), document.getElementById("seventhT"),document.getElementById("eighthT"),
		      document.getElementById("ninthT"),document.getElementById("tenthT")];
	for(i=0;i<remEls.length;i++){
		total+= parseInt(remEls[i].value);
		if(total > 100 && !fir){
			var semi=0;
			for(x=0;x<i;x++){
				semi+= parseFloat(remEls[x].value);
			}
			remEls[i].value = (100 - semi);
			cremEls[i].value = (parseFloat(1 - semi/100)).toString();
			fir = true;
		}
		if(total >= 100){
			for(a=i+1;a<remEls.length;a++){
				remEls[a].value = 0;
				cremEls[a].value = "0";
			}
			return;
		}
	}
}

//Makes sure that it all sums to 1
//in the second graph
function dataValidatorTwo(){
	var total = 0;
	var fir = false;
	var remEls = [document.getElementById("first2"), document.getElementById("second2"), 
		      document.getElementById("third2"), document.getElementById("fourth2"),document.getElementById("fifth2"),
		      document.getElementById("sixth2"), document.getElementById("seventh2"),document.getElementById("eighth2"),
		      document.getElementById("ninth2"),document.getElementById("tenth2")];
	var cremEls = [document.getElementById("firstT2"), document.getElementById("secondT2"), 
		      document.getElementById("thirdT2"), document.getElementById("fourthT2"),document.getElementById("fifthT2"),
		      document.getElementById("sixthT2"), document.getElementById("seventhT2"),document.getElementById("eighthT2"),
		      document.getElementById("ninthT2"),document.getElementById("tenthT2")];
	for(i=0;i<remEls.length;i++){
		total+= parseInt(remEls[i].value);
		if(total > 100 && !fir){
			var semi=0;
			for(x=0;x<i;x++){
				semi+= parseFloat(remEls[x].value);
			}
			remEls[i].value = (100 - semi);
			cremEls[i].value = (parseFloat(1 - semi/100)).toString();
			fir = true;
		}
		if(total >= 100){
			for(a=i+1;a<remEls.length;a++){
				remEls[a].value = 0;
				cremEls[a].value = "0";
			}
			return;
		}
	}
}

//Bar graph function
function BarGraph(ctx) {

  // Private properties and methods
	
  var that = this;
  var startArr;
  var endArr;
  var looping = false;
		
  // Loop method adjusts the height of bar and redraws if neccessary
	var loop = function () {

	  var delta;
	  var animationComplete = true;

	  // Boolean to prevent update function from looping if already looping
	  looping = true;
	  
	  // For each bar
	  for (var i = 0; i < endArr.length; i += 1) {
		// Change the current bar height toward its target height
		delta = (endArr[i] - startArr[i]) / that.animationSteps;
		that.curArr[i] += delta;
		// If any change is made then flip a switch
		if (delta) {
		  animationComplete = false;
		}
	  }
	  // If no change was made to any bars then we are done
	  if (animationComplete) {
		looping = false;
	  } else {
		// Draw and call loop again
		draw(that.curArr);
		setTimeout(loop, that.animationInterval / that.animationSteps);
	  }
	};
		
  // Draw method updates the canvas with the current display
	var draw = function (arr) {
							
	  var numOfBars = arr.length;
	  var barWidth;
	  var barHeight;
	  var border = 2;
	  var ratio;
	  var maxBarHeight;
	  var gradient;
	  var largestValue;
	  var graphAreaX = 0;
	  var graphAreaY = 0;
	  var graphAreaWidth = that.width;
	  var graphAreaHeight = that.height;
	  var i;
	  
		// Update the dimensions of the canvas only if they have changed
	  if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
		ctx.canvas.width = that.width;
		ctx.canvas.height = that.height;
	  }
				
	  // Draw the background color
	  ctx.fillStyle = that.backgroundColor;
	  ctx.fillRect(0, 0, that.width, that.height);
					
	  // If x axis labels exist then make room	
	  if (that.xAxisLabelArr.length) {
		graphAreaHeight -= 40;
	  }
				
	  // Calculate dimensions of the bar
	  barWidth = graphAreaWidth / numOfBars - that.margin * 2;
	  maxBarHeight = graphAreaHeight - 25;
				
	  // Determine the largest value in the bar array
	  var largestValue = 0;
	  for (i = 0; i < arr.length; i += 1) {
		if (arr[i] > largestValue) {
		  largestValue = arr[i];	
		}
	  }
	  
	  // For each bar
	  for (i = 0; i < arr.length; i += 1) {
		// Set the ratio of current bar compared to the maximum
		if (that.maxValue) {
		  ratio = arr[i] / that.maxValue;
		} else {
		  ratio = arr[i] / largestValue;
		}
		
		barHeight = ratio * maxBarHeight;
	  
		// Turn on shadow
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "#999";
						
		// Draw bar background
		ctx.fillStyle = "#333";			
		ctx.fillRect(that.margin + i * that.width / numOfBars,
		  graphAreaHeight - barHeight,
		  barWidth,
		  barHeight);
			
		// Turn off shadow
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;

		// Draw bar color if it is large enough to be visible
		if (barHeight > border * 2) {
			// Create gradient
			gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
			gradient.addColorStop(1-ratio, that.colors[i % that.colors.length]);
			gradient.addColorStop(1, "#ffffff");

			ctx.fillStyle = gradient;
			// Fill rectangle with gradient
			ctx.fillRect(that.margin + i * that.width / numOfBars + border,
			  graphAreaHeight - barHeight + border,
			  barWidth - border * 2,
			  barHeight - border * 2);
		}

		// Write bar value
		ctx.fillStyle = "#333";
		ctx.font = "bold 12px sans-serif";
		ctx.textAlign = "center";
		// Use try / catch to stop IE 8 from going to error town
		try {
		  ctx.fillText(Math.round(arr[i]*100)/100,
			i * that.width / numOfBars + (that.width / numOfBars) / 2,
			graphAreaHeight - barHeight - 10);
		} catch (ex) {}
		// Draw bar label if it exists
		if (that.xAxisLabelArr[i]) {					
		  // Use try / catch to stop IE 8 from going to error town				
		  ctx.fillStyle = "#333";
		  ctx.font = "bold 12px sans-serif";
		  ctx.textAlign = "center";
		  try{
			ctx.fillText(that.xAxisLabelArr[i],
			  i * that.width / numOfBars + (that.width / numOfBars) / 2,
			  that.height - 10);
			} catch (ex) {}
		  }
		}
	  };

  // Public properties and methods
  this.width = 400;
  this.height = 150;	
  this.maxValue;
  this.margin = 5;
  this.colors = ["purple", "red", "green", "yellow"];
  this.curArr = [];
  this.backgroundColor = "#fff";
  this.xAxisLabelArr = ["Places in the league"];
  this.yAxisLabelArr = ["Probability that you get each place"];
  this.animationInterval = 100;
  this.animationSteps = 10;
	
  // Update method sets the end bar array and starts the animation
	this.update = function (newArr) {

	  // If length of target and current array is different 
	  if (that.curArr.length !== newArr.length) {
		that.curArr = newArr;
		draw(newArr);
	  } else {
		// Set the starting array to the current array
		startArr = that.curArr;
		// Set the target array to the new array
		endArr = newArr;
		// Animate from the start array to the end array
		if (!looping) {	
		  loop();
		}
	  }
	}; 
}//end bar graph

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("submit").onclick = testSubmit;
	//First graph
	document.getElementById("first").onchange = function(){updateBox(document.getElementById("first").value,'firstT');};
	document.getElementById("firstT").onchange = function(){updateBar(document.getElementById("firstT").value,'first');};
	//Second
	document.getElementById("second").onchange = function(){updateBox(document.getElementById("second").value,'secondT');};
	document.getElementById("secondT").onchange = function(){updateBar(document.getElementById("secondT").value,'second');};
	//Third
	document.getElementById("third").onchange = function(){updateBox(document.getElementById("third").value,'thirdT');};
	document.getElementById("thirdT").onchange = function(){updateBar(document.getElementById("thirdT").value,'third');};
	//Fourth
	document.getElementById("fourth").onchange = function(){updateBox(document.getElementById("fourth").value,'fourthT');};
	document.getElementById("fourthT").onchange = function(){updateBar(document.getElementById("fourthT").value,'fourth');};
	//Second
	document.getElementById("fifth").onchange = function(){updateBox(document.getElementById("fifth").value,'fifthT');};
	document.getElementById("fifthT").onchange = function(){updateBar(document.getElementById("fifthT").value,'fifth');};
	//Third
	document.getElementById("sixth").onchange = function(){updateBox(document.getElementById("sixth").value,'sixthT');};
	document.getElementById("sixthT").onchange = function(){updateBar(document.getElementById("sixthT").value,'sixth');};
	//Fourth
	document.getElementById("seventh").onchange = function(){updateBox(document.getElementById("seventh").value,'seventhT');};
	document.getElementById("seventhT").onchange = function(){updateBar(document.getElementById("seventhT").value,'seventh');};
	//Fourth
	document.getElementById("eighth").onchange = function(){updateBox(document.getElementById("eighth").value,'eighthT');};
	document.getElementById("eighthT").onchange = function(){updateBar(document.getElementById("eighthT").value,'eighth');};
	//Fifth
	document.getElementById("ninth").onchange = function(){updateBox(document.getElementById("ninth").value,'ninthT');};
	document.getElementById("ninthT").onchange = function(){updateBar(document.getElementById("ninthT").value,'ninth');};
	//Fifth
	document.getElementById("tenth").onchange = function(){updateBox(document.getElementById("tenth").value,'tenthT');};
	document.getElementById("tenthT").onchange = function(){updateBar(document.getElementById("tenthT").value,'tenth');};
	//
	//Second graph
	document.getElementById("first2").onchange = function(){updateBox(document.getElementById("first2").value,'firstT2');};
	document.getElementById("firstT2").onchange = function(){updateBar(document.getElementById("firstT2").value,'first2');};
	//Second
	document.getElementById("second2").onchange = function(){updateBox(document.getElementById("second2").value,'secondT2');};
	document.getElementById("secondT2").onchange = function(){updateBar(document.getElementById("secondT2").value,'second2');};
	//Third
	document.getElementById("third2").onchange = function(){updateBox(document.getElementById("third2").value,'thirdT2');};
	document.getElementById("thirdT2").onchange = function(){updateBar(document.getElementById("thirdT2").value,'third2');};
	//Fourth
	document.getElementById("fourth2").onchange = function(){updateBox(document.getElementById("fourth2").value,'fourthT2');};
	document.getElementById("fourthT2").onchange = function(){updateBar(document.getElementById("fourthT2").value,'fourth2');};
	//Second
	document.getElementById("fifth2").onchange = function(){updateBox(document.getElementById("fifth2").value,'fifthT2');};
	document.getElementById("fifthT2").onchange = function(){updateBar(document.getElementById("fifthT2").value,'fifth2');};
	//Third
	document.getElementById("sixth2").onchange = function(){updateBox(document.getElementById("sixth2").value,'sixthT2');};
	document.getElementById("sixthT2").onchange = function(){updateBar(document.getElementById("sixthT2").value,'sixth2');};
	//Fourth
	document.getElementById("seventh2").onchange = function(){updateBox(document.getElementById("seventh2").value,'seventhT2');};
	document.getElementById("seventhT2").onchange = function(){updateBar(document.getElementById("seventhT2").value,'seventh2');};
	//Fourth
	document.getElementById("eighth2").onchange = function(){updateBox(document.getElementById("eighth2").value,'eighthT2');};
	document.getElementById("eighthT2").onchange = function(){updateBar(document.getElementById("eighthT2").value,'eighth2');};
	//Fifth
	document.getElementById("ninth2").onchange = function(){updateBox(document.getElementById("ninth2").value,'ninthT2');};
	document.getElementById("ninthT2").onchange = function(){updateBar(document.getElementById("ninthT2").value,'ninth2');};
	//Fifth
	document.getElementById("tenth2").onchange = function(){updateBox(document.getElementById("tenth2").value,'tenthT2');};
	document.getElementById("tenthT2").onchange = function(){updateBar(document.getElementById("tenthT2").value,'tenth2');};
	(function () {
	
		function createCanvas(divName) {
			
			var div = document.getElementById(divName);
			var canvas = document.createElement('canvas');
			div.appendChild(canvas);
			if (typeof G_vmlCanvasManager != 'undefined') {
				canvas = G_vmlCanvasManager.initElement(canvas);
			}	
			var ctx = canvas.getContext("2d");
			return ctx;
		}
		
		var ctx = createCanvas("graphDiv1");
		var ctx2 = createCanvas("graphDiv2");
		//Graph 1
		var graph = new BarGraph(ctx);
		graph.maxValue = 1;
		graph.margin = 2;
		graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#0000FF","#df4427","#dffc27",
						"#c21c27","#d93c27","#fdfc97","#dccc27"];
		graph.xAxisLabelArr = ["First", "2nd", "3rd", "4th", "5th", "6th","7th","8th","9th","10th"];
		setInterval(function () {
			//Validate data
			dataValidator();
			//Update
			graph.update([parseFloat(document.getElementById("first").value)/100,
							parseFloat(document.getElementById("second").value)/100,
							parseFloat(document.getElementById("third").value)/100,
							parseFloat(document.getElementById("fourth").value)/100,
							parseFloat(document.getElementById("fifth").value)/100,
							parseFloat(document.getElementById("sixth").value)/100,
							parseFloat(document.getElementById("seventh").value)/100,
							parseFloat(document.getElementById("eighth").value)/100,
							parseFloat(document.getElementById("ninth").value)/100,
							parseFloat(document.getElementById("tenth").value/100)]);
		}, 600);

		//Graph 2
		var graph2 = new BarGraph(ctx2);
		graph2.maxValue = 1;
		graph2.margin = 2;
		graph2.colors = ["#a990d8", "#d153b0", "#ffc527", "#cf00FF","#df4427","#dffc27",
						"#c2ac27","#dd3c27","#fdfc97","#fccc27"];
		graph2.xAxisLabelArr = ["First", "2nd", "3rd", "4th", "5th", "6th","7th","8th","9th","10th"];
		setInterval(function () {
			//Validate data
			dataValidatorTwo();
			//Update
			graph2.update([parseFloat(document.getElementById("first2").value)/100,
							parseFloat(document.getElementById("second2").value)/100,
							parseFloat(document.getElementById("third2").value)/100,
							parseFloat(document.getElementById("fourth2").value)/100,
							parseFloat(document.getElementById("fifth2").value)/100,
							parseFloat(document.getElementById("sixth2").value)/100,
							parseFloat(document.getElementById("seventh2").value)/100,
							parseFloat(document.getElementById("eighth2").value)/100,
							parseFloat(document.getElementById("ninth2").value)/100,
							parseFloat(document.getElementById("tenth2").value/100)]);
		}, 600);
	}());
});
