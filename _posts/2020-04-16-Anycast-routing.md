---
title: "Anycast routing pros and cons"
last_modified_at: 2020-04-16T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Given a task to come up with new design which has routing based redundancy, Anycast routing seems to be the great option. 

In case of anycast routing, customer will end up advertising the same prefix/subnet from their multiple POPs or locations. User closer to specific POP or location will use the anycast site reachable and routeable closer to user. 

With anycast routing, redundancy and fail over to next available or next closest site is readily available as user will have the multiple copy of same route reachable via different location. If one of the anycast site goes down then it will withdraw the subnet or prefix it advertised from that site and user will start using the next available best route or site. 

### Now we will discuss few interesting scenarios to consider:

#### Site failover:
- Anycast routing design need careful design of site. If sites in specific regions were design to serve few customer and if such site fails.

- All of the users will be routed to the next anycast site in the region but is that site now capable enough to handle the load it currently serving and the users coming from the site which failed? 

- If not then you may end up disabling or shutting down many such small sites so that users are reaching to small anycast sites can be diverted to bigger or scaled site which can manage many users.

#### Routing dependency: 
- Another scenario where you have anycast site in east coast connected to ISP-A  and one of the user or customer in east coast connected to the he ISP-B. 

- To make scenario more interesting, your one of the anycast site connected to ISP-B in midwest then east coast user will be routed to the midwest anycast site instead of being connected or served via east caost site. 

- As east coast site is on longer AS path compare to the midwest site. 

