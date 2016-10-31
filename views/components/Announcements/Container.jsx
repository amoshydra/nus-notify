'use babel';

import React, { Component, PropTypes } from 'react';
import Annoncement from './Announcement';
import EmptyState from '../Shared/EmptyState';
import styles from '../Shared/styles/container.css';

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
  }

  renderList(dataList) {
    return dataList.filter((dataItem) =>
      (dataItem.dataType === 'Announcements')
    ).map((dataItem) =>
      <li key={dataItem.ID}>
        <Annoncement announcement={dataItem} />
      </li>
    );
  }

  render() {
    const dataList = this.props.list;
    if (!(dataList && dataList.length > 0)) {
      return <EmptyState dirname={__dirname}/>
    }

    return (
      <div className={styles.container}>
        <ul>
          {this.renderList(dataList)}
        </ul>
      </div>
    );
  }
}

Container.propTypes = {
  list: PropTypes.array
};
