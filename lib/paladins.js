(function() {
	const paladins = require('paladins-api');
	const Promise = require('promise');

	var pal;
	var sessionId;
	function refreshPaladinsSession(callback) {
		pal.connect('PC', (err, res) => {
			if (!err) {
				sessionId = res;
				console.log('Paladins session established, refreshing in 10 minutes');
				setTimeout(refreshPaladinsSession, 1000 * 60 * 10);
				if (callback) callback(err, res);
			} else {
				console.log('Error obtaining paladins session: ', err, ' retry in 1 second');
				setTimeout(() => refreshPaladinsSession(callback), 1000);
			}
		});
	}

	module.exports.init = function(devId, devKey, callback) {
		pal = new paladins(devId, devKey);
		setImmediate(() => refreshPaladinsSession(callback));
	}

	module.exports.getPlayer = function(player) {
		return new Promise((resolve, reject)=>{
			pal.getPlayer(sessionId, 'PC', player, (err, result) => {
				if (err) reject(err);
    			else resolve(result[0]);
			});
		});
	}

	module.exports.getChampionRanks = function(player) {
		return new Promise((resolve, reject)=>{
			pal.getChampionRanks(sessionId, 'PC', player, (err, result) => {
				if (err) reject(err);
    			else {
					function compare(a, b) {
						if (a.champion < b.champion)
							return -1;
						if (a.champion > b.champion)
							return 1;
						return 0;
					}
					console.log('err: ' + err);
					console.log('result: ' + result);
					result.sort(compare);
					resolve(result);
				}
			});
		});
	}

	module.exports.getChampionSkins = function(champion) {
		return new Promise((resolve, reject)=>{
			pal.getChampionSkins(sessionId, 'PC', champion, (err, result) => {
				if (err) reject(err);
    			else resolve(result);
			});
		});
	}

	module.exports.getPlayerLoadouts = function(player) {
		return new Promise((response, reject) =>{
			pal.getPlayerLoadouts(sessionId, 'PC', player, (err, result)=>{
				if (err) reject(err);
				else {
					console.log('qqrt' + result);
					resolve(result);
				}
			});
		});
	}
}());
