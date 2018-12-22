import React, { Component } from 'react';
import './App.css';
import StartGame from './components/StartGame';
import {Container} from 'reactstrap';

class App extends Component {
  render() {
    return (
      <Container>
        <StartGame />
      </Container>
      
    );
  }
}

export default App;
