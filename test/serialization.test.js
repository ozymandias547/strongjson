var assert = require('assert');
var StrongJSON = require('../src/index.js');
var Types = require('../src/types.js');

describe('Serialization', function() {

  var SimpleSchema

  beforeEach(() => {
    SimpleSchema = Types.Object({required: true}, [
      Types.Key(
        "hi",
        {},
        Types.String()
      )
    ]);

  })

  it('should serialize and deserialize instances', function() {

    var myType = StrongJSON.create(
      Types.Object({}, [
        Types.Key(
          "hi",
          {},
          Types.String()
        )
      ]
    ));

    const serializedType = myType.serialize();

    var myOtherType = StrongJSON.create(serializedType);

  });

});
