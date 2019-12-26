---
title: "Let it snow!"
last_modified_at: 2016-12-16T00:00:01-05:00
categories:
  - Blog
tags:
  - - Anish
---

Script I used to resolve DNS name to IP.
[My Github site](https://devangnp.github.io/){:target="_blank"}

![Evergreen Tree with Snow](/assets/images/snow.jpg)

```python
'''
NetOps
Given url find out the IP address of it
Devang Patel
'''
```


```python
import socket
```


```python
ip_add = 'Not a valid name'
try:
    ip_add = socket.gethostbyname('www.google.com')
except socket.gaierror as e:
    print(e)
```


```python
print(ip_add)
```

    172.217.6.68

