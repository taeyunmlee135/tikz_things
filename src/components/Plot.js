import React, { Component } from 'react';
import * as d3 from 'd3'; 

// // Circles to mark points on canvas
// const circleAttrs = {
//     cx: (d) => xScale(d.x),
//     cy: (d) => yScale(d.y),
//     r: RADIUS,
//     fill : "rgb(50, 149, 237)" // This gets updated a lot
// };

// Colors of the points on the canvas
const colors = ["rgb(50, 149, 237)", 
"rgb(51, 88, 255)",
"rgb(172, 18, 255)", 
"rgb(255, 0, 0)",
"rgb(255, 144, 0)",
"rgb(0, 196, 3)", 
"rgb(51, 204, 255)",
"rgb(0, 102, 153)",
"rgb(255, 0, 238)",
"rgb(50, 149, 237)", 
]


const AXIS_TOP_MARGIN = 10; 
const AXIS_RIGHT_MARGIN = 10;
const AXIS_BOTTOM_MARGIN = 30; 
const AXIS_LEFT_MARGIN = 30;

const RADIUS = 3;



class Plot extends Component {
    state = {
        currCodeStatement: {
            statementType : "", // E.g., "draw"
            preamble : "\draw plot",       // E.g., "\draw plot ..."
            point : "",          // E.g., "... (x_1, y_1), (x_2, y_2)..."
            end: ""              // E.g., "... };"
        },
        points: [], // Initialize set of all points on canvas
        currFigure: 0, // Keeps track of which figure the user is editing
        figures: { // "figures" maintains an object of arrays; each array is an (x,y) list of points which makes up a figure.
            fig_0 : []
        },
    }
    static xScale; 
    static yScale;

    componentDidMount() {
        const bounds = document.getElementById("plotWrapper").getBoundingClientRect(); 
        const svgDim = Math.min(bounds.right, bounds.bottom) - 150;

        // Setting x axis scale
        this.xScale = d3.scaleLinear()
                            .domain([0, 100]) // input values
                            .range([0, svgDim-AXIS_LEFT_MARGIN-AXIS_RIGHT_MARGIN]); // [x,y] controls position of x-axis

        this.yScale = d3.scaleLinear()
                            .domain([0, 100])
                            .range([svgDim-AXIS_TOP_MARGIN-AXIS_BOTTOM_MARGIN, 0]);  

        // Setting axis
        let xAxis = d3.axisBottom().scale(this.xScale);
        let yAxis = d3.axisLeft().scale(this.yScale);

        let circleAttrs = {
            cx: (d) => this.xScale(d.x),
            cy: (d) => this.yScale(d.y),
            r: RADIUS,
            fill : "rgb(50, 149, 237)" // This gets updated a lot
        };

        const svg = d3.select("#canvas").append("svg")
                                .attr("width", svgDim)
                                .attr("height", svgDim);
        
        svg.append("g")
                .attr("class", `${this.props.theme}-axis`)
                .attr("transform", `translate(${[AXIS_LEFT_MARGIN, svgDim-AXIS_BOTTOM_MARGIN]})`)  //[x, y] controls position 
                .attr("id", "x-axis")
                .call(xAxis);
        svg.append("g")
                .attr("class", `${this.props.theme}-axis`)
                .attr("transform", `translate(${[AXIS_LEFT_MARGIN, AXIS_TOP_MARGIN]})`)
                .attr("id", "y-axis")
                .call(yAxis);

        svg.on("click", (event) => this.handleSvgClick(event, svg, circleAttrs));
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.theme !== this.props.theme) {
            d3.select("#x-axis").attr("class", `${this.props.theme}-axis`);
            d3.select("#y-axis").attr("class", `${this.props.theme}-axis`);
        }
    }
    
    handleMouseOver = (event, d) => {  // Hovering enlarges the radius, prompts textbox
        d3.select(event.target).attr("r", RADIUS*2);
    
        // The textbox
        d3.select("svg").append("text")
            .attr("id", `t${d.x}-${d.y}-${d3.select("svg").nodes().indexOf(this)}`)
            .attr("x", () => this.xScale(d.x) - 30)
            .attr("y", () => this.yScale(d.y) - 15)
            .attr("class", `${this.props.theme}`)
            .text(() => [d.x, d.y]); // Textbox data
    }

    handleMouseOut = (event, d) => {
        d3.select(event.target).attr("r", RADIUS);
        // When we're done hovering, remove textbox
        d3.select(`#t${d.x}-${d.y}-${d3.select("svg").nodes().indexOf(this)}`).remove(); 
    }

    handleSvgClick = (event, svg, circleAttrs) => {    
        console.log('click');
        if(this.state.currCodeStatement.preamble !== ""){
            // Extract data of clicked point
            let coords = d3.pointer(event);
            let newData = {
                x: Math.round(this.xScale.invert(coords[0])),  // Takes the pixel number to convert to number
                y: Math.round(this.yScale.invert(coords[1]))
            };

            this.state.currCodeStatement.point = `(${newData.x/10}, ${newData.y/10}) `;
            
            // Draw point on the canvas
            this.state.points.push(newData);
            // this.state.figures["fig_"+ String(this.state.currFigure)].push(newData); // adds point to the new figure
            this.state.figures[`fig_${this.state.currFigure}`].push(newData); // adds point to the new figure
            this.props.updateCodeStatement();
            svg.selectAll("circle") 
                .data(this.state.points)
                .enter()
                .append("circle")
                .attr("cx", circleAttrs.cx)
                .attr("cy", circleAttrs.cy)
                .attr("r", circleAttrs.r)
                .attr("fill", circleAttrs.fill)
                // .attr({id: "c" + "-" + "fig_" + String(this.state.currFigure) + "-" + String(this.state.figures["fig_"+ String(this.state.currFigure)].length-1)})
                .attr("id", `c-fig_${this.state.currFigure}-${this.state.figures[`fig_${this.state.currFigure}`].length-1}`)
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
        }
    }

    render() {
        return (
            <div style={{flex: "1", padding: "30px"}} id="plotWrapper">
                {/* <svg width={100} height={100}>
                <circle cx={4} cy={10} r={30} /> 

                </svg> */}

                <div id="canvas">
                </div>

            </div>
        );
    }
    
}

export default Plot;
