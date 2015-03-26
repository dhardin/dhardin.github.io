---
layout: post
title: Reading/Writing to a SharePoint list
tags: [Front End Web Development SharePoint, Web Service, SOAP; XML, JavaScript, jQuery]
---

###CAUTION!
```
Before venturing on further, if you are unfamiliar with web services and thier operations, please refer to the previous post: [SharePoint Web Services](http://dhardin.github.io/2015/03/05/SharePoint-WebServices)
```

Making web service calls through the SharePoint API can seem pretty daughnting if you are new to it.  There are varoius tools out there that help make this process less painful through abstraction and hiding all the details involved with building SOAP envelopes and parsing returned results.

I beleive its best to understand what goes on behind the curtains first so that we can understand exactly what our code is doing.

##Request
To perform any sort of data read/write in our SharePoint environment, we must construct a HTTP header, which is packaged and sent to the server via an Ajax call for processing.

###SOAP Envelope
SOAP envelopes are constructed and identify things such as list GUIDs, items to be updated, etc.  The body of the envelope itself is determined by the web service SOAP operation that you are performing.

In this case, we are calling the GetListItems SOAP operation.  Navigating to the appropriate web service operation page will provide you with the required SOAP body and parameters.

####CAML Query
Collaborative Markup Language (CAML) is an XML based language used for querying and updating SharePoint objects.

You may use CAML queries to narrow down the returned results from the SOAP operations that you perform.  Why would you want to filter results with a complex query versus filtering on the client side?  Well, this is because the client side filtering will be significantly slower as the client browser is a single threaded environment and code is run in a run-time blocking manner by default.  You can work around this of course using JavaScript asynchrous tricks such as setTimeout (I'll be addressing this in another post).

For this example, we will not dive into CAML queries, but deal with returning all list items for simplicity sake.  We'll cover a CAML query in another example in the near future.

For further reading on CAML queries and the various schemas, please check out the reference on [MSDN](https://msdn.microsoft.com/en-us/library/office/ms462365).

###Ajax
COMING SOON

####Get vs Post
COMING SOON

##Response
First we'll need a helper method for extracting the XML nodes returned from our web service calls:
<script src="https://gist.github.com/dhardin/722d1c1182c798a366f3.js"></script>

Now, let's construct our function to get list items from the SharePoint list:
<script src="https://gist.github.com/dhardin/931ad9904fe721f08db5.js"></script>