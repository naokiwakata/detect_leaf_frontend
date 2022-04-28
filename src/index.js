import React from 'react';
import ReactDOM from 'react-dom';

import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: null,
    };

    this.fileInput = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  trimmingImage = img => {
    axios.post('http://127.0.0.1:5000/trimming', {
      post_img: img
    }).then(function (res) {
      console.log(res)
      alert(res.data.result);
    })
  };

  handleSubmit = event => {
    this.trimmingImage(this.state.imageData)
    event.preventDefault();
  };

  handleChange(event) {
    const files = event.target.files

    if (files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.setState({ imageData: e.target.result })
      };
      reader.readAsDataURL(file)
    } else {
      this.setState({ imageData: null })
    }
  }

  resetInput() {
    this.fileInput.current.value = ''
    this.setState({ imageData: null })
  }

  render() {

    const imageData = this.state.imageData
    let preview = ''
    if (imageData !== null) {
      preview = (
        <div>
          <img src={imageData} width={300} alt='' />
        </div>
      )
    } else {
      preview = (
        <p>No image</p>
      )
    }

    let resetButton = ''
    if (imageData !== null) {
      resetButton = (
        <div>
          <button type="button" onClick={this.resetInput.bind(this)}>リセットする</button>
        </div>
      )
    }


    return (
      <div className="App">
        <h1>Detect Leaf</h1>
        <form enctype="multipart/form-data"
          onSubmit={this.handleSubmit}>
          <input type="file"
            name="file"
            accept="image/*,.png,.jpg,.jpeg"
            multiple={true}
            ref={this.fileInput}
            onChange={(e) => {
              this.handleChange(e)
            }}
          />
          <br />
          <button type="submit" formmethod="post"
            onSubmit={(e) => {
              this.handleSubmit(e)
            }}>
            POST</button>
          {preview}
          {resetButton}
        </form>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
