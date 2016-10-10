'use babel';

import React, { Component, PropTypes } from 'react';
import styles from './navbar.css';

export default class NavBar extends Component {

  render() {
    return (
      <div className={styles.navBar}>
        <ul>
          <li><button className={styles.navButton} onClick={this.props.switchView.bind(null, 'announcement')}><i className="material-icons">announcement</i></button></li>
          <li><button className={styles.navButton} onClick={this.props.switchView.bind(null, 'webcast')}><i className="material-icons">video_library</i></button></li>
          <li><button className={styles.navButton} onClick={this.props.switchView.bind(null, 'forum')}><i className="material-icons">forum</i></button></li>
        </ul>
      </div>
    );
  }
}

NavBar.propTypes = {
  windowToRender: PropTypes.string.isRequired,
};
