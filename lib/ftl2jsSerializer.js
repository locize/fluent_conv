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
      value: item.value && this[getTypeName(item.value)](item.value),
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
        // {"{"} is how a pattern writes a literal brace (or a leading [, * or .). Keep
        // it as source like the other placeables: the bare "{" would not parse again.
        if (placeable.expression.type === 'StringLiteral') return `{"${placeable.expression.value}"}`
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
    if (item.selector.type === 'FunctionReference') {
      return '{ ' + id + ' ->\n' + variants.join('\n') + '\n}'
    }
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

  getCallArguments (item) {
    const positional = item.positional.map((p) => this.getArgument(p))
    const named = item.named.map((n) => `${n.name.name}: ${this.getArgument(n.value)}`)
    return positional.concat(named).join(', ')
  },

  getArgument (item) {
    if (item.type === 'VariableReference') return `$${item.id.name}`
    if (item.type === 'NumberLiteral') return item.value
    if (item.type === 'StringLiteral') return `"${item.value}"`
    if (item.type === 'FunctionReference') return this.getFunctionReference(item, true)
    if (item.type === 'Placeable') return this.serialize(item.expression)
    // message and term references, without the '{ ' and ' }' of their placeable form
    return this.serialize(item).slice(2, -2)
  },

  getFunctionReference (item, plain) {
    const args = this.getCallArguments(item.arguments)
    if (plain) return `${item.id.name}(${args})`
    return `{ ${item.id.name}(${args}) }`
  },

  getTermReference (item) {
    const args = item.arguments ? `(${this.getCallArguments(item.arguments)})` : ''
    return `{ -${item.id.name}${args} }`
  },

  getMessageReference (item) {
    const attr = item.attribute ? `.${item.attribute.name}` : ''
    return `{ ${item.id.name}${attr} }`
  },

  getJunk (item) {
    const parts = item.content.split('=')
    const key = parts.shift().trim()
    const value = parts.join('=').trim().replace(/\n {3}/g, '\n ').replace(/\n {2}}/g, '\n}')
    return { key, value }
  }
}
