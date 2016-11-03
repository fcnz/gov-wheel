const pi = Math.PI;

//creating the SVG element
const width = $('.wheel').width();
const height = $('.wheel').height();
const radius = Math.min(width, height) / 2;
const curAngle = 0;

const color = d3.scaleOrdinal()
.range(['#ff8c00', '#98abc5', '#a05d56', '#8a89a6', '#7b6888', '#6b486b']);

const svg = d3.select('.wheel').append('svg')
.attr('width', width)
.attr('height', height)
.append('g')
.attr('transform', `translate(${width / 2},${height / 2})`);

//Here is the for loop that creates each ring. 'i' is the number of rings.
data.forEach(function(ringData, i) {
  const centreX = width / 2 + 15; // Trial and error
  const centreY = height / 2 + 135; // Add distance from edge of page
  const increment = 360 / ringData.length;
  const outer = radius - 10 - (radius - 50) / data.length * i;
  const inner = radius - 10 - (radius - 50) / data.length * (i + 1);

  const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})  rotate(${increment / 2})`);

  //setting the outer and inner radius of each ring:
  const arc = d3.arc()
  .outerRadius(outer)
  .innerRadius(inner);

  // setting up for the sections of each ring
  const pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return 1;
  });

  // mapping the heading from ringData to each section
  const g = svg.selectAll('.arc')
  .data(pie(ringData))
  .enter().append('g')
  .attr('class', 'arc');

  g.append('path')
  .attr('d', arc)
  .style('fill', function(d) {
    return color(i);
  });

  ringData.forEach(function(slice, j) {
    const textRadius = (outer + inner) / 2;

    const theta1 = (-pi / 2) + ((2 * pi) / ringData.length) * j;
    const xStart = textRadius * Math.cos(theta1);
    const yStart = textRadius * Math.sin(theta1);

    const theta2 = (-pi / 2) + ((2 * pi) / ringData.length) * (j + 1);
    const xEnd = textRadius * Math.cos(theta2);
    const yEnd = textRadius * Math.sin(theta2);

    const pathconst = `M ${xStart} ${yStart} A ${textRadius} ${textRadius} 0 0 1 ${xEnd} ${yEnd}`;

    svg.append('defs').append('path')
    .attr('id', 'curve' + i + j)
    .attr('d', pathconst)

    const pathEl   = d3.select('#curve' + i + j).node();
    const pathLength = pathEl.getTotalLength()
    const midpoint = pathEl.getPointAtLength(pathEl.getTotalLength()/2);

    svg.append('text')
    .attr('x', Math.abs(pathLength/2))
    .attr('y', Math.abs(pathLength/2))
    .attr('class', 'curve-text')
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .append('textPath')
    .attr('xlink:href', '#curve' + i + j)
    .text(function(d) {
      return slice.heading;
    });

    g.append('use')
    .attr('class', 'curve-line')
    .attr('xlink:href', '#curve');

    d3.selectAll('.curve-text').on('click', function(a) {
      console.log(a)
    })

    g.on('click', function(element) {
      const { heading, description } = element.data;
      $('.title').text(heading);
      $('.description').text(description);
    })
  });

  //Here starts the code for the mouse events
  let endAngle = increment / 2;
  let startAngle;

  window.onload = function() {
    document.onmousedown = function() {return false;} // mozilla
  }

  svg.on('mousedown', function() {
    startAngle = Math.atan2(d3.event.y - centreY, d3.event.x - centreX) * 180 / pi;

    // Set move and up listeners on entire window
    d3.select(window).on('mousemove', mousemove);
    d3.select(window).on('mouseup', mouseup);

    function mousemove() {
      const thisAngle = Math.atan2(d3.event.y - centreY, d3.event.x - centreX) * 180 / pi;
      let moveAngle = thisAngle - startAngle + endAngle;
      if (moveAngle < 0) moveAngle += 360;
      svg.attr('transform', `translate(${width / 2},${height / 2}) rotate(${moveAngle},0,0)`);  
    }

    function mouseup() {
      const thisAngle = Math.atan2(d3.event.y - centreY, d3.event.x - centreX) * 180 / pi;
      let moveAngle = thisAngle - startAngle + endAngle;
      if (moveAngle < 0) moveAngle += 360;
      // Check which increment is nearest and translate to that instead of doing it smoothly
      moveAngle = Math.round((moveAngle + increment / 2) / increment) * increment - increment / 2;
      svg.attr('transform', `translate(${width / 2},${height / 2}) rotate(${moveAngle},0,0)`);
      endAngle = moveAngle;

      console.log(((endAngle - increment / 2) / increment) % ringData.length); // Says which segment it pointing up

      d3.select(window).on('mousemove', function() {});
      d3.select(window).on('mouseup', function() {});
    }
  });
});
