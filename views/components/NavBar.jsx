'use babel';

import React, { PropTypes } from 'react';

export default function NavBar(props) {
  return (
    <div>
      This is a nav bar {props.windowToRender}
    </div>
  );
}

NavBar.propTypes = {
  windowToRender: PropTypes.string.isRequired,
};
