import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import FileList from './FileList';

@connect(state => ({
  baseRoot: state.app.baseRoot,
  files: state.files,
  startPanelsIndex: state.app.startPanelsIndex,
  activePanel: state.app.activePanel
}))

export default class FileManager extends PureComponent {
  
  render() {
      const {baseRoot, activePanel, files, startPanelsIndex } = this.props;
      return (
          <div className="FileManager">
            <div className="FileManager-header">NHL File Manager <b>{ baseRoot }</b></div>
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
