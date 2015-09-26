var app = app || {};

app.MetricsView = Backbone.View.extend({
    template: _.template($('#metrics-template').html()),

    events: {},

    initialize: function(options) {
        options = options || {};
        this.collection = options.collection || app.Collection;
        this.table = false;

        this.collection.on('reset add remove', function() {
            this.render()
        }, this);
    },

    render: function(options) {
        var collection = (options && options.collection ? options.collection : this.collection),
            model = collection.first(),
            columns = [],
            key, data, title,
            width = $(window).width() * .95;


        this.$el.html(this.template());

        this.$table = this.$el.find('#table');

        this.$timeChart = this.$el.find('.annual-sales-chart');
        this.$listVsBuyersChart = this.$el.find('.list-vs-buyer-chart');
        this.$annual_sales_filter = this.$el.find('.annual-sales-filter');

        this.annual_sales_series = this.getSeries('annual sales');

        this.timeline_series = this.annual_sales_series.timelineSeries;
        this.pie_series = this.annual_sales_series.pie_series;

        (function(that) {

            that.$annual_sales_filter.find('a').on('click', function(e) {
                var fiscal_year = $(this).text();
                that.onAnnaulSalesFitlerChange(fiscal_year);
            })
        })(this);

        this.$timeChart.highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x',
                width: width
            },
            title: {
                text: 'Annual Sales'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%b \'%y',
                    year: '%Y'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Sale Price'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%b-%e}: ${point.y:.2f} '
            },

            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },

            series: this.annual_sales_series
        });

        this.listVsBuyersChart = this.$listVsBuyersChart.highcharts();

        this.timeChart = this.$timeChart.highcharts();

        return this;
    },

    initializeCharts: function () {
        // body...
    },

    cacheDom: function(){
        
    },

    getSeries: function(type) {
        switch (type) {
            case 'annual sales':
                return this.getAnnualSalesSeries();
                break;
            default:
                break;
        }
    },

    getAnnualSalesSeries: function() {
        var data = [];
        (function(that) {
            that.collection.each(function(model) {
                var date = new Date(model.get('date')),
                    price = model.get('price'),
                    i, exists = false,
                    fiscal_date = new Date(date.getUTCFullYear(), date.getUTCMonth() + 6, 1),
                    fiscal_year = fiscal_date.getUTCFullYear();

                for (i = 0; i < data.length; i++) {
                    if (data[i].name == fiscal_year.toString()) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    data.push({
                        name: fiscal_year.toString(),
                        data: []
                    });
                    that.populateFilter('annual sales', fiscal_year);
                }
                data[i].data.push([Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), price]);
            });
        })(this);

        //sort data
        for (var i = 0; i < data.length; i++) {
            var fiscal_year = data[i];
            fiscal_year.data.sort(function(a, b) {
                return a[0] - b[0];
            })
        }

        return data;
    },

    getAnnualSalesDonutSeries: function(){
         var data = [];
        (function(that) {
            that.collection.each(function(model) {
                var date = new Date(model.get('date')),
                    price = model.get('price'),
                    buyer = model.get('buyer'),
                    i, exists = false,
                    fiscal_date = new Date(date.getUTCFullYear(), date.getUTCMonth() + 6, 1),
                    fiscal_year = fiscal_date.getUTCFullYear();

                for (i = 0; i < data.length; i++) {
                    if (data[i].name == fiscal_year.toString()) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    data.push({
                        name: fiscal_year.toString(),
                        data: []
                    });
                    that.populateFilter('annual sales', fiscal_year);
                }
                data[i].data.push([Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), price]);
            });
        })(this);

        return data;
    },

    populateFilter: function(type, text) {
        switch (type) {
            case 'annual sales':
                this.populateAnnualSalesFilter(text);
                break;
            default:
                break;
        }
    },

    populateAnnualSalesFilter: function(text) {
        this.$annual_sales_filter.append('<li><a>' + text + '</a></li>');
    },

    onAnnaulSalesFitlerChange: function(fiscal_year) {
        var chart = this.$timeChart.highcharts();
        for (var i = 0; i < chart.series.length; i++) {
            if (fiscal_year.toLowerCase() == 'all') {
                chart.series[i].setVisible(true);
            } else {
                if (chart.series[i].name == fiscal_year) {
                    chart.series[i].setVisible(true);
                } else {
                    chart.series[i].setVisible(false);
                }
            }
        }

    },

    getAnnualSalesFiscalYearData: function(fiscal_year) {
        for (var i = 0; i < this.annual_sales_series.length; i++) {
            if (this.annual_sales_series[i].name == fiscal_year) {
                return this.annual_sales_series[i];
            }
        }
    }
});
