'use babel';

import React, { Component } from 'react';
import NavBar from './NavBar';
import Announcements from './Announcements/Container';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowToRender: 'Announcements'
    };

    this.switchView = this.switchView.bind(this);
  }

  switchView(view) {
    this.setState({ windowToRender: view });
    console.log(view);
  }

  render() {
    return (
      <div>
        <div id="aSide">
          <NavBar switchView={this.switchView} windowToRender={this.state.windowToRender} />
        </div>
        <div id="content">
          <Announcements />
        </div>
      </div>
    );
  }
}
