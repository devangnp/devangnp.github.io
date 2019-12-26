---
title: "JUNOS scale config"
last_modified_at: 2016-12-16T00:00:02-05:00
categories:
  - Blog
tags:
  - JUNOS
---

JUNOS scale config notebook:


```python
def myloop(cmd):
    i = 1
    j = 1
    #howmany = int(input())
    howmany = 1
    while i <= howmany:
        print(cmd.format(i,i,i))
        i = i + 1
```

# LSP config


```python
cmd = "set protocols mpls label-switched-path LSP-{} to 1.11.{}.1 ldp-tunneling"
myloop(cmd)
```

    set protocols mpls label-switched-path LSP-1 to 1.11.1.1 ldp-tunneling


# IFL scale


```python
print("set interfaces xe-4/1/0 flexible-vlan-tagging encapsulation flexible-ethernet-services ")
cmd = "set interfaces xe-4/1/0 unit {} vlan-id {} family inet address 1.11.{}.2/24"
myloop(cmd)
```

    set interfaces xe-4/1/0 flexible-vlan-tagging encapsulation flexible-ethernet-services 
    set interfaces xe-4/1/0 unit 1 vlan-id 1 family inet address 1.11.1.2/24


# Loopback interface config


```python
cmd = "set interfaces lo0 unit {} family inet address 192.168.1.{}/32"
myloop(cmd)
```

    set interfaces lo0 unit 1 family inet address 192.168.1.1/32


# BGP config
<a id = "BGP config"></a>


```python
cmd = "set protocols bgp group ibpg neighbor 192.168.1.{}"
myloop(cmd)
```

    set protocols bgp group ibpg neighbor 192.168.1.1

