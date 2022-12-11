---
title: "Ways to EBGP loadbalance"
last_modified_at: 2020-02-25T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Upgrading 5K server with patch requires different consideration then upgrading the network devices used for routing of bulk of traffic carried from the  servers.

For servers:
 - Divide or group or label them per PODs, racks, sections, zones, regions.
 - If redundancy or load planned as per N+2 load, where 1 set is production, 1 set to take over production is for maintenance and 1 set is to take over in case of maintenance set failure.
 - N+2 redundancy could be in case of Physical servers, or CPU load perspective.
 - Canary the OS or patch first, give a soaking period of 24 hrs or 48 hrs.
 - If canary is stable, move on to the production.
 - Start upgrading or patching 5, 10, 15 or 20% of servers in that pod at a time.
 - May be plan upgrading 10% servers/VMs or Containers concurrently in each region.
   - At given time upgrade:
     - 10% in AMER
     - 10% in EMEA
     - 10% in APAC
- Consider the error rates to stop the upgrade or patching.

For Network devices:
- Check the redundancy, is it SPOF or N+1
- If N+1, at a given point you can upgrade one router or switch at a time.
- With N+1 redundancy, its possible to work at multiple site at same time and multiple regions. 

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

