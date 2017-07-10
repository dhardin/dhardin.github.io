---
layout: post
title: Reading/Writing to a SharePoint list
tags: [Front End Web Development, SharePoint, Web Service, SOAP; XML, JavaScript, jQuery]
---
* TOC
{:toc}

### CAUTION!
>Before venturing on further, if you are unfamiliar with web services and thier operations, please refer to the previous post: [SharePoint Web Services](http://dhardin.github.io/2015/03/05/SharePoint-WebServices)

Making web service calls through the SharePoint API can seem pretty daughnting if you are new to it.  There are varoius tools out there that help make this process less painful through abstraction and hiding all the details involved with building SOAP envelopes and parsing returned results.

I beleive its best to understand what goes on behind the curtains first so that we can understand exactly what our code is doing.

### SOAP Envelope
SOAP envelopes are constructed and identify things such as list GUIDs, items to be updated, etc.  The body of the envelope itself is determined by the web service SOAP operation that you are performing.

In this case, we are calling the GetListItems SOAP operation.  Navigating to the appropriate web service operation page will provide you with the required SOAP body and parameters.

#### CAML Query
Collaborative Markup Language (CAML) is an XML based language used for querying and updating SharePoint objects.

You may use CAML queries to narrow down the returned results from the SOAP operations that you perform.  Why would you want to filter results with a complex query versus filtering on the client side?  Well, this is because the client side filtering will be significantly slower as the client browser is a single threaded environment and code is run in a run-time blocking manner by default.  You can work around this of course using JavaScript asynchrous tricks such as setTimeout (I'll be addressing this in another post).

For this example, we will not dive into CAML queries, but deal with returning all list items for simplicity sake.  We'll cover a CAML query in another example in the near future.

For further reading on CAML queries and the various schemas, please check out the reference on [MSDN](https://msdn.microsoft.com/en-us/library/office/ms462365).

### AJAX
Asynchronous JavaScript and XML (AJAX) is the method we will use to communicate with a server to request or submit data.  There are a few ways that these requests can be made, but we will only be using the method provided  by jQuery as it undoubtedly makes our job easier.

The basic form of our Ajax calls will look like the following:

```javascript
$.ajax({
    url: url,
    beforeSend: function(xhr) {
        xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/' + action);
    },
    type: "POST",
    dataType: "xml",
    data: data,
    success: successFunc,
    error: function(jqXHR, textStatus, errorThrown) {
      errorFunc(jqXHR, textStatus, errorThrown);
    },
    contentType: 'text/xml; charset="utf-8"'
});
```

Where:

| Value       | Description                                                                                                                           |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| url         | A string containing the URL to which the request is sent.                                                                             |
| action      | What action to set in the header of the request.  This will be aligned depending on what SharePoint web service action we are taking. |
| data        | Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests. |
| successFunc | The function to perform on a successful Ajax call.  The response is passed as an argument into the success function.                  |
| errorFunc   | The function to perform on an unsuccessful Ajax call.                                                                                 |

To see a full list of settings and list cases, please view the reference [here](http://api.jquery.com/jquery.ajax/).

#### Get vs Post
GET and POST are the two methods that we will use in our AJAX requests depending on what we are trying to accoplish.  However, it is important to understand the fundamental differences between the two methods as well as security considerations when handling either method.

First we will look at the definitions of POST and GET methods provided by World Wide Consortium (W3C):

>#### [9.3 GET](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3)
>
>The GET method means retrieve whatever information (in the form of an entity) is identified by the Request-URI. If the Request-URI refers to a data-producing process, it is the produced data which shall be returned as the entity in the response and not the source text of the process, unless that text happens to be the output of the process.
>
>The semantics of the GET method change to a "conditional GET" if the request message includes an If-Modified-Since, If-Unmodified-Since, If-Match, If-None-Match, or If-Range header field. A conditional GET method requests that the entity be transferred only under the circumstances described by the conditional header field(s). The conditional GET method is intended to reduce unnecessary network usage by allowing cached entities to be refreshed without requiring multiple requests or transferring data already held by the client.
>
>The semantics of the GET method change to a "partial GET" if the request message includes a Range header field. A partial GET requests that only part of the entity be transferred, as described in section 14.35. The partial GET method is intended to reduce unnecessary network usage by allowing partially-retrieved entities to be completed without transferring data already held by the client.
>
>The response to a GET request is cacheable if and only if it meets the requirements for HTTP caching described in section 13.
>
>See section 15.1.3 for security considerations when used for forms.
>
>#### [9.5 POST](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3)
>
>The POST method is used to request that the origin server accept the entity enclosed in the request as a new subordinate of the resource identified by the Request-URI in the Request-Line. POST is designed to allow a uniform method to cover the following functions:
>
 > - Annotation of existing resources;
 > - Posting a message to a bulletin board, newsgroup, mailing list, or similar group of articles;
 > - Providing a block of data, such as the result of submitting a form, to a data-handling process;
 > - Extending a database through an append operation.
>The actual function performed by the POST method is determined by the server and is usually dependent on the Request-URI. The posted entity is subordinate to that URI in the same way that a file is subordinate to a directory containing it, a news article is subordinate to a newsgroup to which it is posted, or a record is subordinate to a database.
>
>The action performed by the POST method might not result in a resource that can be identified by a URI. In this case, either 200 (OK) or 204 (No Content) is the appropriate response status, depending on whether or not the response includes an entity that describes the result.
>
>If a resource has been created on the origin server, the response SHOULD be 201 (Created) and contain an entity which describes the status of the request and refers to the new resource, and a Location header (see section 14.30).
>
>Responses to this method are not cacheable, unless the response includes appropriate Cache-Control or Expires header fields. However, the 303 (See Other) response can be used to direct the user agent to retrieve a cacheable resource.
>
>POST requests MUST obey the message transmission requirements set out in section 8.2.
>
>See section 15.1.3 for security considerations

And here are the security considerations provided by WC3 in regards to both POST and GET methods:

>#### [15.1.3 Encoding Sensitive Information in URI's](https://www.w3.org/Protocols/rfc2616/rfc2616-sec15.html#sec15.1.3)
>
>Because the source of a link might be private information or might reveal an otherwise private information source, it is strongly recommended that the user be able to select whether or not the Referer field is sent. For example, a browser client could have a toggle switch for browsing openly/anonymously, which would respectively enable/disable the sending of Referer and From information.
>
>Clients SHOULD NOT include a Referer header field in a (non-secure) HTTP request if the referring page was transferred with a secure protocol.
>
>Authors of services which use the HTTP protocol SHOULD NOT use GET based forms for the submission of sensitive data, because this will cause this data to be encoded in the Request-URI. Many existing servers, proxies, and user agents will log the request URI in some place where it might be visible to third parties. Servers can use POST-based form submission instead

Taking both of these methods into consideration, we will be using GET methods for fetching data from a SharePoint list/library and POST for updating our lists/libraries.  You will see this when we go over requests in the next section.

## Reading from a SharePoint List
To perform any sort of data read/write in our SharePoint environment, we must construct a HTTP header, which is packaged and sent to the server via an Ajax call for processing.

First we'll start with the SOAP envelope that performs the requested function and query to perform on the designated list.  We'll delve further into CAML queries in another post since they require a bit more patience.

Once our SOAP envelope constructed, we'll pass that into our AJAX call's data property and use a POST method for security reasons and because of the data that we're passing in requires a CAML query.

The GUID that we pass into the SOAP envelope is derived from the SharePoint list that we wish to get data from.  If you don't know how to do that, you can find out [here](https://nickgrattan.wordpress.com/2008/04/29/finding-the-id-guid-for-a-sharepoint-list/).

We also go ahead and use a method to help us extract data from the returned XML.

```javascript
 // Begin Utility Method /getListItems/
    getListItems = function (url, guid, callback) {
        var results = [], soapEnv, body;

        // Build SOAP request envelope to match web service SOAP operation request XML.  
        // Don't forget to pass in required parameters!
        soapEnv =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                <soap:Body>\
                    <GetListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">\
                        <listName>'+guid+'</listName>\
                    </GetListItems>\
                </soap:Body>\
            </soap:Envelope>';

        $.ajax({
            url: url + '_vti_bin/lists.asmx',
            beforeSend: function (xhr) {
                //set the affiliated request header for the SOAP operation we're using
                xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/GetListItems');
            },
            type: 'GET',
            dataType: 'xml',
            contentType: 'text/xml; charset="utf-8"',
            data: soapEnv, //pass in constructed SOAP envelope
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              //handle any errors that are returned from Ajax call
                printError(XMLHttpRequest, textStatus, errorThrown);
            },
            complete: function (xData, status) {
                //filter the response xml so we can easily parse each returned objects attributes
                var results = $(xData.responseXML).filterNode('z:row');

                // run callback if passed as argument
                if (callback) {
                    callback(results);
                }
            }
        });
    };
    // End Utility Method /getListItems/

    // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
    // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
    // for performance details.
    $.fn.filterNode = function (name) {
        return this.find('*').filter(function () {
            return this.nodeName === name;
        });
    }; // End $.fn.filterNode
```

From here, we now have an object that contains all of the fields returned from the SharePoint list along with other returned data.  Personally, I prefer parsing this data into an object that contains just the column data that's easily accessible.  This of course is optional and is an algorith with a complexity of O(N).

```javascript
// Begin Utility Method /processData/
     processData = function(results) {
        var data = [{}],
            attrObj = {},
            i, j, attribute;
        //repackage data into an array which each index
        //is an object with key value pairs
        for (i = 0; i < results.length; i++){
            attrObj = {};
            if(!results[i].attributes){
                continue;
            }
            for (j = 0; j < results[i].attributes.length; j++){
                attribute = results[i].attributes[j];
                attrObj[attribute.name] = attribute.value;
            }
            data.push(attrObj);
        }
        return data;
    };
   // End Utility Method /processData/
```

That's it!  From here you can do what you need to with the returned data in your callback function.  Don't forget to pass the results to the callback arguments!

## Writing to a SharePoint List
As with reading from a SharePoint list, we shall once again need to construct a SOAP Envelope.  This envelop needs to contain the SharePoint list GUID along with any updates that are to be made to the list.  These updates may be adds, deletes, or updating existing data.

Here is a breakdown of each of the types of updates

### Adds
If we were to add just one new element, we would construct our SOAP envelope like so:

```
 <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
     <soap:Body>
         <UpdateListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
          <listName>GUID GOES HERE</listName>
            <updates>
              <Batch OnError="Continue" ListVersion="1" ViewName="">
                <Method ID="1" Cmd="New">
                  <Field Name="ID">New</Field>
                  <Field Name="Title"></Field>
                </Method>
              </Batch>
            </updates>
         </UpdateListItems>
        </soap:Body>
    </soap:Envelope>
```

 Inside the Batch element is where the methods will take place.  Each Method element contains the fields that you wish to set in the affiliated SharePoint list.  These are represented by the Field attribute, whre the Name property is set to the static SharePoint list column name.  You may get the SharePoint column's static name by going to the list's settings, clicking on the column name under Columns, and looking at the URL's query string for the Name attribute's value.

The Field element with the Name attribute of "ID" is always set to "New" to identify that this is a new item being added to the list.

 Now, if we were to add more than one new item, our SOAP envelope would look like the following:

```
 <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
     <soap:Body>
         <UpdateListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
          <listName>GUID GOES HERE</listName>
            <updates>
              <Batch OnError="Continue" ListVersion="1" ViewName="">
                <Method ID="1" Cmd="New">
                  <Field Name="ID">New</Field>
                  <Field Name="Title">Foo</Field>
                </Method>
                <Method ID="2" Cmd="New">
                  <Field Name="ID">New</Field>
                  <Field Name="Title">Bar</Field>
                </Method>
              </Batch>
            </updates>
         </UpdateListItems>
        </soap:Body>
    </soap:Envelope>
```
The difference between the the two envelopes is that the ID attribute in the method is incremented for each additional new item.

### Update
The Update method is very similar to the Add method except for that the ID attribute in the Field element needs to be set to an actual list eleemnt or else your web service will not complete successfully.

```
 <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
     <soap:Body>
         <UpdateListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
          <listName>GUID GOES HERE</listName>
            <updates>
              <Batch OnError="Continue" ListVersion="1" ViewName="">
                <Method ID="1" Cmd="Update">
                  <Field Name="ID">23</Field>
                  <Field Name="Title">More Foo</Field>
                </Method>
                <Method ID="2" Cmd="Update">
                  <Field Name="ID">34</Field>
                  <Field Name="Title">More Bar</Field>
                </Method>
              </Batch>
            </updates>
         </UpdateListItems>
        </soap:Body>
    </soap:Envelope>
```

### Delete
The Delete method is much more simpler than the preivous methods as only Field element with the ID attribute is required.

```
 <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
     <soap:Body>
         <UpdateListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
          <listName>GUID GOES HERE</listName>
            <updates>
              <Batch OnError="Continue" ListVersion="1" ViewName="">
                <Method ID="1" Cmd="Delete">
                  <Field Name="ID">23</Field>
                </Method>
                <Method ID="2" Cmd="Delete">
                  <Field Name="ID">34</Field>
                </Method>
              </Batch>
            </updates>
         </UpdateListItems>
        </soap:Body>
    </soap:Envelope>
```

Once our SOAP envelope constructed, we'll pass that into our AJAX call's data property and use a POST method for security reasons and because of the data that we're passing in requires a CAML query.

The GUID that we pass into the SOAP envelope is derived from the SharePoint list that we wish to get data from.  If you don't know how to do that, you can find out [here](https://nickgrattan.wordpress.com/2008/04/29/finding-the-id-guid-for-a-sharepoint-list/).

### Multiple New/Update/Delete
You can even combine multiple list updates at a time just by adding all of your methods for New, Update, and Delete methods inside of the Batch element.

```
 <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
     <soap:Body>
         <UpdateListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
          <listName>GUID GOES HERE</listName>
            <updates>
              <Batch OnError="Continue" ListVersion="1" ViewName="">
               <Method ID="1" Cmd="New">
                  <Field Name="ID">New</Field>
                  <Field Name="Title">Foo Bar</Field>
                </Method>
                <Method ID="2" Cmd="Update">
                  <Field Name="ID">23</Field>
                  <Field Name="Title">More Foo</Field>
                </Method>
                <Method ID="3" Cmd="Update">
                  <Field Name="ID">34</Field>
                  <Field Name="Title">More Bar</Field>
                </Method>
                <Method ID="4" Cmd="Delete">
                  <Field Name="ID">23</Field>
                </Method>
                <Method ID="5" Cmd="Delete">
                  <Field Name="ID">56</Field>
              </Batch>
            </updates>
         </UpdateListItems>
        </soap:Body>
    </soap:Envelope>
```

Now onto the JavaScript, as before, we'll create a function that build our SOAP Envelope, and makes an Ajax call to perform our updates to the SharePoint list.