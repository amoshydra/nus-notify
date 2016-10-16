'use babel';

import React, { Component, PropTypes } from 'react';
import styles from '../Shared/styles/container.css';
import Thread from './Thread';

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

export default class Container extends Component {

  renderList() {
    const dataList = this.props.list;

    if (dataList && dataList.length > 0) {
      return dataList.filter((dataItem) =>
        (dataItem.dataType === 'Forums')
      ).map((dataItem) =>
        <li key={dataItem.ID}>
          <div>
            <h2>{dataItem.CourseCode} {dataItem.CourseName}</h2>
            <ul style={{ padding: '0 10px 50px 10px' }}>
              {
                dataItem.Headings.map((heading) => (
                  [<h3>{heading.Title}</h3>,
                  heading.Threads.sort(sortByLatestUpdate).slice(0, 5).map((thread) => (
                    <Thread thread={thread} />
                  ))
                ]))
              }
            </ul>
          </div>
        </li>
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
