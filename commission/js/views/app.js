var app = app || {};


app.AppView = {
	showView : function(view){
		if (this.currentView){
			this.currentView.close();
		}

		this.currentView = view;
		this.currentView.render();

	 $('#main').html(this.currentView.el);

	   //rebind foundation events by re-calling foundation
        setTimeout(function() {
            $(document).foundation({ offcanvas : {
    // Sets method in which offcanvas opens.
    // [ move | overlap_single | overlap ]
    open_method: 'move', 
    // Should the menu close when a menu link is clicked?
    // [ true | false ]
    close_on_click : true
  }});
        }, 100);
	}
};
Backbone.pubSub = _.extend({}, Backbone.Events);
Backbone.View.prototype.close = function(){
	this.remove();
	this.unbind();
	if(this.onClose){
		this.onClose();
	}
}