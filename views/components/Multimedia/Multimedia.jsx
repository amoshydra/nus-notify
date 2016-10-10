'use babel';

import React, { Component, PropTypes } from 'react';

export default class Multimedia extends Component {

  render() {
    const dataItem = this.props.dataItem;
    return (
      <div>
        <a href={`https://ivle.nus.edu.sg/v1/bank/media/viewmedia.aspx?MediaItemID=${dataItem.ID}&ChannelID=${dataItem.ChannelID}`}>{dataItem.FileTitle}</a>
      </div>
    );
  }
}

Multimedia.propTypes = {
  dataItem: PropTypes.object
};
