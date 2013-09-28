Whiteboard.addModule('classroom-connection', function (context) {

	return {
		messages: ['presentation-request'],

		onmessage: function (name, data) {
			console.log('presentation mode requested... searching for classroom');
		},

		init: function () {
			console.log('classroom-connection init');
		}
	};
});