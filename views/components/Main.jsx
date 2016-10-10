'use babel';

import React, { Component } from 'react';
import JsonWatch from 'jsonwatch';
import NavBar from './NavBar';
import Announcements from './Announcements/Container';
import Multimedia from './Multimedia/Container';
import Storage from './../../controllers/storage';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowToRender: 'announcements',
      list: Storage.dataDb.get('list').value()
    };

    this.observeDatabase();
    this.switchView = this.switchView.bind(this);
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

  switchView(view) {
    this.setState({ windowToRender: view });
  }

  render() {
    return (
      <div>
        <div id="aSide">
          <NavBar switchView={this.switchView} windowToRender={this.state.windowToRender} />
        </div>
        <div id="content">
          {(() => {
            switch (this.state.windowToRender) {
              case 'announcements': return <Announcements list={this.state.list} />;
              case 'multimedia': return <Multimedia list={this.state.list} />;
              case 'forum': return <Announcements list={this.state.list} />;
              default: return <Announcements list={this.state.list} />;
            }
          })()}

        </div>
      </div>
    );
  }
}
