var app = app || {};

var Router = Backbone.Router.extend({
    routes: {
        '': 'commissions',
        'commissions/edit/:id': 'edit',
        'commissions/edit/*': 'edit',
        'commissions/metrics/': 'metrics',
        'commissions/': 'commissions',
        'fetch': 'fetch',
        '*404': 'error'
    },

    initialize: function(options) {
        this.AppView = options.AppView;
        this.on('route', this.onRouteChange);
        Backbone.pubSub.on('breadcrumbs', this.onRouteChange, this);
    },

    home: function() {
        var homeView = new app.HomeView();
        this.AppView.showView(homeView);
    },

    fetch: function(){
        var fetchView = new app.FetchingDataView();
        this.AppView.showView(fetchView);
    },

    error: function() {
        var errorView = new app.ErrorView();
        this.AppView.showView(errorView);
    },

    edit: function(id) {
        var displayView, item;


        if (id) {
            item = (id && app.Collection.get({
                    cid: id
                }) ?
                app.Collection.get({
                    cid: id
                }) : false);
            if (!item) {
                app_router.navigate('#404', {
                    trigger: true
                });
                return;
            }
        } else {
            item = new app.Commission();
        }
        displayView = new app.CommissionView({
            model: item
        });
        this.AppView.showView(displayView);
    },

    commissions: function() {
        var displayView;

        if(app.fetchingData){
             app_router.navigate('#fetch', { trigger: true });
             return;
        }

        app_router.navigate('#commissions/', { trigger: false });

        displayView = new app.CommissionsView();
        this.AppView.showView(displayView);
    },

    metrics: function() {
        var displayView;

        displayView = new app.MetricsView();
        this.AppView.showView(displayView);
    },
    onRouteChange: function(route, params) {
        //parse out hash
        var hashRoute = window.location.hash.substring(1),
            routePathArr = hashRoute.split('/'),
            breadcrumb,
            i, j, href = '#',
            $breadcrumbs = $('.breadcrumbs');

        $breadcrumbs.children().remove();

        if (route == 'error') {
            return;
        }

        for (i = 0; i < routePathArr.length; i++) {
            breadcrumb = routePathArr[i];
            if (breadcrumb == '') {
                continue;
            }
            href += breadcrumb;
            $breadcrumbs.append('<li class="' + (i == routePathArr.length - 1 ? 'current' : '') + '"><a href="' + href + '/">' + breadcrumb + '</a></li>');
            href += '/';
        }
    }

});


var app_router = new Router({
    AppView: app.AppView
});

Backbone.history.start();
