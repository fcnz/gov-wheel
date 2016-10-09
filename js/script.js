d3.select("body").append("p").text("New paragraph!");
[9, 6, 8].forEach
            var pi = Math.PI;
            var data = [
            [
                    {"heading": "AAAAAAAAAAAAAAAAAAAA",
                    "description": 2704659}, 
                    {"heading": "B",
                    "description": 4499890}, 
                    {"heading": "C",
                    "description": 2159981}, 
                    {"heading": "D",
                    "description": 3853788}, 
                    {"heading": "E",
                    "description": 141065}, 
                    {"heading": "F",
                    "description": 8819342}, 
                    {"heading": "G",
                    "description": 612463}
            
                ], 
                [
                    {"heading": "A",
                    "description": 2704659}, 
                    {"heading": "BBBBBBBBBBBBB",
                    "description": 4499890}, 
                    {"heading": "C",
                    "description": 2159981}, 
                    {"heading": "Test",
                    "description": 3853788}, 
                    {"heading": "E",
                    "description": 141065}, 
                    {"heading": "Here is a sentence",
                    "description": 8819342}, 
                    {"heading": "G",
                    "description": 612463}, 
                    {"heading": "H",
                    "description": 1000000}
                ],
                [
                    {"heading": "A",
                    "description": 2704659}, 
                    {"heading": "B",
                    "description": 4499890}, 
                    {"heading": "CCCCCCCCCCCCCCCCCCC",
                    "description": 2159981}, 
                    {"heading": "D",
                    "description": 3853788}, 
                    {"heading": "E",
                    "description": 141065}, 
                    {"heading": "F",
                    "description": 8819342}, 
                    {"heading": "G",
                    "description": 612463}, 
                    {"heading": "H",
                    "description": 1000000}
                ],
                [
                    {"heading": "A",
                    "description": 2704659}, 
                    {"heading": "B",
                    "description": 4499890}, 
                    {"heading": "C",
                    "description": 2159981}, 
                    {"heading": "Yayyyyyy!",
                    "description": 3853788}, 
                    {"heading": "E",
                    "description": 141065}, 
                    {"heading": "F",
                    "description": 8819342}
                ],
            ];

            myFunc('it', '\'s here', cb);

            function myFunc(a, b, callback) {
                var result = a + '+' + b
                callback(result);
                return result;
            }

            function cb(c) {
                console.log(c);
            }

            function iterator(a, b) {

            }

            //creating the SVG element

            var width = 500,
                height = 500,
                radius = Math.min(width, height) / 2;
            curAngle = 0;

            var color = d3.scaleOrdinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            //Here is the for loop that creates each ring

            data.forEach(function(ringData, i) {

                var svg = d3.select("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                //setting the outer and inner radius of each ring:
                if (i == 0) {
                    var outer = radius - 10
                    var inner = radius - 45*(i + 1)
                    var arc = d3.arc()
                        .outerRadius(outer)
                        .innerRadius(inner)
                } else {
                    var outer = radius - 45*i
                    var inner = radius - 45*(i + 1)
                    var arc = d3.arc()
                        .outerRadius(outer)
                        .innerRadius(inner)
                }


                    
                var pie = d3.pie()
                    .sort(null)
                    .value(function(d) {
                        return 1;
                    });

                var g = svg.selectAll("g")
                    .data(pie(ringData))
                    .enter().append("g")
                    .attr("class", "arc");

                g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) {
                        return color(d.data.heading);
                    });

                ringData.forEach(function(slice,j){
                    // var svg = d3.select("svg")
                    // .attr("width", width)
                    // .attr("height", height)
                    // .append("g")
                    // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var textRadius = (outer + inner) / 2;

                    var theta1 = (-pi/2) + ((2*pi)/ringData.length)*j;
                    var xStart = textRadius* Math.cos(theta1);
                    var yStart = textRadius* Math.sin(theta1);

                    var theta2 = (-pi/2) + ((2*pi)/ringData.length)*(j+1);
                    var xEnd = textRadius* Math.cos(theta2);
                    var yEnd = textRadius* Math.sin(theta2);

                    console.log(xStart)
                    console.log(yStart)
                    console.log(textRadius)
                    console.log(xEnd)
                    console.log(yEnd)
                    
                    var pathVar = "M " + xStart + " " + yStart + " " + "A " + textRadius + " " + textRadius + " " + 0 + " " + 0 + " " + 1 + " " + xEnd + " " + yEnd;
                    console.log(pathVar)

                    svg.select("curve").remove();

                    svg.append("defs").append("path")
                        .attr("id", "curve" + i + j)
                        .attr("d", pathVar)

                    svg.append("text")
                        .attr("id", "curve-text")
                        .attr("dy", ".35em")
                        //.style("text-anchor", "middle")
                        .append("textPath")
                        .attr("xlink:href", "#curve" + i + j)
                        .text(function(d){
                            return slice.heading;
                        });


                    svg.append("use")
                        .attr("id", "curve-line")
                        .attr("xlink:href", "#curve");



                    //console.log(theta1, theta2, xStart, yStart, xEnd, yEnd)
                    //console.log(slice.heading)
                    
                });
                

                // g.append("text")
                //     .attr("transform", function(d) {
                //         return "translate(" + arc.centroid(d) + ")";
                //     })
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "middle")
                //     .text(function(d) {
                //         return d.data.heading;
                //     });

                

        //Here starts the code for the mouse events

                 var interval = null;
                 var isDown = false;
                 var lastX = width / 2;
                 var lastY = height / 2;
                 var curAngle = 0;
                 var finishAngle = 0;
                 var angleDeg = 0;
                 var testbool = true;

                 //svg.on("mousedown", mousedown);

                 window.onload = function() {
                    document.onmousedown = function() {return false;} // mozilla
                }

                 svg.on("mousedown", function() {
                     d3.select(window);
                     isDown = true;
                       var thisX = d3.event.x - lastX,
                         thisY = d3.event.y - lastY;
                       curAngle = Math.atan2(lastY - d3.event.y, lastX - d3.event.x) // * 180 / Math.PI) ;
                       if (curAngle < 0) curAngle += 2 * Math.PI;
                       curAngle = curAngle * 180 / Math.PI;

                    svg.on("mousemove", mousemove);

                    d3.select(window).on("mouseup", mouseup);

                    // function mousedown() {
                    //     isDown = true;
                    //    var thisX = d3.event.x - lastX,
                    //      thisY = d3.event.y - lastY;
                    //    curAngle = Math.atan2(lastY - d3.event.y, lastX - d3.event.x) // * 180 / Math.PI) ;
                    //    if (curAngle < 0) curAngle += 2 * Math.PI;
                    //    curAngle = curAngle * 180 / Math.PI;
                    // }

                    function mousemove() {
                        if (isDown) {
                         //svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate(" + (-curAngle) + "," + 0 + "," + 0 + ")");
                         var thisX = d3.event.x - lastX,
                           thisY = d3.event.y - lastY;
                         angleDeg = Math.atan2(lastY - d3.event.y, lastX - d3.event.x) // * 180 / Math.PI) - curAngle
                         if (angleDeg < 0) angleDeg += 2 * Math.PI;
                         angleDeg = angleDeg * 180 / Math.PI;
                         angleDeg = angleDeg - curAngle + finishAngle;
                         if (angleDeg < 0) angleDeg += 360; 
                         svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate(" + angleDeg + "," + 0 + "," + 0 + ")");
                       }
                    }

                    function mouseup() {
                        finishAngle = angleDeg;
                       console.log('curAngleend', curAngle)
                       isDown = false;
                    }
                     });

             }); // start is line 138

            