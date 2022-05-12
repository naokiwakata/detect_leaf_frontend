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
      filename: null,
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

  removeCutImg = index => {
    let array = this.state.cutImgs;
    array.splice(index, 1);
    this.setState({
      cutImgs: array
    });
  }

  saveFile() {
    const cutImgsData = this.state.cutImgs

    cutImgsData.forEach((cut_img_base64, index) => {

      const id = "cut_img_save"
      const element = document.getElementsByClassName({ id })
      element.click()
      console.log(`${index}: ${cut_img_base64}`)
      const downloadName = String(index) + this.state.filename;
      const cut_src = "data:image/png;base64," + cut_img_base64

      const image = fetch(cut_src);
      const imageBlob = image.blob();
      const imageURL = URL.createObjectURL(imageBlob);

      // 拡張子取得
      const mimeTypeArray = imageBlob.type.split('/');
      const extension = mimeTypeArray[1];

      // ダウンロード
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      const filename = file['name']
      const reader = new FileReader()
      reader.onload = (e) => {
        this.setState({
          imageData: e.target.result,
          filename: filename,
        })
      };
      reader.readAsDataURL(file)
    } else {
      this.setState({
        imageData: null,
        filename: null,
      })
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
          onClick={
            () => this.saveFile()
          }>
          SAVE</button>
      )
    }

    const cutImgsData = this.state.cutImgs
    let cutImgs = []
    if (cutImgsData !== null) {
      for (let i = 0; i < cutImgsData.length; i++) {
        const filename = this.state.filename;
        const downloadName = filename.split('.')[0] + "_" + String(i)
        const cut_img_base64 = cutImgsData[i];
        const cut_src = "data:image/png;base64," + cut_img_base64
        const cutImg = (
          <div className='relative'>
            <a href={cut_src} className="cut_img_save" download={downloadName}>
              save
            </a>
            <div className='cutimg'>
              <img src={cut_src} alt="cut_img" width={100}></img>
            </div>
            <div className='deletebutton' onClick={
              () => this.removeCutImg(i)
            }>
              ×
            </div>
          </div >
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


        <div className='button'>
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
          </form>
        </div>

        <div className='predictresult'>
          {preview}
          {predictedImage}
        </div>
        <div className='cutimgs'>
          {cutImgs}
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
