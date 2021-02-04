import { parse } from '@fluent/syntax'
import serializer from './ftl2jsSerializer.js'

export default function ftlToJs (str, cb, params = { respectComments: true }) {
  if (typeof str !== 'string') {
    if (!cb) throw new Error('The first parameter was not a string')
    return cb(new Error('The first parameter was not a string'))
  }

  const parsed = parse(str, { withSpans: false })

  const result = parsed.body.reduce((mem, segment) => {
    const item = serializer.serialize(segment)
    if (!item) return mem
    if (
      (item.attributes && item.attributes.length) ||
      (item.comment && params.respectComments)
    ) {
      const inner = {}
      if (item.comment) inner[item.comment.key] = item.comment.value
      if (item.attributes && item.attributes.length) {
        item.attributes.forEach((attr) => {
          inner[attr.key] = attr.value
        })
      }
      inner.val = item.value

      mem[item.key] = inner
    } else {
      mem[item.key] = item.value
    }
    return mem
  }, {})

  if (cb) cb(null, result)
  return result
}
