'use babel';

import React, { Component, PropTypes } from 'react';
import Post from './Post';

export default class Container extends Component {

  constructor(props) {
    super(props);

    this.state = {
      display: 'hidden'
    };
    this.toggle = this.toggle.bind(this);
  }

  getPosts(thread) {
    const element = [<Post key={thread.ID} post={thread} />];

    element.push(thread.Threads.map((innerThread) =>
      this.getPosts(innerThread)
    ));
    return element;
  }

  toggle() {
    console.log(this.state.display);
    if (this.state.display === 'hidden') {
      this.setState({ display: '' });
    } else {
      this.setState({ display: 'hidden' });
    }
  }

  render() {
    const thread = this.props.thread;
    return (
      <li style={{ margin: '20px 0', listStyle: 'none', boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.3)' }}>
        <button onClick={this.toggle} style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'black', padding: '10px', display: 'block' }}>{thread.PostTitle}</button>
        <div className={this.state.display} style={{ padding: '10px' }}>
          <ul style={{ padding: '0 0 20px 0' }}>
            {this.getPosts(thread)}
          </ul>
        </div>
      </li>
    );
  }
}

Container.propTypes = {
  thread: PropTypes.object
};
