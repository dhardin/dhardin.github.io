//our data module allows us to take in an array of objects 
//which will each reference a list and view GUID.
//
//The module processes each object linearly and then
//returns the results which is stored in the object.
//
//When a result is returned, a callback function is called on the result
//and each callback is also stored in the calling object.  This allows for us to
//process the results asynchronously.
//
var app = app || {};

app.data = (function(){
	 var CLIENT_ID = '170513316872-t33eqbg1ga68f3vktdn9606fh9mt5ij2.apps.googleusercontent.com',
    SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata',
     'https://www.googleapis.com/auth/drive.file'], file = false,
    handleClientLoad, checkAuth, retrieveAppDataFile, downloadFile, saveEditTextToFile, 
    handleAuthResult, getAppDataFile, insertFileInApplicationDataFolder, listFilesInApplicationDataFolder, updateFile, onSignIn,
    /**
     * Called when the client library is loaded to start the auth flow.
     */
    handleClientLoad = function() {
        setTimeout(function(){checkAuth();},1000);
    };

    /**
     * Check if the current user has authorized the application.
     */
    checkAuth = function() {
        gapi.auth.authorize({
                'client_id': CLIENT_ID,
                'scope': SCOPES,
                'immediate': true
            },
            handleAuthResult);
    };

    /**
     * Called when authorization server replies.
     *
     * @param {Object} authResult Authorization result.
     */
    retrieveAppDataFile = function() {
        listFilesInApplicationDataFolder(function(results) {
            file = getAppDataFile(results, app.config.filename);
            if (file) {
               //get file contents
                downloadFile(file, onDataFetch);
            } else {
                onDataFetch(false);
            }
        });
    };

    onDataFetch = function(content){
        Backbone.pubSub.trigger('data-fetched', content);
    };

    /**
     * Download a file's content.
     *
     * @param {File} file Drive File instance.
     * @param {Function} callback Function to call when the request is complete.
     */
    downloadFile =function(file, callback) {
        if (file.downloadUrl) {
            var accessToken = gapi.auth.getToken().access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', file.downloadUrl);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.onload = function() {
                callback(xhr.responseText);
            };
            xhr.onerror = function() {
                callback(null);
            };
            xhr.send();
        } else {
            callback(null);
        }
    };

    save = function (content) {
        //if file exists, update existing file entry
        if (file) {
           var f = new File([content], file.title, {
                type: "text/plain",
                lastModified: (new Date()).toString()
            });
            updateFile(file.id, {
                'title': file.title,
                'mimeType': "text/plain",
                'parents': [{
                    'id': 'appfolder'
                }]
            }, f, function(results) {
                Backbone.pubSub.trigger('save-complete', results);
            });
        } 
        //else create a new file and insert it into the database
        else { 
            // Access token has been successfully retrieved, requests can be sent to the API.
            var f = new File([content], app.config.filename, {
                type: "text/plain",
                lastModified: (new Date()).toString()
            });
            insertFileInApplicationDataFolder(f, function(results) {
                Backbone.pubSub.trigger('save-complete', results);
            });
        }
    };

    handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {

            if (!file) {
                gapi.client.load('drive', 'v2', retrieveAppDataFile);
            };

        } else {
            console.log(authResult.error);

        }
    };

   
    getAppDataFile = function (appDataFiles, filename) {
        var i, file;
        for (i = 0; i < appDataFiles.length; i++) {
            file = appDataFiles[i];
            if (file.title == filename) {
                return file;
            }
        }
        return false;
    };

  /**
     * List all files contained in the Application Data folder.
     *
     * @param {Function} callback Function to call when the request is complete.
     */
    function listFilesInApplicationDataFolder(callback) {
        var retrievePageOfFiles = function(request, result) {
            request.execute(function(resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                        'pageToken': nextPageToken
                    });
                    retrievePageOfFiles(request, result);
                } else if (callback) {
                    callback(result);
                }
            });
        }
        var initialRequest = gapi.client.drive.files.list({
            'q': '\'appfolder\' in parents'
        });
        retrievePageOfFiles(initialRequest, []);
    }
 

    /**
     * Insert new file in the Application Data folder.
     *
     * @param {File} fileData File object to read data from.
     * @param {Function} callback Function to call when the request is complete.
     */
    insertFileInApplicationDataFolder = function (fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octet-stream';
            var metadata = {
                'title': fileData.name,
                'mimeType': contentType,
                'parents': [{
                    'id': 'appfolder'
                }]
            };

            var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': {
                    'uploadType': 'multipart'
                },
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });
            if (!callback) {
                callback = function(file) {
                    console.log(file)
                };
            }
            request.execute(callback);
        }
    };

    /**
     * Update an existing file's metadata and content.
     *
     * @param {String} fileId ID of the file to update.
     * @param {Object} fileMetadata existing Drive file's metadata.
     * @param {File} fileData File object to read data from.
     * @param {Function} callback Callback function to call when the request is complete.
     */
   updateFile = function (fileId, fileMetadata, fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octet-stream';
            // Updating the metadata is optional and you can instead use the value from drive.files.get.
            var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(fileMetadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files/' + fileId,
                'method': 'PUT',
                'params': {
                    'uploadType': 'multipart',
                    'alt': 'json'
                },
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });
            if (!callback) {
                callback = function(file) {
                    console.log(file)
                };
            }
            request.execute(callback);
        }
    };

   onSignIn = function (googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
    };  
	return {
		login: handleClientLoad,
        save: save
	};
})();
