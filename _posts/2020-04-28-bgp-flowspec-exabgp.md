---
title: "BGP flowspec with exabgp"
last_modified_at: 2020-04-28T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Recently I worked on the scenario where the specific protocol on multiple routers were going down. In such scenario usual troubleshooting would focus on:
- Is CPU utilization high on control plane?
- Is there some kind of DDOS to congest specific host bound queue?
- Is there a unknown TLV or update specific protocol receiving and advertising it to all neighbor before its going down?

One more scenario that I learn during this troubleshooting was related to flowspec was detecting the attack and generating the flowspec filter related to ```224.0.0.2``` address which was causing the protocol to flap, after some time monitoring device will no longer consider it as a attacking traffic and it will remove the programing flowspec filter and protocol adjacency would come back up. 

Learning based on this debugging is to be more careful what you generate and send as flowspec filter and safeguard the router as well to avoid programing such route. 

I have seen the history of issues where flowspec filters are not cleared or updated which caused unwanted traffic filtering or filter becomes so big that the forwarding engine would spend lot of instruction just processing that filter and the line rate performance would be degraded. 

In short, BGP flowspec is good tool but while using it keep updating and maintaining it properly to avoid such protocol downtime or flap or unwanted traffic black-hole or reduction in forwarding capabilities. 

In remaining post, I will go over the configuration, verification and safeguarding the flowspec from router perspective.

