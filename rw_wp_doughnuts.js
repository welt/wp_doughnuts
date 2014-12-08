// http://www.chartjs.org/docs/#doughnut-pie-chart-introduction

var $ = jQuery.noConflict();

var console = console || { "log" : function(){} };

Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: true,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    animationEasing: "easeOutQuart",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "ostrich-black, 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: false,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "ostrich-black, 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "ostrich-black, 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for single tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
};

(function() {

	// KEY
	// c = configuration
	// f = function
	// o = object

	// setup charting env
	//
	window.ChartJSDoughnuts = window.ChartJSDoughnuts || {

		fInit: function() {

			var t = this;

			t.oBody = $('body');

		}

	};

	// doughnut chart objects
	//
	ChartJSDoughnuts.doughnut = {

		fInit: function() {
			var t = this;

			// Double check we’ve got oSelf
			if ( !t.oSelf.length ) {
				return;
			} else {
				// console.log('chart object(s) initialising');
			};

			t.cChartJSDoughnutsConfig = {
				//Boolean - Whether we should show a stroke on each segment
				segmentShowStroke : true,

				//String - The colour of each segment stroke
				segmentStrokeColor : "#fff",

				//Number - The width of each segment stroke
				segmentStrokeWidth : 2,

				//Number - The percentage of the chart that we cut out of the middle
				percentageInnerCutout : 65, // This is 0 for Pie charts

				//Number - Amount of animation steps
				animationSteps : 100,

				//String - Animation easing effect
				animationEasing : "easeOutBounce",

				//Boolean - Whether we animate the rotation of the ChartJSDoughnuts
				animateRotate : true,

				//Boolean - Whether we animate scaling the ChartJSDoughnuts from the centre
				animateScale : false,

				//String - A legend template
				legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

			};

			// setup colour definitions
			// Maroon to Rose
			//
			t.cCLUT = [
				{
					color: "#550000",
					highlight: "#550000"
				},
				{
					color: "#801515",
					highlight: "#801515"
				},
				{
					color: "#D46A6A",
					highlight: "#D46A6A"
				},
				{
					color: "#FFAAAA",
					highlight: "#FFAAAA"
				},
				{
					color: "#AA3939",
					highlight: "#AA3939"
				}
			];

			t.doughnuts = [];

			// setup doughnut
			//
			$('.doughnut').each( function( index ) {
				var $this = $(this),
					oInstance = {};
				oInstance.id = $this.attr('ID');
				oInstance.ctx = $this.get(0).getContext("2d");
				oInstance.cval = $this.data('cval');
				oInstance.showText = $this.data('show');
				oInstance.doughnutData = [];
				oInstance.doughnut = {};

				t.doughnuts.push(oInstance); // keep a record of all the instances, not currently used

				// process the doughnut's data
				//
				$.each(oInstance.cval, function( index, value ) {
					var obj = {};
					obj["value"] = parseInt(oInstance.cval[index]);
					// special colour rule if only two values
					//
					var colour = ( 2 === oInstance.cval.length && 1 === index ) ? "#ffffff" : t.cCLUT[index%6]["color"];
					obj["color"] = colour;
					obj["highlight"] = t.cCLUT[index%6]["highlight"];
					obj["label"] = "#282828";
					oInstance.doughnutData.push(obj);
				});

				// don't show stroke if we've only got one value to represent (ie. 100%)
				//
				t.cChartJSDoughnutsConfig.segmentShowStroke = ( 1 === oInstance.cval.length ) ? false : true;

				// we can add to the Canvas context on AnimationComplete
				// but we're not going to
				//
				t.cChartJSDoughnutsConfig.onAnimationComplete = function() {
					// *wip*
					if ( true === oInstance.showText ) {
						var centerText = oInstance.doughnutData[0].value;
						oInstance.ctx.font = "30px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
						oInstance.ctx.textAlign = "left";
						oInstance.ctx.fillStyle = "#282828";
						oInstance.ctx.fillText(centerText, 85, 85, 180);
					}
				}

				// make the doughnut
				//
				oInstance.doughnut = new Chart(oInstance.ctx).Doughnut( oInstance.doughnutData, t.cChartJSDoughnutsConfig );

			});

		}

	};

}());

$( document ).ready(function() {

	// initialise Chart env
	//
	ChartJSDoughnuts.fInit();

});

$( window ).load(function() {

	// initialise doughnut production
	//
	ChartJSDoughnuts.doughnut.oSelf = ChartJSDoughnuts.oBody.find('.doughnut');
	if ( ChartJSDoughnuts.doughnut.oSelf ) {
		ChartJSDoughnuts.doughnut.fInit();
	};

});
