import * as R from "ramda"

export const dataLen = (pkg, includeOrphans = true) =>
  pkg.data.bugs.length +
  pkg.data.prs.length +
  pkg.data.updates.length +
  pkg.data.overrides.length +
  pkg.data.koschei.length +
  pkg.data.fti.length +
  (pkg.data.orphan.depends_on_orphaned ? 1 : 0) +
  (includeOrphans && pkg.data.orphan.orphaned ? 1 : 0)

export const itemCnt = R.compose(
  R.sum,
  R.map(dataLen)
)

// [packageObject] -> {string: int}
export const itemsCntPerCategory = (packages) => {
  // packages in format [{name, data: {bugs,...}}]
  const itemsCntInCategory = R.compose(
    R.sum,
    (category) => packages.map(p => p.data[category].length)
  )

  return {
    bugs: itemsCntInCategory("bugs"),
    prs: itemsCntInCategory("prs"),
    updates: itemsCntInCategory("updates"),
    overrides: itemsCntInCategory("overrides"),
    koschei: itemsCntInCategory("koschei"),
    orphans: R.sum(packages.map(pkg => (pkg.data.orphan.depends_on_orphaned ? 1 : 0) + (pkg.data.orphan.orphaned ? 1 : 0))),
    fti: itemsCntInCategory("fti"),
  }
}

const t = 0
const dl = R.compose(
  R.sum,
  R.map((x) => 52 * dataLen(x, false) + 67) // *52 for row height, +67 for title and padding
)

export const balancedSplitRecursive = (data) => {
  const t0 = performance.now()
  const out = _bs(data, [])
  const t1 = performance.now()

  console.log(`BS (recursive) took ${t1 - t0} milliseconds.`)
  console.log(dl(out[0]), dl(out[1]))
  return out
}

const _bs = (a, b = []) => {
  if (a.length < 2) return [a, b]
  const new_a = R.dropLast(1, a)
  const new_b = R.concat([R.last(a)], b)
  if (dl(new_a) - dl(new_b) < t) return [a, b]

  return _bs(new_a, new_b)
}

