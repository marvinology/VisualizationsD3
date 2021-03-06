// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load video game sales data
d3.csv("video_game_sales_2016.csv", function(error, salesData) {
  if (error) throw error;

  console.log(salesData);

  // Cast the NA_sales value to a number for each piece of sales data
  salesData.forEach(function(d) {
    d.NA_Sales = +d.NA_Sales;
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(salesData.map(d => d.Rating))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(salesData, d => d.NA_Sales)])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(salesData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.Rating))
    .attr("y", d => yLinearScale(d.NA_Sales))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.NA_Sales));

    svg.append('text')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Love meter (%)')

    svg.append('text')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Most loved programming languages in 2018')

  // Step 1: Append tooltip div
  var toolTip = d3.select("body")
    .append("div")
    .style("display", "none")
    .classed("tooltip", true);

  // Step 2: Create "mouseover" event listener to display tooltip
  circles.on("mouseover", function(d) {
    toolTip.style("display", "block")
        .html(
          `<strong>${(d.genre)}<strong><hr>${d.NA_Sales}
      in Sales`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
        d3.select(this).style("stroke", "#323232");
    })
      // Step 3: Create "mouseout" event listener to hide tooltip
     .on("mouseout", function() {
       toolTip.style("display", "none");
       d3.select(this).style("stroke", "#e3e3e3");
     });

});
