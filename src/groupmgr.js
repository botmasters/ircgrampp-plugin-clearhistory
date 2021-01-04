
import fs from 'fs';
import path from 'path';
import queue from 'async/queue';

export default class GroupManager {

    constructor(bridge, channel, data, config, debug) {
        this._bridge = bridge;
        this._channel = channel; 
        this._data = data;
        this._config = {
            queueSize: 10,
            ...config,
        };
        this._lastDeletedMesage = 0;
        this._queue = queue(async (msgId) => {
            try {
                await this._channel._connector.tgBot.deleteMessage(
                    this._channel._chatId,
                    msgId,
                );
            } catch (e) {
                // continue
            }
        }, this._config.queueSize);
        this._queue.drain(() => {
            this.debug(`Delete finished`);
        });
        this._debug = debug;
    }

    get name() {
        return this._data.name;
    }

    get id() {
        return this._channel.id;
    }

    debug(...args) {
        this._debug(...args);
    }

    update(data) {
        this._data = data;
    }

    async clear() {

        const sendData = this._channel._connector.tgBot._formatSendData(
            'animation',
            fs.createReadStream(path.resolve(__dirname, '../gifs/gb.gif')),
        ); 

        const msg = await this._channel._connector.tgBot._request('sendAnimation', {
            "formData": sendData[0],
            "qs": {
                "animation": sendData[1],
                "chat_id": this._channel._chatId,
                "caption": 'Clear channel',
                "disable_notification": true,
            },
        })

        const id = msg.message_id;

        this.debug(`Starting from ${id} to ${this._lastDeletedMesage}`);

        for (let i = id - 1; i > this._lastDeletedMesage; i--) {
            this._queue.push(i);
        }
        this._queue.push(id);
        this._lastDeletedMesage = id;
    }

}
