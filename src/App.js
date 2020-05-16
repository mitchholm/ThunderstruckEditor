import React from 'react';
import Nav from './Nav.js';
import Waveform from './Waveform.js';
import ImageEditor from './ImageEditor.js';
import PropertiesInput from './PropertiesInput.js';
import './App.css';

function Store(initialState = {}) {
  this.state = initialState;
}

Store.prototype.mergeState = function (partialState) {
  Object.assign(this.state, partialState);
};

Store.prototype.getState = function () { 
  return this.state;
}

var myStore = new Store();

function App() {
  return (
    <div className="App"> 
      <Nav pageName="Home"/>    
      <div className="appbody">
        <Waveform mergeState={myStore.mergeState.bind(myStore)} getState={myStore.getState.bind(myStore)}/>
        <ImageEditor mergeState={myStore.mergeState.bind(myStore)} getState={myStore.getState.bind(myStore)}/>
        <PropertiesInput mergeState={myStore.mergeState.bind(myStore)} getState={myStore.getState.bind(myStore)}/>
      </div>
    </div>
  );
}

export default App;
