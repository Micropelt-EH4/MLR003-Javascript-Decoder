function get_spt_value(spt_byte) {
    switch (spt_byte) {
      case 0:
        return "0";
      case 1:
        return "+1";
      case 2:
        return "+2";
      case 3:
        return "+3";
      case 4:
        return "+4";
      case 5:
        return "+5";
      case 12:
        return "-4";
      case 13:
        return "-3";
      case 14:
        return "-2";
      case 15:
        return "-1";
      case 255:
        return "Freeze Protection 6°";
      default:
        return "0";
    }
  }
  
function decode_port_1(input) {
var output = {
          Ambient_Temperature: input[0] * 0.25,
          Energy_Storage_Low: input[1]>>4 & 0x01,
          Radio_Communication_Error: input[1]>>3 & 0x01,
          Radio_Signal_Strength: input[1]>>2 & 0x01,
          Ambient_Temperature_Failure: input[1] & 0x01,
          Storage_Voltage: Number((input[2]*0.02).toFixed(2)),
          Set_Point_Temperature_Value: get_spt_value(input[3])
        };
  return output;
}


function decode_port_2(input) {
  var output = {};
  {
    var REV_Major = (input[0] & 0xF).toString();
    var REV_Minor = ((input[0] >> 4) & 0xF).toString(16);
    output.REV = REV_Major + "." + REV_Minor;
  }
  {
    var HW_Major = (input[1] & 0xF).toString();
    var HW_Minor = ((input[1] >> 4) & 0xF).toString();
    output.HW = HW_Major + "." + HW_Minor;
  }
  {
    var FW_Year = input[2].toString();
    var FW_Month = input[3].toString();
    var FW_Day = input[4].toString();
    var FW_Minor = input[5].toString();
    output.FW = "20" + FW_Year + "." + FW_Month + "." + FW_Day + "." + FW_Minor;
  }
  return output;
}

function Decode(fPort, bytes) {
  var output = {};
  switch (fPort) {
    case 1:
      output = decode_port_1(bytes);
      break;
    case 2:
      output = decode_port_2(bytes);
      break;
    default:
      return {
        errors: ['unknown FPort'],
      };
  }
  return output;
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

/*
Convert Incoming Message to JSON and extract base64 Payload
*/
msg = JSON.parse(msg.payload);
var b64_payload = msg.data;
var fport = msg.port;

/*
Convert base64 payload to Hex String
*/
const buffer = Buffer.from(b64_payload, 'base64');
const hex_payload_str = buffer.toString('hex');

/*
Convert Hex String to bytes and call the Decoder function
*/
var hex_payload = hexToBytes(hex_payload_str);
var output = Decode(fport,hex_payload);

msg.payload = output;

return msg;