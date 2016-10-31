'use babel';

import React, { PropTypes } from 'react';
import Storage from './../../../controllers/storage';

const checkLoginStatus = function checkLoginStatus() {
  return Storage.user.has('user');
}

const EmptyState = ({ dirname }) => {

  const splitted = dirname.split('\\');
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
          {(checkLoginStatus()) ?
            <div>
              <div>Nothing here yet..</div>
              <div style={{marginTop: 5, opacity: '0.3'}}>Try refreshing the app ({(process.platform === 'win32') ? 'CTRL' : 'CMD'}+R)</div>
            </div> :
            <div>
              <div>Login first to see your data</div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

EmptyState.propTypes = {
  dirname: PropTypes.string
};
