import React from "react"
import * as R from "ramda"

export const parsedQueryToCanonicalString = ({ users, packages, groups }) => {
  const sortedListString = R.pipe(R.defaultTo(""), R.split(","), R.sortBy(R.identity), R.join(","))
  return sortedListString(users) + "," + sortedListString(packages) + "," + sortedListString(groups)
}

export const EMPTY_ARRAY = []
export const NOT_ORPHAN = { orphaned: false, depends_on_orphaned: false, orphaned_since: null }
export const NO_ABRT = { outstanding_problems: [], problems_present: false, retrace_link: "" }

export const filterCategories = (options) => (pkg) => {
  return {
    ...pkg,
    data: {
      ...pkg.data,
      bzs: options.show_bugs ? pkg.data.bzs : EMPTY_ARRAY,
      prs: options.show_prs ? pkg.data.prs : EMPTY_ARRAY,
      updates: options.show_updates ? pkg.data.updates : EMPTY_ARRAY,
      overrides: options.show_overrides ? pkg.data.overrides : EMPTY_ARRAY,
      koschei: options.show_koschei ? pkg.data.koschei : EMPTY_ARRAY,
      orphans: options.show_orphaned ? pkg.data.orphans : NOT_ORPHAN,
      fails_to_install: options.show_fti ? pkg.data.fails_to_install : EMPTY_ARRAY,
      abrt_reports: options.show_abrt_reports ? pkg.data.abrt_reports : NO_ABRT,
    },
  }
}

export const showRelease = (releases, options, what) => {
  const showAll = R.compose(
    R.any(R.identity),
    R.map((r) => R.defaultTo(true, options.show_releases[r.replace(/\s/g, "")]))
  )

  // Show [fedora-all] [epel-all] (i.e. "Fedora" and "EPEL" without release number)
  // only when there is at least one "Fedora XX" or "EPEL X" set to true
  switch (what.release) {
    case "Fedora":
      return showAll(releases.fedora)
    case "EPEL":
      return showAll(releases.epel)

    default:
      return R.defaultTo(true, options.show_releases[what.release.replace(/\s/g, "")])
  }
}

export const showOption = R.curry((show_obj, what) => R.defaultTo(true, show_obj[what]))

const filterBugs = (bzs, options, releases) => {
  const priorities_severities = ["unspecified", "low", "medium", "high", "urgent"]

  //if (bzs.status === 204) return EMPTY_ARRAY

  return bzs.filter((bug) => {
    if (
      !showRelease(releases, options, bug) ||
      !options[`show_bug_status_${bug.status}`] ||
      !R.compose(R.all(R.identity), R.map(showOption(options.show_bug_kw)))(bug.keywords) ||
      (options["show_cves_only"] &&
        !(bug.keywords.includes("Security") && bug.keywords.includes("SecurityTracking")))
    )
      return false

    if (bug.priority_severity === "unspecified") return options.bug_include_unspecified
    return (
      priorities_severities.indexOf(bug.priority_severity) >=
      priorities_severities.indexOf(options.bug_min_priority_severity)
    )
  })
}

const filterPRs = (prs, options, releases) => {
  return prs.filter((pr) => {
    if (!showRelease(releases, options, pr)) {
      return false
    }
    return true
  })
}

const filterUpdates = (updates, options, releases) => {
  return updates.filter((update) => {
    if (!showRelease(releases, options, update)) {
      return false
    }
    return true
  })
}

const filterOverrides = (overrides, options, releases) => {
  return overrides.filter((override) => {
    if (!showRelease(releases, options, override)) {
      return false
    }
    return true
  })
}

const filterKoschei = (koschei, options, releases) => {
  return koschei
    .filter((k) => k.status === "failing")
    .filter((k) => {
      if (!showRelease(releases, options, k)) return false

      return true
    })
}

const filterOrphans = (orphans, options, releases) => {
  return orphans
}

const filterFTI = (ftis, options, releases) => {
  return ftis.filter(fti => {
    if (!showRelease(releases, options, fti)) {
      return false
    }

    return true
  })
}

const filterABRT = (abrt, options, releases) => {
  return abrt
}

export const filterPackage = (options, releases) => (pkg) => {
  return {
    ...pkg,
    data: {
      ...pkg.data,
      bzs: filterBugs(pkg.data.bzs, options, releases),
      prs: filterPRs(pkg.data.prs, options, releases),
      updates: filterUpdates(pkg.data.updates, options, releases),
      overrides: filterOverrides(pkg.data.overrides, options, releases),
      koschei: filterKoschei(pkg.data.koschei, options, releases),
      orphans: filterOrphans(pkg.data.orphans, options, releases),
      fails_to_install: filterFTI(pkg.data.fails_to_install, options, releases),
      abrt_reports: filterABRT(pkg.data.abrt_reports, options, releases),
    },
  }
}

export const hiddenDueFiltering = (options, filtered, unfiltered) =>
  (options.show_bugs && filtered.bzs < unfiltered.bzs) ||
  (options.show_prs && filtered.prs < unfiltered.prs) ||
  (options.show_updates && filtered.updates < unfiltered.updates) ||
  (options.show_overrides && filtered.overrides < unfiltered.overrides) ||
  (options.show_koschei && filtered.koschei < unfiltered.koschei) ||
  (options.show_fti && filtered.fails_to_install < unfiltered.fails_to_install) ||
  (options.show_orphans && filtered.orphans < unfiltered.orphans) ||
  (options.show_abrt_reports && filtered.abrt_reports < unfiltered.abrt_reports)

