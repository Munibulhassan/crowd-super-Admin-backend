const short = require('short-uuid');

// By default shortened values are now padded for consistent length.
// If you want to produce variable lengths, like in 3.1.1
const translator = short(short.constants.flickrBase58, {
  consistentLength: false,
});

const createShortUuid = () => {
  return translator.new();
}

module.exports = {
  createShortUuid, 
}
