



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
    let nodesList = [];
    let linksList = [];
    var UsedNodes = [];// nodes we have already Used
   // based on the code in the source(https://gist.github.com/d3noob/5155181)
   d3.csv("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/nodeLinkGraphD3/nodes.csv").then(function (data) {

    //loop over the links in the csv
    data.forEach(function(d) {
        // node either uses existing node if src already a node, or creates a new node in correct format if not
        if (!UsedNodes.includes(d.Src)){
            nodesList.push({"id": d.Src})
            UsedNodes.push(d.Src)

        }
        // now we need to do the same witht he destination node, creating it if it doesn;t exist
        if (!UsedNodes.includes(d.Dest)){
            nodesList.push({"id": d.Dest})
            UsedNodes.push(d.Dest)

        }
        d.value = +d.value;
        linksList.push({"src":d.Src, "dest": d.Dest, "val": +d.Val})
    });
    //console.log(nodesList);

// see https://github.com/d3/d3-force/issues/32
var graph = {
    "nodes":nodesList,
    "links":linksList,
}
links = graph.links.map(d => ({...d}));
nodes = graph.nodes.map(d => ({...d}));

// force simulation based onhttps://d3js.org/d3-force/simulation and https://observablehq.com/@d3/force-directed-graph/2?collection=@d3/d3-force
console.log(nodesList)
  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      //.force("link", d3.forceLink(links))
      // another fix based on github issues
      .force('link', d3.forceLink(links).id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    });