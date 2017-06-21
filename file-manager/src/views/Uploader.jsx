import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import getFileIconByExtension from '../helpers/FileIconByExtention'

export default class Uploader extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isActive: false,
      unzipArchives: true,
      keywords: ''
    };
    this.activeDrag = 0;
    this.fileInput = null;
    this.onClick = this.onClick.bind(this);
    this.onUploadButtonClick = this.onUploadButtonClick.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onTextareaTextChange = this.onTextareaTextChange.bind(this);
    this.onUnzipChange = this.onUnzipChange.bind(this);
  }
  
  onUnzipChange(e) {
    this.setState({unzipArchives: e.target.checked})
  }
  
  onTextareaTextChange(e) {
    this.setState({keywords: e.target.value.trim()})
  }
  
  onClick() {
    this.fileInput.click();
  }
  
  onFileSelect() {
    const items = this.filesToItems(this.fileInput.files);
    this.setState({items});
  }
  
  onDragEnter() {
    this.activeDrag += 1;
    this.setState({isActive: this.activeDrag > 0});
  }
  
  onDragOver(e) {
    if (e) {
      e.preventDefault();
    }
    return false;
  }
  
  onDragLeave() {
    this.activeDrag -= 1;
    if (this.activeDrag === 0) {
      this.setState({isActive: false});
    }
  }
  
  onDrop(e) {
    if (!e) {
      return;
    }
    e.preventDefault();
    this.activeDrag = 0;
    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : [];
    const items = this.filesToItems(droppedFiles);
    this.setState({isActive: false, items});
  }
  
  cancelFile(index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {cancelled: true});
    this.setState({items: newItems});
  }
  
  onUploadButtonClick() {
    const items = this.state.items;
    if (items) {
      items.filter(item => !item.cancelled).forEach((item) => {
        this.uploadItem(item);
      });
    }
  }
  
  uploadItem(item) {
    if (this.props.chunks) {
      const BYTES_PER_CHUNK = this.props.chunkSize;
      const SIZE = item.file.size;
      
      let start = 0;
      let end = BYTES_PER_CHUNK;
      
      const chunkProgressHandler = (percentage, chunkIndex) => {
        this.updateFileChunkProgress(item.index, chunkIndex, percentage);
      };
      let chunkIndex = 0;
      while (start < SIZE) {
        this.uploadChunk(item.file.slice(start, end), chunkIndex += 1, item.file.name, chunkProgressHandler);
        start = end;
        end = start + BYTES_PER_CHUNK;
      }
    } else {
      this.uploadFile(item.file, progress => this.updateFileProgress(item.index, progress));
    }
  }
  
  uploadChunk(blob, chunkIndex, fileName, progressCallback) {
    if (blob) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      
      formData.append(this.props.fieldName, blob, `${fileName}-chunk${chunkIndex}`);
      
      xhr.onload = () => {
        progressCallback(100, chunkIndex);
      };
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressCallback((e.loaded / e.total) * 100, chunkIndex);
        }
      };
      xhr.open(this.props.method, this.props.url, true);
      xhr.send(formData);
    }
  }
  
  uploadFile(file, progressCallback) {
    if (file) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      
      formData.append(this.props.fieldName, file, file.name);
      
      xhr.onload = () => {
        progressCallback(100);
      };
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressCallback((e.loaded / e.total) * 100);
        }
      };
      
      xhr.open(this.props.method, this.props.url, true);
      xhr.send(formData);
    }
  }
  
  updateFileChunkProgress(index, chunkIndex, progress) {
    const newItems = [...this.state.items];
    const currentItem = this.state.items[index];
    const newProgressArr = [...currentItem.chunkProgress];
    const totalProgress = newProgressArr.reduce((a, b) => a + b) / (newProgressArr.length - 1);
    // -1 because there is always single chunk for "0" percentage pushed as chunkProgress.push(0) in method filesToItems)
    newProgressArr[chunkIndex] = progress;
    newItems[index] = Object.assign({}, currentItem, {chunkProgress: newProgressArr, progress: totalProgress});
    this.setState({items: newItems}, this.clearIfAllCompleted);
  }
  
  updateFileProgress(index, progress) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {progress});
    this.setState({items: newItems}, this.clearIfAllCompleted);
  }
  
  clearIfAllCompleted() {
    console.log('Completed');
    let me = this;
    if (this.props.clearTimeOut > 0) {
      const completed = this.state.items.filter(item => item.progress === 100).length;
      if (completed === this.state.items.length) {
        setTimeout(() => {
          me.setState({items: []});
          me.props.onUploadComplete();
        }, this.props.clearTimeOut);
      }
    }
    
  }
  
  renderKeyWordsInput() {
    return (
      <div className="fields-container">
        <label>Keywords</label>
        <textarea
          ref="keywordsTextarea"
          onChange={this.onTextareaTextChange}></textarea>
      </div>);
  }
  
  renderUnzipCheckbox() {
    return (
      <div className="fields-container">
        <label>
          <input
            type="checkbox"
            ref="unzipCheckbox"
            checked={this.state.unzipArchives}
            onChange={this.onUnzipChange}
          /> Unzip archives
        </label>
      </div>)
  }
  
  renderInput() {
    const maxFiles = this.props.maxFiles;
    return (<input
      style={{display: 'none'}}
      multiple={maxFiles > 1}
      type="file" ref={(c) => { if (c) { this.fileInput = c; } }}
      onChange={this.onFileSelect} />);
  }
  
  renderFileSet() {
    const items = this.state.items;
    const {progressClass, filesetTransitionName: transitionName} = this.props;
    if (items.length > 0) {
      const {cancelIconClass, completeIconClass} = this.props;
      const {progress, styles} = this.state;
      const cancelledItems = items.filter(item => item.cancelled === true);
      const filesetStyle = (items.length === cancelledItems.length) ? {display: 'none'} : {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10
      };
      return (
        <ReactCSSTransitionGroup component="div" transitionName={transitionName} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
          <div style={filesetStyle}>
            {
              items.filter(item => !item.cancelled).map((item) => {
                const file = item.file;
                const sizeInMB = (file.size / (1024 * 1024)).toPrecision(2);
                const iconClass = item.progress < 100 ? cancelIconClass : completeIconClass;
                const fileExt = file.name.split('.').pop();
                console.log(fileExt);
                return (
                  <div key={item.index}>
                    <div className="uploader-file-item">
                      <i className={getFileIconByExtension('.' + fileExt)} aria-hidden="true"></i> <span >{ file.name }</span>
                      <span className="file-info">
                        <span >{`${sizeInMB} Mb`}</span>
                        <i
                          className={iconClass}
                          style={{cursor: 'pointer'}}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.cancelFile(item.index);
                          }}></i>
                      </span>
                      <progress
                        className={progressClass} min="0" max="100"
                        value={item.progress}>{item.progress}%</progress>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </ReactCSSTransitionGroup>
      );
    }
    return <ReactCSSTransitionGroup component="div" transitionName={transitionName} transitionEnterTimeout={0} transitionLeaveTimeout={0} />;
  }
  
  renderButtons() {
    const {onCloseUploader} = this.props;
    return (<div className="uploders-buttons">
        <button className="uploader-button" onClick={ this.onUploadButtonClick }><i className="fa fa-upload"></i> Upload </button>
        <button className="uploader-button" onClick={ onCloseUploader }><i className="fa fa-times"></i> Close uploader </button>
      </div>
    );
  }
  
  render() {
    
    let dropzoneClassName = this.state.isActive ? 'drop-zone active' : 'drop-zone';
    
    return (
      <div className="fileupload-form">
        {this.renderKeyWordsInput()}
        {this.renderUnzipCheckbox()}
        <div className="uploader">
          <div
            className={ dropzoneClassName }
            onClick={this.onClick}
            onDragEnter={this.onDragEnter}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
          >
            <i className="fa fa-cloud-upload fa-2x" aria-hidden="true"></i>
            <br/>
            <span className="drop-zone-text">Drag and drop your files here <br/>or<br/> click here to pick them from your computer</span>
          </div>
          {this.renderInput()}
          {this.renderFileSet()}
          {this.renderButtons()}
        </div>
      </div>
    )
  }
  
  filesToItems(files) {
    const fileItems = Array.prototype.slice.call(files).slice(0, this.props.maxFiles);
    const items = fileItems.map((f, i) => {
      if (this.props.chunks) {
        const chunkProgress = [];
        for (let j = 0; j <= f.size / this.props.chunkSize; j += 1) {
          chunkProgress.push(0);
        }
        return {file: f, index: i, progress: 0, cancelled: false, chunkProgress};
      }
      return {file: f, index: i, progress: 0, cancelled: false};
    });
    return items;
  }
  
}

Uploader.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  fieldName: PropTypes.string,
  chunks: PropTypes.bool,
  chunkSize: PropTypes.number,
  maxFiles: PropTypes.number,
  clearTimeOut: PropTypes.number,
  filesetTransitionName: PropTypes.string,
  cancelIconClass: PropTypes.string,
  completeIconClass: PropTypes.string,
  progressClass: PropTypes.string,
  onCloseUploader: PropTypes.func,
  onUploadComplete: PropTypes.func
};


Uploader.defaultProps = {
  method: 'POST',
  fieldName: 'datafile',
  maxSize: 25 * 1024 * 1024,
  chunks: false,
  chunkSize: 512 * 1024,
  localStore: false,
  maxFiles: 10,
  clearTimeOut: 200,
  filesetTransitionName: 'fileset',
  cancelIconClass: 'fa fa-close',
  completeIconClass: 'fa fa-check',
};
