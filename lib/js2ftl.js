function addValue (k, value) {
  let ftl = ''

  ftl = ftl + k + ' ='
  if (value && value.indexOf('\n') > -1) {
    ftl = ftl + '\n  '
    ftl = ftl + value.split('\n').join('\n  ')
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
      ftl = ftl + addValue(k, value.val)

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
