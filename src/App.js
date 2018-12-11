import React, { Component } from 'react';
import './App.css';
import StartGame from './components/StartGame';
import {Container} from 'reactstrap';

class App extends Component {
  render() {
    return (
      <Container fluid>
        <StartGame />
      </Container>
      
    );
  }
}

export default App;
