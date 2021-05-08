import React, { Component } from 'react';
import './App.css';

import { Toggle } from './components/utilComps';
import CodeStatement from './components/CodeStatement';
import Plot from './components/Plot';

class App extends Component {
  state = {
    theme: "light",
    coordinates: [],
  };

  render() {
    console.log(this.state);
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
            updateCodeStatement={() => {}} 
            theme={this.state.theme}
          />
          <div className="button-and-code">
            <div style={{width: "100%"}}>
              {/* <AddDraw /> 
              <AddNode />
              <Redraw /> */}
              <div id="theme-selection">
                  <Toggle 
                    onSwitchOn={() => {this.setState({theme: 'dark'})}}
                    onSwitchOff={() => {this.setState({theme: 'light'})}}
                  />
                  <p> Dark Mode </p>
              </div>
            </div>
            <CodeStatement coordinates={this.state.coordinates} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
