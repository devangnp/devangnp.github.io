var store = [{
        "title": "Welcome to Jekyll!",
        "excerpt":"You’ll find this post in your _posts directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run jekyll serve, which launches a web server and auto-regenerates your site when...","categories": ["blog"],
        "tags": ["Jekyll","update"],
        "url": "http://0.0.0.0:4000/blog/welcome-to-jekyll/",
        "teaser":null},{
        "title": "DNS name resolution using Python",
        "excerpt":"Script I used to resolve DNS name to IP.   ''' NetOps Given url find out the IP address of it Devang Patel ''' import socket ip_add = 'Not a valid name' try:     ip_add = socket.gethostbyname('www.google.com') except socket.gaierror as e:     print(e) print(ip_add)   Output:   172.217.6.68   ","categories": ["Blog"],
        "tags": ["NetOps","Networking"],
        "url": "http://0.0.0.0:4000/blog/dns-name/",
        "teaser":null},{
        "title": "JUNOS scale config",
        "excerpt":"JUNOS scale config notebook: def myloop(cmd): i = 1 j = 1 #howmany = int(input()) howmany = 1 while i &lt;= howmany: print(cmd.format(i,i,i)) i = i + 1 LSP config cmd = \"set protocols mpls label-switched-path LSP-{} to 1.11.{}.1 ldp-tunneling\" myloop(cmd) Output: set protocols mpls label-switched-path LSP-1 to 1.11.1.1 ldp-tunneling...","categories": ["Blog"],
        "tags": ["JUNOS"],
        "url": "http://0.0.0.0:4000/blog/scale-config/",
        "teaser":null},{
        "title": "Let it snow!",
        "excerpt":"Picture of Evergreen Tree, my son and I created during thanks giving break when we were waiting for the snow to arrive.   iPad and pencil was used to draw whole picture.      ","categories": ["Blog"],
        "tags": ["Anish"],
        "url": "http://0.0.0.0:4000/blog/snow/",
        "teaser":null},{
        "title": "Trying out Nornir automation",
        "excerpt":"Trying out the NORNIR network automation and documenting few way to capture data from networking devices. I like the way we can import its different module into the python program that you might already be working on. Nornir is supported with Python 3.6 version and above. Using Nornir, we can...","categories": ["Blog"],
        "tags": ["Networking","NetOps"],
        "url": "http://0.0.0.0:4000/blog/nornir-learning/",
        "teaser":null},{
        "title": "CSV Network device stats calculation",
        "excerpt":"Given a CSV file with stats, how would you calculate the traffic stats? This is what I am trying to document: My CSV file looks like: device,intf,input,output r1,et1,blah,110 r1,et2,102,112 r1,et3,103,113 r2,et1,200,210 r2,et2,202,212 r2,et3,203,213 r3,et1,300,blah r3,et2,302,312 r3,et3,303,313 ''' Reading CSV and cleaning the value ''' import csv from collections import defaultdict...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/csv-stats/",
        "teaser":null},{
        "title": "TextFSM with Nornir",
        "excerpt":"TextFSM has been useful in network automation when you have unstructured data or cli output and want to convert them into Python data structured formatted data. By importing netmiko plugin in nornir we can use its capability of parsing the unstructured data using TextFsm. In this example, we will try...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/nornir-textfsm/",
        "teaser":null},{
        "title": "Learning Ansible automation to manage network devices in the lab",
        "excerpt":"With so many tools available, I decided to try out the Ansible to see how it works and what can I do with it so documenting few things that I tried with it. my Ansible directory tree structure Ansible default config file and modification creating inventory defining variables in inventory...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/ansible-learning/",
        "teaser":null}]
