
// Define Margin
var margin = {top: 20, right:80, bottom:20, left:40},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Define SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define X-Y Scale
var xScale = d3.scale.linear().range([0, width]),
    yScale = d3.scale.linear().range([height, 0]);

// Define X-Y Axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.num;},
    color = d3.scale.category20();

// Define Tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Import Data
d3.csv("data.csv", function(error, data) {
  data.forEach(function(d) {
    d.gdp = +d.gdp;
    d.ec = +d.ec;
    d.num = +d.num;
   

  });

  xScale.domain([0, d3.max(data, function(d) { return d.gdp;})]);
  yScale.domain([0, d3.max(data, function(d) { return d.ec;})]);

  // Draw X-Axis and Label
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("GDP");

  // Draw Y-Axis and Label
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Energy Per Capita");

  // Plot
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .transition().duration(500)
      .delay( function(d,i) {
			return i * 200;
		})
      .attr("r", function(d) { return d.gdp*2.5; })
      .attr("cx", function(d) { return xScale(d.gdp);})
      .attr("cy", function(d) { return yScale(d.ec);})
      .style("fill", function(d) { return color(cValue(d));});
      
  svg.selectAll(".dot")
    .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 1);
          tooltip.html(d.country + "<br/>" + "GDP: $" + d.gdp 
	        + " trillion" + "<br/> " + "EPC: " + d.ec + "")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 30) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      }); 

});
