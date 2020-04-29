var assert = require('assert');
var StrongJSON = require('../src/index.js');
var Types = require('../src/types.js');

describe('Initialization', function() {

  var SimpleSchema, simpleJSON

  beforeEach(() => {

    simpleJSON = {
      "hi": "there"
    }

    SimpleSchema = Types.Object({required: true}, [
      Types.Key(
        "hi",
        {},
        Types.String()
      )
    ]);

  })

  it('should create from a schema object.', function() {
    StrongJSON.create(SimpleSchema);
  });

  it('should create from a schema string.', function() {

    const HouseSchema = `
      (required,"A house schema")
      {
        
        (required, "Address of the house.")
        address: 
          (string)
          (number)
        
        (required, "Address of the house.")
        rooms: 
        
          (array,minlength=1)  
          [
            
            (required, "Bedroom object.") 
            {
              type: "bedroom",
              sq_feet: (number, required, default=0),
              walk_in_closet: (boolean, required, default=false)
            },
            
            (required, "Kitchen object.") 
            {
              type: "kitchen",
              sq_feet: (number, required),
              island: (boolean)
            }
            
          ]
      }
    `;

    // StrongJSON.create(SimpleSchema);
  });

  // it('should create from a JSON file.', function() {
  //   StrongJSON.createFromJSON(SimpleSchema);
  // });

});
