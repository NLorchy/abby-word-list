import React, { Component } from 'react';
import { Jumbotron, Button, Row, Col, Progress, FormGroup, Label, Input } from 'reactstrap';
import { shuffle } from '../shuffle';
import wordlist1 from '../wordlist1';
import wordlist2 from '../wordlist2';
import wordlist3 from '../wordlist3';
import emmyWordList from "../emmy_wordlist";

const word_lists = {
  "wordlist1":wordlist1,
  "wordlist2":wordlist2,
  "wordlist3":wordlist3,
  "emmyList1":emmyWordList,
};

const word_list_choices = {
  "wordlist1":"List 1",
  "wordlist2":"List 2",
  "wordlist3":"List 3",
  "emmyList1":"Emmy 1",
};

class StartGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false,
      isDone: false,
      startTime: Date.now(),
      endTime: Date.now(),
      wordIndex: 0,
      progressValue: 0,
      numWords: wordlist1.length,
      listToUse: "wordlist1",
      wordList: [],
      currentWord: null,
      wordOptions:[100, 80, 60, 40, 20],
      shuffleWords: false,
    };

    this.handleWordChange = this.handleWordChange.bind(this);
    this.handleListSelect = this.handleListSelect.bind(this);
    this.handleShuffleChange = this.handleShuffleChange.bind(this);
  }

  handleWordChange(event) {
    this.setState({numWords: event.target.value});
  }

  handleListSelect(event) {
    console.log(event);
    const num_words = word_lists[event.target.value].length;
    console.log('num words: ',num_words)
    let word_options = [100,80,60,40,20];
    if (num_words < 100)
    {
      word_options = [num_words, 20, 15, 10]
    }
    this.setState({
      listToUse: event.target.value,
      wordOptions: word_options.slice(0)
    });
  }

  handleShuffleChange(event){
    const shuffleWords = !this.state.shuffleWords;
    this.setState({
      shuffleWords
    })
  }


  startGame(e) {

    if (this.state.isRunning) {
      return;
    }

    var randoList = [];
    if (this.state.shuffleWords) {
      randoList = word_lists[this.state.listToUse].slice(0);
      shuffle(randoList);
      randoList = randoList.slice(0, this.state.numWords);
    } else {
      randoList = word_lists[this.state.listToUse].slice(0, this.state.numWords);
    }

    shuffle(randoList);
    
    // var randoList = wordlist2.slice(0);
    const curWord = randoList[0];
    this.setState({
      isRunning: true,
      isDone: false,
      startTime: Date.now(),
      endTime: Date.now(),
      progressValue: 0,
      numWords: randoList.length,
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
    let new_list = this.state.wordList.slice(0);
    let progress_val = this.state.progressValue;
    if (isCorrect === true) {
      new_list.splice(0, 1);
      progress_val = ((this.state.numWords - new_list.length) / this.state.numWords) * 100;
      console.log(new_list);
    }
    else {
      shuffle(new_list);
      console.log(new_list);
    }


    if (new_list.length > 0) {
      // update
      this.setState({
        wordList: new_list,
        currentWord: Object.assign(new_list[0]),
        progressValue: progress_val
      });
    }
    else {
      // game is over
      this.setState({ isDone: true, isRunning: false, endTime: Date.now() })
    }

  }

  renderGameStart() {
    if (this.state.isRunning) {
      return null;
    }

    return (
      <Row>
        <Col>
          <Jumbotron>
            <h1 className="display-3">Family Word List!</h1>
            <br />
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}><Button block
                color="primary" size="lg"
                onClick={(e) => this.startGame(e)}
              >Let's do this!</Button></Col>
            </Row>
          </Jumbotron>

        </Col>
      </Row>

    );
  }

  renderGameSelect() {
    if (this.state.isRunning) {
      return null;
    }

    return (
      <Row>
        <Col>
          <Jumbotron>
            <h1 className="display-3">Family Word List!</h1>
            <br />
            <Row>
              <Col>
              <FormGroup>
                <Label for="numWords">Number of Words</Label>
                <Input type="select" name="select" id="numWords" onChange={this.handleWordChange} defaultValue={this.state.wordOptions[0]}>
                  {this.state.wordOptions.map(item => <option key={`numWord-${item}`}>{item}</option>)}
                </Input>
              </FormGroup>
              </Col>
              <Col>
              <FormGroup>
                <Label for="wordlist">Wordlist</Label>
                <Input type="select" name="wordlistSelect" id="wordlist" onChange={this.handleListSelect}  defaultValue={this.state.listToUse}>
                  {
                    Object.keys(word_list_choices).map(key => {
                      const val = key;
                      return (<option value={val} key={`wordlist-${key}`}>{word_list_choices[key]}</option>)
                    })
                  }
                </Input>
              </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={1}></Col>
              <Col>
              <FormGroup>
                <Label for="shuffleSelect">
                  <Input type="checkbox" name="shuffleInput" id="shuffleSelect" onChange={this.handleShuffleChange} checked={this.state.shuffleWords} />
                  Random words
                </Label>
              </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}><Button block
                color="primary" size="lg"
                onClick={(e) => this.startGame(e)}
              >Let's do this!</Button></Col>
            </Row>
          </Jumbotron>

        </Col>
      </Row>

    );
  }

  renderGameRunning() {
    if (!this.state.isRunning || this.state.isDone) {
      return null;
    }

    const percentDone = Math.ceil(this.state.progressValue);
    const percentStr = `${percentDone} %`

    return (
      <Row>
        <Col>
          <Jumbotron>
            <h1 className="present-word">{this.state.currentWord}</h1>
            <br />
            <Row>
              <Col>
                <Button
                  color="secondary" size="lg"
                  onClick={(e) => this.NextWord(false)}
                  block
                >Uh-oh!</Button>
              </Col>
              <Col>
                <Button
                  color="success" size="lg"
                  onClick={(e) => this.NextWord(true)}
                  block
                >Correct!</Button>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <Progress value={this.state.progressValue}>{percentStr}</Progress>
              </Col>
            </Row>
          </Jumbotron>
        </Col>
      </Row>
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
    const seconds = Math.floor(delta % 60);  // in theory the modulus is not required

    const time_str = `Time: ${minutes}:${seconds}`;

    return (
      <Row>
        <Col>
          <h1 className="present-word">Done!</h1>
          <h1 className="present-word">Words: {this.state.numWords}</h1>
          <h1 className="present-word">{time_str}</h1>
        </Col>
      </Row>
    );

  }

  render() {
    return (
      <div>
        {this.renderGameResult()}
        {this.renderGameSelect()}
        {this.renderGameRunning()}
      </div>

    );
  }
}

// const StartGame = (props) => {

// };

export default StartGame;