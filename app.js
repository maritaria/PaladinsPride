const paladins = require('./lib/paladins.js');
const express = require('express');
const express_handlebars = require('express-handlebars');
const app = express();
const Promise = require('promise');

app.engine('handlebars', express_handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/player/:id', function(request, response) {
	Promise.all([
		paladins.getPlayer(request.params.id),
		paladins.getChampionRanks(request.params.id),
		paladins.getPlayerLoadouts(request.params.id),
	])
		.then((results)=>{
			console.log(results);
			response.render('player', {
				player: results[0],
				champions: results[1],
			});
		})
		.catch((error)=>{
			response.render('error', {
				error: {
					title: 'Failed to get player data',
					message: error.message,
				},
			});
		});
});

app.get('/', function (request, response) {
	response.render('home');
});

paladins.init(process.env.PALADINS_API_DEV, process.env.PALADINS_API_KEY, (err)=>{
	if (err) throw err;
	app.listen(3000, () => console.log('Running on port 3000'));
});
