---
title: "Managing JUNOS device using Netmiko"
last_modified_at: 2020-01-29T00:00:00-05:00
categories:
  - Blog
tags:
  - - NetOps
---

Documenting the way I learned to use Netmiko with JUNOS device. 

Required imports to start with:
```python
In [1]: from netmiko import juniper
In [2]: from netmiko import ConnectHandler
In [4]: from netmiko import file_transfer
In [39]: from pprint import pprint
```

Router details as dictionary which will be used by netmiko as device parameters:
```python
In [20]: ptxrtr = {
    ...: 'device_type': 'juniper_junos', 
    ...: 'ip': '10.85.162.140', 
    ...: 'username': 'lab', 
    ...: 'password': 'mypassword' 
    ...: } 
    ...:  
```

Establishing the connection with router, sending dictionary as kwargs with ** which acts as an unpacking operator:
```python
In [21]: ptx = ConnectHandler(**ptxrtr)
```
Checking if connection is established and alive:
```python
In [22]: ptx.is_alive()     
Out[22]: True
```
Changing router config by sending just one command:
```python
In [23]: ptx.send_config_set('set interfaces lo0 description netmiko_config_change_test2')

Out[23]: 'configure \nEntering configuration mode\n\n[edit]\nlab@r1# set interfaces lo0 description netmiko_config_change_test2 \n\n[edit]\nlab@r1# exit configuration-mode \nThe configuration has been changed but not committed\nExiting configuration mode\n\nlab@r1> '
```
Commiting the configuration:
```python
In [24]: ptx.commit()     
Out[24]: 'configure \r\nEntering configuration mode\r\nThe configuration has been changed but not committed\r\n\r\n[edit]\r\nlab@r1# commit \ncommit complete\n\n[edit]\nlab@r1# '
```

How to copy the file on to the router?
```python
In [30]: file_transfer(ptx, 'transfer.txt','transfer.txt',direction = 'put', file_system = '/var/tmp/')
Out[30]: {'file_exists': True, 'file_transferred': True, 'file_verified': True}
```

Configuration changes from file, lets find a way to check the current working directory and if we are not in proper directory then go to the directory where we have config file:
```python
In [27]: os.getcwd()     
Out[27]: '/home/lab'

In [28]: os.chdir('/home/lab/PythonMyProg/py_networking/NetOps/netmiko_examples')
```

How to check which router prompt I am on?:
```python
In [29]: mx.find_prompt()
Out[29]: 'lab@r1-re0#'
```
Pushing configuration from local server router config file:
```python
In [32]: ptx.send_config_from_file('transfer.txt')

Out[32]: 'configure \nEntering configuration mode\n\n[edit]\nlab@r1# set interfaces lo0 description netmiko_config_change_test3 \n\n[edit]\nlab@r1# exit configuration-mode \nThe configuration has been changed but not committed\nExiting configuration mode\n\nlab@r1> '
```
Commiting the configuration:
```python
In [33]: ptx.commit()
Out[33]: 'configure \r\nEntering configuration mode\r\nThe configuration has been changed but not committed\r\n\r\n[edit]\r\nlab@r1# commit \ncommit complete\n\n[edit]\nlab@r1# '
```
Checking the prompt of the router:
```python
In [41]: ptx.find_prompt()
Out[41]: 'lab@r1#'
```
Since, I am in configuration mode, I can't run the show commands directly, router is sending back the syntax error:
```python
In [45]: ptx.send_command('show rsvp interfaces')
Out[45]: '                     ^\nsyntax error.\n\nlab@r1# show rsvp   interfaces\n                     ^\nsyntax error.\n'
```
Exiting the configuration mode to run show command afterwards:
```python
In [47]: ptx.exit_config_mode()     
Out[47]: 'exit configuration-mode \nExiting configuration mode\n\nlab@r1> '

In [48]: ptx.find_prompt()
Out[48]: 'lab@r1>'
```
Sending show command to catpure RSVP interfaces information:
```python
In [49]: ptx.send_command('show rsvp interface')
Out[49]: '\nRSVP interface: 8 active\n                          Active  Subscr- Static      Available   Reserved    Highwater\nInterface          State  resv    iption  BW          BW          BW          mark\nae0.0                  Up       0   100%  20Gbps      20Gbps      0bps        0bps       \nae2.1000               Up       0   100%  20Gbps      20Gbps      0bps        0bps       \nae2.112                Up       0   100%  20Gbps      20Gbps      0bps        0bps       \nem0.0                  Up       0   100%  1000Mbps    1000Mbps    0bps        0bps       \net-0/0/1:2.0           Up       0   100%  10Gbps      10Gbps      0bps        0bps       \net-0/0/1:3.0           Up       1   100%  10Gbps      10Gbps      0bps        0bps       \net-0/0/3:1.1000      Down       0   100%  10Gbps      10Gbps      0bps        0bps       \nlo0.0                  Up       0   100%  0bps        0bps        0bps        0bps       \n'
```

Printing pretty using pprint:
```python
In [50]: pprint(ptx.send_command('show rsvp interface'))
('\n'
 'RSVP interface: 8 active\n'
 '                          Active  Subscr- Static      Available   '
 'Reserved    Highwater\n'
 'Interface          State  resv    iption  BW          BW          '
 'BW          mark\n'
 'ae0.0                  Up       0   100%  20Gbps      20Gbps      '
 '0bps        0bps       \n'
 'ae2.1000               Up       0   100%  20Gbps      20Gbps      '
 '0bps        0bps       \n'
 'ae2.112                Up       0   100%  20Gbps      20Gbps      '
 '0bps        0bps       \n'
 'em0.0                  Up       0   100%  1000Mbps    1000Mbps    '
 '0bps        0bps       \n'
 'et-0/0/1:2.0           Up       0   100%  10Gbps      10Gbps      '
 '0bps        0bps       \n'
 'et-0/0/1:3.0           Up       1   100%  10Gbps      10Gbps      '
 '0bps        0bps       \n'
 'et-0/0/3:1.1000      Down       0   100%  10Gbps      10Gbps      '
 '0bps        0bps       \n'
 'lo0.0                  Up       0   100%  0bps        0bps        '
 '0bps        0bps       \n')
```

Storing output in variable named output:
```python
In [51]: output = ptx.send_command('show rsvp interface')

In [54]:  print(output)    
```
Output:
```
RSVP interface: 8 active
                          Active  Subscr- Static      Available   Reserved    Highwater
Interface          State  resv    iption  BW          BW          BW          mark
ae0.0                  Up       0   100%  20Gbps      20Gbps      0bps        0bps       
ae2.1000               Up       0   100%  20Gbps      20Gbps      0bps        0bps       
ae2.112                Up       0   100%  20Gbps      20Gbps      0bps        0bps       
em0.0                  Up       0   100%  1000Mbps    1000Mbps    0bps        0bps       
et-0/0/1:2.0           Up       0   100%  10Gbps      10Gbps      0bps        0bps       
et-0/0/1:3.0           Up       1   100%  10Gbps      10Gbps      0bps        0bps       
et-0/0/3:1.1000      Down       0   100%  10Gbps      10Gbps      0bps        0bps       
lo0.0                  Up       0   100%  0bps        0bps        0bps        0bps       
```
Do not forget to close or disconnect the connection with router:
```python
In [55]: ptx.disconnect()
```
