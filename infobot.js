var sqlite3 = require('sqlite3').verbose();

var InfoBot = function(database, tablename) {
	this.tablename = tablename || "infobot";
	this.database = new sqlite3.cached.Database(database);
	this.database.run("CREATE TABLE IF NOT EXISTS " + this.tablename + " (word TEXT, definition TEXT, creatorId TEXT, creatorName TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP, modifierId TEXT, modifierName TEXT, modified DATETIME DEFAULT CURRENT_TIMESTAMP, locked INTEGER)");
}

InfoBot.prototype.getInfo = function(word) {
	return this.database.get("SELECT rowid AS id, word, definition, creatorId, creatorName, created, modifierId, modifierName, modified, locked FROM "+this.tablename, function(err, row){
		if(err) {
			console.log(err.stack());
			return "ERR";
		};
		console.log(JSON.stringify(row));
		console.log("definition:    "+row.definition);
		return row;
	});
}

InfoBot.prototype.getDefinition = function(word) {
	var row = this.getInfo(word);
	console.log();
	console.log("Row");
	console.log(row);
	console.log();
	if(row && row.definition)
		return row.definition;
	else return "No such definition!";
}

InfoBot.prototype.addWord = function(word, definition, userId, userName) {
	var row = this.getInfo(word);
	if(row && row.locked=="locked") return "Definition locked!";
	if(row && row.locked=="unlocked") {
		if(row) this.database.run("UPDATE " + this.tablename + " SET definition = " + definition + ", modifierId = " + userId + ", modifierName = " + userName + ", modified = + datetime('now') WHERE word = " + word);
		return "Definition updated";
	} else if (!row) {
		this.database.run("INSERT INTO " + this.tablename + " VALUES (?1, ?2, ?3, ?4, datetime('now'), ?6, ?7, datetime('now'), ?9)", {
			1: word, 2: definition, 3: userId, 4: userName, 6: null, 7: null, 8: null, 9: "unlocked" });
		return "Definition created";
	}
}

InfoBot.prototype.lock = function(word) {
	var row = this.getInfo(word);
	if(row) {
		this.database.run("UPDATE " + this.tablename + " SET locked = 'locked' WHERE word = " + word);
		return "Definition locked";
	}
	return "No such definition";
}

InfoBot.prototype.unlock = function(word) {
	var row = this.getInfo(word);
	if(row) {
		if(row) this.database.run("UPDATE " + this.tablename + " SET locked = 'locked' WHERE word = " + word);
		return "Definition unlocked";
	}
	return "No such definition";
}

InfoBot.prototype.delWord = function(word) {
	var row = this.getInfo(word);
	if(!row) return "No such definition!"
	if(row.locked = "locked") return "Definition locked!";
	if(row && row.locked = "unlocked") {
		this.database.run("DELETE FROM " + this.tablename + " WHERE word = " + word);
		return "Definition deleted";
	}
}

exports.InfoBot = InfoBot;
