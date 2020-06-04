import React from 'react';

function Footer() {
  return (
    <div className="footer py-5">
      <div className="container">
        <p className="text-light text-center">
          Copyright © 2019-2020 Red Hat, Inc. and others.
        </p>
        <p className="text-light text-center">
          <a href="https://pagure.io/fedora-qa/packager_dashboard" className="text-white-50">
          Packager Dashboard</a>&nbsp;and&nbsp;
          <a href="https://pagure.io/fedora-qa/oraculum" className="text-white-50">
          Oraculum (back-end)</a> are Free Software under GPL.
        </p>
        <p className="text-light text-center">
          Please <a href="https://pagure.io/fedora-qa/packager_dashboard/issues" className="text-white-50">
          file issues and PRs</a>&nbsp;if you have ideas.
        </p>
        <p className="text-light text-center">
            <span>•</span>&nbsp;<a href="https://fedoraproject.org/wiki/Legal:Main" className="text-white-50">Legal</a>&nbsp;
            <span>•</span>&nbsp;<a href="https://fedoraproject.org/wiki/Legal:PrivacyPolicy" className="text-white-50">Privacy policy</a>&nbsp;
            <span>•</span>
        </p>
      </div>
    </div>
  );
}

export default Footer;
