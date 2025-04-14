// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 1000;
const margin = { top: 50, right: 20, bottom: 100, left: 250 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const minSize = 1
const maxSize = 6
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read data from CSV
d3.csv("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/populationEstimate.csv").then(function (data) {

    // Convert string values to numbers
    data.forEach(function (d) {
        d["FIPStxt"] = d["FIPStxt"];
        d.fipsSort = +d.FIPStxt;
        d["CENSUS_2020_POP"] = +d["CENSUS_2020_POP"]

    });
    data.sort((a,b) => a.fipsSort>b.fipsSort);
    console.log(data);

    // Define X and Y scales
   
    var colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .nice()
        .domain([d3.min(data, (d) => d['economy (mpg)']),d3.max(data, (d) => d['economy (mpg)'])]);




    svg.append("text")
    
        .text("map of the United States, colored by county population")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -margin.top/2)
        
    var legend = d3.legendColor()
		.title("Color Legend: economy (mpg)")
		.titleWidth(100)
        .cells(10) // change the number of cells during demo 
        .scale(colorScale);
		

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);


});