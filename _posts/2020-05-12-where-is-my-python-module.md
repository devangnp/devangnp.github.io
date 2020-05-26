---
title: "Where is my Python module located?"
last_modified_at: 2020-05-12T00:00:03-05:00
categories:
  - Blog
tags:
  - - [NetOps]
---

Many times we have difficulty finding things that we put somewhere at home or office. Well I see the same issue with PYTHON modules too so I was searching for a way to locate: Where is that python module? 

And I found the module that I was looking for:

```
root@ubuntu:~# python3
Python 3.5.2 (default, Jul 10 2019, 11:58:48) 
[GCC 5.4.0 20160609] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import dicttoxml
>>> dicttoxml.__file__
'/usr/local/lib/python3.5/dist-packages/dicttoxml.py'
>>> 
[2]+  Stopped                 python3 


root@ubuntu:~# ls -l /usr/local/lib/python3.5/dist-packages/ | egrep -i dicttoxml
drwxr-sr-x  2 root staff    4096 Oct  8 12:23 dicttoxml-1.7.4.dist-info
-rw-r--r--  1 root staff   13020 Oct  8 12:23 dicttoxml.py
root@ubuntu:/usr/lib/python3/dist-packages# 
```


