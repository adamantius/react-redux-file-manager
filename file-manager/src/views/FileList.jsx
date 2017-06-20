import React, { Component } from 'react';
import FileItem from './FileItem';
import Button from './Button';
import Loading from './Loading';
import Uploader from './Uploader';
import { connect } from 'react-redux';
import {createFolderRequest, removeFileRequest} from '../actions/files'

const mapDispatchToProps = (dispatch, ownProps) => {
  
  return {
    
    onRemoveClick: (selectedFile) => {
      let confirmation = confirm("Are you sure?");
      if (confirmation === true) {
        dispatch(removeFileRequest(selectedFile.path, ownProps.panelIndex))
      }
    },
    
    onCreateFolderClick: () => {
      let folder = prompt("Please enter folder name");
      if (folder != null) {
        dispatch(createFolderRequest(ownProps.files.path + '/' + folder, ownProps.panelIndex))
      }
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  console.log(state.app.selectedPanelFile[ownProps.panelIndex]);
  return {
    selectedFile: state.app.selectedPanelFile[ownProps.panelIndex]
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
  
  getUploader() {
    return <Uploader />
  }
  
  render() {
    let topItem;
    let uploading = this.state.uploading;
    const { files, panelIndex, startPanelIndex, loading, activePanel, onRemoveClick, onCreateFolderClick, selectedFile } = this.props;
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
          <span className="panel-caption">{panelIndex} { files && files.path }</span>
          <Button iconClass="fa fa-trash" disabled={ !files || activePanel != panelIndex } onClick={ () => onRemoveClick(selectedFile) }/>
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