In my lab testing I am using this great tool [ExaBGP](https://github.com/Exa-Networks/exabgp){:target="_blank"} to generate the flowspec update. 

I have loaded the ExaBGP tool on my lab VM which is connected to the router.

ExaBGP config to establish and generate the flowspec routes:
```
root@ubuntu:~/exabgp# cat conf3.ini 
process announce-routes {
    run /usr/bin/python3 /root/exabgp/bgproutes.py;
    encoder json;
}

neighbor 1.1.102.2 {
    local-address 1.1.102.1;
    local-as 200;
    peer-as 100;
    flow {
      route {
         match {
            destination 224.0.0.2/32;
         }
         then {
            discard;
         }
      }
      route {
         match {
            source 172.16.1.1/32;
         }
         then {
            discard;
         }
      }
      route {
         match {
            destination 172.16.2.1/32;
         }
         then {
            discard;
         }
      }   
      route {
         match {
            source 172.16.3.1/32;
            destination 172.16.4.1/32;
            protocol tcp;
         }
         then {
            discard;
         }
      }

   }
}
```
Run the exabgp with config file:
```
root@ubuntu:~/exabgp# exabgp ./conf3.ini 
08:10:20 | 25905  | welcome       | Thank you for using ExaBGP
08:10:20 | 25905  | version       | 4.2.6   
08:10:20 | 25905  | interpreter   | 3.6.9 (default, Nov  7 2019, 10:44:02)  [GCC 8.3.0]
08:10:20 | 25905  | os            | Linux ubuntu 4.15.0-29-generic #31-Ubuntu SMP Tue Jul 17 15:39:52 UTC 2018 x86_64
08:10:20 | 25905  | installation  | /usr/local
...
```
Router configuration to establish the BGP with exabgp:
```
lab@r1-re0# show protocols bgp group server                       
neighbor 1.1.102.1 {
    family inet {
        unicast;
        flow {
            no-validate my_flowspec_policy;
        }
    }
    peer-as 200;
}
```
In configuration we see the policy ```my_flowspec_policy``` and we will talk about it later. Let’s first verify the BGP neighbor state and route status on the router. 

BGP is up and running. Note the special table ```inetflow.0``` is created and populated with routes, we are receiving total of 4 routes, out of 4 we have 3 active routes:
```
lab@r1-re0# run show bgp summary 
...
1.1.102.1               200         68         64       0      23        2:51 Establ
  inet.0: 3/3/3/0
  inetflow.0: 3/4/3/0

lab@r1-re0# run show bgp neighbor 1.1.102.1 | match NLRI            
  NLRI inet-flow: No-validate [ everything ] 
  NLRI for restart configured on peer: inet-unicast inet-flow
  NLRI advertised by peer: inet-unicast inet-multicast inet-vpn-unicast inet6-unicast inet6-multicast l2vpn inet-labeled-unicast inet6-labeled-unicast inet6-vpn-unicast route-target inet-flow inet-vpn-flow inet6-flow inet6-vpn-flow evpn te-unicast
  NLRI for this session: inet-unicast inet-flow
```

Routes we received from ExaBGP server:
```  
lab@r1-re0# run show route receive-protocol bgp 1.1.102.1   

inetflow.0: 4 destinations, 4 routes (3 active, 0 holddown, 1 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
  172.16.4.1,172.16.3.1,proto=6/term:1                
*                                                                 200 I
  224.0.0.2,*/term:2                
*                                                                 200 I
  *,172.16.1.1/term:3                
*                                                                 200 I

lab@r1-re0# run show route receive-protocol bgp 1.1.102.1 extensive 
inetflow.0: 4 destinations, 4 routes (3 active, 0 holddown, 1 hidden)

* 172.16.4.1,172.16.3.1,proto=6/term:1 (1 entry, 1 announced)
     Accepted
     Flags: NoNexthop
     AS path: 200 I 
     Communities: traffic-rate:0:0

* 224.0.0.2,*/term:2 (1 entry, 1 announced)
     Accepted
     Flags: NoNexthop
     AS path: 200 I 
     Communities: traffic-rate:0:0      

* *,172.16.1.1/term:3 (1 entry, 1 announced)
     Accepted
     Flags: NoNexthop
     AS path: 200 I 
     Communities: traffic-rate:0:0
```	 
Let's verify the routes in the routing table:
```	 
lab@r1-re0# run show route table inetflow.0 extensive 

inetflow.0: 4 destinations, 4 routes (3 active, 0 holddown, 1 hidden)
172.16.4.1,172.16.3.1,proto=6/term:1 (1 entry, 1 announced)
TSI:
KRT in dfwd;
Action(s): discard,count
        *BGP    Preference: 170/-101
                Next hop type: Fictitious, Next hop index: 0
                Address: 0x71105bc
                Next-hop reference count: 4
                Next hop: 
                State: <Active Ext>
                Local AS:   100 Peer AS:   200
                Age: 2:37 
                Validation State: unverified 
                Task: BGP_200.1.1.102.1
                Announcement bits (1): 0-Flow 
                AS path: 200 I 
                Communities: traffic-rate:0:0
                Accepted
                Localpref: 100
                Router ID: 1.1.102.1

224.0.0.2,*/term:2 (1 entry, 1 announced)
TSI:
KRT in dfwd;
Action(s): discard,count
        *BGP    Preference: 170/-101
                Next hop type: Fictitious, Next hop index: 0
                Address: 0x71105bc
                Next-hop reference count: 4
                Next hop: 
                State: <Active Ext>
                Local AS:   100 Peer AS:   200
                Age: 2:37 
                Validation State: unverified 
                Task: BGP_200.1.1.102.1
                Announcement bits (1): 0-Flow 
                AS path: 200 I 
                Communities: traffic-rate:0:0
                Accepted
                Localpref: 100          
                Router ID: 1.1.102.1

*,172.16.1.1/term:3 (1 entry, 1 announced)
TSI:
KRT in dfwd;
Action(s): discard,count
        *BGP    Preference: 170/-101
                Next hop type: Fictitious, Next hop index: 0
                Address: 0x71105bc
                Next-hop reference count: 4
                Next hop: 
                State: <Active Ext>
                Local AS:   100 Peer AS:   200
                Age: 2:37 
                Validation State: unverified 
                Task: BGP_200.1.1.102.1
                Announcement bits (1): 0-Flow 
                AS path: 200 I 
                Communities: traffic-rate:0:0
                Accepted
                Localpref: 100
                Router ID: 1.1.102.1	 
```
There is one hidden route as well and that is due to the policy that we have created. 
```
lab@r1-re0# run show route table inetflow.0 extensive hidden 

inetflow.0: 4 destinations, 4 routes (3 active, 0 holddown, 1 hidden)
172.16.2.1,*/term:N/A (1 entry, 0 announced)
         BGP                 /-101
                Next hop type: Fictitious, Next hop index: 0
                Address: 0x71105bc
                Next-hop reference count: 4
                Next hop: 
                State: <Hidden Ext>
                Local AS:   100 Peer AS:   200
                Age: 13:59 
                Validation State: unverified 
                Task: BGP_200.1.1.102.1
                AS path: 200 I 
                Communities: traffic-rate:0:0
                Validation state: Reject, Originator: 1.1.102.1, Nbr AS: 200
                Via: 0.0.0.0/0, Active
                Localpref: 100
                Router ID: 1.1.102.1
                Hidden reason: Flow-route fails validation
```				
Here is the policy configuration which is blocking the ```172.16.2.1``` prefix.
```
lab@r1-re0# show policy-options policy-statement my_flowspec_policy 
term 1 {
    from {
        route-filter 172.16.2.1/32 exact;
    }
    then reject;
}
term 2 {
    then accept;
}				
```

With all above, our flowspec filter is programming looks like this:
```
lab@r1-re0# run show firewall filter __flowspec_default_inet__ 

Filter: __flowspec_default_inet__                              
Counters:
Name                                                Bytes              Packets
*,172.16.1.1                                            0                    0
172.16.4.1,172.16.3.1,proto=6                           0                    0
224.0.0.2,*                                          2590                   37


lab@r1-re0# run show firewall filter __flowspec_default_inet__    

Filter: __flowspec_default_inet__                              
Counters:
Name                                                Bytes              Packets
*,172.16.1.1                                            0                    0
172.16.4.1,172.16.3.1,proto=6                           0                    0
224.0.0.2,*                                          2660                   38				
```
In above output, you can see we have programmed the three combination to drop various kind of traffic and ```172.16.2.1``` is not program as filter term due to the policy which is blocking. 

The interesting observation is about the ```224.0.0.2,*``` entry, I can see the counter is incrementing. ```224.0.0.2``` is reserved address for all router multicast address and used by many protocol to send the keep alive so if I advertise the flowspec route to block that address, some of the control protocol traffic will be drop and adjacency will time out so we need to be very careful.

Flow detective device can work mechanically and push such update, however we can take an extra precaution to safeguard and block such updates on router itself and the policy we used ```my_flowspec_policy``` will come to rescue. 

In the lab we will insert one more term to reject the ```224.0.0.2``` in flowspec update:
```
lab@r1-re0# show policy-options policy-statement my_flowspec_policy 
term 1 {
    from {
        route-filter 172.16.2.1/32 exact;
    }
    then reject;
}
term 2 {   <<<<<
    from {
        route-filter 224.0.0.2/32 exact;
    }
    then reject;
}
term 3 {
    then accept;
}
```
After modifying the policy, we can see that we are not installing the ```224.0.0.2``` flowspec route in ```inetflow.0``` table as well as we are not programing the term in flowspec filter. 
```
[edit]
lab@r1-re0# run show route table inetflow.0                            

inetflow.0: 4 destinations, 4 routes (2 active, 0 holddown, 2 hidden)
+ = Active Route, - = Last Active, * = Both

172.16.4.1,172.16.3.1,proto=6/term:1            
                   *[BGP/170] 00:14:36, localpref 100, from 1.1.102.1
                      AS path: 200 I, validation-state: unverified
                      Fictitious
*,172.16.1.1/term:2            
                   *[BGP/170] 00:14:36, localpref 100, from 1.1.102.1
                      AS path: 200 I, validation-state: unverified
                      Fictitious

[edit]
lab@r1-re0# run show firewall filter __flowspec_default_inet__ 

Filter: __flowspec_default_inet__                              
Counters:
Name                                                Bytes              Packets
*,172.16.1.1                                            0                    0
172.16.4.1,172.16.3.1,proto=6                           0                    0
```
Just for documentation I ahve included the BGP traceoptions here to see how the update looks like:
```
Apr 28 08:14:53.949946 BGP RECV 1.1.102.1+46279 -> 1.1.102.2+179
Apr 28 08:14:53.949951 BGP RECV message type 2 (Update) length 62
Apr 28 08:14:53.949955 BGP RECV Update PDU length 62
Apr 28 08:14:53.949959 BGP RECV flags 0x40 code Origin(1): IGP
Apr 28 08:14:53.949969 BGP RECV flags 0x40 code ASPath(2) length 6: 200
Apr 28 08:14:53.949977 BGP RECV flags 0xc0 code Extended Communities(16): 8006:0:0
Apr 28 08:14:53.949981 BGP RECV flags 0x80 code MP_reach(14): AFI/SAFI 1/133
Apr 28 08:14:53.949998 BGP RECV         224.0.0.2,*/48
Apr 28 08:14:53.950033 bgp_rcv_nlri: Peer 1.1.102.1 (External AS 200)
Apr 28 08:14:53.950040 bgp_rcv_nlri: 224.0.0.2,*/48
Apr 28 08:14:54.050176 
Apr 28 08:14:54.050176 BGP RECV 1.1.102.1+46279 -> 1.1.102.2+179
Apr 28 08:14:54.050188 BGP RECV message type 2 (Update) length 62
Apr 28 08:14:54.050190 BGP RECV Update PDU length 62
Apr 28 08:14:54.050192 BGP RECV flags 0x40 code Origin(1): IGP
Apr 28 08:14:54.050199 BGP RECV flags 0x40 code ASPath(2) length 6: 200
Apr 28 08:14:54.050205 BGP RECV flags 0xc0 code Extended Communities(16): 8006:0:0
Apr 28 08:14:54.050208 BGP RECV flags 0x80 code MP_reach(14): AFI/SAFI 1/133
Apr 28 08:14:54.050219 BGP RECV         *,172.16.1.1/48
Apr 28 08:14:54.050238 bgp_rcv_nlri: Peer 1.1.102.1 (External AS 200)
Apr 28 08:14:54.050242 bgp_rcv_nlri: *,172.16.1.1/48
Apr 28 08:14:54.050277 
Apr 28 08:14:54.050277 BGP RECV 1.1.102.1+46279 -> 1.1.102.2+179
Apr 28 08:14:54.050280 BGP RECV message type 2 (Update) length 62
Apr 28 08:14:54.050282 BGP RECV Update PDU length 62
Apr 28 08:14:54.050284 BGP RECV flags 0x40 code Origin(1): IGP
Apr 28 08:14:54.050291 BGP RECV flags 0x40 code ASPath(2) length 6: 200
Apr 28 08:14:54.050302 BGP RECV flags 0xc0 code Extended Communities(16): 8006:0:0
Apr 28 08:14:54.050305 BGP RECV flags 0x80 code MP_reach(14): AFI/SAFI 1/133
Apr 28 08:14:54.050314 BGP RECV         172.16.2.1,*/48
Apr 28 08:14:54.050328 bgp_rcv_nlri: Peer 1.1.102.1 (External AS 200)
Apr 28 08:14:54.050332 bgp_rcv_nlri: 172.16.2.1,*/48
Apr 28 08:14:54.050364 
Apr 28 08:14:54.050364 BGP RECV 1.1.102.1+46279 -> 1.1.102.2+179
Apr 28 08:14:54.050371 BGP RECV message type 2 (Update) length 71
Apr 28 08:14:54.050373 BGP RECV Update PDU length 71
Apr 28 08:14:54.050375 BGP RECV flags 0x40 code Origin(1): IGP
Apr 28 08:14:54.050382 BGP RECV flags 0x40 code ASPath(2) length 6: 200
Apr 28 08:14:54.050387 BGP RECV flags 0xc0 code Extended Communities(16): 8006:0:0
Apr 28 08:14:54.050393 BGP RECV flags 0x80 code MP_reach(14): AFI/SAFI 1/133
Apr 28 08:14:54.050405 BGP RECV         172.16.4.1,172.16.3.1,proto=6/120
Apr 28 08:14:54.050427 bgp_rcv_nlri: Peer 1.1.102.1 (External AS 200)
Apr 28 08:14:54.050432 bgp_rcv_nlri: 172.16.4.1,172.16.3.1,proto=6/120
```

This is just my observation and way to safeguard from flowspec misbehaving or misconfiguration event.
