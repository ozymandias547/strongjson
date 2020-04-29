var assert = require('assert');
var StrongJSON = require('../src/index.js');
var Types = require('../src/types.js');

describe('Types', function() {

  it('Object should be able to accept type elements as arguments', function() {

    var myType = StrongJSON.create(Types.Object(
      Types.Key("hi", Types.String()),
      Types.Key("there", Types.String()),
    ))

    myType.validate({
      "hi": "test",
      "there": "test"
    })

  });

  it('Key should be able to accept type elements as arguments', function() {

    var myType = StrongJSON.create(Types.Object(
      Types.Key("hi", Types.Number(), Types.String()),
    ))

    myType.validate({
      "hi": 12
    })

    myType.validate({
      "hi": "there"
    })

  });

  it('Array should be able to accept type elements as arguments', function() {

    var myType = StrongJSON.create(Types.Object(
      Types.Key("hi", Types.Array(
        Types.String()
      )),
    ))

    myType.validate({
      "hi": [ "test" ]
    })

  });

});
