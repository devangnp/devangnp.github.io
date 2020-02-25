---
title: "The Router I know"
last_modified_at: 2020-02-25T00:00:02-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Tried to picturize the router as I know, at least the Juniper router with control and forwarding plane traffic.

I have also highlighted the traffic flow and try to show which traffic is known as transit and host traffic.

Picture shows one control plane or in Juniper terms its Routing-Engine(RE) and two forwarding plane or card or FPCs.

![Router as I know](/assets/images/router_asiknow.jpg)

Few acronyms used in picture:
- cchip: Center chip or buffer chip
- LUKP: Lookup chip
- RtNH: Route Next-hop database or memory
- CPU: It is a processor on FPC
- intf: Interfaces

