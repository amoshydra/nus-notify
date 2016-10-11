'use babel';

import React, { Component, PropTypes } from 'react';
import CourseWrapper from './CourseWrapper';
import Storage from './../../../controllers/storage';

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.renderCourses = this.renderCourses.bind(this);
  }

  renderCourses() {
    const courseList = getListOfCourses();
    const dataList = this.props.list;

    const mediaList = dataList.filter((dataItem) =>
      (dataItem.dataType === 'Multimedia' || dataItem.dataType === 'Webcast')
    );

    return courseList.map((course) => {
      const courseMediaList = mediaList.filter((mediaItem) =>
        (mediaItem.CourseCode === course.CourseCode)
      );

      if (courseMediaList.length <= 0) return false;
      return (
        <div key={course.CourseCode}>
          <CourseWrapper course={course} mediaList={courseMediaList} />
        </div>
      );
    });
  }

  render() {
    const dataList = this.props.list;
    if (!dataList || dataList.length <= 0) {
      return (
        <p>Loading data...</p>
      );
    }

    return (
      <div>
        {this.renderCourses()}
      </div>
    );
  }
}

function getListOfCourses() {
  const coursesObj = Storage.user.get('modules');
  return Object.keys(coursesObj).map((key) => {
    const course = coursesObj[key];
    return {
      CourseCode: course.CourseCode,
      CourseName: course.CourseName
    };
  });
}

Container.propTypes = {
  list: PropTypes.array
};
