// CALLBACK EVENT QUEUE

export default class CallbackQueue {
  constructor() {
    this._queue = {};
    this._cid = 0;
  }
  getCallbackName() {
    let callbackName = 'cb_' + this._cid;
    this._cid += 1;
    if (this._cid > 999999) this._cid = 0;
    return callbackName;
  }
  on(eve, callback) {
    this._queue[eve] = this._queue[eve] || [];
    this._queue[eve].push(callback);
  }
  emitOnce(eve, args) {
    let eventCount = this.emit(eve, args);
    delete this._queue[eve];
  }
  emit(eve, args) {
    // eve === callback
    let queue = this._queue[eve];
    if (queue === undefined) {
      return 0;
    }
    for (let fn of queue) {
      fn.apply(this, args);
    }
    return queue.length;
  }
}
