var app = app || {};
app.Collection = app.Collection || {};

app.Collection.Commissions = Backbone.Collection.extend({
    model: app.Commission,
   
    initialize: function () {
    }                                                                          
});