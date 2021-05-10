import React, { Component } from 'react';
import './App.css';

import { Toggle, CmdButton } from './components/utilComps';
import CodeStatement from './components/CodeOutput';
import Plot from './components/Plot';

import * as d3 from 'd3';

export const AXIS_TOP_MARGIN = 10; 
export const AXIS_RIGHT_MARGIN = 10;
export const AXIS_BOTTOM_MARGIN = 30; 
export const AXIS_LEFT_MARGIN = 30;
// Colors of the points on the canvas
export const colors = [
  "rgb(50, 149, 237)", 
  "rgb(51, 88, 255)",
  "rgb(172, 18, 255)", 
  "rgb(255, 0, 0)",
  "rgb(255, 144, 0)",
  "rgb(0, 196, 3)", 
  "rgb(51, 204, 255)",
  "rgb(0, 102, 153)",
  "rgb(255, 0, 238)",
  "rgb(50, 149, 237)", 
];

const INIT_CODE_STATEMENT = {
  statementType : "", // E.g., "draw"
  preamble : "",       // E.g., "\draw plot ..."
  points : [],          // E.g., "[... (x_1, y_1), (x_2, y_2)...]"
  end: ""              // E.g., "... };"
};

class App extends Component {
  state = {
    theme: "light",
    // coordinates: [],
    codeStatements: [], // array [{ statementType, preamble, points, end }...]
    currCodeStatement: INIT_CODE_STATEMENT,
    onFigure: 0,
    // figures: { // "figures" maintains an object of arrays; each array is an (x,y) list of points which makes up a figure.
    //   fig_0 : []
    // },
  };
  static xScale; 
  static yScale;

  // initializeSvg --> pass as prop into Plot.js (?) 
  initializeSvg = () => {
    const bounds = document.getElementById("plotWrapper").getBoundingClientRect(); 
    const svgDim = Math.min(bounds.right, bounds.bottom) - 150;

    // Setting x axis scale
    this.xScale = d3.scaleLinear()
                        .domain([0, 100]) // input values
                        .range([0, svgDim-AXIS_LEFT_MARGIN-AXIS_RIGHT_MARGIN]); // [x,y] controls position of x-axis

    this.yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([svgDim-AXIS_TOP_MARGIN-AXIS_BOTTOM_MARGIN, 0]);
    
    const svg = d3.select("#canvas").append("svg")
                        .attr("width", svgDim)
                        .attr("height", svgDim);
    
    return { svg, svgDim, xScale: this.xScale, yScale: this.yScale };
  }

  createCodeStatement = (statementType) => {
    // First, we check if this is not the first figure the user has drawn.
    // if (this.state.onFigure !== 0){
    if (this.state.currCodeStatement !== INIT_CODE_STATEMENT) {
      // We check if the user just finished drawing something. If so, we draw lines between their points.
      if(this.state.currCodeStatement.statementType == "draw"){
          // Draw lines between points.
          // current_fig = figures[`fig_${on_figure}`]; 
          const currPoints = this.state.currCodeStatement.points;
          for(let i = 0; i < currPoints.length; i++){ // Loop over (x,y) coordinates; connect a line from (x_i,y_i) to (x_{i+1}, y_{i+1}). 
              if(i == currPoints.length-1){
                d3.select("svg").append('line')
                .style("stroke", colors[this.state.onFigure])
                .style("stroke-width", 1)
                .attr("x1", this.xScale(currPoints[0].x))
                .attr("y1", this.yScale(currPoints[0].y))
                .attr("x2", this.xScale(currPoints[i].x))
                .attr("y2", this.yScale(currPoints[i].y));             
              }
              else{
                d3.select("svg").append('line')
                .style("stroke", colors[this.state.onFigure])
                .style("stroke-width", 1)
                .attr("x1", this.xScale(currPoints[i].x))
                .attr("y1", this.yScale(currPoints[i].y))
                .attr("x2", this.xScale(currPoints[i+1].x))
                .attr("y2", this.yScale(currPoints[i+1].y)); 
              }
            }
          }
      // We update global variables now that we are on a different figure. 
      // save previous codeStatement into this.state.codeStatements
      // reinitialize currCodeStatement 
      let updatedCodeStatements = [...this.state.codeStatements];
      updatedCodeStatements.push(this.state.currCodeStatement);
      this.setState({
        codeStatements: updatedCodeStatements,
        currCodeStatement: INIT_CODE_STATEMENT,
        onFigure: this.state.onFigure+1 // Very important. Let's all other functions know that, from now on, we're moving onto a different drawing 
      }); 
    }

    
    // this.state.figures[`fig_${this.state.onFigure}`] = []; // Initialize array which will contain new incoming (x,y) coordinates.
    // circleAttrs["fill"] = colors[on_figure]; // Give it a different color.
      
    


    // Next, we work on setting up their new TikZ code.
    // We create a new span element for the incoming TikZ code
    // let newTikZCode = document.createElement("span");

    // We update currCodeStatement, and the span id, based on what type of statement the user wants.
    if (statementType === "draw"){
      this.setState({
        currCodeStatement: {
          statementType: "draw",
          preamble: "\\draw plot[closed hobby] coordinates { \n\n\n",
          points: [],
          end: "};\n",
        }
      });
    }
    else if (statementType === "node"){
      this.setState({
        currCodeStatement: {
          statementType: "node",
          preamble: "\\node at ",
          points: [],
          end: "{};\n",
        }
      });
    }

    // let newTikZCode = 
    //   <div style={{color: colors[this.state.onFigure]}} id={`statement-fig_${this.state.onFigure}`}>
    //     {`${this.state.currCodeStatement.preamble} ${this.state.currCodeStatement.end}`}
    //   </div>;

    // let updatedCoords = [...this.state.coordinates]
    // updatedCoords.push(newTikZCode);
    
    // this.setState({
    //   coordinates: updatedCoords
    // });
    
    // // Edit TikZ code span tag
    // newTikZCode.id = `statement-fig_${onFigure}`;
    // newTikZCode.innerHTML = currCodeStatement.preamble + currCodeStatement.end;
    // newTikZCode.style = "color:" + colors[onFigure];

    // // Add the new span element to HTML 
    // document.getElementById("coordinates").appendChild(newTikZCode);

  }

