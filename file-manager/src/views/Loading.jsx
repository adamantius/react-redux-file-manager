import React, { PureComponent } from 'react';
export default class Loading extends PureComponent {
  render() {
    return (
      <div className="loading">
        <div className="message">
          <i className="fa fa-spinner fa-spin fa-3x fa-fw wobble-fix"></i><br/>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
}
