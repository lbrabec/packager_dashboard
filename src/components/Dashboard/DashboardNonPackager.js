import React, { PureComponent } from "react"
import DashboardLayout from "./DashboardLayout"
import { connect } from "react-redux"

import * as R from "ramda"
import * as QS from "query-string"

const getQueryText = () => {
  const query = QS.parse(window.location.search)
  const nicer = R.pipe(
    (what) => R.defaultTo("", query[what]),
    R.split(","),
    R.join(", "),
  )

  const users = nicer("users")
  const packages = nicer("packages")
  const groups = nicer("groups")

  return {
    users: users.length===0? users : `users: ${users}`,
    packages: packages.length===0? packages : `packages: ${packages}`,
    groups: groups.length===0? groups : `groups: ${groups}`,
  }
}

class DashboardNonPackager extends PureComponent {
  render() {
    const { users, packages, groups } = getQueryText()
    return (
      <DashboardLayout searchHandler={(_) => {}}>
        <div className="container text-center text-muted font-weight-bold py-4">
          <div className="non-packager">
              <h1 className="display-1">
                <i className="fas fa-question"></i>
              </h1>
              <h1 className="display-1">
                <i className="fas fa-box-open"></i>
              </h1>
              {
                <>
                  <h1 className="mt-4">There are no packages for {users} {packages} {groups}</h1>
                  <h4 className="mt-4 ">
                    <a href="https://fedoraproject.org/wiki/Join_the_package_collection_maintainers" target="_blank" rel="noopener noreferrer">
                      Become a packager
                    </a>
                  </h4>
                </>
              }
          </div>
        </div>
      </DashboardLayout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(DashboardNonPackager)
