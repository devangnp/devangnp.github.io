---
title: "Dynamic Tunnels - MPLS RSVP TE based"
last_modified_at: 2020-05-08T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Configuration management is a one of the trickier part when it comes to scale environment. Its becomes even more cumbersome to manage when it has a requirement of establishing the full mesh. Today I am going to talk about such one topic, its MPLS LSP configuration. 

If you are using the MPLS LSP in your core, it requires to be of full mesh or single hop based on you network design. You may end up configuring many lines of configuration based on how many routers are there in that full mesh topology. 

There is a simple configuration option available in JUNOS to signal LSPs to all the peers you are interested in just few configuration lines, its dynamic-tunnel configuration under routing-option hierarchy. 

In IP address management, there is a separate subnet or pool kept on side to allocate the loopback address on the routers. You can use that whole pool and instruct the ingress router to signal the P2P LSPs to all other PEs or peers. 

To explain it further, I am using the same topology used in Overload bit blog post. 

![Lab Topology](/assets/images/2020-04-30-overload-bit.jpg)

In above topology, R2 is my DUT and I want to signal the LSP to R6 and R5 using dynamic-tunnel configuration. 

To configure the RSVP TE based dynamic-tunnel, you can use the customized template or default template. I will use and define the customized template under protocol mpls stanza with just basic configuration as shown below which I will reference in my RSVP-TE based dynamic-tunnel configuration. I 
```
root@r2# show protocols mpls 
traffic-engineering {
    mpls-forwarding;
}
label-switched-path my-dynamic-lsp-template {
    template;
    adaptive;
}
label-switched-path my-dynamic-lsp-template1 {
    template;
    adaptive;
}
```

Now let’s use above template in dynamic-tunnel configuration and define the subnet or specific IP or group of IPs under specific dynamic-tunnel name to signal the actual LSPs. 
```
root@r2# show routing-options dynamic-tunnels 
my-dynamic-tunnel {
    rsvp-te my-dynamic-rsvp-te {
        label-switched-path-template {
            my-dynamic-lsp-template;
        }
        destination-networks {
            192.168.1.6/32;
        }
    }
}
```

As you can see in following template, I have configured the R5 and R6 loopback address under same dynamic-tunnel stanza so RSVP module use the LSP parameters from the template ```my-dynamic-lsp-template``` and destination or to address from the ```destination-networks``` stanza. 
```
my-dynamic-tunnel1 {
    rsvp-te my-dynamic-rsvp-te1 {
        label-switched-path-template {
            my-dynamic-lsp-template;
        }
        destination-networks {
            192.168.1.6/32;
            192.168.1.5/32;			
        }
    }
}
```
Let's verify if LSPs are being signaled and they are up and running, lets pick the name of one of the LSP signaled ```192.168.1.5:dt-rsvp-my-dynamic-tunnel1``` and it is matching the dynamic tunnel name configured ```my-dynamic-tunnel1``` with ```dt-rsvp-``` prepended to identify the tunnels are dynamic-tunnel and signaling protocol is RSVP: 
```
root@r2# run show mpls lsp ingress               
Ingress LSP: 3 sessions
To              From            State Rt P     ActivePath       LSPname
192.168.1.5     192.168.1.2     Up     0 *                      192.168.1.5:dt-rsvp-my-dynamic-tunnel1
192.168.1.6     192.168.1.2     Up     0 *                      192.168.1.6:dt-rsvp-my-dynamic-tunnel
192.168.1.6     192.168.1.2     Up     0 *                      192.168.1.6:dt-rsvp-my-dynamic-tunnel1
Total 3 displayed, Up 3, Down 0


[edit]
root@r2# run show rsvp session ingress 
Ingress RSVP: 3 sessions
To              From            State   Rt Style Labelin Labelout LSPname 
192.168.1.5     192.168.1.2     Up       0  1 SE       -    16869 192.168.1.5:dt-rsvp-my-dynamic-tunnel1
192.168.1.6     192.168.1.2     Up       0  1 SE       -    16867 192.168.1.6:dt-rsvp-my-dynamic-tunnel
192.168.1.6     192.168.1.2     Up       0  1 SE       -    16868 192.168.1.6:dt-rsvp-my-dynamic-tunnel1
Total 3 displayed, Up 3, Down 0
```

In above example, I configured ```192.168.1.6``` two times to cover the RSVP LSP ECMP scenario, R2 has signaled two dynamic LSPs to R6, one using ```my-dynamic-tunnel``` and another using ```my-dynamic-tunnel1``` dynamic-tunnel configuration.

As you can see the R6's loopback is reachable via two dynamic LSP for ECMP load balancing. 

