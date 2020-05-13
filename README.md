StrongJSON
===========================
Library for creating strongly-typed, validated, & documentable JSON.

`npm install --save strongjson`

### Why StrongJSON

Keeping track of JSON object properties, especially when they are nested and complex, can be hard.  This
library helps you define a JSON schema that gives you validation, options, and documentation
of large complex JSON objects or JS objects.

### Getting Started:
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

const {valid, errors} = HouseType.validate({
  "address": "123, South Road", // full address of house.
    "rooms": [                    // All the rooms in the house.
      {
        "name": "bedroom",        // Can be "bedroom", "bathroom", or "kitchen".
        "area": 300               // Area in square feet
      }
    ]
})

console.log(valid)  // => True
console.log(errors) // => []

// Trigger an error:
house.rooms[0].name = "Not a room option";

const {valid, errors} = HouseType.validate(house)

console.log(valid) // => false
console.log(errors)  // =>
// errors: [
//   {
//     errorKey: 'INVALID_OPTION',
//     message: 'Invalid value 'unknown room\'. Expected one of the following: \'bedroom\', \'bathroom\', \'kitchen\'',
//     schemaId: '[Object][Key rooms][Array][option 0][Object][Key name][string]'
//   }
// ]
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

Type arguments can be in any order. For example, these are all the same:

```js
Types.Key("myKey", {description: "My wonderful key"}, Types.String);
Types.Key(Types.String, "myKey", {description: "My wonderful key"});
Types.Key({description: "My wonderful key"}, Types.String, "myKey");
```

Types.Object() and Types.Array() can accept arrays of Types as type "options":

```js
Types.Key("myKey", [Types.String(), Types.Number()]);
Types.Array([Types.String(), Types.Number()]);
```

### Requiring Existence of Object

You can require the existence of Object.Key.

```js
var HouseType = StrongJSON.create(Types.Object(
  Types.Key("address", Types.String(), { required: true }),
))

HouseType.validate({}).valid // false
```

Object.Key required is done "shallow", meaning if parent keys aren't required, then
the validation will pass.  For example:

```js
const MyType = StrongJSON.create(
  Types.Object(
    Types.Key("outerKey",           // add {required: true} here if you want this to validate existence of the innerKey
      Types.Object(
        Types.Key("innerKey", {required: true}, Types.String())
      )
    )
  )
);

HouseType.validate({}).valid // true
```

### Custom Validation

In upcoming versions, custom validation will be allowed via passing curry'd functions
into the options `validate' key:

```js

const minLength = (minLength) => (array) => array.length > minLength;

const MyType = StrongJSON.create(
  Types.Array({ validate: [ minLength(3) ] }, Types.Number())
);

HouseType.validate([1, 2]).valid   // false because it must be 3

```

### Documenting & Generating Examples:

In upcoming versions, you'll be able to set example values and generate example json.

```js
HouseType.getExample();
```

---

### Serialization:

```js
const HouseTypeJson = HouseType.serialize();   // Serializes to a string for storage in a data store.
const NewHouseType = StrongJSON.deserialize(HouseTypeJson)
```


