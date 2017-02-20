import React, { Component } from 'react';
import firebase from 'firebase';


class FileUpload extends Component {
  constructor () {
    super();
    this.state = {
      uploadValue: 0,
      picture: null
    };
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
      this.setState({
        uploadValue: 100,
        picture: task.snapshot.downloadURL
      })
    })
  }

  render() {
    return (
      <div className="m-t-md">
        <progress value={this.state.uploadValue} max="100"></progress>
        <br/>
        <form className="form-upload">
          <div className="fileUpload btn btn-flat cyan">
            <span><i className="fa fa-camera" aria-hidden="true"></i>Upload Image</span>
            <input type="file" className="upload" onChange={this.handleUpload.bind(this)} />
          </div>
        </form>
        <br/>
        <img width="320" src={this.state.picture} alt=""></img>
      </div>
    );
  }
}

export default FileUpload;
