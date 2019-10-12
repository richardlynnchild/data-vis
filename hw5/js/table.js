/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData;

        ///** Store all match data for the 2018 Fifa cup */
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = null;


        /**For goal Column*/
        /** Use colors '#cb181d' and '#034e7b' for the range */
        this.goalColorScale = null;


        let maxGoals = Math.max(...this.teamData.map(country => parseInt(country.value["Goals Made"])));
        let minGoals = Math.min(...this.teamData.map(country => parseInt(country.value["Goals Made"])));
        this.goalScale = d3.scaleLinear().domain([0,maxGoals]).range([0,200]);

        let maxGames = Math.max(...this.teamData.map(country => parseInt(country.value["TotalGames"])));
        this.gameScale = d3.scaleLinear().domain([0,maxGames]).range([0,this.cell.width]);

        this.aggregateColorScale = d3.scaleLinear().domain([0,maxGames]).range(['#feebe2','#690000']);
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the axes
        let goalAxis = d3.axisTop();
        goalAxis.scale(this.goalScale);
        //add GoalAxis to header of col 1.
        d3.select("#goalHeader").append("svg")
                .attr("width","240")
                .attr("height","30");
        d3.select("#goalHeader svg").append('g')
                .attr("transform","translate(20,20)")
                .call(goalAxis);
        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        let _tableElements = this.tableElements;
        d3.selectAll('table thead tr:first-child th, table thead tr:first-child td')
            .on("click", function(){
                let col = this.innerHTML;
                console.log("col: " + col);
                console.log(_tableElements);
                _tableElements = _tableElements.sort(function(a,b){
                    switch (col) {
                        case "Team":
                            if(a.key < b.key){
                                return 1;
                            }
                            else {
                                return -1;
                            }
                        case "Goals":
                            return a.value["Delta Goals"] - b.value["Delta Goals"];
                        case "Round/Result":
                            return a.value["Result"].ranking - b.value["Result"].ranking;
                        case "Wins":
                            return a.value["Wins"] - b.value["Wins"];
                        case "Losses":
                            return a.value["Losses"] - b.value["Losses"];
                        case "Total Games":
                            return a.value["TotalGames"] - b.value["TotalGames"];

                    }
                });
            });
        this.tableElements = _tableElements;
        this.updateTable();

        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        console.log(this.tableElements);
        //Create table rows
        let tr = d3.select("tbody").selectAll("tr").data(this.tableElements)
                    .enter()
                    .append('tr');
                    
        
        //Append th elements for the Team Names
        tr.append('th');
        tr.select('th').text((d)=>d.key);
        //Append td elements for the remaining columns.
        let td = tr.selectAll('td').data(function(d) {
            let arr = [
                {
                    type:"aggregate",
                    vis:"goals",
                    value:[d.value["Goals Made"], d.value["Goals Conceded"]]
                },
                {
                    type:"aggregate",
                    vis:"text",
                    value:[d.value.Result.label]
                },
                {
                    type:"aggregate",
                    vis:"bar",
                    value:[d.value.Wins]
                },
                {
                    type:"aggregate",
                    vis:"bar",
                    value:[d.value.Losses]
                },
                {
                    type:"aggregate",
                    vis:"bar",
                    value:[d.value.TotalGames]
                }
            ];
            return arr;})
            .enter()
            .append('td');

        td.text(function(d) {
            return d.value;
        }); 
        
        let bars = td.filter((d) => {
            return d.vis == 'bar'
        });

        bars.text('');
        let _gameScale = this.gameScale;
        let _aggregateColorScale = this.aggregateColorScale;
        bars.append('svg')
            .attr('width',this.cell.width)
            .attr('height',this.cell.height)
            .append('rect')
            .attr('x',0)
            .attr('y',0)
            .attr('width',function(d) {
                return _gameScale(d.value);
            })
            .attr('height',this.cell.height)
            .attr('fill',function(d) {
                return _aggregateColorScale(d.value);
            });

        bars.selectAll('svg')
            .append('text')
            .text((d) => d.value)
            .attr('x', (d) => _gameScale(d.value)-10)
            .attr('y', this.cell.height/2 + 5)
            .attr('fill','white')
            .attr('stroke','white');

        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column
        let goals = td.filter((d) => {
            return d.vis == 'goals'
        });

        goals.text('')
        goals.append('svg')
            .attr('width','240')
            .attr('height','20')
        
        goals.selectAll('svg')
            .append('g')
            .attr('transform','translate(15,0)');

        let _goalScale = this.goalScale;

        goals.selectAll('g')
            .append('rect')
            .attr('x', function(d) {
                let made = d.value[0];
                let conceded = d.value[1];
                let xVal = 0;
                if(made > conceded){
                    xVal = _goalScale(conceded);
                }
                else {
                    xVal = _goalScale(made);
                }
                return xVal;
            })
            .attr('y', 2)
            .attr('width', function(d) {
                let diff = Math.abs(d.value[0]-d.value[1]);
                return _goalScale(diff);
            })
            .attr('height',16)
            .attr('fill', function(d) {
                if(d.value[0] > d.value[1]){
                    return '#6995AE'
                }
                else {
                    return '#E0767A'
                }
            });

        goals.selectAll('g')
            .append('circle')
            .attr('cx',function(d) {
                return _goalScale(d.value[0]);
            })
            .attr('cy',10)
            .attr('r',8)
            .attr('fill','blue')
            .append('title')
            .text((d)=> d.value[0]);
        
        goals.selectAll('g')
            .append('circle')
            .attr('cx',function(d) {
                return _goalScale(d.value[1]);
            })
            .attr('cy',10)
            .attr('r',8)
            .attr('fill','red')
            .append('title')
            .text((d)=> d.value[1]);

        //Set the color of all games that tied to light gray
        let tied = goals.filter(function(d) {
            return d.value[0] == d.value[1];
        });

        tied.selectAll('circle')
            .attr('fill','gray');

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
