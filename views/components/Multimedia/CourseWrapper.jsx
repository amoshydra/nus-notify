'use babel';

import React, { PropTypes } from 'react';
import Multimedia from './Multimedia';

const CourseWrapper = ({ course, mediaList }) => (
  <div>
    <h3>{course.CourseCode} {course.CourseName}</h3>
    <ul>
      { mediaList.map((dataItem) =>
        <li key={dataItem.ID}>
          <Multimedia dataItem={dataItem} />
        </li>
      )}
    </ul>
  </div>
);

export default CourseWrapper;

CourseWrapper.propTypes = {
  course: PropTypes.object,
  mediaList: PropTypes.array
};
