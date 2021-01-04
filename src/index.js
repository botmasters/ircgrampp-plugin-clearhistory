
import PluginBase from 'ircgrampp-plugin';
import GroupManager from './groupmgr';

export default class clearHistoryPlugin extends PluginBase {

    _channels = [];

    initialize() {
        this.debug('Plugin initialized');
        this._channels = [];
    }

    getCompatibleVersion() {
        return "~0.4.2";
    }

    updateChannel(bridge, channel, data, config) {
        let chan = this._channels.find(x => x.id === data.id);

        if (chan) {
            this.debug(`Channel info update to ${data.name}`);
            chan.update(data);
        } else {
            this.debug(`New channel to use`, channel.name);
            this._channels.push(new GroupManager(
                bridge,
                channel,
                data,
                config,
                (...args) => {
                    this.debug(...args);
                }
            ));
        }
    }

    async clear(_channel) {
        const channel = this._channels.find((x) => x.id === _channel.id);
        if (!channel) {
            this.debug(`Channel not supported, ignoring`);
            return;
        }

        await channel.clear();
    }

    handleBridge(bridge, config) {
        const channel = bridge._telegramChannel;
        this.debug('Subscribe to updateinformtion of telegram channel');

        channel.on('updateinformation', (data) => {
            this.debug('data', data);
            this.updateChannel(bridge, channel, data, config);
        });

        bridge.on('x_command', async (bridge, channel, user, command) => {
            this.debug(`XXXXX`, command, this.config.get('command'));
            if (command.split(' ')[0] === this.config.get('command')) {
                this.debug(`Clear channel ${channel.name} by ${user.username}`);
                await this.clear(channel);
            }
        });
    }

    afterBridgeCreate(bridge) {
        this.debug('New bridge ', bridge.name);

        let conf = this.config.get(bridge.name);

        if (conf) {
            if (!conf.enable) {
                this.debug('Plugin is not enabled for this bridge, pass');
                return;
            }

            this.handleBridge(bridge, conf);
        } else {
            this.debug('There are not configuration for bridge, pass');
        }
    }

}
