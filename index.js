var instance_skel = require('../../instance_skel');
var debug;
var log;
var tree;
const DeviceTree = require('emberplus').DeviceTree;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	if (self.tcp !== undefined) {
		self.tree.destroy();
		delete self.tree;
	}

	self.config = config;

	self.init_tree();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_tree();
};

instance.prototype.init_tree = function() {
	var self = this;

	if (self.tree !== undefined) {
		self.tree.destroy();
		delete self.tree;
	}

	self.status(self.STATE_WARNING, 'Connecting');

	if (self.config.host !== undefined) {
		self.tree = new DeviceTree(self.config.host, self.config.port);

		tree.on('ready', () => {
			self.status(self.STATE_OK);
			tree.getNodeByPath("EmberDevice/Sources/Monitor/Amplification").then((node) => {

					// Subscribe to parameter changes
					tree.subscribe(node, (node) => {
							console.log("Volume changed: %d", node.contents.value);
					});

					// Change parameter value
					tree.setValue(node, -20.0);

			}).catch((e) => {
					console.log("Failed to resolve node:", e);
			});
		});

	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This will establish a connection via Ember+ to Medianetwork devices'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'MediaNetwork IP address',
			width: 12,
			default: '192.168.0.246',
			regex: self.REGEX_IP
		}, {
			type: 'textinput',
			id: 'port',
			label: 'Target port',
			width: 6,
			default: '9998',
			regex: self.REGEX_PORT
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.tree !== undefined) {
		self.tree.destroy();
	}

	debug("destroy", self.id);;
};

instance.prototype.actions = function(system) {
	var self = this;
	var actions = {
		'none': {
			label: 'none'
		}
	};

	self.setActions(actions);
}

instance.prototype.action = function(action) {

	var self = this;
	var id = action.action;
	var opt = action.options;
	var cmd;

	switch (id) {
		case 'none':
			console.log("Works needs to be done");
			break;

	}

};



instance_skel.extendedBy(instance);
exports = module.exports = instance;
