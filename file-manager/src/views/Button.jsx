import React, { PureComponent } from 'react';

export default class Button extends PureComponent {
  
  
  render() {
    const { iconClass, onClick, disabled } = this.props;
    return (
      <div className={"panel-button" + (disabled ? " disabled": '')} onClick={e => {
        e.preventDefault();
        !disabled ? onClick() : null;
      }} ><i className={ iconClass }></i></div>
    );
  }
}
