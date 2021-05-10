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
    codeStatements: [], // array [{ statementType, preamble, points, end }...]
    currCodeStatement: INIT_CODE_STATEMENT,
    onFigure: 0,
  };
  static xScale; 
  static yScale;

  // pass as prop into Plot.js so xScale, yScale can be accessed at top level
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
    if (this.state.currCodeStatement !== INIT_CODE_STATEMENT) {
      // We check if the user just finished drawing something. If so, we draw lines between their points.
      if(this.state.currCodeStatement.statementType == "draw"){
          // Draw lines between points.
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
    // Next, we work on setting up their new TikZ code.
    // We update currCodeStatement, based on what type of statement the user wants.
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
  }

  updateCodeStatement = (newPoint) => {
    /* We update the TikZ code output (because the user clicked a new point). */
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
    d3.select("svg").selectAll(`.circle-fig_${this.state.onFigure}`).remove();
    this.setState({
      currCodeStatement: {
        ...this.state.currCodeStatement,
        points: [],
      }
    });
  }

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
