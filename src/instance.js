const processSchemaNode = require('./processSchema.js');
const Validate = require('./validate.js')
const VERSION = require('../package.json').version;

module.exports = (Schema) => {

  var meta = processSchemaNode(Schema, true);
  var identifiers = buildIdentifiers(meta);
  var validators = Object.assign({}, Validate.validators);

  meta.root = true;

  function serialize() {
    return JSON.stringify({ v: VERSION, meta });
  }

  function deserialize(jsonMeta) {

    var deserialized = {};

    try {
      if (typeof jsonMeta === "string") {
        deserialized = JSON.parse(jsonMeta)
      } else {
        deserialized = jsonMeta;
      }
    } catch(e) {}

    if (deserialized.v) {
      meta = deserialized.meta;
      identifiers = buildIdentifiers(meta);
      return true;
    }

  }

  return {
    identifiers,
    getExample: () => getExample(meta),
    validate: (json) => Validate.validateJson(json, meta, validators),
    stamp: () => generateDefault(meta),
    forEach: (cb) => forEach(meta, cb),
    serialize,
    deserialize
  };

}

function buildIdentifiers(meta) {

  var identifiers = {};

  iterate(meta, "");

  function iterate(node, prefix) {
    if (node.type === "object") {
      var identifier = prefix + `[Object]`;
      identifiers[identifier] = node;
      node.id = identifier;
      node.keys.forEach((key) => iterate(key, identifier))
    }
    else if (node.type === "key") {
      var identifier = prefix + `[Key ${node.key}]`;
      identifiers[identifier] = node;
      node.id = identifier;
      node.valueTypes.forEach((vT) => iterate(vT, identifier))
    }
    else if (node.type === "array") {
      var identifier = prefix + `[Array]`;
      identifiers[identifier] = node;
      node.id = identifier;
      node.valueTypes.forEach((vT, idx) => iterate(vT, identifier + `[option ${idx}]`))
    } else {
      var identifier = prefix + `[${node.type}]`;
      identifiers[identifier] = node;
      node.id = identifier;
    }
  }

  return identifiers;

}

function getExample(meta) {

  return iterate(meta, {});

  function iterate(node, context) {
    if (node.type === "object") {
      var newObject = {};
      node.keys.forEach((key) => iterate(key, newObject))
      return newObject;
    }
    else if (node.type === "key") {
      context[node.key] = iterate(node.valueTypes[0])
      return context;
    }
    else if (node.type === "array") {
      return node.valueTypes.map((vT) =>
        iterate(vT)
      )
    } else {
      if (node.type === "string") return node.options.example || "";
      if (node.type === "number") return node.options.example || 0;
      if (node.type === "boolean") return node.options.example || true;
      if (node.type === "null") return node.options.example || null;
      else return undefined;
    }
  }

}

function forEach(meta, cb) {

  iterate(meta, null, meta);

  function iterate(node, parent, meta) {
    cb(node)
    if (node.type === "object") node.keys.forEach((key) => iterate(key, node, meta))
    else if (
      node.type === "key" ||
      node.type === "array" ) node.valueTypes.forEach((vT) => iterate(vT, node, meta));
  }

}

function generateDefault() {
  return "stamp"
}

function getType(node) {
  if (typeof node === "object" && node !== null) return "object"
  else if (Array.isArray(node)) return "array"
  else return typeof node
}
