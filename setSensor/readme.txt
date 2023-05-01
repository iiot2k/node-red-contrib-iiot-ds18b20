With this little tool you can change the sensor resolution.

The tool is used as follows:

- Open terminal window on Raspberry Pi
- Stop Node-Red
- Change to tool folder: cd ~/.node-red/node_modules/node-red-contrib-iiot-ds18b20/setSensor
- Invoke tool: node setsensor.js 11
  Where setsensor.js [resolution] [pin]
  [resolution] 9..12, default 12
  [pin] 2..27, default 4
- Restart Node-red
- Check in node dialog the sensor list
 
Have fun.