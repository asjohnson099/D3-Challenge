
// Set svg for the scatter plot
// svg container
var svgWidth = 700;
var svgHeight = 500;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(stateData) {

//  DATA elements:  id,state,abbr,
//  poverty,povertyMoe,age,ageMoe,income,incomeMoe,
//  healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,

stateData.forEach(function(data) {
    data.income = +data.income;
    data.smokes = +data.smokes;
  });

// scale x to chart width
var xScale = d3.scaleLinear()
.domain([d3.min(stateData, d => d.income) * 0.9,
      d3.max(stateData, d => d.income) * 1.1
    ])
    .range([0, chartWidth]);

// scale y to chart height
var yScale = d3.scaleLinear()
.domain([d3.min(stateData, d => d.smokes) * 0.9,
  d3.max(stateData, d => d.smokes) * 1.1])
.range([chartHeight, 0]);

// create axes
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(xAxis);

  chartGroup.append("g")
  .call(yAxis);

console.log(stateData);

// Function to initialize tool tip

function updateToolTip(circleGroup) {
  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) { return (`${d.state}<br>Smokes: ${d.smokes}<br>Income: ${d.income}`);})

  circleGroup.call(toolTip);

  circleGroup
    .on("mouseover", function(d) {toolTip.show(d, this)})
    .on("mouseout", function(d) {toolTip.hide(d)});

  return circleGroup;
};

// Append data to chartGroup and plot circles

var circleGroup = chartGroup.selectAll(".stateCircle")
  .data(stateData)
  .enter()
  .append("circle")
  .classed("stateCircle", true)
  .attr("cx", d => xScale(d.income))
  .attr("cy", d => yScale(d.smokes))
  .attr("r", 12)

var circleLabels = chartGroup.selectAll(".stateText")
  .data(stateData)
  .enter()
  .append("text")
  .classed("stateText", true)
  .attr("x", d => xScale(d.income))
  .attr("y", d => yScale(d.smokes))
  .attr("dy", 3)
  .attr("r", 12)
  .attr("font-size", "10px")
  .text(d => d.abbr);

circleGroup = updateToolTip(circleGroup);

// Create axes labels

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Smokes(%)");

chartGroup.append("text")
    .attr("x", (chartWidth / 2))
    .attr("y", chartHeight + margin.top)
    .attr("class", "aText")
    .text("Household Income (Median)");


}).catch(function(error) {
    console.log(error);
  });