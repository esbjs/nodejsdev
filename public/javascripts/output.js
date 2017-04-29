var socket = io(window.location.hostname + ':4001');

socket.on('data', function(data) {
    outPut(data, true);
});
socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));






