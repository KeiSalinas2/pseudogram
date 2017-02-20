import React, { Component } from 'react';
import firebase from 'firebase';

import { Button } from 'react-materialize';

import  FileUpload from './fileUpload'
import './App.css';

class App extends Component {
  constructor () {
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
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

  handleUpload (event) {
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`/pictures/${file.name}`)
    const task = storageRef.put(file)

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }
      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    })
  }

  renderLoginButton () {
    if(this.state.user){
      return (
        <div className="App">
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} className="avatar m-t-md"></img>
          <p className="welcome">¡Hola {this.state.user.displayName}!</p>
          <Button waves='light' className="grey" onClick={this.handleLogout}>Salir</Button>
          <FileUpload onUpload={this.handleUpload}/>
          {
            this.state.pictures.map((picture, index) => (
              <div className="row" key={index}>
                <div className="col s12 m10 offset-m1 l6 offset-l3">
                  <div className="card">
                    <div className="card-image">
                      <img className="activator" src={picture.image} alt={picture.displayName}/>
                    </div>
                    <div className="card-content">
                      <div className="user-content">
                        <img src={picture.photoURL} className="user-avatar" alt={picture.displayName} />
                        <span className="user-name">{picture.displayName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )).reverse()
          }
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
