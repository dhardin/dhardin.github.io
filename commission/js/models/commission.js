var app = app || {};

app.Commission = Backbone.Model.extend({
    defaults: {
        pending: false,
        address: 'N/A',
        phone: 'N/A',
        email: 'N/A',
        city: 'N/A',
        state: 'N/A',
        zip: 'N/A',
        date: 'N/A',
        first_name: '',
        last_name: '',
        price: 0,
        commission: 0,
        fee: 0,
        cap: 0,
        royalty: 0,
        gross_income: 0,
        banked: 0,
        cap_payed: 0,
        royalty_payed: 0
    },
    initialize: function() {

    },
    toJSON: function() {
        var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
        json.cid = this.cid;
        return json;
    }
});
