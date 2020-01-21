---
title: "IPv4 and IPv6 address validation using Python netaddr"
last_modified_at: 2020-01-20T00:00:03-05:00
categories:
  - Blog
tags:
  - - NetOps
---

On and off I had a need to verify if given string is valid IP or not. 

May be you are reading devices or host name files and you want to make sure that the given string is actually well formated IPv4 or IPv6 address before you start further processing in Python program then netaddr module may be very helpful. 

Install the netaddr module using pip and then import it. Here we will mostly talk about the usage for validating if the IP is valid IPv4 or IPv6.

```python
from netaddr import *
```
We will use the ```valid_ipv4``` and ```valid_ipv6``` methods to validate if given element is valid IPv4 or IPv6 address or not. Method will return the ```True``` or ```False```.

#### IPv4 address validation:
Here I have defined a list with valid and invalid pattern and we will iterate over each element to validate if its actually an IPv4 address or not.
```python
ip1 = ['192.168.1.1', '300.1.1.1', 'a.1.1.1', 'abc', 123]
for ip in ip1:
    print(f'Is {ip} valid IPv4 add?:', valid_ipv4(ip))
```
Output:

```
Is 192.168.1.1 valid IPv4 add?: True
Is 300.1.1.1 valid IPv4 add?: False
Is a.1.1.1 valid IPv4 add?: False
Is abc valid IPv4 add?: False
Is 123 valid IPv4 add?: False
```

#### IPv6 address validation:
Same way I have defined a list with combination of valid IPv6 and invalid elements to check. 
```python
ip2 = ['2000:1::1', 'g001::1', 'abc', 123]
for ip in ip2:
    print(f'Is {ip} valid IPv6 add?:', valid_ipv6(ip))
```
Output:

```
Is 2000:1::1 valid IPv6 add?: True
Is g001::1 valid IPv6 add?: False
Is abc valid IPv6 add?: False
Is 123 valid IPv6 add?: False
```
I will blog more about ```netaddr``` module methods in future posts. 