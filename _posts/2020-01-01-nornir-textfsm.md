---
title: "TextFSM with Nornir"
last_modified_at: 2012-01-01T00:00:01-05:00
categories:
  - Blog
tags:
  - - NetOps
---

TextFSM has been useful in network automation when you have unstructured data or cli output and want to convert them into Python data structured formatted data.

By importing netmiko plugin in nornir we can use its capability of parsing the unstructured data using TextFsm. 

In this example, we will try to extract the OSPF neighbor details from Juniper router and read it in TextFSM formatted data model/structure. I am using existing [TextFsm template defined here](https://github.com/networktocode/ntc-templates){:target="_blank"}

Router r1's OSPF neighbor output in plain text is as follow:
```
lab@r1> show ospf neighbor 
Address          Interface              State     ID               Pri  Dead
1.1.13.2         xe-0/1/0.0             Full      192.168.1.3      128    39
```


Telling netmiko where to look for textFSM templates: ```export NET_TEXTFSM=/home/user/ntc-templates/templates/```

```python
#Required imports
from nornir import InitNornir
from nornir.plugins.tasks.networking import netmiko_send_command,
from nornir.plugins.tasks.networking import napalm_get, napalm_cli
from nornir.plugins.functions.text import print_result
from pprint import pprint as pprint

'''
Create nornir object which will use the hosts.yaml and 
groups.yaml files to 
'''
nr = InitNornir()

result = nr.run(
    task=netmiko_send_command,
    command_string="show ospf neighbor",
    use_textfsm=True
)

print_result(result)      

```

#### TextFSM parse output:
```
netmiko_send_command************************************************************
* r1 ** changed : False ********************************************************
vvvv netmiko_send_command ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO
[ { 'address': '1.1.13.2',
    'dead_time': '33',
    'interface': 'xe-0/1/0.0',
    'neighbor_id': '192.168.1.3',
    'priority': '128',
    'state': 'Full'}]
^^^^ END netmiko_send_command ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

If we remove ```use_textfsm=True``` from the script:
```python
result = nr.run(
    task=netmiko_send_command,
    command_string="show ospf neighbor",
)

print_result(result)  
```

#### Output of script without TextFSM usage, it looks like a plain text output:

```
netmiko_send_command************************************************************
* r1 ** changed : False ********************************************************
vvvv netmiko_send_command ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO

Address          Interface              State     ID               Pri  Dead
1.1.13.2         xe-0/1/0.0             Full      192.168.1.3      128    33

^^^^ END netmiko_send_command ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```
