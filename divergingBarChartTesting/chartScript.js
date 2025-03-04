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
    console.log("maximum distance from average was:", maxDist);
    // Define X and Y scales
    const y = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, height])
        .padding(0.1);
    // domain is based on distance from average, making the axis nicer
    const x = d3
        .scaleLinear()
        .domain([-maxDist, maxDist])
        .nice()
        .range([0, width]);

    var colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateRdBu)
        .nice()
        .domain([-maxDist, maxDist]);



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
        // if distance from average of the point is negative, then we need to shift it, so that width remains positive
        // we can use a ternary operation to check the sign and set the value accordingly
        // d['economy (mpg)']-avg gives signed distance from average
        // condition is d['economy (mpg)']-avg) >= 0, or the value is greater or equal to the average.
        // in this case, then we want to draw the bar from the average, since it is going above it
        // since x is based on distance from average, we have x(0) as the output in this case
        // if it is not true, then we want x(dist), since it will be less than the average, so we want the start early
        // this will make the width have it end at 0
        .attr('x', (d) => (d['economy (mpg)']-averageVal) >= 0 ? x(0): x(d['economy (mpg)']-averageVal))
        // width needs to be positive, so wrap calculation in math.abs
        // width should be based on the distance from average 
        // we do x(0) - x(dist), since this calculates the length between the point where the average is
        //  and the point where the data is
        .attr('width', (d) => Math.abs( x(0)-(x(d['economy (mpg)']-averageVal))))
        // color calculated based on distance from average
        .attr('fill', d => colorScale(d['economy (mpg)']-averageVal));

    bars
        .append('text')
        .attr('class', 'barLabel')
        .text((d) => `mpg: ${d['economy (mpg)']}`)
        .attr('y', (d) => y(d.name) + 15)
        // place mpg labels on opposite side of average as bar, for readablilty
        // should be simmilar to ternary above, but if it is negative, then x(0), if positive, is shifted to the left a bit
        // add a slight offset of 5 on both sides, for some extra space between label and bar
        .attr('x', (d) => (d['economy (mpg)']-averageVal) >= 0 ? x(0)-55: x(0)+5);
        

    svg
        .append('text')
        .text('Vehicle Name')
        .attr('x', -100)
        .attr('y', 0);

    svg
        .append('text')
        .text(`distance from average mpg(average is ${averageVal})`)
        .attr('x', 150)
        .attr('y', -margin.top / 4);

    svg
        .append('text')

        .text('barchart of distance from avg mpg of cars, sorted by name')
        .attr('class', 'title')
        .attr('x', 0)
        .attr('y', -margin.top / 2);
    var legend = d3.legendColor()
		.title("Color Legend: distance from avg mpg")
		.titleWidth(100)
        .cells(10) // change the number of cells during demo 
        .scale(colorScale);
		

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);

});
