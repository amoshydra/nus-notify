import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';

window.onload = () => {
  ReactDOM.render(<Main />, document.getElementById('react-target'));
};
