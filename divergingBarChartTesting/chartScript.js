// basic framework from class example, edited to work for my needs
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 4000;
const margin = {
    top: 50,
    right: 100,
    bottom: 30,
    left: 250,
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
    .select('#chart-container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

    .append('g')
    .attr(
        'transform',
        `translate(${margin.left},${margin.top})`,
    );

// Read data from CSV
d3.csv(
    'https://gist.githubusercontent.com/my-name-here/945eb7a96c48a4e44d4e8d28dc2f8f8e/raw/f507ae593a044f4176a1908f1e3b56ff4d54c723/carsDataVis.csv',
).then(function (data) {
    // Convert string values to numbers
    data.forEach(function (d) {
        d['economy (mpg)'] = +d['economy (mpg)'];
        d.name = d.name;

    });
    data.sort((a, b) => a.name > b.name);
    console.log(data);
    // diverging bar chart will be centered around average of data.
    // to do this, we first need to know where the average is
    const averageVal = d3.mean(data, (d) => d['economy (mpg)']);
    console.log("mean value is: ", averageVal);
    // now, we want to figure out the range of distances from the average. the absolute distance in each directiion will be at the min and max
    // find the min and max values first
    const minValue = d3.min(data, (d) => d['economy (mpg)']);
    const maxValue = d3.max(data, (d) => d['economy (mpg)']);
    // now calculate the maximimum possible absolute distance from average
    // first we calculate the absolute distance from average for the min and max
    // since we know that the maximum possible distance must happen at one of those 
    const distLower = averageVal - minValue; // since average is bigger than min, this will be positive
    const distUpper = maxValue - averageVal; // since max is bigger than average, this is positive
    const maxDist = Math.max(distLower, distUpper);// the maximum distance is the maximum of those values
    // Define X and Y scales
    const y = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, height])
        .padding(0.1);

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d['economy (mpg)'])])
        .nice()
        .range([0, width]);

    var colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateRdBu)
        .nice()
        .domain([d3.min(data, (d) => d['economy (mpg)']),d3.max(data, (d) => d['economy (mpg)'])]);



    // Add X and Y axes
    svg
        .append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(20));

    svg
        .append('g')
        .attr('class', 'axis axis-y')
        .call(d3.axisLeft(y).ticks(1));

    // Add bars
    // adding multiple elements on same level with groups based on https://stackoverflow.com/questions/65434376/append-two-elements-in-svg-at-the-same-level
    bars = svg
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('g');

    bars
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d) => y(d.name))
        .attr('height', y.bandwidth())
        .attr('x', (d) => 0)
        .attr('width', (d) => x(d['economy (mpg)']))
        .attr('fill', d => colorScale(d['economy (mpg)']));

    bars
        .append('text')
        .attr('class', 'barLabel')
        .text((d) => `mpg: ${d['economy (mpg)']}`)
        .attr('y', (d) => y(d.name) + 15)
        .attr('x', (d) => 25);
        

    svg
        .append('text')
        .text('Vehicle Name')
        .attr('x', -100)
        .attr('y', 0);

    svg
        .append('text')
        .text('MPG')
        .attr('x', 150)
        .attr('y', 0);

    svg
        .append('text')

        .text('barchart of MPG of cars , sorted by name')
        .attr('class', 'title')
        .attr('x', 0)
        .attr('y', -margin.top / 2);
    var legend = d3.legendColor()
		.title("Color Legend: economy (mpg)")
		.titleWidth(100)
        .cells(10) // change the number of cells during demo 
        .scale(colorScale);
		

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);

});
