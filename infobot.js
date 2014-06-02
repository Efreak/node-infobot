var sqlite3 = require('sqlite3').verbose();

var InfoBot = function(database, tablename) {
	this.database = new sqlite3.cached.Database(database);
	this.tablename = tablename || "infobot";
	this.database.run("CREATE TABLE IF NOT EXISTS " + this.tablename + " (word TEXT, definition TEXT, creatorId TEXT, creatorName TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP, modifierId TEXT, modifierName TEXT, modified DATETIME DEFAULT CURRENT_TIMESTAMP, locked INTEGER)");
}

InfoBot.prototype.getInfo = function(word, callback, errCallback) {
	this.database.get("SELECT rowid AS id, word, definition, creatorId, creatorName, created, modifierId, modifierName, modified, locked FROM " + this.tablename + " WHERE word = '" + word + "'", function(err, row){
		err ? errCallback(err) : callback(row);
	});
}

InfoBot.prototype.getDefinition = function(word, callback, errCallback) {
	this.getInfo(word, function (row) {
		if (row && row.definition) {
			callback(row.definition);
		}
	}, errCallback);
}

InfoBot.prototype.addWord = function(word, definition, userId, userName, callback, errCallback) {
	this.getInfo(word, (function (row) {
		if (row) {
			if (row.locked == "locked"){
				callback("locked");
			}

			if (row.locked == "unlocked") {
				this.database.run("UPDATE " + this.tablename + " SET definition = '" + definition + "', modifierId = " + userId + ", modifierName = '" + userName + "', modified = + datetime('now') WHERE word = " + word, {}, function (err) {
					err ? errCallback(err) : callback("updated");
				});
			}
		} else {
			this.database.run("INSERT INTO " + this.tablename + " VALUES (?1, ?2, ?3, ?4, datetime('now'), ?6, ?7, datetime('now'), ?9)", {
				1: word, 2: definition, 3: userId, 4: userName, 6: null, 7: null, 8: null, 9: "unlocked"
			}, function (err) {
				err ? errCallback(err) : callback("created");
			});
		}
	}).bind(this), errCallback);
}

InfoBot.prototype.lock = function(word, callback, errCallback) {
	this.getInfo(word, (function (row) {
		if (row) {
			this.database.run("UPDATE " + this.tablename + " SET locked = 'locked' WHERE word = " + word, {}, function (err) {
				err ? errCallback(err) : callback("locked");
			});
			return;
		}

		callback("undef");
	}).bind(this), errCallback);
}

InfoBot.prototype.unlock = function(word, callback, errCallback) {
	this.getInfo(word, (function (row) {
		if (row) {
			this.database.run("UPDATE " + this.tablename + " SET locked = 'unlocked' WHERE word = " + word, {}, function (err) {
				err ? errCallback(err) : callback("unlocked");
			});
			return;
		}

		callback("undef");
	}).bind(this), errCallback);
}

InfoBot.prototype.delWord = function(word, callback, errCallback) {
	this.getInfo(word, (function (row) {
		if ( ! row) {
			callback("undef");
			return;
		}

		if (row.locked == "locked") {
			callback("locked");
			return;
		}

		if (row.locked == "unlocked") {
			this.database.run("DELETE FROM " + this.tablename + " WHERE word = " + word, {}, function (err) {
				err ? errCallback(err) : callback("deleted");
			});
		}
	}).bind(this), errCallback);
}

exports.InfoBot = InfoBot;
