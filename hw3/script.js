/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {

  // Select all x dimension rects
  let oldRects = document.querySelectorAll(".bar-chart-x rect");

  // Apply staircase transformation
  for(let i = 0; i < oldRects.length; i++){
    console.log(oldRects[i]);
    oldRects[i].setAttribute("width",(i*30+20).toString());
    oldRects[i].setAttribute("height","18");
    oldRects[i].setAttribute("transform","translate(18," + (i*20).toString() + ")scale(-1, 1)");
    console.log(oldRects[i]);
  }
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

  //console.log(data);
  // Set up the scales
  // TODO: The scales below are examples, modify the ranges and domains to suit your implementation.
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 140]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 140]);
  let iScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 120]);

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  let aBars = d3.select('g.bar-chart-x').selectAll('rect').data(data);
  aBars
  .join(
    enter =>
      enter
        .append("rect")
        .attr("width",function(d){
          return (aScale(d.a)).toString();
        })
        .attr("height","18")
        .attr("transform",function(d,i){
          return "translate(18,"+(i*20).toString()+") scale(-1,1)";
        }),
    update =>
      update
        .attr("width",function(d){
          return (aScale(d.a)).toString();
        })
        .attr("transform",function(d,i){
          return "translate(18,"+(i*20).toString()+") scale(-1,1)";
        }),
    exit =>
        exit.remove()
  );

  // TODO: Select and update the 'b' bar chart bars
  let bBars = d3.select('g.bar-chart-y').selectAll('rect').data(data);
  bBars
  .join(
    enter => 
      enter
        .append("rect")
        .attr("width",function(d){
          return (bScale(d.b)).toString();
        })
        .attr("height","18")
        .attr("transform",function(d,i){
          return "translate(0,"+(i*20).toString()+")";
        }),
    update =>
      update
        .attr("width",function(d){
          return (bScale(d.b)).toString();
        })
        .attr("transform",function(d,i){
          return "translate(0,"+(i*20).toString()+")";
        }),
    exit =>
        exit.remove()
  );
  
  

  // TODO: Select and update the 'a' line chart path using this line generator

  // Delete the scale transform from existing line chart groups
  let lineGroups = d3.selectAll('svg.line-chart g');
  lineGroups
    .attr("transform","translate(0,300) scale(2,-2)");

  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => aScale(d.a));

  let aPath = aLineGenerator(data);
  //console.log(aPath);
  let aLine = d3.select('#aLineChart');
  aLine
    .attr("d",aPath)
    .attr("stroke-opacity","1.0")
    .attr("stroke-width","1.0");
  //console.log(aLine);
  // TODO: Select and update the 'b' line chart path (create your own generator)

  let bLineGenerator = d3
    .line()
    .x((d,i) => iScale(i))
    .y(d => Math.round(bScale(d.b)));

  let bPath = bLineGenerator(data);
  //console.log(bPath);
  let bLine = d3.select('#bLineChart');
  bLine
    .attr("d",bPath)
    .attr("stroke-opacity","1.0")
    .attr("stroke-width","1.0");
  //console.log(bLine);

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGroup = d3.selectAll('svg.area-chart-x g');
  aAreaGroup
    .attr("transform","translate(300,0) rotate(90) scale(2,2)");
  let bAreaGroup = d3.select('svg.area-chart-y g');
  bAreaGroup
    .attr("transform","translate(0,0) rotate(90) scale(2,-2)");
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => Math.round(aScale(d.a)));

  let aAreaPath = d3.select('#aAreaChart');
  aAreaPath
    .attr("d",aAreaGenerator(data));
  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d,i) => iScale(i))
    .y0(0)
    .y1(d=> Math.round(bScale(d.b)));
  let bAreaPath = d3.select('#bAreaChart');
  bAreaPath
    .attr("d",bAreaGenerator(data));

  let xScale = d3.scaleLinear().domain([0,14]).range([0,300]).nice();
  let xAxis = d3.axisBottom();
  xAxis.scale(xScale);

  let yScale = d3.scaleLinear().domain([0,14]).range([300,0]).nice();
  let yAxis = d3.axisLeft();
  yAxis.scale(yScale);

  let svgScatter = d3.select('svg.scatter-plot');
  // TODO: Select and update the scatterplot points
  let gScatter = d3.select('#scatterplot');

  gScatter
    .attr("transform","translate(0,300) scale(2,-2)");
  let scatterPoints = gScatter.selectAll('circle').data(data);
  scatterPoints
        .on("click",(d) => console.log("("+d.a+", "+d.b+")"));
  scatterPoints
    .join(
      enter =>
        enter
          .append('circle')
          .attr("r","2")
          .attr("cx",(d)=>Math.round(aScale(d.a)))
          .attr("cy",(d)=>Math.round(bScale(d.b)))
          .append('title')
          .text((d)=> d.a+","+d.b),
      update =>
        update
        .attr("r","2")
        .attr("cx",(d)=>Math.round(aScale(d.a)))
        .attr("cy",(d)=>Math.round(bScale(d.b)))
        .select('title')
        .text((d)=> d.a+","+d.b),
      exit =>
        exit.remove()
    );
  svgScatter
    .append('g')
    .attr("transform","translate(20,280)")
    .call(xAxis);
  svgScatter
    
    .append('g')
    .attr("transform","translate(20,-20)")
    .call(yAxis);
  // ****** TODO: PART IV ******
}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
