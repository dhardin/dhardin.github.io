---
layout: post
title: CAML Queries
tags: [Front End Web Development, SharePoint, Web Service, SOAP; XML, CAML]
---
* TOC
{:toc}

Let's start off by once again reviewing what a CAML query is and why we want to use them.

### What are CAML queries?
Collaborative Markup Language (CAML) is an XML based language used for querying and updating SharePoint objects.

You may use CAML queries to narrow down the returned results from the SOAP operations that you perform.  Why would you want to filter results with a complex query versus filtering on the client side?  Well, this is because the client side filtering will be significantly slower as the client browser is a single threaded environment and code is run in a run-time blocking manner by default.  You can work around this of course using JavaScript asynchrous tricks such as setTimeout (I'll be addressing this in another post).

For further reading on CAML queries and the various schemas, please check out the reference on [MSDN - CAML Schema](https://msdn.microsoft.com/en-us/library/office/ms462365).


### How to use CAML Queries
CAML queries are XML that we embed into our SOAP envelope, inside of the Query tag.  We will not cover all of the possible logical operations (you can view those on [MSDN - Query Schema](https://msdn.microsoft.com/en-us/library/office/ms467521)), but we'll cover some of the more common scenarios and how to handle some unique scenarios.

CAML queries will reside inside of whatever SOAP web service you're calling.  So if for example, we're calling GetListItems, then we'll nest our query inside of that like so:

```xml
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GetListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
            <query>
                <Query>
                    <Where>
                    </Where>
                </Query>
            </query>
            <rowLimit>0</rowLimit>
            <listName>GUID GOES HERE</listName>
        </GetListItems>
    </soap:Body>
</soap:Envelope>
```
And inside of the ```<Where>``` tag is where our actual query will reside.

Let's take a look at some of the value types and how we can use them to write our queries.

####Integer
The Integer value type comes into play depending not only on the column type, but also the subtype of that column.

For example, we have a Person and Group column in SharePoint but we can make that a multi or single person/group.  By using single, this will result in us using the Integer type in our person/group queries.

Let's take a look at the query portion of our SOAP envelope that contains a query to look up a single user's ID in a person/group column:

```xml
        <GetListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
            <query>
                <Query>
                    <Where>
                        <Includes>
                            <FieldRef Name="User" LookupId="TRUE" />
                            <Value Type="Integer">200</Value>
                        </Includes>
                    </Where>
                </Query>
            </query>
            <rowLimit>0</rowLimit>
            <listName>GUID GOES HERE</listName>
```

Note that you must include the LookupId attribue for Person/Group lookup fields.

Another example, is if we're just looking up a simple ID of an item in a list.  We'll just need the field name (ID in this case) and ID:

```xml
        <GetListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">
            <query>
                <Query>
                    <Where>
                        <Includes>
                            <FieldRef Name="ID"/>
                            <Value Type="Integer">12</Value>
                        </Includes>
                    </Where>
                </Query>
            </query>
            <rowLimit>0</rowLimit>
            <listName>GUID GOES HERE</listName>
```


####DateTime
####Text
####Lookup
