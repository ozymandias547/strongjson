var assert = require('assert');
var StrongJSON = require('../../src/index.js');
var Types = require('../../src/types.js');

describe('Types.Key valueTypes validation', function() {
  it('should successfully validate a keys valueType of String.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.String()
        )
      ])
    );

    var validation = MyType.validate({
      "hi": "there"
    });

    assert.equal(validation.valid, true);

  });

  it('should not validate a keys valueType of String when number .', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.String()
        )
      ])
    );

    var validation = MyType.validate({
      "hi": 1
    });

    assert.equal(validation.valid, false);
    assert.equal(validation.errors.length, 1);

  });

  it('should validate an array of value options.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          [
            Types.String(),
            Types.Number(),
            Types.Boolean()
          ]
        )
      ])
    );

    var validation1 = MyType.validate({"hi": "there"});
    var validation2 = MyType.validate({"hi": 1});
    var validation3= MyType.validate({"hi": true});

    assert.equal(validation1.valid, true);
    assert.equal(validation2.valid, true);
    assert.equal(validation3.valid, true);

  });

  it('should fail if a shallow require is triggered and missing.', function() {

    const MyType = StrongJSON.create(
      Types.Object(
        Types.Key("test",
          Types.Object(
            Types.Key("innertest", {required: true}, Types.String())
          )
        )
      )
    );

    var validation1 = MyType.validate({
      test: {}
    });

    assert.equal(validation1.valid, false);

  });

  it('should succeed if a shallow require is not in path.', function() {

    const MyType = StrongJSON.create(
      Types.Object(
        Types.Key("test",
          Types.Object(
            Types.Key("innertest", {required: true}, Types.String())
          )
        )
      )
    );

    var validation1 = MyType.validate({
      test: {}
    });

    var validation2 = MyType.validate({});

    assert.equal(validation1.valid, false);
    assert.equal(validation2.valid, true);

  });

});