// {pkgName, ...pkgData} -> int
export const dataLen = (pkg, includeOrphans = true) =>
  pkg.data.bzs.length +
  pkg.data.prs.length +
  pkg.data.updates.length +
  pkg.data.overrides.length +
  pkg.data.koschei.length +
  pkg.data.fails_to_install.length +
  (pkg.data.abrt_reports.problems_present ? 1 : 0) +
  (pkg.data.orphans.depends_on_orphaned ? 1 : 0) +
  (includeOrphans && pkg.data.orphans.orphaned ? 1 : 0)

// [[pkg, pkgData], ...] -> int
const pixelHeight = R.pipe(
  R.map((x) => 52 * dataLen(x, false) + 67), // *52 for row height, +67 for title and padding
  R.sum
)

// [packageObject] -> {string: int}
export const itemsCntPerCategory = (packages) => {
  // packages in format [{name, data: {bugs,...}}]
  const itemsCntInCategory = R.pipe(
    (category) => packages.map(p => p.data[category].length),
    R.sum,
  )
  return {
    bzs: itemsCntInCategory("bzs"),
    prs: itemsCntInCategory("prs"),
    updates: itemsCntInCategory("updates"),
    overrides: itemsCntInCategory("overrides"),
    koschei: itemsCntInCategory("koschei"),
    orphans: R.sum(packages.map(pkg => (pkg.data.orphans.depends_on_orphaned ? 1 : 0) + (pkg.data.orphans.orphaned ? 1 : 0))),
    fails_to_install: itemsCntInCategory("fails_to_install"),
    abrt_reports: R.sum(packages.map(p => p.data.abrt_reports?.outstanding_problems?.length ? 1 : 0)),
  }
}

// split list of packages into two lists are the same height in pixels
// [[{pkgName, ...pkgData}, ...]] -> ([{pkgName, ...pkgData}, ...], [{pkgName, ...pkgData}, ...])
export const balancedSplit = (data) => {
  var a = data
  var b = []
  if (a.length < 2) return [a, b]

  var new_a = R.dropLast(1, a)
  var new_b = R.concat([R.last(a)], b)
  while (
    a.length >= 2 &&
    Math.abs(pixelHeight(new_a) - pixelHeight(new_b)) <= Math.abs(pixelHeight(a) - pixelHeight(b))
  ) {
    b = new_b
    a = new_a

    new_a = R.dropLast(1, a)
    new_b = R.concat([R.last(a)], b)
  }
  return [a, b]
}

const _searchMatch = (AST, pkg_name) => {
  switch (AST.o) {
    case "OR":
      return _searchMatch(AST.l, pkg_name) || _searchMatch(AST.r, pkg_name)
    case "AND":
      return _searchMatch(AST.l, pkg_name) && _searchMatch(AST.r, pkg_name)
    case "NOT":
      return !_searchMatch(AST.v, pkg_name)
    case "STR":
      return pkg_name.includes(AST.v)
    case "REGEX":
      return R.test(new RegExp(AST.v), pkg_name)
    default:
      return true // this should not happen
  }
}

export const searchMatch = (AST, pkg_name) => {
  if (R.isEmpty(AST)) return true

  return _searchMatch(AST, pkg_name)
}

export const convertToPDStyle = R.pipe(
  R.mapObjIndexed((pkgData, pkgName, _) => ({...pkgData, name: pkgName})),
  R.values,
)

export const splitByPinning = (packages, pinning) => {
  return {
    packagesPinned: packages.filter((pkg) => R.defaultTo(0, pinning[pkg.name]) ===  1),
    packagesNormal: packages.filter((pkg) => R.defaultTo(0, pinning[pkg.name]) ===  0),
    packagesStashed: packages.filter((pkg) => R.defaultTo(0, pinning[pkg.name]) === -1),
  }
}

export const pipeLog = (a) => {
  console.log("DEBUG *******************")
  console.log(a)
  console.log("DEBUG *******************")
  return a
}

export const ownershipIcon = (pkg) => {
  const users = R.pipe(
    R.uniq,
    R.join(", ")
  )(pkg.maintainers.users)
  const groups = R.pipe(
    R.uniq,
    R.join(", ")
  )(pkg.maintainers.groups)

  if (pkg.maintainers.users.length > 0 && pkg.maintainers.groups.length > 0) {
    // direct and group ownership
    return <i className="fas fa-user-friends mr-1" title={`package owned both by users (${users}) and through groups (${groups})`}></i>
  }

  if (pkg.maintainers.users.length === 0 && pkg.maintainers.groups.length > 0) {
    // group ownership only
    return <i className="fas fa-users mr-1" title={`package owned through groups only (${groups})`}></i>
  }

  if (pkg.maintainers.users.length > 0) {
    // direct ownership only
    return <i className="fas fa-user mr-1" title={`package directly owned by users (${users})`}></i>
  }

  // packages explicitly requested using query ?packages=
  return <i className="fas fa-box-open mr-1" title={`package explicitly requested`}></i>
}
