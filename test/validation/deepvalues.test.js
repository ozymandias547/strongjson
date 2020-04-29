var assert = require('assert');
var StrongJSON = require('../../src/index.js');
var Types = require('../../src/types.js');

describe('Deep validation', function() {
  it('should successfully validate deep objects.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.Array(
            {},
            Types.Object(
              {required: true},
              [
                Types.Key(
                  "there",
                  { required: true },
                  Types.Array({},
                    Types.Number()
                  )
                )
              ]
            )
          )
        ),
        Types.Key(
          "nestedarrays",
          {},
          Types.Array(
            {},
            Types.Array(
              {},
              [
                Types.Number(),
                Types.String(),
                Types.Boolean()
              ]
            )
          )
        )
      ])
    );

    var validation = MyType.validate(
      {
        "hi": [
          {
            "there": [1, 2, 3]
          }
        ],
        nestedarrays: [
          [ 1, "2", true ]
        ]
      }
    );

    assert.equal(validation.valid, true);

  });

  it('should not validate errant deep objects.', function() {

    const MyType = StrongJSON.create(
      Types.Object({required: true}, [
        Types.Key(
          "hi",
          { required: true },
          Types.Array(
            {},
            [Types.Object(
              {required: true},
              [
                Types.Key(
                  "there",
                  { required: true },
                  Types.Array({},
                    Types.Number()
                  )
                )
              ]
            ),
            Types.Object(
              {required: true},
              [
                Types.Key(
                  "there",
                  { required: true },
                  Types.Array({},
                    [
                      Types.Number(),
                    ]
                  )
                )
              ]
            )]
          )
        )
      ])
    );

    var validation = MyType.validate(
      {
        "hi": [
          {
            "there": ["1", 2, true]
          }
        ]
      }
    );

    assert.equal(validation.valid, false);
    console.log(validation);
  });

});