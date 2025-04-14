// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1500;
const svgHeight = 1000;
const margin = { top: 50, right: 200, bottom: 100, left: 50 };
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

    console.log(FIPS2Pop)
    files[0].sort((a,b) => a["POP_ESTIMATE_2023"]>b["POP_ESTIMATE_2023"]);
    console.log(files[0]);
    console.log(d3.min(files[0], d=>d["POP_ESTIMATE_2023"]));
    console.log(d3.max(files[0], d=>d["POP_ESTIMATE_2023"]));

    // math to figure out how many per area

    numSections = 7
    minVal = d3.min(files[0], (d) => d["POP_ESTIMATE_2023"])
    maxVal = d3.max(files[0], (d) => d["POP_ESTIMATE_2023"])
    LogMin = Math.log10(minVal)
    LogMax = Math.log10(maxVal)
    numMiddleSections = numSections - 3
    logChange = LogMax - LogMin
    logChangePerSection =  logChange/numMiddleSections
    mid1 = Math.pow(10, LogMin + 1*logChangePerSection)
    mid2 = Math.pow(10, LogMin + 2*logChangePerSection)
    mid3 = Math.pow(10, LogMin + 3*logChangePerSection)
    mid4 = Math.pow(10, LogMin + 4*logChangePerSection)
    
    
    // Define colorscale
    // threshold color scale based on example from https://www.d3indepth.com/scales/
    var colorScale = d3.scaleThreshold()
        .domain([minVal,mid1,mid2,mid3,mid4,maxVal])
        //colors are blues, based on https://d3js.org/d3-scale/quantize
        .range(d3.schemeBlues[7])


    // creating path based on https://d3js.org/d3-geo/path and    
    // the map code from https://observablehq.com/@mackenziehutchison/choropleth?collection=@observablehq/county-maps 
    console.log(topojson.feature(files[1], files[1].objects.counties).features)
    svg.selectAll()
        .data(topojson.feature(files[1], files[1].objects.counties).features)
        .join("path")
            .attr("fill", d => colorScale(FIPS2Pop[d.id]))
            .attr("d", d3.geoPath());


    // title, legend, from earlier assignments
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