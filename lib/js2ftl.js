// the brace depth after a line: { } outside string literals; a string literal (only inside a
// placeable) ends on its line in Fluent, so the line's own scan is enough
function depthAfter (line, depth) {
  let inString = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inString) {
      if (c === '\\') i++
      else if (c === '"') inString = false
    } else if (c === '"' && depth > 0) inString = true
    else if (c === '{') depth++
    else if (c === '}' && depth > 0) depth--
  }
  return depth
}

// a pattern line that starts, after spaces (only spaces indent in Fluent), with [, * or . is read
// as a variant key or an attribute, so that character goes out as a string literal placeable,
// the way Fluent escapes it; lines inside a placeable (a selector's variants) stay as they are
function escapeLineStarts (lines) {
  let depth = 0
  return lines.map((line) => {
    const out = depth === 0 ? line.replace(/^( *)([[*.])/, '$1{"$2"}') : line
    depth = depthAfter(line, depth)
    return out
  })
}

function addValue (k, value) {
  let ftl = ''

  ftl = ftl + k + ' ='
  if (value && value.indexOf('\n') > -1) {
    ftl = ftl + '\n  '
    ftl = ftl + escapeLineStarts(value.split('\n')).join('\n  ')
  } else {
    ftl = ftl + ' ' + value
  }

  return ftl
}

function addComment (comment) {
  let ftl = ''

  ftl = ftl + '# ' + comment.split('\n').join('\n# ')
  ftl = ftl + '\n'

  return ftl
}

export default function js2ftl (resources, cb) {
  let ftl = ''

  Object.keys(resources).forEach((k) => {
    const value = resources[k]

    if (typeof value === 'string') {
      ftl = ftl + addValue(k, value)
      ftl = ftl + '\n\n'
    } else {
      if (value.comment) ftl = ftl + addComment(value.comment)
      ftl = ftl + (value.val == null ? k + ' =' : addValue(k, value.val))

      Object.keys(value).forEach((innerK) => {
        if (innerK === 'comment' || innerK === 'val') return
        const innerValue = value[innerK]
        ftl = ftl + addValue('\n  .' + innerK, innerValue)
      })

      ftl = ftl + '\n\n'
    }
  })

  if (cb) cb(null, ftl)
  return ftl
}
