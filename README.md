# MLR003-Javascript-Decoder
This repository contains generic Javascript code for decoding MLR003 packets

`MLR003_Node_Red_Example_Flow.json` provides an example Node-Red Flow to test the decoder fucntions
Make sure to modify the MQTT settings as needed

`mlr003_generic_decoder.js` contains code to decode the payload coming directly from the gateway
The Mutlitech Gateway sends the base64 payload in the "data" field.
Modify the field according your gateway input

`mlr003_hex_decoder.js` contains the only the decoder function. If you already have the HEX payload, just call this this function with the HEX payload as the input
