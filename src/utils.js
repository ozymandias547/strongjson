module.exports.getType = (node) => {
  if (Array.isArray(node)) return "array"
  else if (typeof node === "object" && node !== null) return "object"
  else return typeof node
}