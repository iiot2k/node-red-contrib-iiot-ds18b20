/**
 * Copyright 2023 Ocean (iiot2k@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

"use strict";

const syslib = require("./syslib.js");
const sysmodule = syslib.LoadModule("rpi_ds18b20_set");

if (sysmodule === undefined) {
    console.log("driver not load, wrong os or not Raspi");
    process.exit(1);
}

// default values if parameter not given
var pin = 4;
var resolution = 12;

// call:
// node setSonsor [resolution] [pin]

switch(process.argv.length) {
    case 4: // resolution and pin given
        pin = Number(process.argv[3]);
        if (isNaN(pin) || (pin < 2) || (pin > 27)) {
            console.log("pin must 2..27");
            process.exit(1);
        }
    // no break
    case 3: // resolution given
        resolution = Number(process.argv[2]);
        if (isNaN(resolution) || (resolution < 9) || (resolution > 12)) {
            console.log("resolution must 9..12");
            process.exit(1);
        }
}

// call magic function
if (!sysmodule.changeSensorsResolution(pin, resolution)) {
    console.log("error on change resolution");
    process.exit(1);
}

console.log("resolution changed to ", resolution, " on pin ", pin);
