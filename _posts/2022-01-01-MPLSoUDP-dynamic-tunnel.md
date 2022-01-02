---
title: "Next hop based Dynamic Tunnels - MPLSoUDP"
last_modified_at: 2022-01-1T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Scaling is a biggest concern in could providers in terms of tunnel interfaces. Network devices also have to deal with lots of tunnel interfaces and related states building, maintaining and programing on to different levels and adds more complexity in implementation and eventually debugging.

Next-hop based dynamic tunnel infrastructure helps in overcoming the states and complexity challenges. It can support multiple different encapsulation like GRE or UDP or IP as per deployment scenario requirement and provide greater scalability on networking devices.

In this blog post we will explore the BGP Encapsulation extended community and UDP based dynamic tunnel setup and verification on Juniper/JUNOS devices. 


#### RFCs and related snippets:
[RFC5512](https://tools.ietf.org/html/rfc5512){:target="_blank"} talks about The BGP Encapsulation Subsequent Address Family Identifier (SAFI) and the BGP Tunnel Encapsulation Attribute. [Draft The BGP Tunnel Encapsulation Attribute draft-ietf-idr-tunnel-encaps-15.txt](https://tools.ietf.org/html/draft-ietf-idr-tunnel-encaps-15){:target="_blank"} will obsolete the RFC5512 so this draft has more details on attributes. 

12.3.  Extended Communities
IANA has previously assigned values from the "Transitive Opaque
   Extended Community" type Registry to the "Color Extended Community"
   (sub-type 0x0b), and to the "Encapsulation Extended
   Community"(0x030c).  IANA is requested to add this document as a
   reference for both assignments.


[RFC7510](https://tools.ietf.org/html/rfc7510){:target="_blank"} talks about Encapsulating MPLS in UDP, the topic we are going to explore in this post.

As usual, BGP comes to rescue. What a flexible and extendible protocol! 

#### Encapsulation RFC 7510 Section 3.:
```	  
	  0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     |    Source Port = Entropy      |       Dest Port = MPLS        |
     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     |           UDP Length          |        UDP Checksum           |
     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     |                                                               |
     ~                       MPLS Label Stack                        ~
     |                                                               |
     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     |                                                               |
     |                                                               |
     ~                         Message Body                          ~
     |                                                               |
     +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

#### Configuration
```
[edit]
root@r6# show policy-options 
policy-statement udp-encap {
    term 1 {
        then {
            community add udp;
            accept;
        }
    }
}
policy-statement vpnrt {
    term 1 {
        then {
            community add vpnrt;
            accept;
        }
    }
}
community udp members 0x030c:100:13;   <<<<< community information detailed in RFC5512 
community vpnrt members target:1:2;
```
#### Decoding community configured and communicated in BGP:
```0x030c:100:13``` can be read as ```Encapsulation-Extended-community:AS-number:Encapsulation-Type```.

0x030C is Encapsulation Extended Community, 100 is my lab AS number and 13 is Encapsulation type MPLSoUDP. 

- 7 is Encapsulation type IPIP
- 8 is Encapsulation type VXLAN
- 9  is Encapsulation type NVGRE
- 10 is Encapsulation type MPLS
- 11 is Encapsulation type MPLS GRE
- 12 is Encapsulation type VXLAN GPE
- 13 is Encapsulation type MPLSoUDP

With vpn-apply-export in BGP configuration, both VRF export and BGP export policies will be applied before routes are advertised in VPN PEs. 
```
[edit]
root@r6# show protocols bgp 
group ibgp {
    type internal;
    local-address 192.168.1.6;
    family inet-vpn {
        unicast;
    }
    export udp-encap;
    vpn-apply-export;
    neighbor 192.168.1.2;
}

```

VRF configuration is verify basic, nothing new there. 
```
root@r6> show configuration routing-instances mvpnr5 | display inheritance no-comments 
instance-type vrf;
interface ge-0/0/2.67;
interface lo0.1;
route-distinguisher 6:2;
vrf-export vpnrt;
vrf-target target:1:2;
vrf-table-label;
protocols {
    ospf {
        export frombgp;
        area 0.0.0.0 {
            interface all;
        }
    }
}
```
Dynamic tunnels configuration requires the source address to be used, destination networks are the PE devices address to which local router wants to establish the UDP tunnel. 
Configuration also indicates the encapsulation type to be used based on the BGP Encapsulation extended received in the route update.
```
root@r6> show configuration routing-options     
router-id 192.168.1.6;
dynamic-tunnels {
    udp-tunnel {
        source-address 192.168.1.6;
        bgp-signal;
        destination-networks {
            192.168.1.2/32;
        }
    }
}
```
#### Verification
```
[edit]
root@r6# run show bgp summary 
Threading mode: BGP I/O
Groups: 1 Peers: 1 Down peers: 0
Table          Tot Paths  Act Paths Suppressed    History Damp State    Pending
bgp.l3vpn.0          
                       5          5          0          0          0          0
bgp.evpn.0           
                       0          0          0          0          0          0
bgp.mvpn.0           
                       0          0          0          0          0          0
Peer                     AS      InPkt     OutPkt    OutQ   Flaps Last Up/Dwn State|#Active/Received/Accepted/Damped...
192.168.1.2             100        100        100       0       2       42:41 Establ
  bgp.l3vpn.0: 5/5/5/0
  mvpnr5.inet.0: 5/5/5/0
```

show dynamic-tunnel has terse and summary options for quick tunnel status verification:
```
root@r6> show dynamic-tunnels database terse 
*- Signal Tunnels #- PFE-down
Table: inet.3       

Destination-network: 192.168.1.2/32
Destination         Source          Next-hop             Type       Status
192.168.1.2/32      192.168.1.6     0xccd8990 nhid 644   UDP*       Up (via metric 2) 

root@r6> show dynamic-tunnels database summary  
Dynamic Tunnels,  Total 1 displayed
GRE Tunnel: 
Active Tunnel Mode, Logical Interface Base
  IFL Based,  Total 0 displayed, Up 0, Down 0
  Nexthop Based,  Total 0 displayed, Up 0, Down 0
RSVP Tunnel: 
  Total 0 displayed
UDP Tunnel: 
  Total 1 displayed, Up 1, Down 0
```
Following output give bit more details on the tunnel status, statistics, type of tunnel signaled and related forwarding NH it will use to forward the traffic. 
```
root@r6> show dynamic-tunnels database            
*- Signal Tunnels #- PFE-down
Table: inet.3       

Destination-network: 192.168.1.2/32
Tunnel to: 192.168.1.2/32
  Reference count: 4
  Next-hop type: UDP (BGP-Signal)
    Source address: 192.168.1.6
    Next hop: tunnel-composite, 0xccd8990, nhid 644
      Reference count: 1
      Ingress Route: 192.168.1.2/32, via metric 2
      Traffic Statistics: Packets 2, Bytes 168 
      State: Up
```
#### updates and route verification
Take a note of the received and advertised route with the encapsulation extended community:
```
root@r6> show route advertising-protocol bgp 192.168.1.2 table mvpnr5.inet.0 

mvpnr5.inet.0: 9 destinations, 9 routes (9 active, 0 holddown, 0 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
* 1.1.67.0/24             Self                         100        I
* 192.168.2.6/32          Self                         100        I

root@r6> show route advertising-protocol bgp 192.168.1.2 table mvpnr5.inet.0 extensive 

mvpnr5.inet.0: 9 destinations, 9 routes (9 active, 0 holddown, 0 hidden)
* 1.1.67.0/24 (1 entry, 1 announced)
 BGP group ibgp type Internal
     Route Distinguisher: 6:2
     VPN Label: 20
     Nexthop: Self
     Flags: Nexthop Change
     Localpref: 100
     AS path: [100] I 
     Communities: target:1:2 encapsulation:mpls-in-udp(0xd)    <<<<< route advertised with MPLSoUDP

* 192.168.2.6/32 (1 entry, 1 announced)
 BGP group ibgp type Internal
     Route Distinguisher: 6:2
     VPN Label: 20
     Nexthop: Self
     Flags: Nexthop Change
     Localpref: 100
     AS path: [100] I 
     Communities: target:1:2 encapsulation:mpls-in-udp(0xd)    <<<<< route advertised with MPLSoUDP

root@r6> show route receive-protocol bgp 192.168.1.2 table mvpnr5.inet.0 192.168.1.1      

mvpnr5.inet.0: 9 destinations, 9 routes (9 active, 0 holddown, 0 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
* 192.168.1.1/32          192.168.1.2          1       100        I

root@r6> show route receive-protocol bgp 192.168.1.2 table mvpnr5.inet.0 192.168.1.1 extensive 

mvpnr5.inet.0: 9 destinations, 9 routes (9 active, 0 holddown, 0 hidden)
* 192.168.1.1/32 (1 entry, 1 announced)
     Import Accepted
     Route Distinguisher: 2:2
     VPN Label: 16
     Nexthop: 192.168.1.2
     MED: 1
     Localpref: 100
     AS path: I 
     Communities: target:1:2 rte-type:0.0.0.0:1:0 encapsulation:mpls-in-udp(0xd)    <<<<< route received with MPLSoUDP
```

Verify the VPN route programing with tunnel next-hop as outgoing interfaces in RIB. Output with extensive keyword is documented at the end of the post.
```
root@r6> show route 192.168.1.1 table mvpnr5.inet.0 

mvpnr5.inet.0: 9 destinations, 9 routes (9 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.1/32     *[BGP/170] 00:40:18, MED 1, localpref 100, from 192.168.1.2
                      AS path: I, validation-state: unverified
                    >  via Tunnel Composite, Push 16

           
root@r6> show route table inet.3 

inet.3: 1 destinations, 2 routes (1 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.2/32     *[Tunnel/300] 00:40:29, metric 2
                       Tunnel Composite
                    [Tunnel/305] 00:40:29
                       Tunnel
```

VPN routes verification in router kernel pointing to the tunnel next-hop:
```
root@r6> show krt indirect-next-hop 
Indirect Nexthop:
Index: 1048575 Protocol next-hop address: 192.168.1.2
  RIB Table: bgp.l3vpn.0                
  Policy Version: 2                     References: 5
  Locks: 3                              0xcd19500
  Flags: 0x1                              
  INH Session ID: 0x0
  INH Version ID: 0
  Ref RIB Table: unknown
        Tunnel type: UDP, (BGP-Signal), Reference count: 1, nhid: 644
        Destination address: 192.168.1.2, Source address: 192.168.1.6
      IGP FRR Interesting proto count : 5
      Chain IGP FRR Node Num          : 1
         IGP Resolver node(hex)       : 0xce8ad00   
         IGP Route handle(hex)        : 0xb9fdc7c      IGP rt_entry protocol        : Tunnel
         IGP Actual Route handle(hex) : 0x0            IGP Actual rt_entry protocol : Any
		 
root@r6> show route forwarding-table destination 192.168.1.1 vpn mvpnr5 
Routing table: mvpnr5.inet
Internet:
Enabled protocols: Bridging, All VLANs, 
Destination        Type RtRef Next hop           Type Index    NhRef Netif
192.168.1.1/32     user     0                    comp      645     6
```
Output with extensive keyword is documented at the end of the post. 

#### Forwarding plane verification
```
VMX-0(r6 vty)# show route ip table      
Protocol: IPv4
    Table Name                       Table Index (lrid ) # of Routes  Bytes        LOCAL     FRRP TID         
    -------------------------------------------------------------------------------------------------------
    __juniper_private1__.1           1           (0    ) 9            1184         LOCAL     low ----
    __juniper_private2__.2           2           (0    ) 8            1052         LOCAL     low ----
    __juniper_private4__.36736       36736       (0    ) 5            656          LOCAL     low ----
    __juniper_services__.4           4           (0    ) 9            1184         LOCAL     low ----
    __master.anon__.5                5           (0    ) 5            656          LOCAL     low ----
    __pfe_private__.3                3           (0    ) 5            656          LOCAL     low ----
    default.0                        0           (0    ) 37           4880         LOCAL     low ----
    mvpnr5.6                         6           (0    ) 17           2240         LOCAL     low ----

VMX-0(r6 vty)# show route ip table index 6 prefix 192.168.1.1
IPv4 Route Table 6, mvpnr5.6, 0x41000:
Destination                       NH IP Addr      Type     NH ID Interface
--------------------------------- --------------- -------- ----- ---------
192.168.1.1                                         Compst   645 RT-ifl 0 

VMX-0(r6 vty)# show nhdb id 645 recursive    
645(Compst, IPv4->MPLS, ifl:0:-, pfe-id:0, comp-fn:Chain)
    1048575(Indirect, IPv4, ifl:0:-, pfe-id:0, i-ifl:0:-)
        644(Compst, MPLS, ifl:0:-, pfe-id:0, comp-fn:Tunnel)

VMX-0(r6 vty)# show nhdb id 644 extensive    
   ID      Type      Interface    Next Hop Addr    Protocol       Encap     MTU               Flags  PFE internal Flags
-----  --------  -------------  ---------------  ----------  ------------  ----  ------------------  ------------------
  644    Compst  -              -                      MPLS             -     0  0x0000000000000000  0x0000000000000000

BFD Session Id: 0

Composite NH:
  Function: Tunnel Function
  Hardware Index: 0x0
  Composite flag: 0x0
  Composite pfe flag: 0xe
  Lower-level NH Ids:
  Derived NH Ids:
  Tunnel Data:
      Type     : UDP-V4
      Tunnel ID: 1
      Encap VRF: 0
      Decap VRF: 0
      MTU      : 0
      Flags    : 0x80
      AnchorId : 0
      Encap Len: 28
      Encap    : 0x45 0x00 0x00 0x00 0x00 0x00 0x40 0x00 
                 0x40 0x2f 0x00 0x00 0x06 0x01 0xa8 0xc0 
                 0x02 0x01 0xa8 0xc0 0x00 0x00 0x00 0x00 
                 0x00 0x00 0x00 0x00 
      Data Len : 8
      Data     : 0xc0 0xa8 0x01 0x02 0xc0 0xa8 0x01 0x06 
        Feature List: NH
           [pfe-0]: 0x082afb7400020000;
          f_mask:0xe000000000000000; c_mask:0xe000000000000000; f_num:3; c_num:3,  inst:0xffffffff
        Idx#0          -:
           [pfe-0]: 0x2bfffffd48006900

        Idx#1          -:
           [pfe-0]: 0x23fffffc0000000c

        Idx#2          -:
           [pfe-0]: 0x0822664800010000

Tunnel ID 1
==============
         Ref-count 1
TunnelModel:
Dynamic Tunnel Model:
         Name = MPLSoUDP <src: 192.168.1.6, dst: 192.168.1.2>
         ID   = 1
         MTU = 0
         VRF = default.0(0)
         Source Entropy = 1
         Carry Hash = 1
         Reassemble = 0
         Packets = 0 Bytes = 0

Source IP     : 192.168.1.6
Destination IP: 192.168.1.2

Ingress:
Index:0
  PFE(0): 0x2bfffffd48016100

Index:1
  PFE(0): 0x82afac000020000

Handle JNH
PFE(0): 0x822664800010000
Egress:
Index:0
  PFE(0): 0x2bfffffd4801a100

Index:1
  PFE(0): 0x23fffffc0000020a

Index:2
  PFE(0): 0xa00001fffff00001

Index:3
  PFE(0): 0xda00022419000404

Index:4
  PFE(0): 0x23fffffc00000001

Handle JNH
PFE(0): 0x820030800040000


  Routing-table id: 0
```

#### Connectivity verification
```
root@r6> ping 192.168.1.1 routing-instance mvpnr5 
PING 192.168.1.1 (192.168.1.1): 56 data bytes
64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=5.935 ms
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=4.881 ms
64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=5.003 ms
64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=9.544 ms
64 bytes from 192.168.1.1: icmp_seq=4 ttl=64 time=4.961 ms
^C
--- 192.168.1.1 ping statistics ---
5 packets transmitted, 5 packets received, 0% packet loss
round-trip min/avg/max/stddev = 4.881/6.065/9.544/1.782 ms

```
```
root@r6> show interfaces routing-instance mvpnr5 terse 
Interface               Admin Link Proto    Local                 Remote
ge-0/0/2.67             up    up   inet     1.1.67.1/24     
                                   multiservice
lo0.1                   up    up   inet     192.168.2.6         --> 0/0
lsi.0                   up    up   inet    
                                   iso     
                                   inet6   
```
#### Statistics on FPC/PFE:
```
VMX-0(r6 vty)#  show nhdb id 644 statistics    
Nexthop Statistics:
Interface      NH ID Next Hop Addr    Output Pkts Pkt Rate    Output Bytes  Byte Rate   Protocol
------------ ------- --------------- ------------ -------- --------------- ---------- ----------

Nexthop ID 644: 
-----------------

Output:
-------
        Packets 7902, Rate 9 pps
        Bytes   663768, Rate 818 Bps


Tunnel ID 1: MPLSoUDP <src: 192.168.1.6, dst: 192.168.1.2>
-----------------

Output:
-------
        Packets 7902, Rate 9 pps
        Bytes   663768, Rate 818 Bps

Input:
------
        Packets 7902, Rate 9 pps
        Bytes   916632, Rate 1130 Bps
```
#### Tunnel verification on R2
```
====
root@r2> show dynamic-tunnels database summary 
Dynamic Tunnels,  Total 1 displayed
GRE Tunnel: 
Active Tunnel Mode, Logical Interface Base
  IFL Based,  Total 0 displayed, Up 0, Down 0
  Nexthop Based,  Total 0 displayed, Up 0, Down 0
RSVP Tunnel: 
  Total 0 displayed
UDP Tunnel: 
  Total 1 displayed, Up 1, Down 0

root@r2> show dynamic-tunnels database terse      
*- Signal Tunnels #- PFE-down
Table: inet.3       

Destination-network: 192.168.1.6/32
Destination         Source          Next-hop             Type       Status
192.168.1.6/32      192.168.1.2     0xccd7df0 nhid 632   UDP*       Up (via metric 2) 

root@r2> show dynamic-tunnels database          
*- Signal Tunnels #- PFE-down
Table: inet.3       

Destination-network: 192.168.1.6/32
Tunnel to: 192.168.1.6/32
  Reference count: 4
  Next-hop type: UDP (BGP-Signal)
    Source address: 192.168.1.2
    Next hop: tunnel-composite, 0xccd7df0, nhid 632
      Reference count: 1
      Ingress Route: 192.168.1.6/32, via metric 2
      Traffic Statistics: Packets 2, Bytes 168 
      State: Up
	  
```	  


#### Incoming packet captured on R6 PFE, hex dump to decode/open in wireshark:
```
56 68 
a3 1e 0e 24 56 68 a3 1e 
28 f7 81 00 00 2e 08 00 
45 00 00 74 6c 34 00 00 
3f 11 8b ec c0 a8 01 02 
c0 a8 01 06 c4 62 19 eb 
00 60 00 00 00 01 41 40 
45 00 00 54 f8 0a 00 00 
40 01 7b f2 c0 a8 02 02 
01 01 43 01 08 00 b5 f1 
da 6c 01 19 5e b8 c9 2c 
00 0c 56 9f ba dc 0f fe 
ee ba dc 0f fe ee ba dc 
0f fe ee ba dc 0f fe ee 
ba dc 0f fe ee ba dc 0f 
fe ee ba dc 0f fe ee ba 
dc 0f fe ee ba dc 0f fe 
ee ba dc 0f 
```

#### Packet summary:
```
No.     Time           Time Diff                     Source                Destination           Protocol Length Info
      1 0.000000       2020-05-11 03:42:55.000000    192.168.2.2           1.1.67.1              ICMP     134    Echo (ping) request  id=0xda6c, seq=281/6401, ttl=64 (no response found!)

Frame 1: 134 bytes on wire (1072 bits), 134 bytes captured (1072 bits)
Ethernet II, Src: 56:68:a3:1e:28:f7 (56:68:a3:1e:28:f7), Dst: 56:68:a3:1e:0e:24 (56:68:a3:1e:0e:24)
802.1Q Virtual LAN, PRI: 0, DEI: 0, ID: 46
Internet Protocol Version 4, Src: 192.168.1.2, Dst: 192.168.1.6
User Datagram Protocol, Src Port: 50274, Dst Port: 6635
MultiProtocol Label Switching Header, Label: 20, Exp: 0, S: 1, TTL: 64
Internet Protocol Version 4, Src: 192.168.2.2, Dst: 1.1.67.1
Internet Control Message Protocol

0000  56 68 a3 1e 0e 24 56 68 a3 1e 28 f7 81 00 00 2e   Vh...$Vh..(.....
0010  08 00 45 00 00 74 6c 34 00 00 3f 11 8b ec c0 a8   ..E..tl4..?.....
0020  01 02 c0 a8 01 06 c4 62 19 eb 00 60 00 00 00 01   .......b...`....
0030  41 40 45 00 00 54 f8 0a 00 00 40 01 7b f2 c0 a8   A@E..T....@.{...
0040  02 02 01 01 43 01 08 00 b5 f1 da 6c 01 19 5e b8   ....C......l..^.
0050  c9 2c 00 0c 56 9f ba dc 0f fe ee ba dc 0f fe ee   .,..V...........
0060  ba dc 0f fe ee ba dc 0f fe ee ba dc 0f fe ee ba   ................
0070  dc 0f fe ee ba dc 0f fe ee ba dc 0f fe ee ba dc   ................
0080  0f fe ee ba dc 0f                                 ......
```	  

#### BGP update with communitys looks like:
```
            Carried extended communities: (3 communities)
                Route Target: 1:2 [Transitive 2-Octet AS-Specific]
                    Type: Transitive 2-Octet AS-Specific (0x00)
                        0... .... = IANA Authority: Allocated on Standard Action, Early Allocation or Experimental Basis
                        .0.. .... = Transitive across AS: Transitive
                    Subtype (AS2): Route Target (0x02)
                    2-Octet AS: 1
                    4-Octet AN: 2
                OSPF Route Type: Area: 0.0.0.0, Type: Router [Transitive Opaque]
                    Type: Transitive Opaque (0x03)
                        0... .... = IANA Authority: Allocated on Standard Action, Early Allocation or Experimental Basis
                        .0.. .... = Transitive across AS: Transitive
                    Subtype (Opaque): OSPF Route Type (0x06)
                    Area ID: 0.0.0.0
                    Route type: Router (1)
                    Options: 0x00 (Metric: Type-1)
                        .... ...0 = Metric type: Type-1
                Encapsulation: MPLS in UDP Encapsulation [Transitive Opaque]
                    Type: Transitive Opaque (0x03)
                        0... .... = IANA Authority: Allocated on Standard Action, Early Allocation or Experimental Basis
                        .0.. .... = Transitive across AS: Transitive
                    Subtype (Opaque): Encapsulation (0x0c)
                    Tunnel type: MPLS in UDP Encapsulation (13)
					
Hex dump to decode in wireshark:

56 68 a3 1e 0e 24 56 68 a3 1e 28 f7 81 00 00 2e 
08 00 45 c0 01 a5 78 1c 00 00 3f 06 7e 1e c0 a8 
01 02 c0 a8 01 06 d3 0c 00 b3 7a 1b da 13 71 6c 
74 be 80 18 40 22 36 31 00 00 01 01 08 0a 88 68 
29 d7 88 68 3c c3 ff ff ff ff ff ff ff ff ff ff 
ff ff ff ff ff ff 00 6b 02 00 00 00 54 40 01 01 
00 40 02 00 80 04 04 00 00 00 02 40 05 04 00 00 
00 64 c0 10 18 00 02 00 01 00 00 00 02 03 06 00 
00 00 00 01 00 03 0c 64 00 00 00 00 0d 90 0e 00 
20 00 01 80 0c 00 00 00 00 00 00 00 00 c0 a8 01 
02 00 70 00 01 01 00 00 00 02 00 00 00 02 01 01 
0d ff ff ff ff ff ff ff ff ff ff ff ff ff ff ff 
ff 00 7c 02 00 00 00 65 40 01 01 00 40 02 00 80 
04 04 00 00 00 01 40 05 04 00 00 00 64 c0 10 18 
00 02 00 01 00 00 00 02 03 06 00 00 00 00 01 00 
03 0c 64 00 00 00 00 0d 90 0e 00 31 00 01 					
					
```					

#### List of useful commands
```
	show configuration policy-options 
	show configuration protocols bgp 
	show configuration routing-instances mvpnr5 | display inheritance no-comments 
	show configuration routing-options 
	show dynamic-tunnels database terse 
	show dynamic-tunnels database summary 
	show dynamic-tunnels database 
	show route 192.168.1.1 table mvpnr5.inet.0 
	show route table inet.3 
	show route table inet.3 extensive 
	show route 192.168.1.1 table mvpnr5.inet.0 extensive 
	show route advertising-protocol bgp 192.168.1.2 table mvpnr5.inet.0 
	show route advertising-protocol bgp 192.168.1.2 table mvpnr5.inet.0 extensive 
	show route receive-protocol bgp 192.168.1.2 table mvpnr5.inet.0 192.168.1.1 
	show route receive-protocol bgp 192.168.1.2 table mvpnr5.inet.0 192.168.1.1 extensive 
	show route forwarding-table destination 192.168.1.1 vpn mvpnr5 
	show route forwarding-table destination 192.168.1.1 vpn mvpnr5 extensive 
	start shell pfe network fpc0 
	show krt indirect-next-hop 
	ping 192.168.1.1 routing-instance mvpnr5 
	show interfaces routing-instance mvpnr5 
	show interfaces routing-instance mvpnr5 terse 
```
Output with extensive option for reference:
```

root@r6> show route table inet.3 extensive 

inet.3: 1 destinations, 2 routes (1 active, 0 holddown, 0 hidden)
192.168.1.2/32 (2 entries, 1 announced)
        State: <FlashAll>
        *Tunnel Preference: 300
                Next hop type: Tunnel Composite, Next hop index: 0
                Address: 0xccd8390
                Next-hop reference count: 2
                Tunnel type: BGP-Signal, Reference count: 2, nhid: 0
                Destination address: 192.168.1.2, Source address: 192.168.1.6
                State: <Active>
                Local AS:   100 
                Age: 40:34      Metric: 2 
                Validation State: unverified 
                Area: 0.0.0.0
                Task: DYN_TUNNEL
                Announcement bits (2): 2-Resolve tree 1 3-Resolve_IGP_FRR task 
                AS path: I 
         Tunnel Preference: 305
                Next hop type: Tunnel, Next hop index: 0
                Address: 0xccd4a30
                Next-hop reference count: 1
                Inactive reason: Route Preference
                Local AS:   100 
                Age: 40:34 
                Validation State: unverified 
                Task: DYN_TUNNEL
                AS path: I 

root@r6> show route 192.168.1.1 table mvpnr5.inet.0 extensive 

mvpnr5.inet.0: 9 destinations, 9 routes (9 active, 0 holddown, 0 hidden)
192.168.1.1/32 (1 entry, 1 announced)
TSI:
OSPF area : 0.0.0.0, LSA ID : 192.168.1.1, LSA type : Summary
KRT in-kernel 192.168.1.1/32 -> {composite(645)}
        *BGP    Preference: 170/-101
                Route Distinguisher: 2:2
                Next hop type: Indirect, Next hop index: 0
                Address: 0xccd8f30
                Next-hop reference count: 15
                Source: 192.168.1.2
                Next hop type: Tunnel Composite, Next hop index: 644
                Next hop: , selected
                Protocol next hop: 192.168.1.2
                Label operation: Push 16
                Label TTL action: prop-ttl
                Load balance label: Label 16: None; 
                Composite next hop: 0xe8068c0 645 INH Session ID: 0x0
                Indirect next hop: 0xcd19500 1048575 INH Session ID: 0x0
                State: <Secondary Active Int Ext ProtectionCand>
                Local AS:   100 Peer AS:   100
                Age: 40:40      Metric: 1       Metric2: 2 
                Validation State: unverified 
                Task: BGP_100.192.168.1.2
                Announcement bits (2): 0-mvpnr5-OSPF 2-KRT 
                AS path: I 
                Communities: target:1:2 rte-type:0.0.0.0:1:0 encapsulation:mpls-in-udp(0xd)
                Import Accepted
                VPN Label: 16
                Localpref: 100
                Router ID: 192.168.1.2
                Primary Routing Table bgp.l3vpn.0
                Composite next hops: 1
                        Protocol next hop: 192.168.1.2 Metric: 2
                        Label operation: Push 16
                        Label TTL action: prop-ttl
                        Load balance label: Label 16: None; 
                        Composite next hop: 0xe8068c0 645 INH Session ID: 0x0
                        Indirect next hop: 0xcd19500 1048575 INH Session ID: 0x0
                        Indirect path forwarding next hops: 1
                                Next hop type: Tunnel Composite
                                Next hop: 
                                192.168.1.2/32 Originating RIB: inet.3
                                  Metric: 2     Node path count: 1
                                  Forwarding nexthops: 1
                                        Next hop type: Tunnel Composite
                                        Tunnel type: BGP-Signal, nhid: 0, Reference-count: 2, tunnel id: 0
                                        Destination address: 192.168.1.2, Source address: 192.168.1.6

root@r6> show route forwarding-table destination 192.168.1.1 vpn mvpnr5 extensive 
Routing table: mvpnr5.inet [Index 6] 
Internet:
Enabled protocols: Bridging, All VLANs, 
    
Destination:  192.168.1.1/32
  Route type: user                  
  Route reference: 0                   Route interface-index: 0   
  Multicast RPF nh index: 0             
  P2mpidx: 0              
  Flags: sent to PFE 
  Nexthop:  
  Next-hop type: composite             Index: 645      Reference: 6    
  Load Balance Label: Push 16, None     
  Next-hop type: indirect              Index: 1048575  Reference: 2    
  Nexthop:  
  Next-hop type: composite             Index: 644      Reference: 2    
```  
  