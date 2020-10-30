import React, { Component } from "react"
import logo from "../logo.svg"
import Footer from "./Footer"
import Widget from "./Widget"
import ModalNetwork from "./ModalNetwork"
import * as U from "../utils"
import * as moment from "moment"

const bugs = [
  {
    bug_id: 123456,
    comments: 69,
    keywords: ["Reopened"],
    modified: moment().utc().subtract(1, 'week').format("YYYY-MM-DD HH:mm:ss"), //"2018-08-10 12:48:19",
    priority: "urgent",
    priority_severity: "urgent",
    release: "Fedora 32",
    reported: moment().utc().subtract(1, 'week').format("YYYY-MM-DD HH:mm:ss"), //"2014-10-24 15:40:09",
    severity: "unspecified",
    status: "ASSIGNED",
    title: "Title of this bug is quite long, it will be trimmed. Full title is shown in tooltip.",
    url: "https://bugzilla.redhat.com/123456",
  },
]

const updates = [
  {
    comments: 8,
    karma: 1,
    pretty_name: "foobar-12.3.fc31",
    release: "Fedora 31",
    stable_by_time: moment().utc().add(4, 'days').format("YYYY-MM-DD HH:mm:ss"),
    status: "testing",
    submission_date: moment().utc().subtract(3, 'days').format("YYYY-MM-DD HH:mm:ss"),
    updateid: "FEDORA-2020-b93b9312bc",
    url: "https://bodhi.fedoraproj…s/FEDORA-2020-b93b9312bc",
  },
]

const overrides = [
  {
    expiration_date: moment().utc().add(8, 'days').format("YYYY-MM-DD HH:mm:ss"),
    pretty_name: "foobar-0.8.0-1.fc31~bootstrap",
    release: "Fedora 31",
    submission_date: moment().utc().subtract(2, 'days').format("YYYY-MM-DD HH:mm:ss"),
    url: "https://bodhi.fedoraproj…c-0.8.0-1.fc31~bootstrap",
  },
]

const prs = [
  {
    author: "mjb90",
    ci_status: {
      Zuul: "failure",
      FedoraCI: "success",
    },
    comments: 11,
    date_created: moment().utc().subtract(1, 'month').format("YYYY-MM-DD HH:mm:ss"),
    last_updated: moment().utc().subtract(2, 'weeks').format("YYYY-MM-DD HH:mm:ss"),
    release: "Fedora Rawhide",
    title: "Fix foobar spec file",
    url: "https://src.fedoraprojec…udcompare/pull-request/1",
  },
]

const koschei = [
  {
    last_success: {
      time: moment().utc().subtract(2, 'weeks').format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
      url: "https://koji.fedoraproje…uildinfo?buildID=1433125",
    },
    release: "Fedora 32",
    status: "failing",
    url: "https://koschei.fedorapr…ge/Cython?collection=f32",
  },
]

const fti = [
  {
    problems: {
      aarch64: {
        reason: [
          "python3.8dist(decorator)",
          "python3.8dist(numpy)",
          "python3.8dist(setuptools)",
          "python3.8dist(six)",
          "python(abi) = 3.8",
          "python3.8dist(networkx) >= 2",
          "python3.8dist(ply) >= 3.4",
        ],
        since: "2020-07-17T07:41:32.007689425Z",
      },
      armv7hl: {
        reason: [
          "python(abi) = 3.8",
          "python3.8dist(numpy)",
          "python3.8dist(setuptools)",
          "python3.8dist(six)",
          "python3.8dist(networkx) >= 2",
          "python3.8dist(ply) >= 3.4",
          "python3.8dist(decorator)",
        ],
        since: "2020-07-17T07:41:32.007696065Z",
      },
      ppc64le: {
        reason: [
          "python(abi) = 3.8",
          "python3.8dist(decorator)",
          "python3.8dist(networkx) >= 2",
          "python3.8dist(ply) >= 3.4",
          "python3.8dist(numpy)",
          "python3.8dist(setuptools)",
          "python3.8dist(six)",
        ],
        since: "2020-07-17T07:41:32.007702589Z",
      },
      s390x: {
        reason: [
          "python3.8dist(networkx) >= 2",
          "python3.8dist(ply) >= 3.4",
          "python3.8dist(numpy)",
          "python3.8dist(setuptools)",
          "python3.8dist(six)",
          "python(abi) = 3.8",
          "python3.8dist(decorator)",
        ],
        since: "2020-07-17T07:41:32.007709187Z",
      },
      x86_64: {
        reason: [
          "python(abi) = 3.8",
          "python3.8dist(numpy)",
          "python3.8dist(setuptools)",
          "python3.8dist(six)",
          "python3.8dist(decorator)",
          "python3.8dist(networkx) >= 2",
          "python3.8dist(ply) >= 3.4",
        ],
        since: "2020-07-17T07:41:32.007717430Z",
      },
    },
    release: "Fedora Rawhide",
    repo: "rawhide",
  },
]

