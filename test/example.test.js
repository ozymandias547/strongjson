var assert = require('assert');
var StrongJSON = require('../src/index.js');
var Types = require('../src/types.js');

describe('Generating example JSON', function() {

  it('should generate a simple example object', function() {

    var HouseType = StrongJSON.create(Types.Object(
      Types.Key("address", Types.String({example: "123 South Hampton, New York, NY"}), { description: "full address of house." }),
      Types.Key("rooms", Types.Array({ description: "All the rooms in the house." },
        Types.Object(
          Types.Key("name", Types.String(
            {
              validate: { options: ["bedroom", "bathroom", "kitchen"] },
              example: "bedroom"
            }
          )),
          Types.Key("area", Types.Number({example: 100}), { description: "Area in square feet." })
        )
      ))
    ))

    const example = HouseType.getExample()

    console.log(example);

  });

});