'use babel';

import React, { Component, PropTypes } from 'react';
import Multimedia from './Multimedia';

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
  }

  renderList() {
    const dataList = this.props.list;

    if (dataList && dataList.length > 0) {
      return dataList.filter((dataItem) =>
        (dataItem.dataType === 'Multimedia' || dataItem.dataType === 'Webcast')
      ).map((dataItem) =>
        <li key={dataItem.ID}>
          <Multimedia dataItem={dataItem} />
        </li>
      );
    }
    return <p>Nothing to see here.</p>;
  }

  render() {
    return (
      <div>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

Container.propTypes = {
  list: PropTypes.array
};
