---
title: "NORNIR automation learning"
last_modified_at: 2016-12-29T22:00:00-00:00
categories:
  - Blog
tags:
  - - [Networking,NetOps]
---

NORNIR for JUNOS device  
Devang patel  
NetOps


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

    {'r1': Host: r1}[0m
    [0m{'mylab': Group: mylab}[0m
    [0m


```python
result = nr.run(
    task=netmiko_send_command,
    command_string="show bgp summary"
)

print_result(result)      
```

    [1m[36mnetmiko_send_command************************************************************[0m
    [0m[1m[34m* r1 ** changed : False ********************************************************[0m
    [0m[1m[32mvvvv netmiko_send_command ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO[0m
    [0m
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
    [0m
    [0m[1m[32m^^^^ END netmiko_send_command ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[0m
    [0m


```python
result = nr.run(
             napalm_cli,
             commands=['show system processes extensive | match rpd', 'show system processes extensive | match mem'])

print_result(result)

```

    [1m[36mnapalm_cli**********************************************************************[0m
    [0m[1m[34m* r1 ** changed : False ********************************************************[0m
    [0m[1m[32mvvvv napalm_cli ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO[0m
    [0m{[0m [0m'show system processes extensive | match mem'[0m: [0m'Mem: 146M Active, 3462M '[0m
                                                     [0m'Inact, 927M Wired, 530M Buf, '[0m
                                                     [0m'11G Free'[0m,
      [0m'show system processes extensive | match rpd'[0m: [0m'96074 root      20    0  '[0m
                                                     [0m'1152M   176M kqread  1   '[0m
                                                     [0m'7:58   0.00% rpd{rpd}\n'[0m
                                                     [0m'96074 root      20    0  '[0m
                                                     [0m'1152M   176M kqread  0   '[0m
                                                     [0m'7:37   0.00% '[0m
                                                     [0m'rpd{TraceThread}\n'[0m
                                                     [0m'96074 root      20    0  '[0m
                                                     [0m'1152M   176M kqread  1   '[0m
                                                     [0m'1:27   0.00% rpd{rsvp-io}\n'[0m
                                                     [0m'96074 root      20    0  '[0m
                                                     [0m'1152M   176M kqread  1   '[0m
                                                     [0m'1:11   0.00% '[0m
                                                     [0m'rpd{bgpio-0-th}\n'[0m
                                                     [0m'96074 root      20    0  '[0m
                                                     [0m'1152M   176M kqread  0   '[0m
                                                     [0m'0:09   0.00% rpd{krtio-th}'[0m}[0m
    [0m[1m[32m^^^^ END napalm_cli ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[0m
    [0m


```python
type(result)
```




    nornir.core.task.AggregatedResult




```python
cmd = "show version"
result = nr.run(
             napalm_get,
             getters = ['bgp_neighbors'])

print_result(result)
```

    [1m[36mnapalm_get**********************************************************************[0m
    [0m[1m[34m* r1 ** changed : False ********************************************************[0m
    [0m[1m[32mvvvv napalm_get ** changed : False vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv INFO[0m
    [0m{[0m [0m'bgp_neighbors'[0m: [0m{[0m [0m'global'[0m: [0m{[0m [0m'peers'[0m: [0m{[0m [0m'1.1.11.2'[0m: [0m{[0m [0m'address_family'[0m: [0m{[0m [0m'ipv4'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                            [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                            [0m'sent_prefixes'[0m: [0m-1[0m}[0m,
                                                                                  [0m'ipv6'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                            [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                            [0m'sent_prefixes'[0m: [0m-1[0m}[0m}[0m,
                                                              [0m'description'[0m: [0m''[0m,
                                                              [0m'is_enabled'[0m: [0mTrue[0m,
                                                              [0m'is_up'[0m: [0mFalse[0m,
                                                              [0m'local_as'[0m: [0m100[0m,
                                                              [0m'remote_as'[0m: [0m200[0m,
                                                              [0m'remote_id'[0m: [0m''[0m,
                                                              [0m'uptime'[0m: [0m894325[0m}[0m,
                                                [0m'192.168.1.2'[0m: [0m{[0m [0m'address_family'[0m: [0m{[0m [0m'ipv4'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m0[0m,
                                                                                               [0m'received_prefixes'[0m: [0m0[0m,
                                                                                               [0m'sent_prefixes'[0m: [0m1[0m}[0m,
                                                                                     [0m'ipv6'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                               [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                               [0m'sent_prefixes'[0m: [0m-1[0m}[0m}[0m,
                                                                 [0m'description'[0m: [0m''[0m,
                                                                 [0m'is_enabled'[0m: [0mTrue[0m,
                                                                 [0m'is_up'[0m: [0mTrue[0m,
                                                                 [0m'local_as'[0m: [0m100[0m,
                                                                 [0m'remote_as'[0m: [0m100[0m,
                                                                 [0m'remote_id'[0m: [0m'192.168.1.2'[0m,
                                                                 [0m'uptime'[0m: [0m277455[0m}[0m,
                                                [0m'192.168.200.1'[0m: [0m{[0m [0m'address_family'[0m: [0m{[0m [0m'ipv4'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m0[0m,
                                                                                                 [0m'received_prefixes'[0m: [0m0[0m,
                                                                                                 [0m'sent_prefixes'[0m: [0m1[0m}[0m,
                                                                                       [0m'ipv6'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                                 [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                                 [0m'sent_prefixes'[0m: [0m-1[0m}[0m}[0m,
                                                                   [0m'description'[0m: [0m''[0m,
                                                                   [0m'is_enabled'[0m: [0mTrue[0m,
                                                                   [0m'is_up'[0m: [0mTrue[0m,
                                                                   [0m'local_as'[0m: [0m100[0m,
                                                                   [0m'remote_as'[0m: [0m100[0m,
                                                                   [0m'remote_id'[0m: [0m'192.168.200.1'[0m,
                                                                   [0m'uptime'[0m: [0m279779[0m}[0m,
                                                [0m'2001:1:1::1'[0m: [0m{[0m [0m'address_family'[0m: [0m{[0m [0m'ipv4'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                               [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                               [0m'sent_prefixes'[0m: [0m-1[0m}[0m,
                                                                                     [0m'ipv6'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                               [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                               [0m'sent_prefixes'[0m: [0m-1[0m}[0m}[0m,
                                                                 [0m'description'[0m: [0m''[0m,
                                                                 [0m'is_enabled'[0m: [0mTrue[0m,
                                                                 [0m'is_up'[0m: [0mFalse[0m,
                                                                 [0m'local_as'[0m: [0m100[0m,
                                                                 [0m'remote_as'[0m: [0m1[0m,
                                                                 [0m'remote_id'[0m: [0m''[0m,
                                                                 [0m'uptime'[0m: [0m894325[0m}[0m}[0m,
                                     [0m'router_id'[0m: [0m''[0m}[0m,
                         [0m'mvpn'[0m: [0m{[0m [0m'peers'[0m: [0m{[0m [0m'2.1.1.2'[0m: [0m{[0m [0m'address_family'[0m: [0m{[0m [0m'ipv4'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                         [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                         [0m'sent_prefixes'[0m: [0m-1[0m}[0m,
                                                                               [0m'ipv6'[0m: [0m{[0m [0m'accepted_prefixes'[0m: [0m-1[0m,
                                                                                         [0m'received_prefixes'[0m: [0m-1[0m,
                                                                                         [0m'sent_prefixes'[0m: [0m-1[0m}[0m}[0m,
                                                           [0m'description'[0m: [0m''[0m,
                                                           [0m'is_enabled'[0m: [0mTrue[0m,
                                                           [0m'is_up'[0m: [0mFalse[0m,
                                                           [0m'local_as'[0m: [0m100[0m,
                                                           [0m'remote_as'[0m: [0m200[0m,
                                                           [0m'remote_id'[0m: [0m''[0m,
                                                           [0m'uptime'[0m: [0m894325[0m}[0m}[0m,
                                   [0m'router_id'[0m: [0m''[0m}[0m}[0m}[0m
    [0m[1m[32m^^^^ END napalm_get ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[0m
    [0m


```python
print(result)
```

    AggregatedResult (napalm_get): {'r1': MultiResult: [Result: "napalm_get"]}[0m
    [0m


```python
print(type((result['r1'][0].result)))
print((((result['r1'][0].result)['bgp_neighbors'])).keys())
pprint((((result['r1'][0].result)['bgp_neighbors']))['mvpn'])
```

    <class 'dict'>[0m
    [0mdict_keys(['global', 'mvpn'])[0m
    [0m{[0m'peers'[0m: [0m{[0m'2.1.1.2'[0m: [0m{[0m'address_family'[0m: [0m{[0m'ipv4'[0m: [0m{[0m'accepted_prefixes'[0m: [0m-1[0m,
                                                       [0m'received_prefixes'[0m: [0m-1[0m,
                                                       [0m'sent_prefixes'[0m: [0m-1[0m}[0m,
                                              [0m'ipv6'[0m: [0m{[0m'accepted_prefixes'[0m: [0m-1[0m,
                                                       [0m'received_prefixes'[0m: [0m-1[0m,
                                                       [0m'sent_prefixes'[0m: [0m-1[0m}[0m}[0m,
                           [0m'description'[0m: [0m''[0m,
                           [0m'is_enabled'[0m: [0mTrue[0m,
                           [0m'is_up'[0m: [0mFalse[0m,
                           [0m'local_as'[0m: [0m100[0m,
                           [0m'remote_as'[0m: [0m200[0m,
                           [0m'remote_id'[0m: [0m''[0m,
                           [0m'uptime'[0m: [0m894325[0m}[0m}[0m,
     [0m'router_id'[0m: [0m''[0m}[0m
    [0m
