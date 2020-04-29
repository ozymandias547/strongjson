module.exports.Object = (...args) => {

  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  var keys = [].concat.apply(
    args.filter((arg) => typeof arg === "function") || [],
    args.filter((arg) => Array.isArray(arg)) || []
  );

  return () => ({
    type: "object",
    options,
    keys
  });

};

module.exports.Key = (...args) => {

  var key = args.filter((arg) => typeof arg === "string")[0] || {};
  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  var valueTypes = [].concat.apply(
    args.filter((arg) => typeof arg === "function") || [],
    args.filter((arg) => Array.isArray(arg)) || []
  );

  return () => ({
    type: "key",
    key,
    options,
    valueTypes
  });

};

module.exports.Array = (...args) => {

  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  var valueTypes = [].concat.apply(
    args.filter((arg) => typeof arg === "function") || [],
    args.filter((arg) => Array.isArray(arg)) || []
  );

  return () => ({
    type: "array",
    options,
    valueTypes
  });
};

module.exports.String = (...args) => {

  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  return () => ({
    type: "string",
    options
  });

};

module.exports.Number = (...args) => {

  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  return () => ({
    type: "number",
    options
  });

};

module.exports.Boolean = (...args) => {

  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  return () => ({
    type: "boolean",
    options
  });

};

module.exports.Null = (...args) => {

  var options = args.filter((arg) => typeof arg === 'object' && arg !== null)[0] || {};

  return () => ({
    type: "null",
    options
  });

};