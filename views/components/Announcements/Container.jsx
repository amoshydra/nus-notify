'use babel';

import React, { Component } from 'react';
import Annoncement from './Item';
import Storage from './../../../controllers/storage';

// const JsonWatch = require('jsonwatch');

// const dataDbListener = new JsonWatch('./data/datadb.json');

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Storage.dataDb.get('list').value()
    };
  }

  render() {
    let emptyMessage = '';
    if (this.state.list.length <= 0) {
      emptyMessage = <p>Nothing to see here.</p>;
    }

    return (
      <div>
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
