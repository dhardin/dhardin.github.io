---
layout: post
title: SharePoint WebServices
---

The first thing you need to know about developing front end web applications for SharePoint are WebServices.

##What is a Web Service?
>The term Web services describes a standardized way of integrating Web-based applications using the XML, SOAP, WSDL and UDDI open standards over an Internet protocol backbone. XML is used to tag the data, SOAP is used to transfer the data, WSDL is used for describing the services available and UDDI is used for listing what services are available. Used primarily as a means for businesses to communicate with each other and with clients, Web services allow organizations to communicate data without intimate knowledge of each other's IT systems behind the firewall.

*Source*: [webopedia](http://www.webopedia.com/TERM/W/Web_Services.html)

Great, so we have an understanding of web services.  But how does this pair up with writing SharePoint front end web applications?  SharePoint utilizes SOAP reqeusts.

###What is SOAP?
>The Windows SharePoint Services Web Service provided by the Microsoft.SharePoint.SoapServer namespace has numerous methods for accessing content on a site, including methods for working with lists or site data, as well as methods for customizing meetings, imaging, document workspaces, or search.
The Simple Object Access Protocol (SOAP) interfaces used in these services provide .NET developers with object models for creating solutions that work with Microsoft Windows SharePoint Services remotely from a client or custom application. The interfaces are integrated with the server-side object models of the Windows SharePoint Services assembly, and their design has been optimized to reduce the number of roundtrips transacted between client computer and server.
Web services provide their functionality through the _vti_bin virtual directory, which maps to the Local_Drive:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\60\ISAPI physical directory in the file system.

*Source*: [MSDN](https://msdn.microsoft.com/en-us/library/dd587241(v=office.11).aspx)

So where do we find which SOAP services are available to us?  Well, we'll cover that next.


##SharePoint Web Services 
In order to acquire the services at your disposal, you'll first need to get a grasp on the web services available:

| Service               | Description                                                                                                                        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| Administration        | Provides methods for managing a deployment ofWindows SharePoint Services, such as for creating or deleting sites.                  |
| Alerts                | Provides methods for working with alerts for list items in a SharePoint site.                                                      |
| Document Workspace    | Exposes the Document Workspace Web service and its eleven methods for managing Document Workspace sites and the data they contain. |
| Forms                 | Provides methods for returning forms used in the user interface when working with the contents of a list.                          |
| Imaging               | Provides methods that enable you to create and manage picture libraries.                                                           |
| List Data Retrieval   | Provides a method for performing queries against lists in Microsoft Windows SharePoint Services.                                   |
| Lists                 | Provides methods for working with lists and list data.                                                                             |
| Meetings              | Provides methods that enable you to create and manage Meeting Workspace sites.                                                     |
| Permissions           | Provides methods for working with the permissions for a site or list.                                                              |
| Site Data             | Provides methods that return metadata or list data from sites or lists in Microsoft Windows SharePoint Services.                   |
| Sites                 | Provides a method for returning information about the site templates for a site collection.                                        |
| Users and Groups      | Provides methods for working with users, site groups, and cross-site groups.                                                       |
| Versions              | Provides methods for working with file versions.                                                                                   |
| Views                 | Provides methods for working with views of lists.     | Web Part Pages        | Provides the methods to send information to and retrieve information from XML Web services.                                        |
| Webs                  | Provides methods for working with sites and subsites.                                                                              |