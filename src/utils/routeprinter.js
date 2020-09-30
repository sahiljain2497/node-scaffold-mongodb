const { printTable } = require('console-table-printer');
var routes = new Set();

function split(thing) {
	if (typeof thing === 'string') {
		return thing.split('/');
	}
	if (thing.fast_slash) {
		return '';
	}
	const match = thing
		.toString()
		.replace('\\/?', '')
		.replace('(?=\\/|$)', '$')
		.match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
	return match ? match[1].replace(/\\(.)/g, '$1').split('/') : `<complex:${thing.toString()}>`;
}

function print(pathe, layer) {
	if (layer.route) {
		layer.route.stack.forEach(print.bind(null, pathe.concat(split(layer.route.path))));
	} else if (layer.name === 'router' && layer.handle.stack) {
		layer.handle.stack.forEach(print.bind(null, pathe.concat(split(layer.regexp))));
	} else if (layer.method) {
		routes.add(layer.method.toUpperCase() + ' ||| ' + pathe.concat(split(layer.regexp)).filter(Boolean).join('/'));
	}
}

module.exports = {
	init: function(app) {
		app._router.stack.forEach(print.bind(null, []));
		const routesToPrint = [];
		routes = Array.from(routes);
		for (let i = 0; i < routes.length; i++) {
			route = routes[i].split('|||');
			routesToPrint.push({ index: i, text: route[1], value: route[0] });
		}
		printTable(routesToPrint);
	}
};
