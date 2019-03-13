var moment = require('moment');

var generateMessage = (message) => {
    return {
        text: message,
        createdAt: moment(new Date().getTime()).format('hh:mm a')
    }
}

var generateLocationMessage = (position) => {
    return {
        url: `https://www.google.com/maps?q=${position.latitude},${position.longitude}`,
        createdAt: moment(new Date().getTime()).format('hh:mm a')
    };
}
module.exports = {
    generateMessage,
    generateLocationMessage
}