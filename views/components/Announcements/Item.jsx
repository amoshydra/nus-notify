'use babel';

import React, { Component, PropTypes } from 'react';

export default function Announcement(props) {
  const annObj = props.announcement;

  return (
    <div className="announcement">
      <div>{annObj.Title}</div>
      <p dangerouslySetInnerHTML={{ __html: annObj.Description }} />
    </div>
  );
}

Announcement.propTypes = {
  announcement: PropTypes.object
};
