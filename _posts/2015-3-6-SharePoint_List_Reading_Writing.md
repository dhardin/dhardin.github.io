---
layout: post
title: Reading/Writing to a SharePoint list
tags: [Front End Web Development SharePoint, Web Service, SOAP; XML, JavaScript, jQuery]
---
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title"><span class="glyphicon glyphicon-warning-sign warning"></span> CAUTION</h3>
  </div>
  <div class="panel-body">
     Before venturing on further, if you are unfamiliar with web services and thier operations, please refer to the previous post: <a href="http://dhardin.github.io/2015/03/05/SharePoint-WebServices/">SharePoint Web Services</a>
  </div>
</div>


First we'll need a helper method for extracting the XML nodes returned from our web service calls:
<script src="https://gist.github.com/dhardin/722d1c1182c798a366f3.js"></script>

Now, let's construct our function to get list items from the SharePoint list:
<script src="https://gist.github.com/dhardin/931ad9904fe721f08db5.js"></script>