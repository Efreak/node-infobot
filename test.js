var InfoBot = require('./infobot.js').InfoBot;
var bot = new InfoBot('infobot.db');

console.log('getinfo');
console.log(bot.getInfo('word'));
//console.log('setdefinition');
//console.log(bot.addWord('word','word definition','steamid','steamname'));
console.log('getword');
console.log(bot.getDefinition('word'));
console.log('getinfo');
console.log(bot.getInfo('word'));
