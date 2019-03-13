const socket = io();

// socket.on('updateCount', (count) => {
//     console.log("Count is "+count);
// })

// document.querySelector('button').addEventListener('click', () => {
//     socket.emit('increment');
// });

//Elements
const $chatMessages = document.querySelector('#chatbox');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        user: message.user,
        message: message.text,
        createdAt: message.createdAt
    })
    $chatMessages.insertAdjacentHTML('beforeend', html);
})

socket.on('location', (message) => {
    const html = Mustache.render(locationTemplate, {
        user: message.user,
        createdAt: message.createdAt,
        url: message.url
    })
    $chatMessages.insertAdjacentHTML('beforeend', html);
})

document.querySelector('#form-message').addEventListener('submit', (event) => {
    event.preventDefault();
    var message = document.querySelector('input').value;
    socket.emit('newMessage', message, () => {
        console.log('Message is delivered');
    });
    document.querySelector('input').value = '';
});

document.querySelector("#location-button").addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Location is not supported by your browser!!');
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            socket.emit('sendLocation', {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            });
        });
    }
});


socket.emit('join', {
    username: username,
    room: room
})