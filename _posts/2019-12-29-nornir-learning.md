---
title: "NORNIR automation learning"
last_modified_at: 2016-12-29T22:00:00-00:00
categories:
  - Blog
tags:
  - - [Networking,NetOps]
---

Trying out the NORNIR network automation and documenting few way to capture data from networking devices.

```python
#Required imports
from nornir import InitNornir
from nornir.plugins.tasks.networking import netmiko_send_command
from nornir.plugins.tasks.networking import napalm_get, napalm_cli
from nornir.plugins.functions.text import print_result
from pprint import pprint as pprint
```


```python
'''
Create nornir object which will use the hosts.yaml and 
groups.yaml files to 
'''
nr = InitNornir()
```


```python
print(nr.inventory.hosts)
print(nr.inventory.groups)
```
###Output:  
	{'r1': Host: r1}
	{'mylab': Group: mylab}


```python
result = nr.run(
    task=netmiko_send_command,
    command_string="show bgp summary"
)

print_result(result)      
```
###Output:  
	netmiko_send_command************************************************************
	* r1 ** changed : False ********************************************************
	vvvv netmiko_send_command ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO

	Groups: 4 Peers: 5 Down peers: 3
	Table          Tot Paths  Act Paths Suppressed    History Damp State    Pending
	inet.0               
						   0          0          0          0          0          0
	bgp.l3vpn.0          
						   2          2          0          0          0          0
	bgp.l2vpn.0          
						   0          0          0          0          0          0
	bgp.evpn.0           
						   0          0          0          0          0          0
	bgp.mvpn.0           
						   0          0          0          0          0          0
	bgp.mdt.0            
						   0          0          0          0          0          0
	inet6.0              
						   0          0          0          0          0          0
	Peer                     AS      InPkt     OutPkt    OutQ   Flaps Last Up/Dwn State|#Active/Received/Accepted/Damped...
	1.1.11.2                200          0          0       0       0 1w3d 8:25:11 Idle  
	2.1.1.2                 200          0          0       0       0 1w3d 8:25:11 Idle  
	192.168.1.2             100     102189     102311       0       2  3d 5:04:01 Establ
	  inet.0: 0/0/0/0
	  bgp.l3vpn.0: 1/1/1/0
	  bgp.l2vpn.0: 0/0/0/0
	  bgp.evpn.0: 0/0/0/0
	  bgp.mvpn.0: 0/0/0/0
	  bgp.mdt.0: 0/0/0/0
	  mvpn.inet.0: 1/1/1/0
	192.168.200.1           100     103606     103169       0       1  3d 5:42:45 Establ
	  inet.0: 0/0/0/0
	  bgp.l3vpn.0: 1/1/1/0
	  bgp.l2vpn.0: 0/0/0/0
	  bgp.evpn.0: 0/0/0/0
	  bgp.mvpn.0: 0/0/0/0
	  bgp.mdt.0: 0/0/0/0
	  mvpn.inet.0: 1/1/1/0
	2001:1:1::1               1          0          0       0       0 1w3d 8:25:11 Idle  

	^^^^ END netmiko_send_command ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

```python
result = nr.run(
             napalm_cli,
             commands=['show system processes extensive | match rpd', 'show system processes extensive | match mem'])

print_result(result)

```
###Output:  
	napalm_cli**********************************************************************
	* r1 ** changed : False ********************************************************
	vvvv napalm_cli ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO
	{ 'show system processes extensive | match mem': 'Mem: 146M Active, 3462M '
													 'Inact, 927M Wired, 530M Buf, '
													 '11G Free',
	  'show system processes extensive | match rpd': '96074 root      20    0  '
													 '1152M   176M kqread  1   '
													 '7:58   0.00% rpd{rpd}\n'
													 '96074 root      20    0  '
													 '1152M   176M kqread  0   '
													 '7:37   0.00% '
													 'rpd{TraceThread}\n'
													 '96074 root      20    0  '
													 '1152M   176M kqread  1   '
													 '1:27   0.00% rpd{rsvp-io}\n'
													 '96074 root      20    0  '
													 '1152M   176M kqread  1   '
													 '1:11   0.00% '
													 'rpd{bgpio-0-th}\n'
													 '96074 root      20    0  '
													 '1152M   176M kqread  0   '
													 '0:09   0.00% rpd{krtio-th}'}
	^^^^ END napalm_cli ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

