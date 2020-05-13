var assert = require('assert');


describe('Readme examples', function() {

  it('Getting started should work as expected', function() {

    var StrongJSON = require('../src/index.js');
    var Types = require('../src/types.js');

    var house = {
      "address": "123, South Road", // full address of house.
      "rooms": [                    // All the rooms in the house.
        {
          "name": "bedroom",        // Can be "bedroom", "bathroom", or "kitchen".
          "area": 300               // Area in square feet
        }
      ]
    }

    var HouseType = StrongJSON.create(Types.Object(
      Types.Key("address", Types.String(), { description: "full address of house." }),
      Types.Key("rooms", Types.Array({ description: "All the rooms in the house." },
        Types.Object(
          Types.Key("name", Types.String({ validate: { options: ["bedroom", "bathroom", "kitchen"] }})),
          Types.Key("area", Types.Number(), { description: "Area in square feet." })
        )
      ))
    ))

    var resultsA = HouseType.validate(house);
    // { valid: true, errors: [] }

    assert.equal(resultsA.valid, true);

    house.rooms[0].name = "unknown room";

    var resultsB = HouseType.validate(house);
    // {
    //   valid: false,
    //   errors: [
    //     {
    //       errorKey: 'INVALID_OPTION',
    //       message: 'Invalid value 'unknown room\'. Expected one of the following: \'bedroom\', \'bathroom\', \'kitchen\'',
    //       schemaId: '[Object][Key rooms][Array][option 0][Object][Key name][string]'
    //     }
    //   ]
    // }

    assert.equal(resultsB.valid, false);

  });

  it('Documenting should work as expected', function() {



  });

});
