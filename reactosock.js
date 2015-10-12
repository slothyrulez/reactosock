import Connection from "./connection";

export default class Reactosock {
  constructor(host, endpoint) {
    this.conn = new Connection(host, endpoint);
  }
  // Connection setup
  open(fn) {
    if (this.conn.ready()) {
      fn();
    } else {
      this.conn.on('open', fn);
    }
  }
  close(fn) {
    this.conn.on("close", fn);
  }
  ready(fn) {
    if (this.conn.ready()) {
      fn();
    } else {
      this.conn.on('ready', fn);
    }
  }
  onChannelMessage(fn) {
    this.conn.eventHandler("channelMessage", fn);
  }
  send(data) {
    // Send data
    return this.conn.connection.socket.send(data);
  }
  sendJSON(data) {
    return this.send(JSON.stringify(data));
  }
  callRouter(verb, route, args, success, failure, channel) {
    // Call router
    let callbackName = this.conn.eventHandler.getCallbackName();
    if (channel !== null) {
        args = args || {};
        args.channel = channel;
    }

    this.conn.eventHandler.on(callbackName, function (context, data) {
        if (context.state == 'success') {
            if (success) { success(context, data); }
        }
        if (context.state == 'error') {
            if (failure) { failure(context, data); }
        }
    });

    this.sendJSON({
        route: route,
        verb: verb,
        args: args,
        callbackname: callbackName
    });
  }
  subscribe(route, channel, args, success, failure) {
    return this.callRouter('subscribe', route, args, success, failure, channel);
  }
  unsubscribe(route, channel, args, success, failure) {
    return this.callRouter('unsubscribe', route, args, success, failure, channel);
  }
  // Get object/s
  getSingle(route, data, success, failure) {
    this.callRouter('get_single', route, data, success, failure, null);
  }
  getList(route, data, success, failure) {
    this.callRouter('get_list', route, data, success, failure, null);
  }
  getPagedList(route, data, page, success, failure) {
    page = page || 1;
    data['_page'] = page;
    this.callRouter('get_list', route, data, success, failure, null);
  }
  // Create / update / delete
  create(route, data, success, failure) {
    this.callRouter('create', route, data, success, failure, null)
  }
  update(route, data, success, failure) {
      this.callRouter('update', route, data, success, failure, null)
  }
  delete(route, data, success, failure) {
    swampdragon.callRouter('delete', route, data, success, failure, null)
  }
}
