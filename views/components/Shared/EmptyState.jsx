'use babel';

import React, { Component, PropTypes } from 'react';
import Storage from './../../../controllers/storage';

export default class EmptyState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: Storage.user.get('user')
    };

    // TODO: This chunk of codes are not working
    Storage.user.watch('/user', () => {
      this.setState({ loginStatus: true });
    });
    this.displayContent = this.displayContent.bind(this);
  }

  displayContent() {
    if (this.state.loginStatus) {
      return (
        <div>
          <div>Fetching data...</div>
          <div style={{marginTop: 5, opacity: '0.3'}}>Try refreshing the app ({(process.platform === 'win32') ? 'CTRL' : 'CMD'}+R)</div>
        </div>
      )
    } else {
      return (
        <div>Login first to see your data</div>
      )
    }
  }

  render() {
    const splitted = this.props.dirname.split('\\');
    const componentName = splitted[splitted.length - 1];

    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{textAlign:'center', marginBottom: '200px'}}>
          <div>
            <strong>{componentName}</strong>
          </div>
          <div style={{margin: "15px"}}>
            {this.displayContent()}
          </div>
        </div>
      </div>
    );
  }
}

EmptyState.propTypes = {
  dirname: PropTypes.string
};
