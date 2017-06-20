import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isActive: false
    };
    this.activeDrag = 0;
    this.fileInput = null;
    this.onClick = this.onClick.bind(this);
    //this.onUploadButtonClick = this.onUploadButtonClick.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
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
    
    this.setState({isActive: false, items}, () => {
      if (this.props.auto) {
        this.upload();
      }
    });
  }
  
  cancelFile(index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {cancelled: true});
    this.setState({items: newItems});
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
                return (
                  <div key={item.index}>
                    <div>
                      <span className="icon-file icon-large">&nbsp;</span>
                      <span >{`${file.name}, ${file.type}`}</span>
                      <span >{`${sizeInMB} Mb`}</span>
                      <i
                        className={iconClass}
                        style={{cursor: 'pointer'}}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.cancelFile(item.index);
                        }}></i>
                    </div>
                    <div>
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
  
  render() {
    const { dropzoneLabel } = this.props;
    let dropzoneClassName = this.state.isActive ? 'drop-zone active' : 'drop-zone';
    
    return (
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
          <span className="drop-zone-text">Drag and drop your files here <br/>or<br/> pick them from your computer</span>
        </div>
        {this.renderInput()}
        {this.renderFileSet()}
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

Uploader.defaultProps = {
  method: 'POST',
  auto: false,
  fieldName: 'datafile',
  buttonLabel: 'Upload',
  maxSize: 25 * 1024 * 1024,
  chunks: false,
  chunkSize: 512 * 1024,
  localStore: false,
  maxFiles: 10,
  clearTimeOut: 3000,
  filesetTransitionName: 'fileset',
  cancelIconClass: 'fa fa-close',
  completeIconClass: 'fa fa-check',
  uploadIconClass: 'fa fa-upload'
};
