'use babel';

import React, { PropTypes } from 'react';
import Thread from './Thread';
import styles from './coursewrapper.css';

const CourseWrapper = ({ dataItem }) => {
  if (!dataItem.hasItems) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span className={styles.code}>{dataItem.CourseCode}</span> <span className={styles.name}>{dataItem.CourseName}</span>
      </div>
      <ul className={styles.contents} style={{ padding: '0 0px 20px 0' }}>
        {
          dataItem.Headings.map((heading) => (
            <div key={heading.ID}>
              <div style={{ fontWeight: '600', margin: '10px 0', opacity: '0.6', fontSize: '0.9em' }}>{heading.Title}</div>
              <ul style={{padding: '0 0 10px 0'}}> {
                heading.Threads.sort(sortByLatestUpdate).slice(0, 5).map((thread) => (
                  <Thread key={thread.ID} thread={thread} />
                ))
              }
              </ul>
            </div>
          ))
        }
      </ul>
    </div>
)};

export default CourseWrapper;

CourseWrapper.propTypes = {
  dataItem: PropTypes.object
};



const noDate = 0;

function getLatestUpdate(thread) {
  const myDate = new Date(thread.PostDate_js).getTime();

  let childMaxDate = noDate;
  thread.Threads.forEach((childThread) => {
    const childDate = getLatestUpdate(childThread);
    if (childDate > childMaxDate) {
      childMaxDate = childDate;
    }
  });

  const returnDate = (myDate > childMaxDate) ? myDate : childMaxDate;
  return returnDate;
}

function sortByLatestUpdate(threadA, threadB) {
  const timeUpdatedA = getLatestUpdate(threadA);
  const timeUpdatedB = getLatestUpdate(threadB);

  return (timeUpdatedB - timeUpdatedA);
}
