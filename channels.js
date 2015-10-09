// CHANNELS

const CHANNEL_DATA_SUBSCRIBE = 'subscribe';
const CHANNEL_DATA_UNSUBSCRIBE = 'unsubscribe';


export default class Channels {
  contructor() {
    this._channels = {};
  }
  setupChannels(channelSetup) {
    for (let remote of channelSetup.remote_channels) {
      if (channelSetup.action === CHANNEL_DATA_SUBSCRIBE) {
        this.addRemoteChannel(remote, channelSetup.local_channel);
      }
      if (channelSetup.action === CHANNEL_DATA_UNSUBSCRIBE) {
        this.removeRemoteChannel(remote, channelSetup.local_channel);
      }
    }
  }
  addRemoteChannel(remote, local) {
    if (remote in _channels) {
      for (let remote_chan of this._channels) {
        if (remote_chan === local) {
          return;
        }
      }
      this._channels[remote].push(local);
    } else {
        this._channels[remote] = [local];

    }
  }
  removeRemoteChannel(remote) {
    delete this._channels[remote];
  }
  getLocalChannels(remote) {
    return this._channels[remote];
  }
}
