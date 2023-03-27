"use strict";
const commands = () => {
    return [
        require('./install'),
        require('./publish'),
        require('./instance-list'),
        require('./plugin-list'),
        require('./plugin-init'),
        require('./plugin-version'),
        require('./watch'),
    ];
};
module.exports = commands;
