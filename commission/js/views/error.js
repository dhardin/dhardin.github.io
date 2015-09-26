var app = app || {};

app.ErrorView = Backbone.View.extend({
	template: _.template($('#error-template').html()),
	
	render: function () {
		this.$el.html(this.template());
		
		return this;
	}
});
