import React, { Component } from 'react';
import firebase from 'firebase';

import { Button } from 'react-materialize';

import  FileUpload from './fileUpload'
import './App.css';

class App extends Component {
  constructor () {
    super();
    this.state = {
      user: null
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    })
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleLogout () {

    firebase.auth().signOut()
      .then(result => console.log(`Ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  renderLoginButton () {
    if(this.state.user){
      return (
        <div className="App">
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} className="avatar m-t-md"></img>
          <p>Hola {this.state.user.displayName}!</p>
          <Button waves='light' className="grey" onClick={this.handleLogout}>Salir</Button>
          <FileUpload />
        </div>
      );
    }
    else{
      return(
        <Button waves='light' className="red m-t-md" onClick={this.handleAuth}>Login con Google</Button>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <div className="App-intro">
          { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;
