var pi = Math.PI;

//creating the SVG element
var $wheel = $('.wheel');
var width = $wheel.width();
var height = $wheel.height();
var radius = Math.min(width, height) / 2 - 40;
var innerRadius = 60;
var curAngle = 0;

var color = d3.scaleOrdinal().range(['#ff8c00', '#98abc5', '#a05d56', '#8a89a6', '#7b6888', '#6b486b']);

var svg = d3.select('.wheel')
.append('svg')
.attr('width', width)
.attr('height', height)
.append('g')
.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

// Draw arrows to indicate important part of wheel.
svg.append('polygon')
.attr('points', '-30,'+-height/2+' 30,'+-height/2+' 0,'+-radius);

svg.append('polygon')
.attr('points', '-30,'+-(innerRadius-40)+' 30,'+-(innerRadius-40)+' 0,'+-innerRadius)

//Here is the for loop that creates each ring. 'i' is the number of rings.
data.reverse().forEach(function(ringData, i) {
  var centreX = width / 2 + 23; // Trial and error
  var centreY = height / 2 + 50; // Add distance from edge of page
  var increment = 360 / ringData.length;
  var outer = radius - (radius - innerRadius) / data.length * i;
  var inner = radius - (radius - innerRadius) / data.length * (i + 1);

  var svg = d3.select('svg')
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')  rotate(' + increment / 2 + ')');

  //setting the outer and inner radius of each ring:
  var arc = d3.arc().outerRadius(outer).innerRadius(inner);

  // setting up for the sections of each ring
  var pie = d3.pie().sort(null).value(function() {
    return 1;
  });

  // mapping the heading from ringData to each section
  var g = svg.selectAll('.arc').data(pie(ringData)).enter().append('g').attr('class', 'arc');

  g.append('path').attr('d', arc).style('fill', function() {
    return color(i);
  });

  ringData.forEach(function(slice, j) {
    var textRadius = (outer + inner) / 2;

    var theta1 = -pi / 2 + 2 * pi / ringData.length * j;
    var xStart = textRadius * Math.cos(theta1);
    var yStart = textRadius * Math.sin(theta1);

    var theta2 = -pi / 2 + 2 * pi / ringData.length * (j + 1);
    var xEnd = textRadius * Math.cos(theta2);
    var yEnd = textRadius * Math.sin(theta2);

    var pathconst = 'M ' + xStart + ' ' + yStart + ' A ' + textRadius + ' ' + textRadius + ' 0 0 1 ' + xEnd + ' ' + yEnd;

    svg.append('defs').append('path').attr('id', 'curve' + i + j).attr('d', pathconst);

    var pathEl = d3.select('#curve' + i + j).node();
    var pathLength = pathEl.getTotalLength();

    svg.append('text')
    .attr('x', Math.abs(pathLength / 2))
    .attr('y', Math.abs(pathLength / 2))
    .attr('class', 'curve-text')
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .append('textPath')
    .attr('xlink:href', '#curve' + i + j)
    .text(function() {
      return slice.heading;
    });

    g.append('use').attr('class', 'curve-line').attr('xlink:href', '#curve');

    g.on('click', function(element) {
      var _element$data = element.data;
      var heading = _element$data.heading;
      var description = _element$data.description;

      $('.title').text(heading);
      $('.description').text(description || 'No Description Available');
    });
  });

  //Here starts the code for the mouse events
  var endAngle = increment / 2;
  var startAngle = void 0;

  window.onload = function() {
    document.onmousedown = function() {
      return false;
    }; // mozilla
  };

  svg.on('mousedown', function() {
    startAngle = Math.atan2(d3.event.y - centreY, d3.event.x - centreX) * 180 / pi;

    // Set move and up listeners on entire window
    d3.select(window).on('mousemove', mousemove);
    d3.select(window).on('mouseup', mouseup);

    function mousemove() {
      var thisAngle = Math.atan2(d3.event.y - centreY, d3.event.x - centreX) * 180 / pi;
      var moveAngle = thisAngle - startAngle + endAngle;
      if (moveAngle < 0) moveAngle += 360;
      svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') rotate(' + moveAngle + ',0,0)');
    }

    function mouseup() {
      var thisAngle = Math.atan2(d3.event.y - centreY, d3.event.x - centreX) * 180 / pi;
      var moveAngle = thisAngle - startAngle + endAngle;
      if (moveAngle < 0) moveAngle += 360;
      // Check which increment is nearest and translate to that instead of doing it smoothly
      moveAngle = Math.round((moveAngle + increment / 2) / increment) * increment - increment / 2;
      svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') rotate(' + moveAngle + ',0,0)');
      endAngle = moveAngle;

      console.log((endAngle - increment / 2) / increment % ringData.length); // Says which segment it pointing up

      d3.select(window).on('mousemove', function() {});
      d3.select(window).on('mouseup', function() {});
    }
  });
});
