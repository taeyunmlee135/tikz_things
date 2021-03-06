import React, { Component } from 'react';
import * as d3 from 'd3'; 

import { AXIS_TOP_MARGIN, AXIS_RIGHT_MARGIN, AXIS_BOTTOM_MARGIN, AXIS_LEFT_MARGIN } from '../App';

const RADIUS = 3;

class Plot extends Component {
    static xScale;
    static yScale;

    componentDidMount() { 
        let { svg, svgDim, xScale, yScale } = this.props.initializeSvg();
        this.xScale = xScale;
        this.yScale = yScale;
        // Setting axis
        let xAxis = d3.axisBottom().scale(this.xScale);
        let yAxis = d3.axisLeft().scale(this.yScale);

        let circleAttrs = {
            cx: (d) => this.xScale(d.x),
            cy: (d) => this.yScale(d.y),
            r: RADIUS,
            fill : this.props.figColor // This gets updated a lot
        };

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
        if(this.props.currCodeStatement.preamble !== ""){
            // Extract data of clicked point
            let coords = d3.pointer(event);
            let newData = {
                x: Math.round(this.xScale.invert(coords[0])),  // Takes the pixel number to convert to number
                y: Math.round(this.yScale.invert(coords[1]))
            };
            
            // Draw point on the canvas
            this.props.updateCodeStatement(newData);
            svg.selectAll(`.circle-fig_${this.props.onFigure}`) 
                .data(this.props.currCodeStatement.points)
                .enter()
                .append("circle")
                .attr("cx", circleAttrs.cx)
                .attr("cy", circleAttrs.cy)
                .attr("r", circleAttrs.r)
                .attr("fill", this.props.figColor)
                .attr("class", `circle-fig_${this.props.onFigure}`)
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
        }
    }

    render() {
        return (
            <div style={{flex: "1", padding: "30px"}} id="plotWrapper">
                <div id="canvas" />
            </div>
        );
    }
    
}

export default Plot;
