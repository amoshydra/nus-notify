'use babel';

import React, { Component } from 'react';
import NavBar from './NavBar';
import Announcements from './Announcements/Container';
import Multimedia from './Multimedia/Container';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowToRender: 'announcements'
    };

    this.switchView = this.switchView.bind(this);
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
              case 'announcements': return <Announcements />;
              case 'multimedia': return <Multimedia />;
              case 'forum': return <Announcements />;
              default: return <Announcements />;
            }
          })()}

        </div>
      </div>
    );
  }
}
