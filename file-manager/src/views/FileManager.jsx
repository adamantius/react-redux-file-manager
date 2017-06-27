import React, { PureComponent } from 'react';
import Select from 'react-select';

import { connect } from 'react-redux';
import FileList from './FileList';
import {recieveFilesList} from '../actions/files';

const mapDispatchToProps = (dispatch, ownProps) => {
  
  return {
    onRootChange: (value) => {
      dispatch(recieveFilesList(value, 0))
    }
  }
};

@connect(state => ({
  files: state.files,
  startPanelsIndex: state.app.startPanelsIndex,
  activePanel: state.app.activePanel
}), mapDispatchToProps)

export default class FileManager extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      baseRoot: props.baseRoots[0].value
    };
    this.rootChange = this.rootChange.bind(this);
  }
  
  getRootSelector() {
    const {baseRoots} = this.props;
    
    return <Select
      className="root-selector"
      options={ baseRoots }
      onChange={this.rootChange}
      value={ this.state.baseRoot }
      clearable={ false }
    />
  }
  
  rootChange(val) {
    this.setState({
      baseRoot: val.value
    }, this.props.onRootChange(val.value));
  }
  
  render() {
      const {activePanel, files, startPanelsIndex } = this.props;
      return (
          <div className="FileManager">
              <div className="filemanager-header">
                { this.getRootSelector()}
              </div>
              <div className="filelists-container">
                  {[...Array(3)].map((x, i) =>
                    <FileList
                      key={ i }
                      files={ files[startPanelsIndex + i ] ? files[startPanelsIndex + i ].filesData : null }
                      panelIndex={ startPanelsIndex + i }
                      startPanelIndex={startPanelsIndex}
                      loading={files[startPanelsIndex + i ] ? files[startPanelsIndex + i ].loading : false}
                      activePanel={activePanel}
                    />
                  )}
              </div>
          </div>
      );
  }
}
