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

//What happens when they submit
function submit(){
	localStorage.survey = "true";
	var d = new Date();
	localStorage.complete = d.toString();
	chrome.browserAction.setPopup({popup: "popup.html"});
	window.location.href="popup.html";
	//XMLHttp thing to submit the data
}
//Makes sure that it all sums to 1
function dataValidator(){
	var total = 0;
	var remEls = [document.getElementById("first"), document.getElementById("second"), 
		      document.getElementById("thirdfifth"), document.getElementById("sixtheight"),
		      document.getElementById("ninth"), document.getElementById("last")];
	var last = remEls[0];
	while(total <= 1 && remEls.length != 0){
		total += remEls[0].value;
		last = remEls[0];
		remEls.remove(0);
	}
	if(total > 1){
		var w = window.open('test.htm', 'name', 'width=200,height=200');
        	w.onload = w.print;
       		w.focus();
		for(el in remEls){
			el.value = 0;
		}
		last.value = total - 1;
	}
	/*var total = 0;
>>>>>>> 5aae95689079b221cb743bb139cab17ff23ffe3a
	total += parseFloat(document.getElementById("first").value);
	if(total >= 1){
		document.getElementById("second").value = 0;
		document.getElementById("thirdfifth").value = 0;
		document.getElementById("sixtheight").value = 0;
		document.getElementById("ninth").value = 0;
		document.getElementById("last").value = 0;
		return;
	}

	total += parseFloat(document.getElementById("second").value);
	if(total > 1){
		var a = "";
		a += Math.round((1 - parseFloat(document.getElementById("first").value))*10)/10;
		if(Math.round((1 - parseFloat(document.getElementById("first").value))*10)/10 == 0){
			document.getElementById("last").value = "0";
		}else{
			document.getElementById("second").value = a.substring(1);
		}
		document.getElementById("thirdfifth").value = "0";
		document.getElementById("sixtheight").value = "0";
		document.getElementById("ninth").value = "0";
		document.getElementById("last").value = "0";
		return;
	}

	total += parseFloat(document.getElementById("thirdfifth").value);
	if(total > 1){
		var a = "";
		a += Math.round((1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value))*10)/10;
		if(Math.round((1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value))*10)/10 == 0){
			document.getElementById("thirdfifth").value = "0";
		}else{
			document.getElementById("thirdfifth").value = a.substring(1);
		}
		document.getElementById("sixtheight").value = "0";
		document.getElementById("ninth").value = "0";
		document.getElementById("last").value = "0";
		return;
	}

	total += parseFloat(document.getElementById("sixtheight").value);
	if(total > 1){
		var a = "";
		a += Math.round(
			(1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value)-
			parseFloat(document.getElementById("thirdfifth").value))*10)/10;
		if(Math.round(
			(1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value)-
			parseFloat(document.getElementById("thirdfifth").value))*10)/10 == 0){
			document.getElementById("sixtheight").value = "0";
		}else{
			document.getElementById("sixtheight").value = a.substring(1);
		}
		document.getElementById("ninth").value = "0";
		document.getElementById("last").value = "0";
		return;
	}

	total += parseFloat(document.getElementById("ninth").value);
	if(total > 1){
		var a = "";
		a += Math.round((1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value)-
			parseFloat(document.getElementById("thirdfifth").value)-
			parseFloat(document.getElementById("sixtheight").value))*10)/10;
		if(Math.round((1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value)-
			parseFloat(document.getElementById("thirdfifth").value)-
			parseFloat(document.getElementById("sixtheight").value))*10)/10 == 0){
				document.getElementById("ninth").value = "0";
		}else{
			document.getElementById("ninth").value = a.substring(1);
		}
		document.getElementById("last").value = "0";
		return;
	}

	total += parseFloat(document.getElementById("last").value);
	if(total > 1){
		var a = "";
		a += Math.round((1 - parseFloat(document.getElementById("first").value)-
			parseFloat(document.getElementById("second").value)-
			parseFloat(document.getElementById("thirdfifth").value)-
			parseFloat(document.getElementById("sixtheight").value)-
			parseFloat(document.getElementById("ninth").value))*10)/10;
		if(a == "0"){
			document.getElementById("last").value = "0";
		}else{
			document.getElementById("last").value = a.substring(1);
		}
	}/*else if(total < 1){
		var a = "";
		a += Math.round((1 - total) *10)/10;
		if(a == "0"){
			document.getElementById("last").value = "0";
		}else{
			document.getElementById("last").value = a.substring(1);
		}
	}*/
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
  this.width = 300;
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
	document.getElementById("submit").onclick = submit;
	document.getElementById("first").onchange = function(){updateBox(document.getElementById("first").value,'firstT');};
	document.getElementById("firstT").onchange = function(){updateBar(document.getElementById("firstT").value,'first');};
	//Second
	document.getElementById("second").onchange = function(){updateBox(document.getElementById("second").value,'secondT');};
	document.getElementById("secondT").onchange = function(){updateBar(document.getElementById("secondT").value,'second');};
	//Third
	document.getElementById("thirdfifth").onchange = function(){updateBox(document.getElementById("thirdfifth").value,'thirdfifthT');};
	document.getElementById("thirdfifthT").onchange = function(){updateBar(document.getElementById("thirdfifthT").value,'thirdfifth');};
	//Fourth
	document.getElementById("sixtheight").onchange = function(){updateBox(document.getElementById("sixtheight").value,'sixtheightT');};
	document.getElementById("sixtheightT").onchange = function(){updateBar(document.getElementById("sixtheightT").value,'sixtheight');};
	//Fifth
	document.getElementById("ninth").onchange = function(){updateBox(document.getElementById("ninth").value,'ninthT');};
	document.getElementById("ninthT").onchange = function(){updateBar(document.getElementById("ninth").value,'last');};
	//Fifth
	document.getElementById("last").onchange = function(){updateBox(document.getElementById("last").value,'lastT');};
	document.getElementById("lastT").onchange = function(){updateBar(document.getElementById("lastT").value,'last');};
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
		
		var graph = new BarGraph(ctx);
		graph.maxValue = 1;
		graph.margin = 2;
		graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#0000FF","#df4427","#dffc27"];
		graph.xAxisLabelArr = ["First", "Second", "3-5", "6-8", "9th", "Last"];
		setInterval(function () {
			//Validate data
			dataValidator();
			//Update
			graph.update([parseFloat(document.getElementById("first").value/100),
							parseFloat(document.getElementById("second").value/100), 
							parseFloat(document.getElementById("thirdfifth").value/100), 
							parseFloat(document.getElementById("sixtheight").value/100),
							parseFloat(document.getElementById("ninth").value/100),
							parseFloat(document.getElementById("last").value/100)]);
		}, 1000);

	}());
});
