'use babel';

import React, { Component } from 'react';
import NavBar from './NavBar';
import ComponentList from './Shared/componentList';
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
    this.renderContainer = this.renderContainer.bind(this);
  }

  observeDatabase(pathToWatch) {
    Storage.data.watch(`/${pathToWatch}`, (data) => {
      this.setState({ list: data });
    });
  }

  switchView(view) {
    this.setState({ windowToRender: view });
  }

  renderContainer(containerName) {
    const Container = ComponentList[containerName].container;
    return <Container list={this.state.list} />;
  }

  render() {
    return (
      <div>
        <div id="aSide">
          <NavBar
            switchView={this.switchView}
            windowToRender={this.state.windowToRender}
            componentList={ComponentList}
          />
        </div>
        <div id="content">
          { this.renderContainer(this.state.windowToRender) }
        </div>
      </div>
    );
  }
}
