"use strict";
module.exports = {
    name: "clientReady",
    once: false,
    execute: async (client) => {
        console.log("Ready!!!");
    },
};
