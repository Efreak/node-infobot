node-infobot
============

infobot nodejs module

This class was built for [steam-chat-bot](http://github.com/Efreak/node-steam-chat-bot). It stores information much like the original [infobot](http://infobot.org) does.

# Using

````
var InfoBot = require('infobot').InfoBot;
var bot = new InfoBot('database-file-name', 'optional-table-name');

bot.addWord('word','definition','userid','username')
bot.delWord('



````
InfoBot.addWord(word, definition, userid, username) - this has two user identification systems. You do not need to use both. The reason it has two is because the bot designed for use on steam, where the id is the steamid64 and the name is the user's current profile name at the time of creation. On IRC the equivalent would be for the id to be nickserv username, and name to be nickname. If the word already exists, the definition will be updated, unless it's locked.

InfoBot.delWord(word) - this deletes the word. Only works if the word is unlocked.

InfoBot.getDefinition(word) - returns only the definition field of the word, rather than the whole data object.

InfoBot.getInfo(word) - returns the entire database row for the word. { word: string, creatorId: string, creatorName: string, created: DateTime, modifiername: string, modifierId: string, modified: datetime, locked: string}

InfoBot.lock(word) - locks the word, preventing updates, and deletion.
