const path = require('path');
const express = require('express');

module.exports = (app, port) => {
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/bootstrap', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')
  ));

    const server = app.listen(port, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        const io = require('socket.io')(server);

        io.on('connection', (socket) => {
            console.log('User connected to Server');

            socket.on('message',function(event){
                console.log('Received message from client!',event);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected from Server');
            });

        });



  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
  });




    console.log(`Server running at http://localhost: ${port}`);
  });
};
