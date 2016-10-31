'use babel';

import React, { Component, PropTypes } from 'react';
import CourseWrapper from './CourseWrapper';
import EmptyState from '../Shared/EmptyState';
import Storage from './../../../controllers/storage';
import styles from '../Shared/styles/container.css';

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.renderCourses = this.renderCourses.bind(this);
  }

  renderCourses() {
    const courseList = getListOfCourses();
    const dataList = this.props.list;

    const mediaList = dataList.filter((dataItem) =>
      (dataItem.dataType === 'Multimedia' || dataItem.dataType === 'Webcasts')
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
    // TODO perhaps shouldn't use get module next time
    if (!dataList || dataList.length <= 0 || !Storage.user.has('modules')) {
      return (
        <EmptyState dirname={__dirname}/>
      );
    }

    return (
      <div className={styles.container}>
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
