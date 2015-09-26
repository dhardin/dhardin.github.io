 var app = app || {};

 app.CommissionView = Backbone.View.extend({
     template: _.template($('#commission-template').html()),
     events: {},

     initialize: function() {

     },

     render: function() {
         this.$el.html(this.template(this.model.toJSON()));
         var state = this.model.get('state');
         this.$save = this.$el.find('.save');
         this.$delete = this.$el.find('.delete');
         this.$cancel = this.$el.find('.cancel');
         this.$state = this.$el.find('.state');
         this.$royalty = this.$el.find('.royalty');
         this.$fee = this.$el.find('.fee');
         this.$commission = this.$el.find('.commission');
         this.$price = this.$el.find('.price');
         this.$cap = this.$el.find('.cap');
         this.$tax = this.$el.find('.tax');
         this.$gross_income = this.$el.find('.gross_income');
         this.$banked = this.$el.find('.banked');
         this.$cap_payed = this.$el.find('.cap_payed');
         this.$royalty_payed = this.$el.find('.royalty_payed');
         this.$tax_payed = this.$el.find('.tax_payed');
         this.$notification = this.$el.find('.notification');
         this.$notificationText = this.$el.find('.notification-text');

         this.$notification.hide();

         this.$state.val(state);

         (function(that) {
             that.$royalty.on('change', function(e) {
                 that.onRoyltyChange(e);
             });
             that.$fee.on('change', function(e) {
                 that.onFeeChange(e);
             });
             that.$commission.on('change', function(e) {
                 that.onCommissionChange(e);
             });
             that.$price.on('change', function(e) {
                 that.onPriceChange(e);
             });
             that.$cap.on('change', function(e) {
                 that.onCapChange(e);
             });
             that.$tax.on('change', function(e) {
                 that.onTaxChange(e);
             });

             that.$save.on('click', function(e) {
                 that.onSaveClick(e);
             });
             that.$delete.on('click', function(e) {
                 that.onDeleteClick(e);
             });
             that.$cancel.on('click', function(e) {
                 that.onCancelClick(e);
             });
         })(this);
         return this;
     },
     onRoyltyChange: function(e) {
         this.update(['banked', 'royalty payed', 'tax payed']);
     },
     onFeeChange: function(e) {
         this.update(['gross income']);
     },
     onCommissionChange: function(e) {
         this.update(['gross income', 'cap payed', 'royalty payed', 'tax payed']);
     },
     onPriceChange: function(e) {
         this.update(['gross income', 'cap payed', 'royalty payed', 'tax payed']);
     },
     onCapChange: function(e) {
         this.update(['banked', 'cap payed', 'tax payed']);
     },
     onTaxChange: function(e) {
         this.update(['tax payed']);
     },
     onSaveClick: function(e) {
         var that = this;
         this.save();
         this.toggleControls(false);
         this.setNotification('Saving...');
         Backbone.pubSub.trigger('data-save');

         Backbone.pubSub.on('save-complete', function(results){that.onSaveComplete(results);});
     },
     onSaveComplete: function(results) {
         var that = this;
         this.toggleControls(true);
         this.$notification.show().removeClass('success danger warning').addClass('info');
         this.setNotification('Save Complete!', function() {
             that.$notification.removeClass('danger warning info').addClass('success');
             setTimeout(function() {
                 app_router.navigate('', {
                     trigger: true
                 });
                 that.$notification.hide();
             }, 2000);
         });
     },

     onDeleteClick: function(e) {

     },
     onCancelClick: function(e) {
         app_router.navigate('', {
             trigger: true
         });
     },
     setNotification: function(text, callback) {
         text = text || '';
         this.$notificationText.text(text);
         if (callback) {
             callback();
         }
     },
     toggleControls: function(isEnabled) {
         if (isEnabled) {
             this.$save.addClass('disabled');
             this.$delete.addClass('disabled');
             this.$cancel.addClass('disabled');
         } else {
             this.$save.removeClass('disabled');
             this.$delete.removeClass('disabled');
             this.$cancel.removeClass('disabled');
         }

     },
     save: function() {
         var formData = this.getFormData({});

         this.model.set(formData);

         if (!app.Collection.get({
                 cid: this.model.cid
             })) {
             app.Collection.add(this.model);
         }

     },
     update: function(keyArr) {
         for (var i = 0; i < keyArr.length; i++) {
             this.recalc(keyArr[i]);
         }
     },
     getFormData: function(obj) {
         //get form data
         if (Object.keys(obj).length === 0) {
             this.$el.find('input, select').each(function(i, el) {
                 obj[el.getAttribute('class')] = $(el).val();
             });
         }
         return obj;
     },
     recalc: function(key) {
         var price = parseFloat(this.$price.val()),
             commission = parseFloat(this.$commission.val()) * 0.01,
             fee = parseFloat(this.$fee.val()),
             royalty = parseFloat(this.$royalty.val()) * 0.01,
             tax = parseFloat(this.$tax.val()) * 0.01,
             gross_income = parseFloat(this.$gross_income.val()),
             cap = parseFloat(this.$cap.val()) * 0.01;

         switch (key) {
             case 'gross income':
                 this.$gross_income.val(parseFloat(((price * commission) + (fee * (commission / 0.03))).toFixed(2)));
                 break;
             case 'banked':
                 this.$banked.val(parseFloat((gross_income * (1 - (cap + royalty))).toFixed(2)));
                 break;
             case 'cap payed':
                 this.$cap_payed.val(parseFloat((price * commission * cap).toFixed(2)));
                 break;
             case 'royalty payed':
                 this.$royalty_payed.val(parseFloat((price * commission * royalty).toFixed(2)));
                 break;
             case 'tax payed':
                 this.$tax_payed.val(parseFloat((((commission * price) * (1 - (cap + royalty))) * tax).toFixed(2)));
                 break;
             default:
                 return false;
         }
     }
 });
