import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.css'

import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: null,
      predictedImageData: null,
      cutImgs: null,
      isLoading: false,
    };

    this.fileInput = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  trim = async (img) => {
    this.startLoading()
    const response = await axios.post('http://127.0.0.1:5000/trimming', {
      post_img: img
    });
    this.endLoading()
    const data = response.data;
    const predict_img_base64 = data['predict']
    const cut_img_base64_list = data['cut_imgs']
    this.setState({
      predictedImageData: "data:image/png;base64," + predict_img_base64,
      cutImgs: cut_img_base64_list,
    })
  }

  handleSubmit = event => {
    this.trim(this.state.imageData)
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
  startLoading() {
    this.setState({
      isLoading: true,
    })
  }

  endLoading() {
    this.setState({
      isLoading: false,
    })
  }

  render() {

    const imageData = this.state.imageData
    let preview = ''
    if (imageData !== null) {
      preview = (
        <div>
          <img src={imageData} width={500} alt='' />
        </div>
      )
    } else {
      preview = (

        <div>
          <img src="https://smalistblog.com/wp-content/uploads/2021/07/%E6%A3%AE%E4%B8%83%E5%A5%88.jpg" width={400} alt='' />
        </div>
      )
    }

    let resetButton = ''
    if (imageData !== null) {
      resetButton = (
        <div>
          <button type="button" onClick={this.resetInput.bind(this)}>リセット</button>
        </div>
      )
    }

    const predictedImageData = this.state.predictedImageData
    let predictedImage = ''
    let saveButton = ''
    if (predictedImageData !== null) {
      predictedImage = (
        <div>
          <img src={predictedImageData} alt="predicted_img" width={500}></img>
        </div>
      )
      saveButton = (
        <button className='savebutton'
          onSubmit={(e) => {

          }}>
          SAVE</button>
      )
    } else {
      predictedImage = (
        <div>
          <img src="https://smalistblog.com/wp-content/uploads/2021/07/%E6%A3%AE%E4%B8%83%E5%A5%88.jpg" width={400} alt='' />
        </div>
      )
    }

    const cutImgsData = this.state.cutImgs
    let cutImgs = []
    if (cutImgsData !== null) {
      for (const cut_img_base64 of cutImgsData) {
        const cut_src = "data:image/png;base64," + cut_img_base64
        const cutImg = (
          <div className='relative'>
            <div className='cutimg'>
              <img src={cut_src} alt="cut_img" width={100}></img>
            </div>
            <div className='deletebutton'>
              ×
            </div>
          </div>
        )
        cutImgs.push(cutImg)
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const cut_src = "https://smalistblog.com/wp-content/uploads/2021/07/%E6%A3%AE%E4%B8%83%E5%A5%88.jpg"
        const cutImg = (
          <div className='relative'>
            <div className='cutimg'>
              <img src={cut_src} alt="cut_img" width={100}></img>
            </div>
            <div className='deletebutton'>
              ×
            </div>
          </div>
        )
        cutImgs.push(cutImg)
      }
    }

    if (this.state.isLoading) {
      return (
        <div className="App">
          <h1>Detect Leaf</h1>
          <h2>... Loading ...</h2>
        </div>
      )
    }
    return (
      <div className="App">

        <h1 className='h1'>Detect Leaf</h1>

        <form enctype="multipart/form-data"
          onSubmit={this.handleSubmit}>
          <label for='file' className='filelabel'>SELECT PUMPKIN IMAGE</label>
          <input type="file"
            id="file"
            name="file"
            accept="image/*,.png,.jpg,.jpeg"
            multiple={true}
            ref={this.fileInput}
            className='fileinput'
            onChange={(e) => {
              this.handleChange(e)
            }}
          />
          <br />
          <button type="submit" formmethod="post" className='postbutton'
            onSubmit={(e) => {
              this.handleSubmit(e)
            }}>
            POST</button>
          {saveButton}
          <div className='predictresult'>
            {preview}
            {predictedImage}
          </div>
          <div className='cutimgs'>
            {cutImgs}
          </div>
        </form>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
