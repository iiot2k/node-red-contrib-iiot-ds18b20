/**
 * Copyright 2023 Ocean (iot.redplc@gmail.com).
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

module.exports = function(RED) {
	const syslib = require("./lib/syslib.js");
	const sysmodule = syslib.LoadModule("rpi_ds18b20");

    RED.nodes.registerType("iiot-ds18b20-fs", function(n) {
		var node = this;
		RED.nodes.createNode(node, n);

		node.tupdate = n.tupdate;
		node.fahrenheit = n.fahrenheit;
		node.tofix = n.tofix;

		node.name = "iiot-ds18b20-fs";
		node.onwork = false;
		node.iserror = false;
		node.ndevice = 0;
		node.ch_cnt = 0;
		node.id_update = [];
		node.status_txt = "↻ " + node.tupdate + "s ";

		if (sysmodule === undefined)
			node.iserror = syslib.outError(node, "driver error", "driver not load, wrong os or not Raspi");
		else if (sysmodule.isused())
			node.iserror = syslib.outError(node, "already used", "node already used");
		else if (!sysmodule.init_fs())
			node.iserror = syslib.outError(node, "init error", "init error, no 1-wire setup");
		else {
			node.ndevice = sysmodule.get_ndevice_fs();

			if (node.ndevice == 0)
				node.iserror = syslib.setStatus(node, node.status_txt + " nodevice", "grey");
			else {
				node.ctxvar = new Array(node.ndevice).fill(0);
				node.topics = new Array(node.ndevice).fill("");
				syslib.setStatus(node, node.status_txt, "grey");
			}
		}

		function update(index) {
			sysmodule.get_temperatur_fs(index, function(readval, index, device_id) {
				if (readval === null)
					node.read_error = syslib.outError(node, "read error: " + device_id);
				else {
					var val_read = node.fahrenheit ? (readval * (9/5)) + 32 : readval;
					val_read = syslib.toFixed(val_read, node.tofix);
					
					node.topics[index] = device_id;

					if (node.ctxvar[index] !== val_read) {
						node.ctxvar[index] = val_read;
						node.send({ payload: node.ctxvar, topic: node.topics });
					}
				}

				node.ch_cnt++;

				if (node.ch_cnt >= node.ndevice)
				{
					if (!node.read_error)
						syslib.setStatus(node, node.status_txt);

					node.onwork = false;
				}
			});
		}

		if (!node.iserror)
			node.id_interval = setInterval(function() {
				if (node.onwork)
					return;

				node.onwork = true;
				node.ch_cnt = 0;
				node.read_error = false;

				for ( var index = 0; index < node.ndevice; index++)
					update(index);
			}, node.tupdate);

		node.on('close', function () {
			clearInterval(node.id_interval);
			sysmodule.deinit();
		});
	});
}
