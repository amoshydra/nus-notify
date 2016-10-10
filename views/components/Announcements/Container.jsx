'use babel';

import React, { Component } from 'react';
import JsonWatch from 'jsonwatch';
import Annoncement from './Item';
import Storage from './../../../controllers/storage';
import styles from './container.css';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Storage.dataDb.get('list').value()
    };
    this.observeDatabase();
    this.renderList = this.renderList.bind(this);
  }

  observeDatabase() {
    const dataDbListener = new JsonWatch('./data/datadb.json');

    dataDbListener.on('add', (path, data) => {
      if (path === '/list') {
        this.setState({ list: data });
      }
    });

    dataDbListener.on('cng', (path, oldData, newData) => {
      if (path === '/list') {
        this.setState({ list: newData });
      }
    });
  }

  renderList() {
    const dataList = this.state.list;

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
