'use babel';

import React, { PropTypes } from 'react';
import styles from './multimedia.css';

const Multimedia = ({ dataItem }) => (
  <div className={styles.media}>
    <a href={`https://ivle.nus.edu.sg/v1/bank/media/viewmedia.aspx?MediaItemID=${dataItem.ID}&ChannelID=${dataItem.ChannelID}`}>{dataItem.FileTitle}</a>
  </div>
);

export default Multimedia;

Multimedia.propTypes = {
  dataItem: PropTypes.object
};
