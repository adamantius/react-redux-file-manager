import React, { Component } from 'react';
import FileItem from './FileItem';
import Button from './Button';
import Loading from './Loading';
import Uploader from './Uploader';
import { connect } from 'react-redux';
import {createFolderRequest, removeFilesRequest, recieveFilesList} from '../actions/files'
import {UPLOAD_API_URL} from '../config'

const mapDispatchToProps = (dispatch, ownProps) => {
  
  return {
    
    onRemoveClick: (selectedFiles) => {
      let confirmation = confirm("Are you sure?");
      if (confirmation === true) {
        dispatch(removeFilesRequest(selectedFiles, ownProps.panelIndex))
      }
    },
    
    onCreateFolderClick: () => {
      let folder = prompt("Please enter folder name");
      if (folder != null) {
        dispatch(createFolderRequest(ownProps.files.path + '/' + folder, ownProps.panelIndex))
      }
    },
    onUploadComplete: () => {
      dispatch(recieveFilesList(ownProps.files.path, ownProps.panelIndex))
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    selectedFiles: state.app.selectedPanelFile[ownProps.panelIndex]
  }
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class FileList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      uploading: false
    };
  };
  
  onUploadFileClick(e){
    this.setState({uploading:true});
  }
  
  onCloseUploader() {
    this.setState({uploading:false});
  }
  
  onUploadComplete() {
    this.setState({uploading:false});
    this.props.onUploadComplete();
  }
  
  getUploader() {
    const { files, onUploadComplete } = this.props;
    return <Uploader
      onCloseUploader={ (e) => this.onCloseUploader() }
      onUploadComplete={ (e) => this.onUploadComplete()}
      url={UPLOAD_API_URL + files.path} />
  }
  
  render() {
    let topItem;
    let uploading = this.state.uploading;
    const { files, panelIndex, startPanelIndex, loading, activePanel, onRemoveClick, onCreateFolderClick, selectedFiles } = this.props;
    const toTopLevelItem  = {
      name: '...',
      type: 'toTop'
    };
    
    if (startPanelIndex && startPanelIndex == panelIndex) {
      topItem = <FileItem fileData={ toTopLevelItem } key={ -1 } panelIndex={ panelIndex } />
    }
    
    const loadingContent = <Loading/>;
    const loadedContent =  (files && files.children) && (
        <ul>
          {topItem}
          { files.children.map((fileData, index) => (
            <FileItem fileData={ fileData } key={ index } panelIndex={ panelIndex } />
          ) ) }
        </ul>
        );
    
    return (
      <div className="filelist-panel">
        <div className="panel-actions">
          <span className="panel-caption">{ files && files.path }</span>
          <Button iconClass="fa fa-trash" disabled={ !files || activePanel != panelIndex } onClick={ () => onRemoveClick(selectedFiles) }/>
          <Button iconClass="fa fa-folder-o" disabled={ !files } onClick={ onCreateFolderClick }/>
          <Button iconClass="fa fa-file-o" disabled={ !files } onClick={(e) => this.onUploadFileClick(e) }/>
        </div>
        <div className="filelist">
          {uploading ? this.getUploader() : (loading ? loadingContent : loadedContent)}
        </div>
      </div>
    )
  }
}
