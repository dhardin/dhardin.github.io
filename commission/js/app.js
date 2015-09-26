var app = app || {};
app.fetchingData = app.fetchingData || false;
app.dataLoadCallback = app.dataLoadCallback || [];
app.testing = false;
app.Collection = app.Collection || {};

app.onFetchComplete = function(){
	app.fetchingData = false;
	   app_router.navigate('', {trigger: true});
}
//populate test data
app.getData = function() {
	app.fetchingData = true;
	app.Collection = new app.Collection.Commissions([]);
	if(app.testing){
		 app.Collection.set(app.test_data);
		 app.onFetchComplete();
	}
    else {
    	app.data.login();
    	Backbone.pubSub.on('data-fetched', function(content){
    		var data = content ? JSON.parse(content) : [];
    		app.Collection.set(data);
    		app.onFetchComplete();
    	});    	
    	Backbone.pubSub.on('data-save', function(){
    		app.data.save(JSON.stringify(app.Collection.toJSON()));
    	});
    	Backbone.pubSub.on('save-complete', function(results){
    		console.log(results);
    	});
    }
}	

//fetch data from server
app.getData();