const orphan = {
  depends_on_orphaned: true,
  direct_dependencies: ["bar"],
  dot_graph: '"";',
  orphaned: true,
  problematic_since: moment().utc().subtract(1, 'day').format("YYYY-MM-DDTHH:mm:ss"),
  remote_dependencies: ["baz"],
  vis_js: {
    edges: [
      {
        from: 0,
        to: 1,
      },
      {
        from: 0,
        to: 2,
      },
      {
        from: 2,
        to: 3,
      },
    ],
    nodes: [
      {
        id: 0,
        label: "foobar",
      },
      {
        id: 1,
        label: "bar",
      },
      {
        id: 2,
        label: "libfoo",
      },
      {
        id: 3,
        label: "baz",
      },
    ],
  },
}

const pkg = {
  name: "foobar",
  data: {
    bugs: U.EMPTY_ARRAY,
    prs: U.EMPTY_ARRAY,
    updates: U.EMPTY_ARRAY,
    overrides: U.EMPTY_ARRAY,
    koschei: U.EMPTY_ARRAY,
    orphan: U.NOT_ORPHAN,
    fti: U.EMPTY_ARRAY,
  },
}

const version = {
  "Fedora 31": {
    stable: "foobar-0.1.0-2.fc31",
  },
  "Fedora 32": {
    stable: "foobar-0.1.0-4.fc32",
  },
}

function Venn(props) {
  return (    
    <div style={{"width": 100, margin: "auto"}} className="my-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 309 208">
      <g
        fillOpacity="1"
        stroke="#373a3c"
        strokeDasharray="none"
        strokeMiterlimit="4"
        strokeOpacity="1"
        transform="translate(-37.782 -37.398)"
      >
        <circle
          cx="180"
          cy="180"
          r="120"
          fill={props.a}
          strokeWidth="6"
          transform="matrix(.84256 0 0 .84073 -10.244 -10.524)"
        ></circle>
        <circle
          cx="300"
          cy="180"
          r="120"
          fill={props.b}
          strokeWidth="6"
          transform="matrix(.84256 0 0 .84073 -10.244 -10.524)"
        ></circle>
        <path
          fill={props.union}
          strokeWidth="5.05"
          d="M191.971 53.436c31.283 18.022 50.554 51.328 50.554 87.372s-19.27 69.35-50.554 87.371c-31.282-18.022-50.553-51.327-50.553-87.371s19.27-69.35 50.553-87.372"
        ></path>
      </g>
    </svg>
    </div>
  );
}

