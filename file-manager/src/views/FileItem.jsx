import EditableFileItem from './EditableFileItem';
import { connect } from 'react-redux';
import { recieveFilesList, updateFileRequest } from '../actions/files';
import { moveToTopLevel, selectPanelFile } from '../actions/app';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    
    onItemClick: (e) => {
      
      let selectionStrategy = 'single';
      
      if (ownProps.fileData.type === 'toTop') {
        dispatch(moveToTopLevel());
        return;
      }
  
      if (e.ctrlKey || e.metaKey) {
        selectionStrategy = 'multi';
      }
      
      dispatch(selectPanelFile(ownProps.fileData, ownProps.panelIndex, selectionStrategy));
      
      if (ownProps.fileData.type === 'directory') {
        dispatch(recieveFilesList(ownProps.fileData.path, ownProps.panelIndex+1));
        return;
      }
    },
    
    onFileNameChanged: (panelIndex, fileData, fileName) => {
      let onSuccess = () => console.log('onSuccess');
      let onFailure = () => console.log('onFailure');
      dispatch(updateFileRequest(fileData.path, fileName, panelIndex, onSuccess, onFailure))
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  
  let selection = state.app.selectedPanelFile[ownProps.panelIndex];
  
  let filtered = selection ? selection.filter((item) => {
    return item == ownProps.fileData;
  }) : [];
  
  return {
    active: !!filtered.length
  }
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class FileItem extends EditableFileItem {

}