```python
print(type(result))
```
###Output:  
<class 'nornir.core.task.AggregatedResult'>



```python
cmd = "show version"
result = nr.run(
             napalm_get,
             getters = ['bgp_neighbors'])

print_result(result)
```
###Output:  
	napalm_get**********************************************************************
	* r1 ** changed : False ********************************************************
	vvvv napalm_get ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO
	{ 'bgp_neighbors': { 'global': { 'peers': { '1.1.11.2': { 'address_family': { 'ipv4': { 'accepted_prefixes': -1,
																							'received_prefixes': -1,
																							'sent_prefixes': -1},
																				  'ipv6': { 'accepted_prefixes': -1,
																							'received_prefixes': -1,
																							'sent_prefixes': -1}},
															  'description': '',
															  'is_enabled': True,
															  'is_up': False,
															  'local_as': 100,
															  'remote_as': 200,
															  'remote_id': '',
															  'uptime': 894325},
												'192.168.1.2': { 'address_family': { 'ipv4': { 'accepted_prefixes': 0,
																							   'received_prefixes': 0,
																							   'sent_prefixes': 1},
																					 'ipv6': { 'accepted_prefixes': -1,
																							   'received_prefixes': -1,
																							   'sent_prefixes': -1}},
																 'description': '',
																 'is_enabled': True,
																 'is_up': True,
																 'local_as': 100,
																 'remote_as': 100,
																 'remote_id': '192.168.1.2',
																 'uptime': 277455},
												'192.168.200.1': { 'address_family': { 'ipv4': { 'accepted_prefixes': 0,
																								 'received_prefixes': 0,
																								 'sent_prefixes': 1},
																					   'ipv6': { 'accepted_prefixes': -1,
																								 'received_prefixes': -1,
																								 'sent_prefixes': -1}},
																   'description': '',
																   'is_enabled': True,
																   'is_up': True,
																   'local_as': 100,
																   'remote_as': 100,
																   'remote_id': '192.168.200.1',
																   'uptime': 279779},
												'2001:1:1::1': { 'address_family': { 'ipv4': { 'accepted_prefixes': -1,
																							   'received_prefixes': -1,
																							   'sent_prefixes': -1},
																					 'ipv6': { 'accepted_prefixes': -1,
																							   'received_prefixes': -1,
																							   'sent_prefixes': -1}},
																 'description': '',
																 'is_enabled': True,
																 'is_up': False,
																 'local_as': 100,
																 'remote_as': 1,
																 'remote_id': '',
																 'uptime': 894325}},
									 'router_id': ''},
						 'mvpn': { 'peers': { '2.1.1.2': { 'address_family': { 'ipv4': { 'accepted_prefixes': -1,
																						 'received_prefixes': -1,
																						 'sent_prefixes': -1},
																			   'ipv6': { 'accepted_prefixes': -1,
																						 'received_prefixes': -1,
																						 'sent_prefixes': -1}},
														   'description': '',
														   'is_enabled': True,
														   'is_up': False,
														   'local_as': 100,
														   'remote_as': 200,
														   'remote_id': '',
														   'uptime': 894325}},
								   'router_id': ''}}}
	^^^^ END napalm_get ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

```python
print(result)
```
###Output:  
    AggregatedResult (napalm_get): {'r1': MultiResult: [Result: "napalm_get"]}

```python
print(type((result['r1'][0].result)))
print((((result['r1'][0].result)['bgp_neighbors'])).keys())
pprint((((result['r1'][0].result)['bgp_neighbors']))['mvpn'])
```
###Output:  
	<class 'dict'>
	dict_keys(['global', 'mvpn'])
	{'peers': {'2.1.1.2': {'address_family': {'ipv4': {'accepted_prefixes': -1,
													   'received_prefixes': -1,
													   'sent_prefixes': -1},
											  'ipv6': {'accepted_prefixes': -1,
													   'received_prefixes': -1,
													   'sent_prefixes': -1}},
						   'description': '',
						   'is_enabled': True,
						   'is_up': False,
						   'local_as': 100,
						   'remote_as': 200,
						   'remote_id': '',
						   'uptime': 894325}},
	 'router_id': ''}