```
root@r2# run show route 192.168.1.6    

inet.0: 30 destinations, 36 routes (30 active, 0 holddown, 0 hidden)
@ = Routing Use Only, # = Forwarding Use Only
+ = Active Route, - = Last Active, * = Both

192.168.1.6/32     @[IS-IS/18] 00:03:23, metric 30
                    > to 1.1.23.2 via ge-0/0/1.23
                   #[RSVP/7/3] 00:03:23, metric 30
                      to 1.1.23.2 via ge-0/0/1.23, label-switched-path 192.168.1.6:dt-rsvp-my-dynamic-tunnel
                    > to 1.1.23.2 via ge-0/0/1.23, label-switched-path 192.168.1.6:dt-rsvp-my-dynamic-tunnel1
                    [LDP/9] 00:03:23, metric 1
                    > to 1.1.23.2 via ge-0/0/1.23, Push 16866

inet.3: 4 destinations, 6 routes (4 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.6/32     *[RSVP/7/3] 00:03:23, metric 30
                      to 1.1.23.2 via ge-0/0/1.23, label-switched-path 192.168.1.6:dt-rsvp-my-dynamic-tunnel
                    > to 1.1.23.2 via ge-0/0/1.23, label-switched-path 192.168.1.6:dt-rsvp-my-dynamic-tunnel1
                    [LDP/9] 00:03:23, metric 1
                    > to 1.1.23.2 via ge-0/0/1.23, Push 16866
                    [Tunnel/305] 10:32:11
                      Tunnel
```

Forwarding path is also configured with the multiple ECMP paths to reach R6 from R2:

```
root@r2# run show route forwarding-table destination 192.168.1.6 table default 
Routing table: default.inet
Internet:
Enabled protocols: Bridging, 
Destination        Type RtRef Next hop           Type Index    NhRef Netif
192.168.1.6/32     user     0                    ulst  1048578     2
                              1.1.23.2          Push 16867      637     2 ge-0/0/1.23
                              1.1.23.2          Push 16868      638     2 ge-0/0/1.23

[edit]
root@r2# run show route forwarding-table destination 192.168.1.6 table default extensive 
Routing table: default.inet [Index 0] 
Internet:
Enabled protocols: Bridging, 
    
Destination:  192.168.1.6/32
  Route type: user                  
  Route reference: 0                   Route interface-index: 0   
  Multicast RPF nh index: 0             
  P2mpidx: 0              
  Flags: sent to PFE, rt nh decoupled  
  Next-hop type: unilist               Index: 1048578  Reference: 2    
  Nexthop: 1.1.23.2
  Next-hop type: Push 16867            Index: 637      Reference: 2    
  Load Balance Label: None              
  Next-hop interface: ge-0/0/1.23   Weight: 0x1  
  Nexthop: 1.1.23.2
  Next-hop type: Push 16868            Index: 638      Reference: 2    
  Load Balance Label: None              
  Next-hop interface: ge-0/0/1.23   Weight: 0x1  

```
For reference, I have captured the rsvp session and mpls LSP extensive outputs:

