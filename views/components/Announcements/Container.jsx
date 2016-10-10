'use babel';

import React, { Component, PropTypes } from 'react';
import Annoncement from './Item';
import styles from './container.css';

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
  }

  renderList() {
    const dataList = this.props.list;

    if (dataList && dataList.length > 0) {
      return dataList.filter((dataItem) =>
        (dataItem.dataType === 'Announcements')
      ).map((announcement) =>
        <li key={announcement.ID}>
          <Annoncement announcement={announcement} />
        </li>
      );
    }
    return <p>Nothing to see here.</p>;
  }

  render() {
    return (
      <div className={styles.announcements}>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

Container.propTypes = {
  list: PropTypes.array
};
