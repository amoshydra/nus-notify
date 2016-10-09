'use babel';

import React, { Component } from 'react';
import NavBar from './NavBar';
import Announcements from './Announcements/Container';

export default class Main extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      windowToRender: 'announcement'
    };
  }

  render() {
    return (
      <div>
        <div id="aSide">
          <NavBar windowToRender={this.state.windowToRender} />
        </div>
        <div id="content">
          <Announcements />
        </div>
      </div>
    );
  }
}
