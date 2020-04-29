StrongJSON
===========================
Library for creating documented, strongly-typed, & validated JSON.

`npm install --save strongjson`


### Why StrongJSON

Keeping track of JSON object properties, especially when they are nested and complex, can be hard.  This 
library helps you define a JSON schema that gives you validation, defaults, options, and documentation 
of large complex JSON objects or JS objects. 

### Validating JSON:
```js

var StrongJSON = require('strongjson');
var Types = require('strongjson').Types;

var HouseType = StrongJSON.create(Types.Object(
  Types.Key("address", Types.String(), { description: "full address of house." }),
  Types.Key("rooms", Types.Array({ description: "All the rooms in the house." },
    Types.Object(
      Types.Key("name", Types.String({ validate: { options: ["bedroom", "bathroom", "kitchen"] }})),
      Types.Key("area", Types.Number(), { description: "Area in square feet." })
    )
  ))
))

var house = {
  "address": "123, South Road", // full address of house.
  "rooms": [                    // All the rooms in the house.
    {
      "name": "bedroom",        // Can be "bedroom", "bathroom", or "kitchen".
      "area": 300               // Area in square feet
    }
  ]
}
HouseType.validate(house);
// { valid: true, errors: [] }

house.rooms[0].name = "unknown room";

var results = HouseType.validate(house);
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
```

### Types

```js
var Types = require('strongjson').Types

Types.Object();
Types.Array();
Types.Key();
Types.String();
Types.Number();
Types.Null();
Types.Boolean();
```

### Validation

More details coming soon.

### Documenting & Generating Examples:

```js
HouseType.getExample();
```

---

### Iterating:
```js
HouseType.forEach((node, parent) => {
  // iteratively walk over the tree
})
```

### Serialization:

```js
const HouseTypeJson = HouseType.serialize();   // Serializes to a string for storage in a data store.
const NewHouseType = StrongJSON.deserialize(HouseTypeJson)
```

### Accessing & Mutating Type validation nodes:
ted Type values is accomplished via an accessor string.

```js
const AddressStringType = HouseType.get('{}.address.<string>');
AddressStringType.setOptions({required: true});

const RoomType = HouseType.get('{}.rooms.[].0.{}');
RoomType.add(Types.Key())
```

Accessing nes

