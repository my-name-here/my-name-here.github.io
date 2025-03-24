



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
    let nodes;
    let links;

   // based on the code in the source(https://gist.github.com/d3noob/5155181), but edited for new version and to work how I want
   d3.csv("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/nodeLinkGraphD3/nodes.csv").then(function (data)  {
    var nodes = [];
    var links = [];
    var UsedNodeNames = [];// a list to keep track of which nodes we already have
    //loop over the links in the csv
    data.forEach(function(d) {
        // node either uses existing node if src already a node, or creates a new node in correct format if not
        nodes.push( {name: d.Src});
        // now we need to do the same witht he destination node, creating it if it doesn;t exist
        nodes.push( {name: d.Dest});

        d.value = +d.value;
        links.push({"src":d.Src, "dest": d.Dest, "val": +d.Val});
    });
    console.log(nodes);
});
    