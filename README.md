# dirstructur

This Node script will help you quickly create your a directory structure using JSON.

## Usage

Create the dirstructur.json file in the folder you wish to populate.
Set the CONFIG_PATH to point to the folder dirstructur.json resides in and call dirstructor.js


/* Expected Output
// +tests
  // +common
    // +css
      // +libs
        // -bootstrap.css
      // -app.css
    // +js
      // +libs
        // -jquery.js
        // -bootstrap.js
        // -lodash.js
      // +app
        // -subapp.js
      // -app.js
    // +img
  // +en
    // +us
      // +foo
      // +bar
*/
