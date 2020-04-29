var Instance = require('./instance')
var jsonToSchema = require('./jsonconvertor.js').jsonToSchema
var Types = require('./types');
var Utils = require('./utils')
var Validate = require('./validate')

module.exports.create = (data) => {

  var type = Utils.getType(data);

  if (type === "function") {
    return Instance(data);
  }
  else if (typeof data === "string") {
    var instance = Instance();
    instance.deserialize(data);
    return instance;
  }

}

module.exports.addValidator = (name, validator) => {
  Validate.validators[name] = validator;
}

module.exports.createFromJSON = (json) => {
  // var schema = jsonToSchema(json);
  // return Tree(schema)
}

module.exports.Types = {
  Object: Types.Object,
  Array: Types.Array,
  Key: Types.Key,
  String: Types.String,
  Number: Types.Number,
  Null: Types.Null,
  Boolean: Types.Boolean
};
