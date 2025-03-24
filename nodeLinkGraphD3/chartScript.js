



// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 1000;
const margin = { top: 50, right: 100, bottom: 100, left: 250 };
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

    svg.append("text")
    
        .text("force directed layout")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -margin.top/2)




    var colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateRdBu)
        .nice()
        .domain([-1, 1]);
    // load from csv, based on https://d3js.org/d3-fetch
    var nodes = d3.csv("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/nodeLinkGraphD3/nodesList.csv",).then(function (data) {
        // Convert string values to numbers
        data.forEach(function (d) {
            d['nodes'] = d['s'];

    
        });
    });
    console.log(nodes)