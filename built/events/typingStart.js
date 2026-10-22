"use strict";
module.exports = {
    name: "typingStart",
    once: false,
    execute: async (client, typing) => {
        console.log("Detected Typing!!");
        if (typing.channel.isSendable()) {
            typing.channel.send(":eyes:");
        }
    },
};
