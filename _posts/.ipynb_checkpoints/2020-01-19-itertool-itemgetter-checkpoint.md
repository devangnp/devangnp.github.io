---
title: "itemgetter and itertools "
last_modified_at: 2020-01-19T00:00:02-05:00
categories:
  - Blog
tags:
  - - NetOps
---

Documenting the learning on itemgetter and itertools module for network stats analysis. 

To make this blog more relevant, I am using the data from one of my [previous post](https://devangnp.github.io/blog/csv-stats/){:target="_blank"} later in this blog. 

As name suggest, groupby is used to group the items based on given parameters and that parameters can be provided using itemgetter or lambda function. 

Most of all such tools/method takes iterator and passes the items of iterator to the functions. 

As per itemgetter and groubpy documentation:

```
class itemgetter(builtins.object)
 |  itemgetter(item, ...) --> itemgetter object
 |  
 |  Return a callable object that fetches the given item(s) from its operand.
```

```
class groupby(builtins.object)
 |  groupby(iterable, key=None)
 |  
 |  make an iterator that returns consecutive keys and groups from the iterable
```

```python
In [14]: stocks                                                                                         
Out[14]: 
[{'name': 'APPL', 'price': 100, 'shares': 100},
 {'name': 'JNPR', 'price': 25, 'shares': 300},
 {'name': 'APPL', 'price': 101, 'shares': 105},
 {'name': 'JNPR', 'price': 30, 'shares': 200},
 {'name': 'IBM', 'price': 90, 'shares': 50}]
```

For groupby to work with, it needs sorted data to work on so let's sort the data using sorted.
```python
In [15]: stocks1 = sorted(stocks, key = lambda stocks: stocks['name'])                                  
```
```python
In [16]: stocks1                                                                                        
Out[16]: 
[{'name': 'APPL', 'price': 100, 'shares': 100},
 {'name': 'APPL', 'price': 101, 'shares': 105},
 {'name': 'IBM', 'price': 90, 'shares': 50},
 {'name': 'JNPR', 'price': 25, 'shares': 300},
 {'name': 'JNPR', 'price': 30, 'shares': 200}]


In [21]: for ticker, item in itertools.groupby(stocks1, key=lambda stocks1: stocks1['name']):  
    ...:     print(ticker) 
    ...:     for share in ticker: 
    ...:         print('    ', share) 
    ...:                                                                                                
APPL
     {'name': 'APPL', 'price': 100, 'shares': 100}
     {'name': 'APPL', 'price': 101, 'shares': 105}
IBM
     {'name': 'IBM', 'price': 90, 'shares': 50}
JNPR
     {'name': 'JNPR', 'price': 25, 'shares': 300}
     {'name': 'JNPR', 'price': 30, 'shares': 200}
```

Now lets use the data from my previous blog post. 
```python
In [36]: devices                                                                                        
Out[36]: 
[{'device': 'r1', 'input': 0, 'intf': 'et1', 'output': '110'},
 {'device': 'r1', 'input': '102', 'intf': 'et2', 'output': '112'},
 {'device': 'r1', 'input': '103', 'intf': 'et3', 'output': '113'},
 {'device': 'r2', 'input': '200', 'intf': 'et1', 'output': '210'},
 {'device': 'r2', 'input': '202', 'intf': 'et2', 'output': '212'},
 {'device': 'r2', 'input': '203', 'intf': 'et3', 'output': '213'},
 {'device': 'r3', 'input': '300', 'intf': 'et1', 'output': 0},
 {'device': 'r3', 'input': '302', 'intf': 'et2', 'output': '312'},
 {'device': 'r3', 'input': '303', 'intf': 'et3', 'output': '313'}]


In [24]: for router, item in itertools.groupby(devices, key=lambda devices: devices['device']):  
    ...:     print(router) 
    ...:     for rtr in item: 
    ...:         print('    ', rtr) 
    ...:                                                                                                
r1
     {'device': 'r1', 'input': 0, 'intf': 'et1', 'output': '110'}
     {'device': 'r1', 'input': '102', 'intf': 'et2', 'output': '112'}
     {'device': 'r1', 'input': '103', 'intf': 'et3', 'output': '113'}
r2
     {'device': 'r2', 'input': '200', 'intf': 'et1', 'output': '210'}
     {'device': 'r2', 'input': '202', 'intf': 'et2', 'output': '212'}
     {'device': 'r2', 'input': '203', 'intf': 'et3', 'output': '213'}
r3
     {'device': 'r3', 'input': '300', 'intf': 'et1', 'output': 0}
     {'device': 'r3', 'input': '302', 'intf': 'et2', 'output': '312'}
     {'device': 'r3', 'input': '303', 'intf': 'et3', 'output': '313'}
```
Using itemgetter to generate the key to use with groupby.

```python
In [26]: import operator                                                                                

In [29]: for router, item in itertools.groupby(devices, key=operator.itemgetter('device')):  
    ...:     print(router) 
    ...:     for rtr in item: 
    ...:         print('    ', rtr) 
    ...:                                                                                                
r1
     {'device': 'r1', 'input': 0, 'intf': 'et1', 'output': '110'}
     {'device': 'r1', 'input': '102', 'intf': 'et2', 'output': '112'}
     {'device': 'r1', 'input': '103', 'intf': 'et3', 'output': '113'}
r2
     {'device': 'r2', 'input': '200', 'intf': 'et1', 'output': '210'}
     {'device': 'r2', 'input': '202', 'intf': 'et2', 'output': '212'}
     {'device': 'r2', 'input': '203', 'intf': 'et3', 'output': '213'}
r3
     {'device': 'r3', 'input': '300', 'intf': 'et1', 'output': 0}
     {'device': 'r3', 'input': '302', 'intf': 'et2', 'output': '312'}
     {'device': 'r3', 'input': '303', 'intf': 'et3', 'output': '313'}
```

Allocating the key to variable and using it with groupby:
```python
In [30]:  mykey = operator.itemgetter('device')                                                         

In [31]: for router, item in itertools.groupby(devices, mykey):  
    ...:     print(router) 
    ...:     for rtr in item: 
    ...:         print('    ', rtr) 
    ...:                                                                                                
r1
     {'device': 'r1', 'input': 0, 'intf': 'et1', 'output': '110'}
     {'device': 'r1', 'input': '102', 'intf': 'et2', 'output': '112'}
     {'device': 'r1', 'input': '103', 'intf': 'et3', 'output': '113'}
r2
     {'device': 'r2', 'input': '200', 'intf': 'et1', 'output': '210'}
     {'device': 'r2', 'input': '202', 'intf': 'et2', 'output': '212'}
     {'device': 'r2', 'input': '203', 'intf': 'et3', 'output': '213'}
r3
     {'device': 'r3', 'input': '300', 'intf': 'et1', 'output': 0}
     {'device': 'r3', 'input': '302', 'intf': 'et2', 'output': '312'}
     {'device': 'r3', 'input': '303', 'intf': 'et3', 'output': '313'}
```

Do you have any better idea or way to handle it?
