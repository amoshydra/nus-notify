'use babel';

import React, { Component, PropTypes } from 'react';
import styles from './navbar.css';

export default class NavBar extends Component {

  handleClick(view) {
    this.props.switchView(view);
  }

  checkIsActive(currentElement) {
    return (currentElement.toLowerCase() === this.props.windowToRender.toLowerCase()) ? styles.navActive : '';
  }

  render() {
    const self = this;
    const compList = this.props.componentList;
    return (
      <div className={styles.navBar}>
        <ul>
          {Object.keys(compList).map((name) =>
            <li key={name}>
              <button
                className={`${styles.navButton} ${this.checkIsActive(name)}`}
                onClick={function onClick() {
                  self.handleClick(name);
                }}
              >
                <i className="material-icons">
                  {compList[name].icon}
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
  componentList: PropTypes.object.isRequired,
  windowToRender: PropTypes.string.isRequired,
  switchView: PropTypes.func.isRequired
};
