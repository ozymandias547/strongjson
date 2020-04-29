var getType = require('./utils.js').getType;

function validate(node, instance, validatorNode, typeOverride) {

  const nodeType = typeOverride || getType(node);

  return TypeValidators[nodeType](node, instance, validatorNode);

}

const ValidationErrorMessages = {
  "OBJECT_MISSING": (nodeType) => `Expected an object, but got a ${nodeType}`,
  "MISSING_KEY": (missingKeyName) => `Unexpected missing Key "${missingKeyName}".`,
  "ADDITIONAL_KEY": (addlKey) => `Unexpected additional Key "${addlKey}".`,
  "KEY_VALUE_TYPE_ERROR": (nodeType, expectedNodeTypes) =>
    `Unexpected Key Value Type '${nodeType}'. Expected ${expectedNodeTypes}`,
  "ARRAY_ELEMENT_TYPE_ERROR": () => `Array element type error.`,
  "STRING_TYPE_ERROR": () => `Expected string.`,
  "NUMBER_TYPE_ERROR": () => `Expected number.`,
  "BOOLEAN_TYPE_ERROR": () => `Expected boolean.`,
  "NULL_TYPE_ERROR": () => `Expected null.`,
}

const TypeValidators = {

  "object": (node, instance, validatorNode) => {

    if (validatorNode.type !== "object")
      return [{
        schemaId: validatorNode.id,
        errorKey: 'OBJECT_MISSING',
        message: ValidationErrorMessages['OBJECT_MISSING'](getType(node))
      }]

    var nodeKeys = Object.keys(node)
    var validatorKeys = validatorNode.keys.map((key) => key.key)
    var keyErrors = {}

    // Check for all required keys to exist:
    var missingRequiredKeyErrors =
      validatorNode.keys
        .filter((key) => key.options.required)
        .filter((requiredKey) => !nodeKeys.includes(requiredKey.key))
        .map((missingKey) => {
          return {
            schemaId: validatorNode.id,
            errorKey: 'MISSING_KEY',
            message: ValidationErrorMessages['MISSING_KEY'](missingKey.key)
          }
        })

    // Check for any additional keys that aren't defined in the schema:
    var addlKeyErrors = nodeKeys
      .filter((nodeKey) => !validatorKeys.includes(nodeKey))
      .map((addlKey) => {

        return {
          schemaId: validatorNode.id,
          errorKey: 'ADDITIONAL_KEY',
          message: ValidationErrorMessages['ADDITIONAL_KEY'](addlKey)
        }

      })

    if (missingRequiredKeyErrors.length > 0 || addlKeyErrors.length > 0)
      return missingRequiredKeyErrors.concat(addlKeyErrors);

    // validate each key one-by-one, escaping if just one fails for the sake of speed.
    for (var i = 0; i < nodeKeys.length; i++) {

      keyErrors[i] = [];

      keyErrors[i] = validate(
        node[nodeKeys[i]],
        instance,
        validatorNode.keys.find(key => key.key === nodeKeys[i]),
        "key"
      )

      if (keyErrors[i].length > 0) return keyErrors[i];

    }

    return [];  // successful validation of this object.

  },
  "key": (node, instance, validatorNode) => {

    const nodeType = getType(node)
    const matchingValidatorNode = validatorNode.valueTypes.find((vT) => vT.type === nodeType);

    if (!matchingValidatorNode) {
      return [
        {
          schemaId: validatorNode.id,
          errorKey: 'KEY_VALUE_TYPE_ERROR',
          message: ValidationErrorMessages['KEY_VALUE_TYPE_ERROR'](getType(node), validatorNode.valueTypes.map((vT) => `'${vT.type}'`).join(", "))
        }
      ];
    }

    return TypeValidators[nodeType](node, instance, matchingValidatorNode)

  },

  "array": (node, instance, validatorNode) => {

    var subtreeErrors = {};

    // Check types.  Return immediately if not the right type.
    for (var i = 0; i < node.length; i++) {

      var elementValue = node[i];
      var elementValueType = getType(node[i]);

      var matchingValidatorNode = validatorNode.valueTypes.find((vT) => vT.type === elementValueType);

      if (!matchingValidatorNode) {
        return [
          {
            schemaId: validatorNode.id,
            errorKey: 'ARRAY_ELEMENT_TYPE_ERROR',
            message: ValidationErrorMessages['ARRAY_ELEMENT_TYPE_ERROR']()
          }
        ]
      }

    }

    // Check subtrees.  Return immediately subtree succeeds.
    for (i = 0; i < node.length; i++) {
      // check each type subtree. if one doesn't have errors, break for the sake of performance.
      for (var j = 0; j < validatorNode.valueTypes.length; j++) {

        var valueTypeValidator = validatorNode.valueTypes[j];

        subtreeErrors[j] = TypeValidators[elementValueType](elementValue, instance, valueTypeValidator)

        if (subtreeErrors[j].length === 0)
          return [];

      }
    }

    // return all the errors if no path is found.
    return Object.keys(subtreeErrors).reduce((prev, next) => prev.concat(subtreeErrors[next]), [])

  },

  "string": (node, instance, validatorNode) => {

    const nodeType = getType(node)

    // Type Validations:
    if (nodeType !== validatorNode.type) {
      return [
        {
          schemaId: validatorNode.id,
          errorKey: 'STRING_TYPE_ERROR',
          message: ValidationErrorMessages['STRING_TYPE_ERROR']()
        }
      ];
    }

    return validateOptions(node, instance, validatorNode);

  },

  "number": (node, instance, validatorNode) => {
    const nodeType = getType(node)

    if (nodeType !== validatorNode.type) {
      return [
        {
          schemaId: validatorNode.id,
          errorKey: 'NUMBER_TYPE_ERROR',
          message: ValidationErrorMessages['NUMBER_TYPE_ERROR']()
        }
      ];
    }

    return validateOptions(node, instance, validatorNode);
  },

  "boolean": (node, instance, validatorNode) => {
    const nodeType = getType(node)

    if (nodeType !== validatorNode.type) {
      return [
        {
          schemaId: validatorNode.id,
          errorKey: 'BOOLEAN_TYPE_ERROR',
          message: ValidationErrorMessages['BOOLEAN_TYPE_ERROR']()
        }
      ];
    }

    return validateOptions(node, instance, validatorNode);
  }
}

