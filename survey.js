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
	//localStorage.survey = "true";
	var d = new Date();
	localStorage.lastM = d.getMonth();
	localStorage.lastD = d.getDate();
	//localStorage.complete = d.toString();
	//XMLHttp thing to submit the data
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://jack.cs.brown.edu/data.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("type=survey&username="+localStorage.username+"&results="+"|1:"+document.getElementById("first").value+
		"|2:"+document.getElementById("second").value+"|3:"+document.getElementById("third").value+
		"|4:"+document.getElementById("fourth").value+"|5:"+document.getElementById("fifth").value+
		"|6:"+document.getElementById("sixth").value+"|7:"+document.getElementById("seventh").value+
		"|8:"+document.getElementById("eighth").value+"|9:"+document.getElementById("ninth").value+
		"|10:"+document.getElementById("tenth").value);
	//Set them free, Mr. Willy
	//Well, almost
	chrome.browserAction.setPopup({popup: "partTwo.html"})
	window.location.href="partTwo.html";
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
  this.width = 575;
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

	}());
});
