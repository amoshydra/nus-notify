'use babel';

import React, { Component, PropTypes } from 'react';
import CourseWrapper from './CourseWrapper';
import EmptyState from '../Shared/EmptyState';
import styles from '../Shared/styles/container.css';

export default class Container extends Component {

  renderList(dataList) {
    return dataList.filter((dataItem) =>
      (dataItem.dataType === 'Forums')
    ).map((dataItem) =>
      <CourseWrapper key={dataItem.ID} dataItem={dataItem}/>
    );
  }

  render() {
    const dataList = this.props.list;
    if (!(dataList && dataList.length > 0)) {
      return <EmptyState dirname={__dirname}/>
    }

    return (
      <div className={styles.container}>
        <ul>
          {this.renderList(dataList)}
        </ul>
      </div>
    );
  }
}

Container.propTypes = {
  list: PropTypes.array
};
