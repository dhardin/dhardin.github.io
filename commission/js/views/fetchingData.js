var app = app || {};

app.FetchingDataView = Backbone.View.extend({
	template: _.template($('#fetch-template').html()),
	
	render: function () {
		this.$el.html(this.template());
		
		return this;
	}
});
