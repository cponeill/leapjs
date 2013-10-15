describe('Connection', function(){
  describe('#new', function(){
    it('should return a connection that pumps events', function(done) {
      var controller = fakeController()
      var connection = controller.connection
      controller.on('ready', function() {
        connection.handleData(JSON.stringify(fakeFrame({id:123})))
      })
      controller.on('frame', function() {
        assert.equal(123, controller.lastFrame.id)
        connection.disconnect()
        done()
      })
      connection.connect()
    })
  })

  describe('#connect', function(){
    it('should fire a "connect" event', function(done){
      var controller = fakeController()
      var connection = controller.connection
      connection.on('ready', function() {
        connection.disconnect()
        done()
      })
      connection.connect()
    })
  })

  describe('#disconnect', function(){
    it('should fire a "disconnect" event', function(done){
      var controller = fakeController()
      var connection = controller.connection
      connection.on('disconnect', function() {
        assert.isUndefined(connection.socket);
        assert.isUndefined(connection.protocol);
        done();
      });
      connection.on('ready', function() {
        assert.isDefined(connection.socket);
        assert.isDefined(connection.protocol);
        connection.disconnect()
      })
      connection.connect()
    })
  })

  if (typeof(window) === 'undefined') {
    describe('background in protocol 4', function(){
      it('should send background true', function(done){
        var controller = fakeController({version: 4});
        var connection = controller.connection;
        controller.on('ready', function() {
          controller.setBackground(true);
          setTimeout(function() {
            assert.deepEqual([JSON.stringify({"enableGestures":false}), JSON.stringify({"background":true})], connection.socket.messages);
            connection.disconnect();
            done();
          }, 100);
        })
        controller.connection.connect()
      })

      it('should send background false', function(done){
        var controller = fakeController({version: 4});
        var connection = controller.connection;
        controller.on('ready', function() {
          controller.setBackground(false);
          setTimeout(function() {
            assert.equal('{"background":false}', connection.socket.messages[connection.socket.messages.length - 1]);
            connection.disconnect();
            done();
          }, 100);
        })
        controller.connection.connect()
      })
    })
  } else {
    describe('background in protocol 4', function(){
      it('should send background true', function(done){
        var controller = fakeController({version: 4});
        var connection = controller.connection;
        controller.on('ready', function() {
          controller.setBackground(true);
          setTimeout(function() {
            assert.deepEqual([JSON.stringify({"enableGestures":false}), JSON.stringify({"background":true}), JSON.stringify({"focused":true})], connection.socket.messages);
            connection.disconnect();
            done();
          }, 100);
        })
        controller.connection.connect()
      })

      it('should send background false', function(done){
        var controller = fakeController({version: 4});
        var connection = controller.connection;
        controller.on('ready', function() {
          controller.setBackground(false);
          setTimeout(function() {
            assert.deepEqual([JSON.stringify({"enableGestures":false}), JSON.stringify({"background":false}), JSON.stringify({"focused":true})], connection.socket.messages);
            connection.disconnect();
            done();
          }, 100);
        })
        controller.connection.connect()
      })
    })
  }
})
