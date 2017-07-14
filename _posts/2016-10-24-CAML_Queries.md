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
CAML queries are XML that we embed into our SOAP envelope, inside of the Query tag.  We will not cover all of the possible logical operations (you can view those on [MSDN - Query Schema](https://msdn.microsoft.com/en-us/library/office/ms467521)), but we'll show a few scenarios as well as cover SharePoint column types in CAML queries, as these can be difficult to deal with.
