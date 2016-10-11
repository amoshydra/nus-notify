'use babel';

import React, { Component } from 'react';
import NavBar from './NavBar';
import Announcements from './Announcements/Container';
import Multimedia from './Multimedia/Container';
import Storage from './../../controllers/storage';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowToRender: 'announcements',
      list: Storage.data.get('list')
    };

    this.observeDatabase('list');
    this.switchView = this.switchView.bind(this);
  }

  observeDatabase(pathToWatch) {
    Storage.data.watch(`/${pathToWatch}`, (data) => {
      this.setState({ list: data });
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
