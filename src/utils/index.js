import * as R from "ramda"

export const dataLen = (pkg, includeOrphans = true) =>
  pkg.data.bugs.length +
  pkg.data.pull_requests.length +
  pkg.data.updates.length +
  pkg.data.overrides.length +
  pkg.data.koschei.length +
  pkg.data.fti.length +
  (pkg.data.orphan.depends_on_orphaned ? 1 : 0) +
  (includeOrphans && pkg.data.orphan.orphaned ? 1 : 0)


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
    R.map(r => R.defaultTo(true, options.show_releases[r.replace(/\s/g, "")])),
  )

  // Show [fedora-all] [epel-all] (i.e. "Fedora" and "EPEL" without release number)
  // only when there is at least one "Fedora XX" or "EPEL X" set to true
  switch(what.release){
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