#### RSVP session extensive output
```
[edit]
root@r2# run show rsvp session ingress extensive 
Ingress RSVP: 2 sessions

192.168.1.6
  From: 192.168.1.2, LSPstate: Up, ActiveRoute: 0
  LSPname: 192.168.1.6:dt-rsvp-my-dynamic-tunnel, LSPpath: Primary
  LSPtype: Dynamic Configured    <<<<< indicates dynamically configured
  Suggested label received: -, Suggested label sent: -
  Recovery label received: -, Recovery label sent: 16867
  Resv style: 1 SE, Label in: -, Label out: 16867
  Time left:    -, Since: Thu May  7 21:08:28 2020
  Tspec: rate 0bps size 0bps peak Infbps m 20 M 1500
  Port number: sender 2 receiver 37876 protocol 0
  Enhanced FRR: Enabled (Downstream)
  PATH rcvfrom: localclient 
  Adspec: sent MTU 1500
  Path MTU: received 1500
  PATH sentto: 1.1.23.2 (ge-0/0/1.23) 2 pkts
       outgoing message state: refreshing, Message ID: 22531, Epoch: 4961110
  RESV rcvfrom: 1.1.23.2 (ge-0/0/1.23) 2 pkts, Entropy label: Yes
       incoming message handle: R-23832/2, Message ID: 56575, Epoch: 7352319
  Explct route: 1.1.23.2 1.1.35.2 1.1.56.2 
  Record route: <self> 1.1.23.2 1.1.35.2 1.1.56.2  

192.168.1.6
  From: 192.168.1.2, LSPstate: Up, ActiveRoute: 0
  LSPname: 192.168.1.6:dt-rsvp-my-dynamic-tunnel1, LSPpath: Primary
  LSPtype: Dynamic Configured    <<<<< indicates dynamically configured
  Suggested label received: -, Suggested label sent: -
  Recovery label received: -, Recovery label sent: 16868
  Resv style: 1 SE, Label in: -, Label out: 16868
  Time left:    -, Since: Thu May  7 21:09:52 2020
  Tspec: rate 0bps size 0bps peak Infbps m 20 M 1500
  Port number: sender 1 receiver 37877 protocol 0
  Enhanced FRR: Enabled (Downstream)
  PATH rcvfrom: localclient 
  Adspec: sent MTU 1500
  Path MTU: received 1500
  PATH sentto: 1.1.23.2 (ge-0/0/1.23) 2 pkts
       outgoing message state: refreshing, Message ID: 22532, Epoch: 4961110
  RESV rcvfrom: 1.1.23.2 (ge-0/0/1.23) 2 pkts, Entropy label: Yes
       incoming message handle: R-23833/2, Message ID: 56576, Epoch: 7352319
  Explct route: 1.1.23.2 1.1.35.2 1.1.56.2 
  Record route: <self> 1.1.23.2 1.1.35.2 1.1.56.2  
Total 2 displayed, Up 2, Down 0
```
#### MPLS LSP extensive output
```
root@r2# run show mpls lsp ingress extensive 
Ingress LSP: 2 sessions

192.168.1.6
  From: 192.168.1.2, State: Up, ActiveRoute: 0, LSPname: 192.168.1.6:dt-rsvp-my-dynamic-tunnel
  ActivePath:  (primary)
  LSPtype: Dynamic Configured, Penultimate hop popping    <<<<< indicates dynamically configured
  LoadBalance: Random
  Follow destination IGP metric
  Encoding type: Packet, Switching type: Packet, GPID: IPv4
  LSP Self-ping Status : Enabled
 *Primary                    State: Up
    Priorities: 7 0
    SmartOptimizeTimer: 180
    Flap Count: 0
    MBB Count: 0
    Computed ERO (S [L] denotes strict [loose] hops): (CSPF metric: 30)
 1.1.23.2 S 1.1.35.2 S 1.1.56.2 S 
    Received RRO (ProtectionFlag 1=Available 2=InUse 4=B/W 8=Node 10=SoftPreempt 20=Node-ID):
          1.1.23.2(Label=16867) 1.1.35.2(Label=31263) 1.1.56.2(Label=3)
   15 May  8 07:26:50.508 CSPF: computation result accepted  1.1.23.2 1.1.35.2 1.1.56.2
   14 May  7 21:08:29.670 Self-ping ended successfully
   13 May  7 21:08:29.224 Selected as active path
   12 May  7 21:08:29.222 Up
   11 May  7 21:08:29.222 Self-ping started
   10 May  7 21:08:29.222 Self-ping enqueued
    9 May  7 21:08:29.222 Record Route:  1.1.23.2(Label=16867) 1.1.35.2(Label=31263) 1.1.56.2(Label=3)
    8 May  7 21:08:28.927 Originate Call
    7 May  7 21:08:28.927 CSPF: computation result accepted  1.1.23.2 1.1.35.2 1.1.56.2
    6 May  7 21:08:00.196 CSPF failed: no route toward 192.168.1.6[2 times]
    5 May  7 21:07:33.306 Clear Call: CSPF computation failed
    4 May  7 21:07:33.306 CSPF: link down/deleted: 0.0.0.0(0.0.0.0:0)(r5.02/0.0.0.0)->0.0.0.0(192.168.1.6:0)(r6.00/192.168.1.6)
    3 May  7 21:07:31.765 1.1.56.2: RSVP System error, subcode 4: protocol shutdown[4 times]
    2 May  7 21:07:30.883 Originate Call
    1 May  7 21:07:30.883 CSPF: computation result accepted  1.1.23.2 1.1.35.2 1.1.56.2
  Created: Thu May  7 21:07:30 2020

192.168.1.6
  From: 192.168.1.2, State: Up, ActiveRoute: 0, LSPname: 192.168.1.6:dt-rsvp-my-dynamic-tunnel1
  ActivePath:  (primary)
  LSPtype: Dynamic Configured, Penultimate hop popping    <<<<< indicates dynamically configured
  LoadBalance: Random
  Follow destination IGP metric
  Encoding type: Packet, Switching type: Packet, GPID: IPv4
  LSP Self-ping Status : Enabled
 *Primary                    State: Up
    Priorities: 7 0
    SmartOptimizeTimer: 180
    Flap Count: 0
    MBB Count: 0
    Computed ERO (S [L] denotes strict [loose] hops): (CSPF metric: 30)
 1.1.23.2 S 1.1.35.2 S 1.1.56.2 S 
    Received RRO (ProtectionFlag 1=Available 2=InUse 4=B/W 8=Node 10=SoftPreempt 20=Node-ID):
          1.1.23.2(Label=16868) 1.1.35.2(Label=31264) 1.1.56.2(Label=3)
    9 May  8 07:26:50.511 CSPF: computation result accepted  1.1.23.2 1.1.35.2 1.1.56.2
    8 May  7 21:09:52.729 Self-ping ended successfully
    7 May  7 21:09:52.398 Selected as active path
    6 May  7 21:09:52.397 Up
    5 May  7 21:09:52.397 Self-ping started
    4 May  7 21:09:52.397 Self-ping enqueued
    3 May  7 21:09:52.397 Record Route:  1.1.23.2(Label=16868) 1.1.35.2(Label=31264) 1.1.56.2(Label=3)
    2 May  7 21:09:52.034 Originate Call
    1 May  7 21:09:52.034 CSPF: computation result accepted  1.1.23.2 1.1.35.2 1.1.56.2
  Created: Thu May  7 21:09:52 2020
Total 2 displayed, Up 2, Down 0
```

