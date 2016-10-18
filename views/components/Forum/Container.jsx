'use babel';

import React, { Component, PropTypes } from 'react';
import styles from '../Shared/styles/container.css';
import CourseWrapper from './CourseWrapper';

export default class Container extends Component {

  renderList() {
    const dataList = this.props.list;

    if (dataList && dataList.length > 0) {
      return dataList.filter((dataItem) =>
        (dataItem.dataType === 'Forums')
      ).map((dataItem) =>
        <CourseWrapper key={dataItem.ID} dataItem={dataItem}/>
      );
    }
    return <p>Nothing to see here.</p>;
  }

  render() {
    return (
      <div className={styles.container}>
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
