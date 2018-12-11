import React, { Component } from 'react';
import { Jumbotron, Button } from 'reactstrap';

const words = [
  'This',
  'Is',
  'A',
  'Word',
  'List'
]

class StartGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      isDone: false,
      startTime: Date.now(),
      endTime: Date.now(),
      wordIndex: 0,
      wordList: [],
      currentWord: null
    };
  }


  startGame(e) {

    if (this.state.isRunning) { return; }
    const randoList = words.slice(0);
    const curWord = randoList[0];
    this.setState({
      isRunning: true,
      isDone: false,
      startTime: Date.now(),
      endTime: Date.now(),
      wordIndex: 0,
      wordList: randoList,
      currentWord: curWord
    });

    console.log(`started game:`)
    console.log(this.state);
    console.log(randoList);

  }

  NextWord(isCorrect) {
    console.log(`The word is ${isCorrect}`);
    const new_index = this.state.wordIndex + 1;
    if (new_index >= this.state.wordList.length) {
      this.setState({ isDone: true, isRunning: false, endTime: Date.now() })
      return
    }
    this.setState({
      wordIndex: new_index,
      currentWord: Object.assign(this.state.wordList[new_index])
    });
  }

  renderGameStart() {
    if (this.state.isRunning) {
      return null;
    }

    return (
      <Jumbotron>
        <h1 className="display-3">Abby's Word List!</h1>
        <p className="lead">
          <Button
            color="primary"
            onClick={(e) => this.startGame(e)}
          >Let's do this!</Button>
        </p>
      </Jumbotron>
    );
  }

  renderGameRunning() {
    if (!this.state.isRunning || this.state.isDone) {
      return null;
    }

    return (
      <Jumbotron>
        <h1 className="display-3">{this.state.currentWord}</h1>
        <p className="lead">
          <Button
            color="primary"
            onClick={(e) => this.NextWord(true)}
          >Correct!</Button>

          <Button
            color="primary"
            onClick={(e) => this.NextWord(false)}
          >Uh-oh!</Button>
        </p>
      </Jumbotron>
    );

  }

  renderGameResult() {
    if (!this.state.isDone) {
      return null;
    }

    // get total seconds between the times
    var delta = Math.abs(this.state.endTime - this.state.startTime) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;  // in theory the modulus is not required

    const show_minutes = minutes > 0;

    return (
      <div>
        <h1>Done!</h1>
        <h1>Time</h1>
        { show_minutes && <h2>Minutes: {minutes}</h2> }
        <h2>Seconds: {seconds}</h2>
      </div>
    );

  }

  render() {
    return (
      <div>
        {this.renderGameResult()}
        {this.renderGameStart()}
        {this.renderGameRunning()}
      </div>
    );
  }
}

// const StartGame = (props) => {

// };

export default StartGame;