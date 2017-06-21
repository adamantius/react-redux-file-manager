import React, { Component } from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import ReactTooltip from 'react-tooltip'
import getFileIconByExtension from '../helpers/FileIconByExtention'

export default class FileItem extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      fileName: '',
      saving: false
    };
  };
  
  componentWillMount() {
    this.setState({fileName:this.props.fileData.name});
  }

  componentDidUpdate(prevProps, prevState) {
    let inputElem = ReactDOM.findDOMNode(this.refs.input);
    if (this.state.editing && !prevState.editing) {
      inputElem.focus();
      this._selectInputText(inputElem);
    }
  };

  componentWillReceiveProps(newProps) {
    if (this.state.saving) {
      this.setState({saving: false, fileName:newProps.fileData.name});
    } else {
      this.setState({fileName:newProps.fileData.name});
    }
  }
  
  onDoubleClick() {
    if (this.props.fileData.type !== 'toTop') {
      this.setState({editing:true});
    }
  };
  
  onKeyDown(event) {
    if (event.keyCode === 13) {
      this.finishEditing();
    } else if (event.keyCode === 27) {
      this.cancelEditing();
    }
  };
  
  onTextChanged(event) {
    this.setState({
      fileName: event.target.value.trim()
    });
  }
  
  onCopyClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this._copyToClipboard(this.props.fileData.path);
  }
  
  finishEditing(){
    this.setState({editing: false, saving: true});
    this.props.onFileNameChanged(this.props.panelIndex, this.props.fileData, this.state.fileName);
  };
  
  cancelEditing(){
    this.setState({editing: false});
  };
  
  getActiveIndicator() {
    return <i className="fa fa-caret-right indicator" aria-hidden="true"></i>;
  }
  
  getSavingIndicator() {
    return <i className="fa fa-circle-o-notch fa-spin wobble-fix indicator" aria-hidden="true"></i>;
  }
  
  getCopyIndicator() {
    return <i
            className="fa fa-clipboard indicator"
            aria-hidden="true"
            ref="copyButton"
            data-tip="Copied!"
            data-place="bottom"
            data-event="click"
            data-event-off="mouseleave"
            data-iscapture="true"
            onClick={(e) => { this.onCopyClick(e)}}
          ></i>;
  }
  
  getEditor() {
    return <input
      type="text"
      defaultValue={this.state.fileName}
      onBlur={() => this.finishEditing()}
      onKeyDown={ (e) => this.onKeyDown(e) }
      onChange={(e) => this.onTextChanged(e)}
      onClick = { e => {e.stopPropagation();} }
      ref="input"
    />
  }
  
  getViewer() {
    return this.state.fileName;
  }
  
  getIndicator(isFile, active, saving) {
    if (!isFile && active && !saving) {
      return this.getActiveIndicator();
    } else if (saving) {
      return this.getSavingIndicator();
    } else if (!isFile) {
      return '';
    } else {
      return this.getCopyIndicator();
    }
  }
  
  render() {
    const { active, fileData, onItemClick} = this.props;
    let content =  this.state.editing ? this.getEditor(fileData): this.getViewer(fileData);
    let saving = this.state.saving;
    return (
      <li
        className={this._getFileItemClassName(active)}
        onClick = {e => {e.preventDefault(); onItemClick(e);}}
        onDoubleClick={()=>this.onDoubleClick()}
      >
        <ReactTooltip place="bottom"/>
        <i
          className={ fileData.type === 'directory' ? "fa fa-folder-o" : getFileIconByExtension(fileData.extension) }
          data-tip="Double click to edit"
        ></i> { content }
        { this.getIndicator(fileData.type === 'file', active, saving) }
      </li>
    );
  }
  
  _getFileItemClassName(active){
    return active ? 'file-item active': 'file-item';
  }
  
  _selectInputText(element) {
    element.setSelectionRange(0, element.value.length);
  }
  
  _copyToClipboard(text) {
    var textField = document.createElement('textarea');
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }
}
