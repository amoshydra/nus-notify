'use babel';

import React, { PropTypes } from 'react';
import Multimedia from './Multimedia';
import styles from './coursewrapper.css';

const CourseWrapper = ({ course, mediaList }) => (
  <div className={styles.wrapper}>
    <div className={styles.title}>
      <span className={styles.code}>{course.CourseCode}</span> <span className={styles.name}>{course.CourseName}</span>
    </div>
    <div className={styles.contents}>
      { mediaList.map((dataItem) =>
        <Multimedia key={dataItem.ID} dataItem={dataItem} />
      )}
    </div>
  </div>
);

export default CourseWrapper;

CourseWrapper.propTypes = {
  course: PropTypes.object,
  mediaList: PropTypes.array
};
