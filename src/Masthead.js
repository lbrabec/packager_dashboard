import React from 'react';
import logo from './logo.svg';

function Masthead() {
  return (
    <div className="masthead py-2">
      <div className="container px-0">
        <div className="row no-gutters">
          <div className="col-sm-6">
            <img src={logo} alt='Fedora Packager Dashboard'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Masthead;
