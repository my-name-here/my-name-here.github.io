// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 1000;
const margin = { top: 50, right: 200, bottom: 100, left: 100 };
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





var FIPS2Pop = {};

// loading data from multiple files using promise.all, see https://stackoverflow.com/a/51113326
Promise.all([
    d3.csv("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/populationEstimate.csv"),
    d3.json("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/counties-albers-10m.json"),
]).then(function(files){

    files[0].forEach(function (d) {
        d["FIPStxt"] = d["FIPStxt"];
        d["POP_ESTIMATE_2023"] = +d["POP_ESTIMATE_2023"]
        // coorespondence idea loosely based on https://observablehq.com/@mackenziehutchison/choropleth?collection=@observablehq/county-maps
        FIPS2Pop[d["FIPStxt"]] = d["POP_ESTIMATE_2023"];

    });


    files[0].sort((a,b) => a["POP_ESTIMATE_2023"]>b["POP_ESTIMATE_2023"]);
    console.log(data);
    console.log(d3.min(files[0], d=>d["POP_ESTIMATE_2023"]));
    // Define colorscale
    // quantize color scale based on example from https://www.d3indepth.com/scales/
    var colorScale = d3.scaleQuantize()
        
        .nice()

        .domain([d3.min(files[0], (d) => d["POP_ESTIMATE_2023"]),d3.max(files[0], (d) => d["POP_ESTIMATE_2023"])])
        //colors chosen by colorbrewer(https://colorbrewer2.org/#type=sequential&scheme=Blues&n=5)
        .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);



    svg.append("text")
    
        .text("map of the United States, colored by county population")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -margin.top/2)
        
    var legend = d3.legendColor()
		.title("Color Legend: population estimate 2023")
		.titleWidth(100)
        .cells(10) // change the number of cells during demo 
        .scale(colorScale);
		

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);


});