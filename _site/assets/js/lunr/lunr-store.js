var store = [{
        "title": "Welcome to Jekyll!",
        "excerpt":"You’ll find this post in your _posts directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run jekyll serve, which launches a web server and auto-regenerates your site when...","categories": ["blog"],
        "tags": ["Jekyll","update"],
        "url": "http://0.0.0.0:4000/blog/welcome-to-jekyll/",
        "teaser":null},{
        "title": "DNS name resolution using Python",
        "excerpt":"Script I used to resolve DNS name to IP.   ''' NetOps Given url find out the IP address of it Devang Patel '''   import socket   ip_add = 'Not a valid name' try:     ip_add = socket.gethostbyname('www.google.com') except socket.gaierror as e:     print(e)   print(ip_add)   172.217.6.68   ","categories": ["Blog"],
        "tags": ["NetOps","Networking"],
        "url": "http://0.0.0.0:4000/blog/dns-name/",
        "teaser":null},{
        "title": "JUNOS scale config",
        "excerpt":"JUNOS scale config notebook: def myloop(cmd): i = 1 j = 1 #howmany = int(input()) howmany = 1 while i &lt;= howmany: print(cmd.format(i,i,i)) i = i + 1 LSP config cmd = \"set protocols mpls label-switched-path LSP-{} to 1.11.{}.1 ldp-tunneling\" myloop(cmd) set protocols mpls label-switched-path LSP-1 to 1.11.1.1 ldp-tunneling IFL...","categories": ["Blog"],
        "tags": ["JUNOS"],
        "url": "http://0.0.0.0:4000/blog/scale-config/",
        "teaser":null},{
        "title": "Let it snow!",
        "excerpt":"Picture of Evergreen Tree, my son and I created during thanks giving break when we were waiting for the snow to arrive.   iPad and pencil was used to draw whole picture.      ","categories": ["Blog"],
        "tags": ["Anish"],
        "url": "http://0.0.0.0:4000/blog/snow/",
        "teaser":null}]
