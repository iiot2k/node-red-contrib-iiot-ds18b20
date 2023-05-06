/**
 * Copyright 2023 Ocean (iiot2k@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use node file except in compliance with the License.
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

const fs = require('fs');

/**
* Outputs error on status and error log.
* @param node - the node object
* @param errShort - the error text display on status
* @param errLong - the error text display on log
* @returns true for set node.error
*/
function outError(node, errShort, errLong) {
    if (node.save_txt !== errShort) {
        node.save_txt = errShort;
        node.save_color = "red";
        node.status({fill: "red", shape: "dot", text: errShort});
        if (errLong)
            node.error(errLong);
    }

    return true;
}

module.exports.outError = outError;

/**
* Sets status text and icon.
* @param node - the node object
* @param txt - the text display on status
* @param color - the color of icon
* @returns true for set node.error
*/
module.exports.setStatus = function(node, txt = "", color = "green") {
    if ((node.save_txt !== txt) || (node.save_color !== color)) {
        node.save_txt = txt;
        node.save_color = color;
        node.status({ fill: color, shape: "dot", text: txt });
    }

    return true;
}

/**
* Rounds number to fix decimal after point.
* https://www.jacklmoore.com/notes/rounding-in-javascript/
* @param value - the value to fix
* @param decimals - decimals after point
* @returns formated time string
*/
module.exports.toFixed = function (value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

/**
* Check for Raspberry Pi and OS.
* @returns module extension depends on OS
*/
function getRpiTarget()
{
    if (process.platform !== 'linux')
        return undefined;
    
    var cpuinfo = fs.readFileSync("/proc/cpuinfo").toString();

    if (cpuinfo.indexOf(": BCM") === -1)
        return undefined;
    
    if (process.arch === "arm64")
        return "_s64.node";
    else if (process.arch === "arm")
        return "_s32.node";
    
    return undefined;
}

/**
* Check for Raspberry Pi and loads module.
* @param module - the name name
* @returns module object
*/
module.exports.LoadModule = function(module) {
    try {
        var modName = getRpiTarget();
        if (modName !== undefined)
            return require("./" + module + modName);
    }
    catch (e) { console.log(e); }
    return undefined;
}
