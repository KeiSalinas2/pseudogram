import React, { Component } from 'react';

class FileUpload extends Component {

  render() {
    return (
      <div className="m-t-md">
        <form className="form-upload">
          <div className="fileUpload btn btn-flat cyan">
            <span><i className="fa fa-camera" aria-hidden="true"></i>Upload Image</span>
            <input type="file" className="upload" onChange={this.props.onUpload} />
          </div>
        </form>
      </div>
    );
  }
}

export default FileUpload;
