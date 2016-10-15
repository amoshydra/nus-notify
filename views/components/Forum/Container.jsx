'use babel';

import React, { Component, PropTypes } from 'react';
import styles from '../Shared/styles/container.css';

export default class Container extends Component {

  render() {
    return (
      <div className={styles.container}>
        Not implemented yet
      </div>
    );
  }
}

Container.propTypes = {
  list: PropTypes.array
};
