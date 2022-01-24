---
title: "Ways to EBGP loadbalance"
last_modified_at: 2020-02-25T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
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

