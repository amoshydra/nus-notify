'use babel';

import React, { Component, PropTypes } from 'react';
import Multimedia from './Multimedia';

export default class CourseWrapper extends Component {

  renderList() {
    const mediaList = this.props.mediaList;
    return mediaList.map((dataItem) =>
      <li key={dataItem.ID}>
        <Multimedia dataItem={dataItem} />
      </li>
    );
  }

  render() {
    return (
      <div>
        <h3>{this.props.course.CourseCode} {this.props.course.CourseName}</h3>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

CourseWrapper.propTypes = {
  course: PropTypes.object,
  mediaList: PropTypes.array
};