export const balancedSplit = (data) => {
  const t0 = performance.now()
  var a = data
  var b = []
  if (a.length < 2) return [a, b]

  var new_a = R.dropLast(1, a)
  var new_b = R.concat([R.last(a)], b)
  while (a.length >= 2 && dl(new_a) - dl(new_b) >= t) {
    b = new_b
    a = new_a

    new_a = R.dropLast(1, a)
    new_b = R.concat([R.last(a)], b)
  }
  const t1 = performance.now()
  console.log(`BS (while) took ${t1 - t0} milliseconds.`)
  return [a, b]
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

export const valueOfInput = (t) => {
  switch (t.type) {
    case "checkbox":
      return t.checked

    default:
      return t.value
  }
}

export const onlyCategoryShown = (options, category) => {
  return (
    options[`show_${category}`] &&
    R.compose(
      R.all(R.identity),
      R.map((category) => !options[category]),
      R.without(`show_${category}`)
    )([
      "show_bugs",
      "show_updates",
      "show_prs",
      "show_overrides",
      "show_orphaned",
      "show_koschei",
      "show_fti",
    ])
  )
}

export const filterCategory = (options, releases, user_data) => {
  return {
    bugs: filterBugs(options, releases, user_data),
    prs: filterPRs(options, releases, user_data),
    updates: filterUpdates(options, releases, user_data),
    overrides: filterOverrides(options, releases, user_data),
    koschei: filterKoschei(options, releases, user_data),
    orphan: filterOrphan(options, releases, user_data),
    fti: filterFTI(options, releases, user_data),
  }
}

const EMPTY_ARRAY = []
const NOT_ORPHAN = { orphaned: false, depends_on_orphaned: false, orphaned_since: null }

export const filterBugs = (options, releases, user_data) => (pkg) => {
  const { bzs } = user_data
  const priorities_severities = ["unspecified", "low", "medium", "high", "urgent"]

  if (bzs.status === 204) return EMPTY_ARRAY

  return bzs.data[pkg].filter((bug) => {
    if (
      !showRelease(releases, options, bug) ||
      !options[`show_bug_status_${bug.status}`] ||
      !R.compose(R.all(R.identity), R.map(showOption(options.show_bug_kw)))(bug.keywords)
    )
      return false

    if (bug.priority_severity === "unspecified") return options.bug_include_unspecified
    return (
      priorities_severities.indexOf(bug.priority_severity) >=
      priorities_severities.indexOf(options.bug_min_priority_severity)
    )
  })
}

export const filterPRs = (options, releases, user_data) => (pkg) => {
  const { prs } = user_data
  if (prs.status === 204) return EMPTY_ARRAY

  return prs.data[pkg].filter((pr) => {
    if (!showRelease(releases, options, pr)) return false

    return true
  })
}

export const filterUpdates = (options, releases, user_data) => (pkg) => {
  const { static_info } = user_data

  return static_info.data.updates[pkg].filter((update) => {
    if (!showRelease(releases, options, update)) return false

    return true
  })
}

export const filterOverrides = (options, releases, user_data) => (pkg) => {
  const { static_info } = user_data

  return static_info.data.overrides[pkg].filter((override) => {
    if (!showRelease(releases, options, override)) return false

    return true
  })
}

export const filterKoschei = (options, releases, user_data) => (pkg) => {
  const { static_info } = user_data

  return static_info.data.koschei[pkg]
    .filter((k) => k.status === "failing")
    .filter((k) => {
      if (!showRelease(releases, options, k)) return false

      return true
    })
}

export const filterOrphan = (options, releases, user_data) => (pkg) => {
  const { static_info } = user_data

  return static_info.data.orphans[pkg]
}

export const filterFTI = (options, releases, user_data) => (pkg) => {
  const { static_info } = user_data

  return static_info.data.fails_to_install[pkg].filter((fti) => {
    if (!showRelease(releases, options, fti)) return false

    return true
  })
}

export const packageSort = (options) => (pkgs) => {
  // pkgs in format [{name, data: {bugs,...}}]

  switch (options.sort) {
    case "name":
      return R.sortBy((pkg) => pkg.name.toLowerCase(), pkgs)

    case "cnt":
      return R.sortBy((pkg) => -dataLen(pkg), pkgs)

    case "priority":
      return R.sortWith(
        [
          R.descend(
            (pkg) =>
              pkg.data.koschei.length + pkg.data.fti.length + (pkg.data.orphan.orphaned ? 1 : 0)
          ),
          R.ascend((pkg) => pkg.name.toLowerCase()),
        ],
        pkgs
      )

    // fallback, sort by name
    default:
      return R.sortBy((pkg) => pkg.name.toLowerCase(), pkgs)
  }
}

export const hiddenDueFiltering = (options, filtered, unfiltered) =>
  (options.show_bugs && filtered.bugs < unfiltered.bugs) ||
  (options.show_prs && filtered.prs < unfiltered.prs) ||
  (options.show_updates && filtered.updates < unfiltered.updates) ||
  (options.show_overrides && filtered.overrides < unfiltered.overrides) ||
  (options.show_koschei && filtered.koschei < unfiltered.koschei) ||
  (options.show_fti && filtered.fti < unfiltered.fti) ||
  (options.show_orphans && filtered.orphans < unfiltered.orphans)


export const packageObject = (filterFunction) => (pkg) => ({
  name: pkg,
  data: {
    bugs: filterFunction.bugs(pkg),
    prs: filterFunction.prs(pkg),
    updates: filterFunction.updates(pkg),
    overrides: filterFunction.overrides(pkg),
    koschei: filterFunction.koschei(pkg),
    orphan: filterFunction.orphan(pkg),
    fti: filterFunction.fti(pkg),
  },
})

export const filterHiddenCategories = (options) => (packageObjects) => {
  return packageObjects.map(pkg => ({
    name: pkg.name,
    data: {
      bugs: options.show_bugs? pkg.data.bugs : EMPTY_ARRAY,
      prs: options.show_prs? pkg.data.prs : EMPTY_ARRAY,
      updates: options.show_updates? pkg.data.updates : EMPTY_ARRAY,
      overrides: options.show_overrides? pkg.data.overrides : EMPTY_ARRAY,
      koschei: options.show_koschei? pkg.data.koschei : EMPTY_ARRAY,
      orphan: options.show_orphaned? pkg.data.orphan : NOT_ORPHAN,
      fti: options.show_fti? pkg.data.fti : EMPTY_ARRAY,
    }
  }))
}
