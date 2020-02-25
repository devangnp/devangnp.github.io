---
title: "BGP Multipath in Junos - IPv4 routes"
last_modified_at: 2020-02-20T00:00:01-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Optimizing network resources is ongoing improvement process in any network deployment. Networks are deployed with redundant links, line cards, devices, CPU etc. to cover the failover, quick migration or adding capacity or introducing new feature or upgrading device to new software release related scenarios. In this blog post we will cover the optimal usage of network paths or links as well as nodes available using BGP. 

BGP has the multipath capabilities which can be used to utilize the available links or nodes to load share the traffic or use resources optimally. BGP is widely deployed protocol and carries many address families so multipath can be used for different address families to achieve the load balancing. 

Multipath can be used with iBGP or eBGP both and all families which are supported with BGP can benefit from it.

#### Lets consider the following route:

Route ```192.168.200.1``` is learned from route reflector and it is originated by two different source routers or protocol next hops(PNH) ```192.168.1.2``` and ```192.168.1.3```.  
```
[edit]
root@r6# run show route 192.168.200.1 

inet.0: 30 destinations, 31 routes (30 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.200.1/32   *[BGP/170] 06:39:51, localpref 100, from 192.168.1.4
                      AS path: I, validation-state: unverified
                    > to 1.1.46.1 via ge-0/0/0.46, Push 299888
                      to 1.1.56.1 via ge-0/0/1.56, Push 300000
                    [BGP/170] 06:39:47, localpref 100, from 192.168.1.4
                      AS path: I, validation-state: unverified
                    > to 1.1.46.1 via ge-0/0/0.46, Push 299904
                      to 1.1.56.1 via ge-0/0/1.56, Push 300080

[edit]
root@r6# run show route 192.168.200.1 extensive | match "Protocol next hop" 
                Protocol next hop: 192.168.1.2
                        Protocol next hop: 192.168.1.2 Metric: 1
                Protocol next hop: 192.168.1.3
                        Protocol next hop: 192.168.1.3 Metric: 1
```

![IGP loadbalancing and next hop](/assets/images/multipath1.jpg)

Now to reach each PNH, we have two IGP labeled path. In IGP if you have multiple equal cost paths then we use both the paths to send the traffic as seen in following output. To reach prefix ```192.168.1.2``` and ```192.168.1.3``` we can use path via interfaces ```ge-0/0/0.46``` and ```ge-0/0/1.56```. 

```
root@r6# run show route 192.168.1.2 

inet.0: 30 destinations, 31 routes (30 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.2/32     *[OSPF/10] 05:28:38, metric 2
                      to 1.1.46.1 via ge-0/0/0.46
                    > to 1.1.56.1 via ge-0/0/1.56

inet.3: 4 destinations, 4 routes (4 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.2/32     *[LDP/9] 05:28:38, metric 1
                      to 1.1.46.1 via ge-0/0/0.46, Push 299888
                    > to 1.1.56.1 via ge-0/0/1.56, Push 300000

[edit]
root@r6# run show route 192.168.1.3    

inet.0: 30 destinations, 31 routes (30 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.3/32     *[OSPF/10] 06:39:36, metric 2
                      to 1.1.46.1 via ge-0/0/0.46
                    > to 1.1.56.1 via ge-0/0/1.56

inet.3: 4 destinations, 4 routes (4 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.1.3/32     *[LDP/9] 06:39:36, metric 1
                      to 1.1.46.1 via ge-0/0/0.46, Push 299904
                    > to 1.1.56.1 via ge-0/0/1.56, Push 300080
```                    

Going back to the BGP route ```192.168.200.1```:
- Do we have multipath in play by default? 
- Are we using both the PNH to send traffic?

We can get answer by inspecting following output:

```
[edit]
root@r6# run show bgp neighbor | match multipath 


[edit]
root@r6# run show route 192.168.200.1 extensive | match multipath 

[edit]
root@r6# run show route forwarding-table destination 192.168.200.1 table default 
Routing table: default.inet
Internet:
Enabled protocols: Bridging, 
Destination        Type RtRef Next hop           Type Index    NhRef Netif
192.168.200.1/32   user     0                    indr  1048575     2
                                                 ulst  1048585     2
                              1.1.46.1          Push 299888      659     2 ge-0/0/0.46
                              1.1.56.1          Push 300000      647     2 ge-0/0/1.56
```
Looking at above output, it doesn't look like we have multipath in play and we are not using both the PNHs to forward the traffic. 

We are using only one PNH to send traffic, however we are using both the IGP paths of that selected PNH to send traffic so at this point we have ECMP or resources being used optimally at the IGP level but not yet at the BGP level. 

#### Enable BGP multipath:
Let's enable BGP multipath, to enable and verify if multipath is enabled or not you can use following commands:

```

root@r6# set protocols bgp group rrclient multipath  

[edit]
root@r6# commit 
commit complete
```
Lets verify if multipath is enabled or not:
```
[edit]
root@r6# run show bgp neighbor | match multipath    
  Options: <Preference LocalAddress AddressFamily Multipath Rib-group Refresh>

[edit]
root@r6# run show bgp summary | match 192.168       
192.168.1.4             100       2870       2903       0       0    21:39:34 Establ
```
Lets verify the BGP route after enabling the multipath:

```
[edit]
root@r6# run show route 192.168.200.1                      

inet.0: 30 destinations, 31 routes (30 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

192.168.200.1/32   *[BGP/170] 00:00:13, localpref 100, from 192.168.1.4
                      AS path: I, validation-state: unverified
                    > to 1.1.46.1 via ge-0/0/0.46, Push 299888
                      to 1.1.56.1 via ge-0/0/1.56, Push 300000
                      to 1.1.46.1 via ge-0/0/0.46, Push 299904
                      to 1.1.56.1 via ge-0/0/1.56, Push 300080
                    [BGP/170] 06:47:45, localpref 100, from 192.168.1.4
                      AS path: I, validation-state: unverified
                    > to 1.1.46.1 via ge-0/0/0.46, Push 299904
                      to 1.1.56.1 via ge-0/0/1.56, Push 300080

```
Both the PNHs are now the multipath and multipath contributing routes:
```
root@r6# run show route 192.168.200.1 extensive | match multipath 
                Accepted Multipath
                Accepted MultipathContrib
```
![BGP multipath and next hops](/assets/images/multipath2.jpg)

After enabling the multipath the output of the route looks different then the earlier one. Here we started using the IGP/Label forwarding routes of both the PNHs. Let's check how forwarding table looks like now:

```
root@r6# run show route forwarding-table destination 192.168.200.1 table default 
Routing table: default.inet
Internet:
Enabled protocols: Bridging, 
Destination        Type RtRef Next hop           Type Index    NhRef Netif
192.168.200.1/32   user     0                    ulst  1048587     2
                                                 indr  1048574     2
                                                 ulst  1048582     2
                              1.1.46.1          Push 299904      660     2 ge-0/0/0.46
                              1.1.56.1          Push 300080      651     2 ge-0/0/1.56 -
                                                 indr  1048575     2
                                                 ulst  1048585     2
                              1.1.46.1          Push 299888      659     2 ge-0/0/0.46 -
                              1.1.56.1          Push 300000      647     2 ge-0/0/1.56

```
As we can see in above output, we have programmed both the PNHs and its IGP/labeled routes to reach that PNH in forwarding table so now route's forwarding plane will start using all four forwarding paths to send traffic to destination ```192.168.200.1```.

Next post I will cover the multipath with L3VPN routes. 

