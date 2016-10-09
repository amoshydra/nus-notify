'use babel';

import React, { Component } from 'react';
import Annoncement from './Item';
import Storage from './../../../controllers/storage';

const JsonWatch = require('jsonwatch');

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Storage.dataDb.get('list').value()
    };
    this.observeDatabase();
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

  render() {
    let emptyMessage = '';
    if (this.state.list.length <= 0) {
      emptyMessage = <p>Nothing to see here.</p>;
    }

    return (
      <div className="announcements">
        <ul>
          {this.state.list.map((announcement) =>
            <li key={announcement.ID}>
              <Annoncement announcement={announcement} />
            </li>
          )}
          {emptyMessage}
        </ul>
      </div>
    );
  }
}