class Help extends Component {
  render() {
    return (
      <>
        <ModalNetwork />
        <div className="Help">
          <div className="container">
            <div className="row">
              <a href="/">
                <img src={logo} alt="Fedora Packager Dashboard" className="py-4" />
              </a>
            </div>
            <h2 className="mt-4">What is this place?</h2>
            <div className="row mb-4">
              <div className="col-md-12">
                <p>
                  Packager Dashboard is a service for Fedora package maintainers aiming to provide
                  all relevant data: FTBFS/FTI status (from both Bugzilla, Koschei and health
                  check), orphan warnings, bugzillas, pull requests, active overrides and updates -
                  at a single place in an easy to read and filter way.
                </p>
                <p>
                  Not a package maintainer or feeling lost? Check the dashboadrs for some packagers
                  and groups:
                </p>
                  <ul>
                    <li>
                      <a href="/python-sig" target="_blank">
                        Python SIG
                      </a>
                    </li>
                    <li>
                      <a href="/churchyard" target="_blank">
                        Miro Hroncok
                      </a>
                    </li>
                    <li>
                      <a href="/frantisekz" target="_blank">
                        Frantisek Zatloukal
                      </a>
                    </li>
                  </ul>

                <p>
                  Explore all the categories, try to use some filters or search for packages. Don't
                  worry, you won't mess it for them. All options are saved client side in your
                  browser.
                </p>
              </div>
            </div>
            <hr />
            <div className="row mb-4">
              <div className="col-md-6">
                <h2 className="text-left">Icons and their meaning</h2>

                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-bug mr-1`} />
                      </th>
                      <td>Bug</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-bolt mr-1`} />
                      </th>
                      <td>Update</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-shapes mr-1`} />
                      </th>
                      <td>Bodhi override</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-git mr-1`} />
                      </th>
                      <td>Pull-request</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-wrench mr-1`} />
                      </th>
                      <td>FTBFS (Koschei fails)</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-file-medical-alt mr-1`} />
                      </th>
                      <td>FTI or FTBFS (fedora-health-check fails)</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <i className={`fa fa-user-slash mr-1`} />
                      </th>
                      <td>Orphaned or orphan impacted package</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6 text-right">
                <h2 className="text-left">Search and filtering options</h2>
                <div className="text-left">
                  In the top bar, there is:
                  <ul>
                    <li>
                      search input to filter packages by their name, you can use regular
                      expressions
                    </li>
                    <li>
                      <i className="fas fa-cog"></i> button, click opens filtering options
                    </li>
                    <li>
                      <i className="fas fa-sign-out-alt"></i> button to swich users
                    </li>
                  </ul>
                </div>
                <div className="masthead navbar py-1 px-0 px-md-2">
                  <div className="container px-1 px-md-2">
                    <nav className="navbar-expand-md navbar-light" style={{ width: 100 + "%" }}>
                      <div
                        className="d-flex flex-row align-items-center justify-content-end"
                        style={{ width: 100 + "%" }}>
                        <div className="mr-4 mt-1 mt-sm-0">
                          <input
                            className={"form-control "}
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                        </div>
                        <span
                          data-toggle="tooltip"
                          title=""
                          data-original-title="Options"
                          className="mr-4">
                          <a data-target="#options" data-toggle="modal">
                            <i className="fas fa-cog"></i>
                          </a>
                        </span>
                        <span
                          data-toggle="tooltip"
                          title=""
                          data-original-title="Change user/group">
                          <a href="" onClick={(e) => e.preventDefault()}>
                            <i className="fas fa-sign-out-alt"></i>
                          </a>
                        </span>
                      </div>
                    </nav>
                  </div>
                </div>

                <h2 className="mt-4 text-left">Stats and tooltips</h2>
                <p className="text-left">
                  On the top right, there are stats for each category (bugs, PRs, etc.). You can
                  hover over the icons to see detailed tooltip or you can click the icon, to show
                  only items from that category. Click again on the active filter, to reset it.
                </p>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="13 bugs">
                  <i className={`fa fa-bug mr-1`} /> 13
                </span>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="9 updates">
                  <i className={`fa fa-bolt mr-1`} /> 9
                </span>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="1 override">
                  <i className={`fa fa-shapes mr-1`} /> 1
                </span>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="3 PRs">
                  <i className={`fa fa-git mr-1`} /> 3
                </span>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="2 fails in koschei (FTBFS)">
                  <i className={`fa fa-wrench mr-1`} /> 2
                </span>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="0 fails in fedora-health-check (FTI/FTBFS)">
                  <i className={`fa fa-file-medical-alt mr-1`} /> 0
                </span>
                <span
                  data-toggle="tooltip"
                  title=""
                  className={`text-nowrap pointer text-muted font-weight-bold mr-4`}
                  data-original-title="1 packages orphaned">
                  <i className={`fa fa-user-slash mr-1`} /> 1
                </span>
              </div>
            </div>
            <hr />
            <h2>Group items visibility settings</h2>
            There is an option to set the visibility of packages according to ownership.
            This example uses following color coding:
            <ul>
              <li>
                <span style={{"font-weight": "bold","color": "#3c6eb4"}}>blue color</span> for packages owned directly by you
              </li>
              <li>
                <span style={{"font-weight": "bold","color": "#DC3545"}}>red color</span> for packages owned through group
              </li>
              <li>
                <span style={{"font-weight": "bold","color": "#8C527D"}}>purple color</span> for packages owned directly and through group
              </li>
            </ul>
            <div className="row mt-4">
              <div className="col-4 text-center">
                <i className="fas fa-users mr-1"></i><br />
                Include all packages maintained by this group regardless of my direct package relationship
                <Venn a="#3c6eb4" b="#DC3545" union="#8C527D"/>
                <em>"I want to see everything."</em>
              </div>
              <div className="col-4 text-center">
                <i className="fas fa-user mr-1"></i><br />
                Include packages that I directly maintain regardless of their relationship to this group
                <Venn a="#3c6eb4" b="#f3f3f3" union="#8C527D"/>
                <em>"I don't care about groups, show my packages."</em>
              </div>
              <div className="col-4 text-center">
                <i className="fas fa-eye-slash"></i><br />
                Exclude all packages maintained by this group regardless of my direct package relationship
                <Venn a="#3c6eb4" b="#f3f3f3" union="#f3f3f3"/>
                <em>"Hide packages from that group."</em>
              </div>
            </div>
            <hr />
            <h2>Bugs, PRs, Updates, etc</h2>
            This sections show all the items you can encounter in the dashboard. Data shown bellow are for imaginary
            package foobar and are artificial, made only for this help page. Hover over the package name, title,
            icons, ... to see tooltips.
            <div className="row mt-4">
              <div className="col-md-6 pt-4">
                <h3>Bug</h3>
                <p>
                  The item shows bug summary, time from the last activity, release, number of
                  comments, bug status (new, assigned, ...) and priority/severity of the bug (L&nbsp;-&nbsp;                  low, M&nbsp;-&nbsp;medium, H&nbsp;-&nbsp;high, U&nbsp;-&nbsp;urgent)
                </p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, bugs: bugs }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />

                <h3 className="mt-4">Update</h3>
                <p>
                  Update item shows the update's name, time since it was created, Fedora release and time to stable (if
                  applicable), current repo, numbers of comments and karma.
                </p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, updates: updates }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />

                <h3 className="mt-4">Overrides</h3>
                <p>Override item shows override's title, time since it was created, Fedora release and time to expiry.</p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, overrides: overrides }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />

                <h3 className="mt-4">Pull-requests</h3>
                <p>
                  Pull-request shows pull-request's title, time since it was created, author, Fedora release and generalized
                  result. This item is expandable (denoted by{" "}
                  <i className="fas fa-chevron-down"></i>), expansion shows per CI results.
                </p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, prs: prs }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />
              </div>
              <div className="col-md-6">
                <h3>Koschei fails</h3>
                <p>
                  Koschei fail means that package fails to build from source (FTBFS), this is
                  indicated by the badge near the package name. Koschei item show release, link to the last
                  successful build and time since.
                </p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, koschei: koschei }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />

                <h3 className="mt-4">Fedora-health-check fails</h3>
                <p>
                  Fedora-health-check fail means that package fails to install on a given
                  architecture (e.g. missing dependencies). Item shows release and list of arches.
                  This item is expandable (denoted by{" "}
                  <i className="fas fa-chevron-down"></i>), expansion shows problematic dependencies
                  per arch.
                  <br />
                </p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, fti: fti }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />

                <h3 className="mt-4">Orphan impacted package</h3>
                <p>
                  Orphaned and orphan impacted packages are denoted by the badge near the package name. For
                  orphan impacted packages the item shows remaining time until troubles occur (the package
                  will start missing dependencies, because of the orphaning process, either directly or
                  indirectly). Item can be expanded (denoted by{" "} <i className="fas fa-chevron-down"></i>)
                  to show problematic dependencies (both direct and remote). Clicking on "show dependency network"
                  opens modal window with dependency graph. Package bar directly affects the foobar package
                  by being orphaned, and the package baz is an example of the indirect impact.
                </p>
                <Widget
                  title={pkg.name}
                  {...{ ...pkg.data, orphan: orphan }}
                  ownershipIcon={null}
                  versions={version}
                  cvesOnly={false}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6"></div>
              <div className="col-md-6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Help
