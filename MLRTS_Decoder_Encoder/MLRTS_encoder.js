function encode_port_2() {
  return [];
}

// Encode downlink function.
//
// Input is an object with the following fields:
// - output = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.
function encodeDownlink(input) {
  let port = Number(input.fPort);
  var downlink;
  switch (port) {
    case 2:
      downlink = encode_port_2();
      break;
    default:
      return {
        errors: ['unknown FPort'],
      };
  }
  
  return {
    bytes: Buffer.from(downlink),
    fPort: input.fPort
  };
}


msg.payload = encodeDownlink(msg.payload);

return msg;