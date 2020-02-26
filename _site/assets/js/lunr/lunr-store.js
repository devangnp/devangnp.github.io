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
        "excerpt":"Picture of Evergreen Tree, my son and we(wife and I) created during thanks giving break when we were waiting for the snow to arrive.   iPad and pencil was used to draw whole picture.      ","categories": ["Blog"],
        "tags": ["Anish"],
        "url": "http://0.0.0.0:4000/blog/snow/",
        "teaser":null},{
        "title": "Trying out Nornir automation",
        "excerpt":"Trying out the NORNIR network automation and documenting few way to capture data from networking devices. I like the way we can import its different module into the python program that you might already be working on. Nornir is supported with Python 3.6 version and above. Using Nornir, we can...","categories": ["Blog"],
        "tags": ["Networking","NetOps"],
        "url": "http://0.0.0.0:4000/blog/nornir-learning/",
        "teaser":null},{
        "title": "CSV Network device stats calculation and top talkers",
        "excerpt":"Given a CSV file with stats, we might have to perform following tasks: How would you calculate the traffic stats? Who are the top talkers based on input or output or total? This is what I am trying to document: My CSV file looks like: device,intf,input,output r1,et1,blah,110 r1,et2,102,112 r1,et3,103,113 r2,et1,200,210...","categories": ["Blog"],
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
        "teaser":null},{
        "title": "itemgetter and itertools ",
        "excerpt":"Documenting the learning on itemgetter and itertools module for network stats analysis. To make this blog more relevant, I am using the data from one of my previous post later in this blog. As name suggest, groupby is used to group the items based on given parameters and that parameters...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/itertool-itemgetter/",
        "teaser":null},{
        "title": "Netmiko SSH connection handling using with statement",
        "excerpt":"While working on Python program to connect to multiple lab devices and capture data, I faced the issue (due to bug in my program) where router was rejecting SSH connection request. As one might have guessed, it was issue due to the number of SSH connection limit reached! Upon investigation,...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/ssh-netmiko-cntxmngr/",
        "teaser":null},{
        "title": "IPv4 and IPv6 address validation using Python netaddr",
        "excerpt":"On and off I had a need to verify if given string is valid IP or not. May be you are reading devices or host name files and you want to make sure that the given string is actually well formatted IPv4 or IPv6 address before you start further processing...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/is-ip-valid/",
        "teaser":null},{
        "title": "Data store and easy access data structures",
        "excerpt":"I was looking for data structure which can store data in key and value pair, it would be even better if I can access it using \".\" or dot notation for easy and clean acess so few such data structures I was exploring: dictionary class namedtuple Using Dictionary: Dictionary is...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/data-store-access/",
        "teaser":null},{
        "title": "Managing JUNOS device using Netmiko",
        "excerpt":"Documenting the way I learned to use Netmiko with JUNOS device. Required imports to start with: In [1]: from netmiko import juniper In [2]: from netmiko import ConnectHandler In [4]: from netmiko import file_transfer In [39]: from pprint import pprint Router details as dictionary which will be used by netmiko...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/netmiko-junos/",
        "teaser":null},{
        "title": "Netmiko multithreading with Junos devices",
        "excerpt":"Automation of networking is always comes with scale requirement, manage or connect or capture data from so many devices, create reports of each device in separate files etc. Such requirements demands for multithreading or multiprocessing. Since connecting to routers or capturing data, storing collected data to the different files has...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/netmiko-multithreading/",
        "teaser":null},{
        "title": "Working with files in Python",
        "excerpt":"Working with files and directories is everyday work so how can we create, rename, traverse through different level of directories and files is what I am trying to learn and document in this blog post. In [3]: import os In [4]: import sys In [5]: import glob How do I...","categories": ["Blog"],
        "tags": ["NetOps"],
        "url": "http://0.0.0.0:4000/blog/files-rename/",
        "teaser":null},{
        "title": "BGP Multipath in Junos - IPv4 routes",
        "excerpt":"Optimizing network resources is ongoing improvement process in any network deployment. Networks are deployed with redundant links, line cards, devices, CPU etc. to cover the failover, quick migration or adding capacity or introducing new feature or upgrading device to new software release related scenarios. In this blog post we will...","categories": ["Blog"],
        "tags": ["Networking","JUNOS"],
        "url": "http://0.0.0.0:4000/blog/bgp-multipath/",
        "teaser":null},{
        "title": "BGP route reflector reflection in picture",
        "excerpt":"When you have a route reflector, we always have many questions like:     What is a purpose of it?   Which route will it reflect?   What will it do with the update from non-client?   Will it send update to the non-client?       ","categories": ["Blog"],
        "tags": ["Networking","JUNOS"],
        "url": "http://0.0.0.0:4000/blog/bgp-rr-update/",
        "teaser":null},{
        "title": "Ways to EBGP loadbalance",
        "excerpt":"   Previous blog of IGP lb and iBGP multipath BGP Multipath in Junos - IPv4 routes   ","categories": ["Blog"],
        "tags": ["Networking","JUNOS"],
        "url": "http://0.0.0.0:4000/blog/ebgplb/",
        "teaser":null},{
        "title": "The Router I know",
        "excerpt":"Tried to picturize the router as I know, at least the Juniper router with control and forwarding plane traffic. I have also highlighted the traffic flow and try to show which traffic is known as transit and host traffic. Picture shows one control plane or in Juniper terms its Routing-Engine(RE)...","categories": ["Blog"],
        "tags": ["Networking","JUNOS"],
        "url": "http://0.0.0.0:4000/blog/the-router-asiknow/",
        "teaser":null}]
