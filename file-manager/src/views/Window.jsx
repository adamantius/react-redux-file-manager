import React, { PureComponent } from 'react';
export default class Window extends PureComponent {
  render() {
    return (
      <div className="window">
        <div className="message">
          <i className="fa fa-spinner fa-spin fa-3x fa-fw wobble-fix"></i><br/>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
}
