function getTypeName(item) {
  return 'get' + item.type;
}

const serializer = {
  serialize: function(item) {
    if (this[getTypeName(item)]) {
      return this[getTypeName(item)](item);
    } else {
      console.warn('unknown type:', item.type, item);
    }
  },

  getComment: function(item) {
    return { key: 'comment', value: item.content };
  },

  getMessage: function(item) {
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value),
      comment: item.comment && this[getTypeName(item.comment)](item.comment),
      attributes:
        item.attributes &&
        item.attributes.map((attr) => {
          return this.serialize(attr);
        })
    };
  },

  getAttribute: function(item) {
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value)
    };
  },

  getTerm: function(item) {
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value),
      comment: item.comment && this[getTypeName(item.comment)](item.comment),
      attributes:
        item.attributes &&
        item.attributes.map((attr) => {
          return this.serialize(attr);
        })
    };
  },

  getIdentifier: function(item) {
    return item.name;
  },

  getStringLiteral: function(item) {
    return item.value;
  },

  getPattern: function(item) {
    const items = item.elements.map((placeable) => {
      if (placeable.expression) {
        if (!this[getTypeName(placeable.expression)])
          return console.log(
            'unknown1',
            getTypeName(placeable.expression),
            placeable.expression
          );
        return this[getTypeName(placeable.expression)](placeable.expression);
      } else {
        if (!this[getTypeName(placeable)])
          return console.log('unknown2', getTypeName(placeable), placeable);
        return this[getTypeName(placeable)](placeable);
      }
    });

    return items.join('');
  },

  getCallExpression: function(item) {
    const fcName = item.callee.name;

    const positionals = item.positional.map((positional) => {
      return this[getTypeName(positional)](positional, true);
    });

    const nameds = item.named.map((named) => {
      return this[getTypeName(named)](named);
    });

    return (
      '{ ' +
      fcName +
      '($' +
      positionals.join(' ') +
      (nameds.length ? ', ' + nameds.join(', ') : '') +
      ') }'
    );
  },

  getNamedArgument: function(item) {
    return (
      this[getTypeName(item.name)](item.name) +
      ': "' +
      this[getTypeName(item.value)](item.value) +
      '"'
    );
  },

  getTextElement: function(item) {
    return item.value;
  },

  getSelectExpression: function(item) {
    const id = this[getTypeName(item.selector)](item.selector, true);

    const variants = item.variants.map((variant) => {
      return this[getTypeName(variant)](variant);
    });

    return '{ $' + id + ' ->\n' + variants.join('\n') + '\n}';
  },

  getVariantExpression: function(item) {
    const ref = this[getTypeName(item.ref)](item.ref, true);
    const key = this[getTypeName(item.key)](item.key);

    if (key) return '{ ' + ref + '[' + key + '] }';
    return ' { ' + ref + ' } ';
  },

  getVariableReference: function(item, plain) {
    if (plain) return this[getTypeName(item.id)](item.id);
    return '{ $' + this[getTypeName(item.id)](item.id) + ' }';
  },

  getTermReference: function(item, plain) {
    if (plain) return this[getTypeName(item.id)](item.id);
    return '{ ' + this[getTypeName(item.id)](item.id) + ' }';
  },

  getVariantName: function(item) {
    return item.name;
  },

  getVariantList: function(item) {
    const variants = item.variants.map((variant) => {
      return this[getTypeName(variant)](variant);
    });

    return '{\n' + variants.join('\n') + '\n}';
  },

  getVariant: function(item) {
    const name = item.key.name;
    const isDefault = item.default;
    const pattern = this[getTypeName(item.value)](item.value);

    const ret = '[' + name + '] ' + pattern;

    if (isDefault) return ' *' + ret;
    return '  ' + ret;
  }
};

module.exports = serializer;
