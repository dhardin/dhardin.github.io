var app = app || {};

app.HomeView = Backbone.View.extend({
	template: _.template($('#home-template').html()),
	className: 'home',
	
	render: function () {
		this.$el.html(this.template());
		
		return this;
	}
});
