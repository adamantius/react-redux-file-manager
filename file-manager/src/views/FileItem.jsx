import EditableFileItem from './EditableFileItem';
import { connect } from 'react-redux';
import { recieveFilesList, updateFileRequest } from '../actions/files';
import { moveToTopLevel, selectPanelFile } from '../actions/app';

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    
    onItemClick: () => {
      if (ownProps.fileData.type === 'directory') {
        dispatch(selectPanelFile(ownProps.fileData, ownProps.panelIndex));
        dispatch(recieveFilesList(ownProps.fileData.path, ownProps.panelIndex+1));
        return;
      }
      if (ownProps.fileData.type === 'toTop') {
        dispatch(moveToTopLevel());
        return;
      }
      dispatch(selectPanelFile(ownProps.fileData, ownProps.panelIndex));
      
    },
    
    onFileNameChanged: (panelIndex, fileData, fileName) => {
      let onSuccess = () => console.log('onSuccess');
      let onFailure = () => console.log('onFailure');
      dispatch(updateFileRequest(fileData.path, fileName, panelIndex, onSuccess, onFailure))
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.fileData === state.app.selectedPanelFile[ownProps.panelIndex]
  }
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class FileItem extends EditableFileItem {

}
