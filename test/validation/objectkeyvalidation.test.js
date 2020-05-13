var assert = require('assert');
var StrongJSON = require('../../src/index.js');
var Types = require('../../src/types.js');
var ValidationErrorMessages = require('../../src/validate').ValidationErrorMessages

describe('Types.Key validation', function() {
  it('should successfully validate a simple json object with keys.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.String()
        ),
        Types.Key(
          "there",
          { required: true },
          Types.String()
        )
      ])
    );

    var validation = MyType.validate({
      "hi": "test",
      "there": "test"
    });

    assert.equal(validation.valid, true);

  });

  it('should not validate if a required key is missing in an object.', function() {

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

    });

    assert.equal(validation.valid, false);
    assert(validation.errors.length === 1)

  });

  it('should validate if a non-required key is missing in an object.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: false },
          Types.String()
        )
      ])
    );

    var validation = MyType.validate({});

    assert.equal(validation.valid, true);
    assert(validation.errors.length === 0)

  });

  it('should not validate if an extra key exists in an object.', function() {

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
      "hi": "there",
      "extra": "key"
    });

    assert.equal(validation.valid, false);
    assert(validation.errors.length === 1);

  });

});