  updateCodeStatement = (newPoint) => {
    // console.log('updating code statement', newPoint);
    /* We update the TikZ code output (because the user clicked a new point). 
       We do this by 
        1. Figuring out where in our string (coordinates.innerHTML) to add the new coordinate to the TikZ command
        2. Add the new coordinate 
        3. Update the TiKZ command
    */
    // let current_id = `statement-fig_${this.state.onFigure}`;
    // let n_Chars = document.getElementById(current_id).innerHTML.length; 
    // let n_endCodeChars = this.state.currCodeStatement.end.length;

    // let newStatement = document.getElementById(current_id).innerHTML.substring(0, n_Chars - n_endCodeChars); //We've figured out where to add our coordinate.
    // newStatement += this.state.currCodeStatement.point ; // Add the new coordinate 
    // newStatement += this.state.currCodeStatement.end;    // Add the end code, e.g., it could be "};"
    // document.getElementById(current_id).innerHTML = newStatement;     // Update the page with the new TikZ code

    // append newPoint to currCodeStatement.points
    let updatedPoints = [...this.state.currCodeStatement.points];
    updatedPoints.push(newPoint);
    this.setState({
      currCodeStatement: {
        ...this.state.currCodeStatement,
        points: updatedPoints
      }
    });
    console.log('updated points', this.state);
  }

  redoCurrentStatement = () => {
    // let tuples = figures["fig_" + String(on_figure)];
    // for(let i = 0; i < tuples.length; i++){
    //     d3.select("#c" + "-" + "fig_" + String(on_figure) + "-" + i).remove(); //remove the circles
    //     points.pop(); //remove the circle's data from "points"
    // }
    // figures["fig_" + String(on_figure)] = [];
    // document.getElementById("statement-fig_" + String(on_figure)).innerHTML = currCodeStatement.preamble + currCodeStatement.end;
    
    d3.select("svg").selectAll(`.circle-fig_${this.state.onFigure}`).remove();
    this.setState({
      currCodeStatement: {
        ...this.state.currCodeStatement,
        points: [],
      }
    })
}

  // // not sure if this is necessary
  // getAllPoints = () => {
  //   let allPoints = [];
  //   this.state.codeStatements.forEach((cs) => allPoints.concat(cs.points));
  //   allPoints.concat(this.state.currCodeStatement.points);
  // }

  render() {
    return (
      <div className={`App ${this.state.theme}`}>
        <div id="text-heading">
            <div id="description">Simple Canvas For Control Points
                <p id="sub_description">
                Before you can draw, you need to select a code statement.
                Select "add <span className="codefont">\draw</span>" to create a TikZ <span className="codefont">\draw</span> statement. "add <span className="codefont">\node</span>" works 
                similarly.
                </p>
            </div>
        </div>
        <div id="main-body-parent">
            {/* figures={this.getAllPoints()} */}
          <Plot 
            initializeSvg={this.initializeSvg}
            figColor={colors[this.state.onFigure]}
            currCodeStatement={this.state.currCodeStatement}
            updateCodeStatement={this.updateCodeStatement} 
            theme={this.state.theme}
            onFigure={this.state.onFigure}
          />
          <div className="button-and-code">
            <div style={{width: "100%"}}>
              <CmdButton onClick={() => this.createCodeStatement("draw")} label={"Add \\draw"} /> 
              <CmdButton onClick={() => this.createCodeStatement("node")} label={"Add \\node"} /> 
              <CmdButton onClick={this.redoCurrentStatement} label={"Redo Current Statement"} /> 
              <div id="theme-selection">
                  <Toggle 
                    onSwitchOn={() => {this.setState({theme: 'dark'})}}
                    onSwitchOff={() => {this.setState({theme: 'light'})}}
                  />
                  <p> Dark Mode </p>
              </div>
            </div>
            <CodeStatement 
              codeStatements={this.state.codeStatements} 
              currCodeStatement={this.state.currCodeStatement}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
