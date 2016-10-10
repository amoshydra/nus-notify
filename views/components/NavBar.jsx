'use babel';

import React, { Component, PropTypes } from 'react';
import styles from './navbar.css';

export default class NavBar extends Component {

  handleClick(view) {
    this.props.switchView(view);
  }

  checkIsActive(currentElement) {
    console.log(currentElement);
    return (currentElement.toLowerCase() === this.props.windowToRender.toLowerCase()) ? styles.navActive : '';
  }

  render() {
    const navToRender = [{
      name: 'announcements',
      icon: 'announcement'
    }, {
      name: 'multimedia',
      icon: 'video_library'
    }, {
      name: 'forum',
      icon: 'forum'
    }];
    const self = this;
    return (
      <div className={styles.navBar}>
        <ul>
          {navToRender.map((navElement) =>
            <li key={navElement.name}>
              <button
                className={`${styles.navButton} ${this.checkIsActive(navElement.name)}`}
                onClick={function onClick() {
                  self.handleClick(navElement.name);
                }}
              >
                <i className="material-icons">
                  {navElement.icon}
                </i>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

NavBar.propTypes = {
  windowToRender: PropTypes.string.isRequired,
};
