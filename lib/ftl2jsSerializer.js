const getTypeName = (item) => 'get' + item.type

export default {
  serialize (item) {
    if (this[getTypeName(item)]) {
      return this[getTypeName(item)](item)
    } else {
      console.warn('unknown type:', item.type, item)
    }
  },

  getComment (item) {
    return { key: 'comment', value: item.content }
  },

  getGroupComment () {
    return null
  },

  getResourceComment () {
    return null
  },

  getMessage (item) {
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value),
      comment: item.comment && this[getTypeName(item.comment)](item.comment),
      attributes:
        item.attributes &&
        item.attributes.map((attr) => {
          return this.serialize(attr)
        })
    }
  },

  getAttribute (item) {
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value)
    }
  },

  getTerm (item) {
    return {
      key: `-${this[getTypeName(item.id)](item.id)}`,
      value: this[getTypeName(item.value)](item.value),
      comment: item.comment && this[getTypeName(item.comment)](item.comment),
      attributes:
        item.attributes &&
        item.attributes.map((attr) => {
          return this.serialize(attr)
        })
    }
  },

  getIdentifier (item) {
    return item.name
  },

  getStringLiteral (item) {
    return item.value
  },

  getPattern (item) {
    const items = item.elements.map((placeable) => {
      if (placeable.expression) {
        if (!this[getTypeName(placeable.expression)]) {
          return console.log(
            'unknown1',
            getTypeName(placeable.expression),
            placeable.expression
          )
        }
        return this[getTypeName(placeable.expression)](placeable.expression)
      } else {
        if (!this[getTypeName(placeable)]) { return console.log('unknown2', getTypeName(placeable), placeable) }
        return this[getTypeName(placeable)](placeable)
      }
    })

    return items.join('')
  },

  getCallExpression (item) {
    const fcName = item.callee.name

    const positionals = item.positional.map((positional) => {
      return this[getTypeName(positional)](positional, true)
    })

    const nameds = item.named.map((named) => {
      return this[getTypeName(named)](named)
    })

    return (
      '{ ' +
      fcName +
      '($' +
      positionals.join(' ') +
      (nameds.length ? ', ' + nameds.join(', ') : '') +
      ') }'
    )
  },

  getNamedArgument (item) {
    return (
      this[getTypeName(item.name)](item.name) +
      ': "' +
      this[getTypeName(item.value)](item.value) +
      '"'
    )
  },

  getTextElement (item) {
    return item.value
  },

  getSelectExpression (item) {
    const id = this[getTypeName(item.selector)](item.selector, true)

    const variants = item.variants.map((variant) => {
      return this[getTypeName(variant)](variant)
    })

    return '{ $' + id + ' ->\n' + variants.join('\n') + '\n}'
  },

  getVariantExpression (item) {
    const ref = this[getTypeName(item.ref)](item.ref, true)
    const key = this[getTypeName(item.key)](item.key)

    if (key) return '{ ' + ref + '[' + key + '] }'
    return ' { ' + ref + ' } '
  },

  getVariableReference (item, plain) {
    if (plain) return this[getTypeName(item.id)](item.id)
    return '{ $' + this[getTypeName(item.id)](item.id) + ' }'
  },

  getTermReferences (item, plain) {
    if (plain) return this[getTypeName(item.id)](item.id)
    return '{ ' + this[getTypeName(item.id)](item.id) + ' }'
  },

  getVariantName (item) {
    return item.name
  },

  getVariantList (item) {
    const variants = item.variants.map((variant) => {
      return this[getTypeName(variant)](variant)
    })

    return '{\n' + variants.join('\n') + '\n}'
  },

  getVariant (item) {
    const name = item.key.name ? item.key.name : item.key.value
    const isDefault = item.default
    const pattern = this[getTypeName(item.value)](item.value)

    const ret = '[' + name + '] ' + pattern

    if (isDefault) return ' *' + ret
    return '  ' + ret
  },

  getFunctionReference (item) {
    let args = ''

    item.arguments.positional.forEach((p, i) => {
      if (i > 0) args += ', '
      args += `$${p.id.name}`
    })

    item.arguments.named.forEach((n, i) => {
      if (i > 0 || args !== '') args += ', '
      args += `${n.name.name}: "${n.value.value}"`
    })

    return `{ ${item.id.name}(${args}) }`
  },

  getTermReference (item) {
    return `{ -${item.id.name} }`
  },

  getJunk (item) {
    const parts = item.content.split('=')
    const key = parts.shift().trim()
    const value = parts.join('=').trim().replace(/\n {3}/g, '\n ').replace(/\n {2}}/g, '\n}')
    return { key, value }
  }
}
