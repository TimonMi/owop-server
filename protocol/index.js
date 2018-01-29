'use strict';
const Packet = require(`./packet`);
const PACKETS = require(`./packets`);
const server = require(`../server`);
const CONFIG = require(`../config`);

console.log(`Loaded ${Object.keys(PACKETS).length} packets`);

function onPacket(rawPacket, player, socketAddress) {
	var packet = new Packet(rawPacket);
	if (packet.id >= 200) {
		console.warn(`Player ${socketAddress} sent server packet ${packet.id}`);
		player.kick();
	}
	switch (packet.id) {
		case PACKETS.ClientHello:
			var clientVersion = packet.readUInt8();
			if (clientVersion != CONFIG.serverVersion) {
				player.kick();
			} else {
				player.send(new Packet(undefined, PACKETS.ServerHello));
			}
			break;
	}
}

function isWorldNameValid(worldName) {
    const size = worldName.length;
    /* Should there be a limit for size?
    if(size < 3 || size > 26) {
        return false;
    } */
    for(let i = 0; i < size; i++) {
        const char = worldName.charCodeAt(i);
        if(!(
            (char > 96 && char < 123) //a-z
            || (char > 64 && char < 91) //A-Z
            || (char > 47 && char < 58) //0-9
            || (char === 95) //'_'
            || (char === 46) //'.'
            )) return false;
    }
    return true;
}

module.exports = onPacket;
