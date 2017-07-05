---
layout: post
title: SharePoint Web Services
tags: [Front End Web Development, SharePoint, Web Service, SOAP; XML]
---

The first thing you need to know about developing front end web applications for SharePoint are Web Services.

## What is a Web Service?
>The term Web services describes a standardized way of integrating Web-based applications using the XML, SOAP, WSDL and UDDI open standards over an Internet protocol backbone. XML is used to tag the data, SOAP is used to transfer the data, WSDL is used for describing the services available and UDDI is used for listing what services are available. Used primarily as a means for businesses to communicate with each other and with clients, Web services allow organizations to communicate data without intimate knowledge of each other's IT systems behind the firewall.

*Source*: [webopedia](http://www.webopedia.com/TERM/W/Web_Services.html)

Great, so we have an understanding of web services.  But how does this pair up with writing SharePoint front end web applications?  SharePoint utilizes SOAP reqeusts.

### What is SOAP?
>The Windows SharePoint Services Web Service provided by the Microsoft.SharePoint.SoapServer namespace has numerous methods for accessing content on a site, including methods for working with lists or site data, as well as methods for customizing meetings, imaging, document workspaces, or search.
The Simple Object Access Protocol (SOAP) interfaces used in these services provide .NET developers with object models for creating solutions that work with Microsoft Windows SharePoint Services remotely from a client or custom application. The interfaces are integrated with the server-side object models of the Windows SharePoint Services assembly, and their design has been optimized to reduce the number of roundtrips transacted between client computer and server.
Web services provide their functionality through the _vti_bin virtual directory, which maps to the Local_Drive:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\60\ISAPI physical directory in the file system.

*Source*: [MSDN](https://msdn.microsoft.com/en-us/library/dd587241(v=office.11).aspx)

So where do we find which SOAP services are available to us?  Well, we'll cover that next.


## SharePoint Web Services 
In order to acquire the services at your disposal, you'll first need to get a grasp on the web services available:

| Service               | Description                                                                                                                        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [Administration](https://msdn.microsoft.com/en-us/library/dd586087(v=office.11).aspx)        | Provides methods for managing a deployment ofWindows SharePoint Services, such as for creating or deleting sites.                  |
| [Alerts](https://msdn.microsoft.com/en-us/library/dd586093(v=office.11).aspx)                | Provides methods for working with alerts for list items in a SharePoint site.                                                      |
| [Document Workspace](https://msdn.microsoft.com/en-us/library/dd586103(v=office.11).aspx)    | Exposes the Document Workspace Web service and its eleven methods for managing Document Workspace sites and the data they contain. |
| [Forms](https://msdn.microsoft.com/en-us/library/dd586110(v=office.11).aspx)                 | Provides methods for returning forms used in the user interface when working with the contents of a list.                          |
| [Imaging](https://msdn.microsoft.com/en-us/library/dd586123(v=office.11).aspx)               | Provides methods that enable you to create and manage picture libraries.                                                           |
| [List Data Retrieval](https://msdn.microsoft.com/en-us/library/dd586096(v=office.11).aspx)   | Provides a method for performing queries against lists in Microsoft Windows SharePoint Services.                                   |
| [Lists](https://msdn.microsoft.com/en-us/library/dd586136(v=office.11).aspx)                 | Provides methods for working with lists and list data.                                                                             |
| [Meetings](https://msdn.microsoft.com/en-us/library/dd586165(v=office.11).aspx)              | Provides methods that enable you to create and manage Meeting Workspace sites.                                                     |
| [Permissions](https://msdn.microsoft.com/en-us/library/dd586179(v=office.11).aspx)           | Provides methods for working with the permissions for a site or list.                                                              |
| [Site Data](https://msdn.microsoft.com/en-us/library/dd586184(v=office.11).aspx)             | Provides methods that return metadata or list data from sites or lists in Microsoft Windows SharePoint Services.                   |
| [Sites](https://msdn.microsoft.com/en-us/library/dd586187(v=office.11).aspx)                 | Provides a method for returning information about the site templates for a site collection.                                        |
| [Users and Groups](https://msdn.microsoft.com/en-us/library/dd586193(v=office.11).aspx)      | Provides methods for working with users, site groups, and cross-site groups.                                                       |
| [Versions](https://msdn.microsoft.com/en-us/library/dd586197(v=office.11).aspx)              | Provides methods for working with file versions.                                                                                   |
| [Views](https://msdn.microsoft.com/en-us/library/dd586201(v=office.11).aspx)                 | Provides methods for working with views of lists.     | [Web Part Pages](https://msdn.microsoft.com/en-us/library/dd586207(v=office.11).aspx)        | Provides the methods to send information to and retrieve information from XML Web services.                                        |
| [Webs](https://msdn.microsoft.com/en-us/library/dd586211(v=office.11).aspx)                  | Provides methods for working with sites and subsites.                                                                              |


Now that you have a list of web services available to you, you can now dig into the construction of SOAP requests and responses.

Let's go ahead and navigate to any of the above web services on your SharePoint portal:

**http://[domain]/[sites/][Site_Name/][Subsite_Name/]_vti_bin/Service_Name.asmx**

So if we navigate to the *list* service, we'll get the following page of list operations:


[Expand Image](../../../../images/2015-3-6-SharePoint_List_Reading_Writing/lists.png)
[
![Image of list web service operations]
(../../../../images/2015-3-6-SharePoint_List_Reading_Writing/lists.png)
](../../../../images/2015-3-6-SharePoint_List_Reading_Writing/lists.png)

Now if we click on one of the operations (e.g., GetListItems), the SOAP web service request and response body will be displayed in XML format:


[Expand Image](../../../../images/2015-3-6-SharePoint_List_Reading_Writing/getlistitems.png)
[
![Image of Get List Items SOAP Web Service Operation]
(../../../../images/2015-3-6-SharePoint_List_Reading_Writing/getlistitems.png)
](../../../../images/2015-3-6-SharePoint_List_Reading_Writing/getlistitems.png)

As previoulsy mentioned, the XML shown defines the SOAP request and response bodies.  What does this mean though?  Well, the SOAP request is what you will bundle in an Ajax call and send to the server and the SOAP response is how the XML will be packaged when returned (if successfully...more on that in another post) back to you.

"But wait, what about this SOAP version 1.1 or 1.2?"

Good question.  These variantions in SOAP reqeusts have a few differences besides a few attribute changes between the SOAP envelopes.

## SOAP 1.1 vs 1.2
First, read this excellent response on [Stack Overflow](http://stackoverflow.com/a/8588362).

Now, which one to choose?  Well, you can technically choose either.  But, after reading the differences, if writing a new application, I'd go with 1.2 for security and optimization reasons.  SOAP 1.1 is there I beleive for legacy support reasons.

Now that's really it for Web Services.  Please leave a comment or question!


Cheers,

Dustin