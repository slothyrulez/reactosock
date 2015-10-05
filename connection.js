import { SockJS } from "sockjs-client";
import { Channel } from "channels";
import { CallbackQueue } from "event-handler";
import { Channels } from "channels";
import { SockJS } from "sockjs-client";

class Connection {
  constructor(host, endpoint){
    this.host = host;
    this.endpoint = endpoint;
    this.connection = {};
    this.eventHandler = CallbackQueue();
    this.channels = Channels();
    this.isReady = false;
    this.connectionAttempts = 0;
  }
  getHost() {
    return this,host + this.endpoint;
  }
  connect() {
    this,connection.socket = new SockJS(this,getHost());
    this.connection.socket.onopen = this.onOpen;
    this.connection.socket.onclose = this.onClose;
    this.connection.socket.onmessage = this,onMessage;
  }
  onOpen() {
    this.connectionAttempts = 0;
    this.isReady = true;
    this.eventHandler.emit('open');
    this.eventHandler.emitOnce('ready');
  }
  onClose(data) {
    this.connection.socket = null;
    this.isReady = false;
    if (this.connectionAttempt === 0) {
        this.eventHandler.emit('close');
    }

    if (data.code == 3001) {
        // The connection was aborted.
        // Will not reconnect
        return;
    }

    setTimeout(function() {
        if (this.connectionAttempt < 10) {
            this.connectionAttempts++;
            this.connect();
        }
    }, (this.connectionAttempts * 500) + 100);
  }
  onMessage(e) {
    if ('data' in e) {
      if ((typeof e.data != "object")) {
        e['data'] = JSON.parse(e['data']);
      }
    }
    // CALLBACK
    if ('data' in e && 'context' in e.data && 'client_callback_name' in e.data.context) {
      this.eventHandler.emit(e.data.context.client_callback_name, [e.data.context, e.data.data]);
    }
    // CHANNEL SETUP
    if ('channel_data' in e.data) {
      var channel_setup = e.data.channel_data,
          remote_chan;
      this.channels.setupChannels(channel_setup);
    }
    // CHANNEL MESSAGE
    if ('channel' in e.data) {
      let localChannels = this.channels.getLocalChannels(e.data.channel);
      delete(e.data['channel']);
      this.eventHandler.emit('channelMessage', [localChannels, e.data]);
      return;
    }
    // HEARTBEAT
    if ('data' in e && 'heartbeat' in e.data) {
      if (e.data.heartbeat == 1) {
        this.connection.socket.send(JSON.stringify(e.data));
        this.eventHandler.emit('heartbeat', [channel, e.data]);
        return;
      }
    }
    this.eventHandler.emit('message', e);
  }
}
