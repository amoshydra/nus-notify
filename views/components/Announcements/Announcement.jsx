'use babel';

import React, { Component, PropTypes } from 'react';
import DOMPurify from 'dompurify';
import styles from './announcement.css';


export default class Announcement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      descriptionMode: 'collapsed'
    };
    this.toggleDescription = this.toggleDescription.bind(this);
  }

  toggleDescription() {
    if (this.state.descriptionMode === 'collapsed') {
      this.setState({ descriptionMode: 'expanded' });
    } else {
      this.setState({ descriptionMode: 'collapsed' });
    }
  }

  render() {
    const annObj = this.props.announcement;
    return (
      <div className={styles.announcement}>
        <button className={styles.title} onClick={this.toggleDescription}>{annObj.Title}</button>
        <div className={styles[this.state.descriptionMode]}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(annObj.Description) }}
          />
        </div>
      </div>
    );
  }
}

Announcement.propTypes = {
  announcement: PropTypes.object
};
