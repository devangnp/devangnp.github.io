---
title: "Ways to EBGP loadbalance"
last_modified_at: 2020-02-25T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, JUNOS]
---

Servers:
  Redundancy 2+N, each server running 1/3rd of capacity so if 2 servers fail, 1 server is capable enough of taking care of load.
    1s is active
    2nd one could be used if 1st needs maintenance 
    3rd can be backup to 2nd if 1st is going through maintenance and 2nd one is active

Routers:
  Redundancy 1+N
    1st one is active
    2nd is standby
    or both as active/active

Put things in production:
  Test > Canary > Production
  Blue green deployment, blue is current running version, green is latest version of application which you want to put in and eventually replace the version in blue.
  
  Release service to handful of users at first with all features or few features and then increase user base after 24hr soak time.
    Terminology: slow or 
      dark launch: Full service launched with few features in disabled or hidden mode, in new service launch we dont know what will be the load so this method helps in capacity planning.
Use load balancer to send traffic based on weight, send traffic to old service and slowly migrate to new service by modifying load balancer config. 


Horizontal scaling is smaller failure domain and easy to replace vs vertical scaling.

Serve LIFO when oversubscribe vs FIFO in normal mode.

Send traffic to sink hole then oversubscribe other sites when one or more site has seen failure.

Reject or discard expensive request and serve easy one.

Use caching or CDN(anycast) for better experience, invalidate the caches.

When threshold is about to reach, reply with 5 things instead of replying 20 things when in normal mode.

Failures:
  Config
  New Roll outs
  Upgrades
  New features