function validateOptions(node, instance, validatorNode) {

  var errors = [];

  // Option validations
  if (getType(validatorNode.options.validate) === "object") {
    var validationNames = Object.keys(validatorNode.options.validate);

    for (var i = 0; i < validationNames.length; i++) {

      var validatorName = validationNames[i];

      // check for validation type to be registered:
      if (getType(instance.validators[validationNames[i]]) === "function") {

        var validatorResponse = instance.validators[validatorName](
          validatorNode.options.validate[validatorName],
          node,
          validatorNode,
          instance.json
        )

        if (!!validatorResponse) {

          var validatorError = {};

          if (getType(validatorResponse) === "object") {
            validatorError = validatorResponse
          } else {
            validatorError = {
              message: validatorResponse
            }
          }

          if (!validatorError.errorKey) validatorError.errorKey = "CUSTOM_VALIDATION";
          if (!validatorError.schemaId) validatorError.schemaId = validatorNode.id;

          errors.push(validatorError)
        }

      }
    }

  }

  return errors;

}

module.exports.validators = {
  "options": (validation, value, schemaNode, json) => {
    if (!validation.includes(value)) {
      return {
        errorKey: 'INVALID_OPTION',
        message: `Invalid value '${value}'. Expected one of the following: ${validation.map((o) => `'${o}'`).join(", ")}`
      }
    }
  },
  "required": (options, value, schemaNode, json) => {

  },
  "maxLength": (options, value, schemaNode, json) => {

  },
  "minLength": (options, value, schemaNode, json) => {

  }
}

module.exports.validateJson = (json, schemaTree, validators) => {

  var errors = validate(json, { json, validators }, schemaTree)

  return {
    valid: errors.length === 0,
    errors
  };

}

module.exports.ValidationErrorMessages = ValidationErrorMessages;