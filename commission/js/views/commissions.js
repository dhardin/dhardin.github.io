var app = app || {};

app.CommissionsView = Backbone.View.extend({
    template: _.template($('#commissions-template').html()),

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
            model = new app.Commission(),
            columns = [],
            key, data, title,
            column_omit_map = {
                'gender': true,
                'email': true,
                'phone': true,
                'name': true
            };

        this.column_index_map = {};


        this.$el.html(this.template());

        this.$table = this.$el.find('#table');
        this.$startDate = this.$el.find('.startDate');
        this.$endDate = this.$el.find('.endDate');
        this.$pendingRadioBox = this.$el.find('input[name=pending]');

        columns.push({
            sortable: false,
            render: function(data, type, full, meta) {
                var href = "#commissions/edit/" + full.cid;
                return '<a href="' + href + '">Edit</a>';
            }
        });
        //build column array from model
        for (key in model.attributes) {
            title = key.replace(/_/g, ' ');
            title = title.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            if (column_omit_map[key]) {
                continue;
            }
            this.column_index_map[key] = columns.length;
            columns.push({
                data: key,
                title: title
            });
        }

        if (!this.column_index_map.date) {
            this.$startDate.hide();
            this.$endDate.hide();
        }


        //build datatable
        this.table = this.$table.DataTable({
            data: collection.toJSON(),
            columns: columns,
            deferRender: true
        });

        (function(that) {
            that.$table.find('.edit').on('click', function() {
                var data = that.table.row($(this).parents('tr')).data();
                app_router.navigate('#edit/' + data.cid, {
                    trigger: true
                });
            });

            $.fn.dataTable.ext.search.push(
                function(settings, data, dataIndex) {
                    var min = new Date(that.$startDate.val()),
                        max = new Date(that.$endDate.val()),
                        date = new Date(data[that.column_index_map.date]),
                        pendingValue = getPendingVal(that.$pendingRadioBox),
                        pendingStatus = data[that.column_index_map.pending];

                    function dateInRange(min, max, date) {
                        if ((isNaN(min) && isNaN(max)) ||
                            (isNaN(min) && date <= max) ||
                            (min <= date && isNaN(max)) ||
                            (min <= date && date <= max)) {
                            return true;
                        }
                    }

                    function pendingSame(value, status) {
                        return value == 'all' ? true : value == status;
                    }

                    function getPendingVal($radio) {
                        var val = false;
                        $radio.each(function(i, el) {
                            if (el.checked) {
                                val = el.value;
                                return;
                            }
                        });
                        return val;
                    }


                    if (dateInRange(min, max, date) && pendingSame(pendingValue, pendingStatus)) {
                        return true;
                    }




                    return false;
                }
            );


            that.$startDate.on('change', function(e) {
                that.table.draw();
            });

            that.$endDate.on('change', function(e) {
                //yyyy-mm-dd
                that.table.draw();
            });

            that.$pendingRadioBox.on('change', function(e) {
                that.table.draw();
            });

        })(this);

        return this;
    },
    onClose: function() {
        this.$table.find('.edit').off('click');
    },
    filterByDates: function(start, end) {
        this.table
            .column(this.column_index_map.date)
            .search($(this).val())
            .draw();
    }
});
