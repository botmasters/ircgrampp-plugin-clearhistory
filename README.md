Plugin for ircgrampp to clear telegram history 

# Install & Configure

Install as globaly:

    # npm install -g ircgrampp-plugin-clearhistory

Add file `{ircgrampp_config_dir}/plugins/clearhistory.yml` with the follow content:

```yaml
name: clearhistory
enable: true
```

# Bridge configuration

Each bridge is defined with the bridge name and params, for example, if you have a bridge name `friends`:

```yaml
name: clearhistory 
enable: true
command: clear

friends:
  enable: true
```

## Options (Plugin)

|Option|Type|Required|Default|Description|
|:----|:--:|:--:|:---:|:-----|
|command|string|Yes||Command name, by ex. `!clear`|

## Options (By bridge)

|Option|Type|Required|Default|Description|
|:----|:--:|:--:|:---:|:-----|
|enable|bool|No|false|Enable bridge|
|queueSize|int|No|10|Delete messages queue size|

## Limitations

This plugin is limitated by the [Telegram Bot
API](https://core.telegram.org/bots/api#deletemessage):

> Use this method to delete a message, including service messages, with the following limitations:
> * A message can only be deleted if it was sent less than 48 hours ago.
> * A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
> * Bots can delete outgoing messages in private chats, groups, and supergroups.
> * Bots can delete incoming messages in private chats.
> * Bots granted can_post_messages permissions can delete outgoing messages in channels.
> * If the bot is an administrator of a group, it can delete any message there.
> * If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.
