const processSchemaNode = (node) => {
  if (typeof node !== "function") return {};
  var node = node();
  return processors[node.type](node);
}

var processors = {
  "object": (node) => {
    return {
      type: node.type,
      keys: node.keys.map(processSchemaNode),
      options: {...node.options}
    }
  },
  "key": (node) => {
    return {
      type: node.type,
      key: node.key,
      valueTypes: node.valueTypes.map(processSchemaNode),
      options: {...node.options}
    }
  },
  "array": (node) => {
    return {
      type: node.type,
      valueTypes: node.valueTypes.map(processSchemaNode),
      options: {...node.options}
    }
  },
  "string": (node) => {
    return {
      type: node.type,
      default: node.options.default || null,
      options: {...node.options}
    }
  },
  "number": (node) => {
    return {
      type: node.type,
      default: node.options.default || null,
      options: {...node.options}
    }
  },
  "boolean": (node) => {
    return {
      type: node.type,
      default: node.options.default || null,
      options: {...node.options}
    }
  },
  "null": (node) => {
    return {
      type: node.type,
      options: {...node.options}
    }
  }
}

module.exports = processSchemaNode;