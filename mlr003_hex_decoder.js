/*
Use the following script to decode the MLR003 payload if your already have a HEX value

The "decodeMLR003Uplink" accepts a HEX BUFFER as an input

Eg.
HEX BUFFER : [0,57,63,113,113,0,129,255,0,18,40]

Example Decoded Output:

Current_Valve_Position: 0
Flow_Sensor_Raw: 28.5
Flow_Temperature: 31.5
Ambient_Sensor_Raw: 28.25
Ambient_Temperature: 28.25
Energy_Storage: 0
Harvesting_Active: 0
Ambient_Sensor_Failure: 0
Flow_Sensor_Failure: 0
Radio_Communication_Error: 0
Received_Signal_Strength: 0
Motor_Error: 0
Storage_Voltage: 2.58
Average_Current_Consumed: 460
Average_Current_Generated: 0
Reference_Completed: 1
Operating_Mode: 0
Storage_Fully_Charged: 0
User_Mode: 2
User_Value: 20

*/

function decodeMLR003Uplink(input) {
    var output = {
        Current_Valve_Position: input[0],
        Flow_Sensor_Raw: input[1] * 0.5,
        Flow_Temperature: input[2] * 0.5,
        Ambient_Sensor_Raw: input[3] * 0.25,
        Ambient_Temperature: input[4] * 0.25,
        Energy_Storage: input[5] >> 6 & 0x01,
        Harvesting_Active: input[5] >> 5 & 0x01,
        Ambient_Sensor_Failure: input[5] >> 4 & 0x01,
        Flow_Sensor_Failure: input[5] >> 3 & 0x01,
        Radio_Communication_Error: input[5] >> 2 & 0x01,
        Received_Signal_Strength: input[5] >> 1 & 0x01,
        Motor_Error: input[5] >> 0 & 0x01,
        Storage_Voltage: Number((input[6] * 0.02).toFixed(2)),
        Average_Current_Consumed: input[7] * 10,
        Average_Current_Generated: input[8] * 10,
        Reference_Completed: input[9] >> 4 & 0x01,
        Operating_Mode: input[9] >> 7 & 0x01,
        Storage_Fully_Charged: input[9] >> 6 & 0x01,
    }
    if (input.length == 11) {
        var um = input[9] & 0x03
        if (um == 0) {
            var uv = input[10]
        }
        else {
            var uv = input[10] * 0.5
        }
        output.User_Mode = um
        output.User_Value = uv
    }
    return output;
}

var output = decodeMLR003Uplink(msg.payload);

msg.payload = output;

return msg;