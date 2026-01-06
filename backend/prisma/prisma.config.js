"use strict";
const { defineConfig } = require("prisma/config");
module.exports = defineConfig({
    migrate: {
        datasourceUrl: process.env['DATABASE_URL'],
    },
});
