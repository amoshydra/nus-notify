'use babel';

import React, { Component, PropTypes } from 'react';

export default class Announcement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      descriptionMode: 'collapsed'
    };
    this.toggleDescription = this.toggleDescription.bind(this);
  }

  toggleDescription() {
    if (this.state.descriptionMode === 'collapsed') {
      this.setState({ descriptionMode: 'expanded' });
    } else {
      this.setState({ descriptionMode: 'collapsed' });
    }
  }

  render() {
    const annObj = this.props.announcement;
    return (
      <div className="announcement">
        <button onClick={this.toggleDescription}>{annObj.Title}</button>
        <div className={`${this.state.descriptionMode}  description`}>
          <div className="content" dangerouslySetInnerHTML={{ __html: annObj.Description }} />
        </div>
      </div>
    );
  }
}

Announcement.propTypes = {
  announcement: PropTypes.object
};
