var assert = require('assert');
var StrongJSON = require('../../src/index.js');
var Types = require('../../src/types.js');

describe('Array validation', function() {
  it('should successfully validate existence of array.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.Array(
            {},
            Types.String())
        )
      ])
    );

    var validation = MyType.validate({
      "hi": [ "cool" ]
    });

    assert.equal(validation.valid, true);

  });

  it('should not validate array elements of the wrong type.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.Array(
            {},
            [
              Types.String(),
              Types.Null(),
              Types.Object()
            ]
          )
        )
      ])
    );

    var validation = MyType.validate({
      "hi": [ 1 ]
    });

    assert.equal(validation.valid, false);
    assert.equal(validation.errors.length, 1);

  });

  it('should validate with many array element options.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.Array(
            {},
            [
              Types.String(),
              Types.Number()
            ]
          )
        )
      ])
    );

    var validation = MyType.validate({
      "hi": [ 1, "there" ]
    });

    assert.equal(validation.valid, true);

  });

  it('should not validate when a multiple option array has the wrong value type.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.Array(
            {},
            [
              Types.String(),
              Types.Number()
            ]
          )
        )
      ])
    );

    var validation = MyType.validate({
      "hi": [ 1, "there", null ]
    });

    assert.equal(validation.valid, false);

  });

});
