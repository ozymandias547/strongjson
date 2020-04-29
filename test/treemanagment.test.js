var assert = require('assert');
var StrongJSON = require('../src/index.js');
var Types = require('../src/types.js');

describe('Type instance schema management', function() {

  var TestSchema;

  beforeEach(() => {

    TestSchema = Types.Object({required: true}, [
      Types.Key(
        "hi",
        {},
        Types.String()
      ),
      Types.Key(
        "myArray",
        {},
        Types.Array({}, [
          Types.String(),
          Types.Number(),
          Types.Boolean(),
          Types.Null()
        ])
      )
    ]);

  })

  it('should make available an identifiers object with references to every node.', function() {

    const myTestType = StrongJSON.create(TestSchema);
    assert(Object.keys(myTestType.identifiers).length === 9)

  });

  it('should have a forEach iterable method that returns the node.', function() {

    const myTestType = StrongJSON.create(TestSchema);

    myTestType.forEach((node) => {
      assert.equal(myTestType.identifiers[node.id] === node, true);
    })

  });

});
