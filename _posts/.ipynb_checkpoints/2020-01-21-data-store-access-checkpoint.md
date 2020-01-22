---
title: "Data store and easy access"
last_modified_at: 2020-01-21T00:00:00-05:00
categories:
  - Blog
tags:
  - - NetOps
---

I was looking for data structure which is like key and value pair and it would be even better if I can access it using "." or dot notation for easy and clean acess so few such data structure I was exploring:
   - dictionary
   - class
   - namedtuple
   
Dictionary is very useful data structure, however accessing its elements using dot notation is not possible. 

#### Using Dictionary:
```python
In [22]: person = {'first': 'Dev', 'last': 'Pat', 'age': 3}

In [23]: person['first']
Out[23]: 'Dev'

In [24]: person['last']
Out[24]: 'Pat'

In [25]: person['age']
Out[25]: 3
```

#### Using class:
Using class to store value and access those values using dot notation as below. With such data storage, we can modify the value as well after assignment:
```python
In [12]: class person():
    ...:     def __init__(self, first, last, age):
    ...:         self.first = first
    ...:         self.last = last
    ...:         self.age = age
    ...:

In [13]: p1 = person('Dev', 'Pat', 3)

In [14]: p1.first
Out[14]: 'Dev'

In [15]: p1.last
Out[15]: 'Pat'

In [16]: p1.age
Out[16]: 3
```

#### Using namedtuple:
Another good way is to use ```namedtuple``` of ```collections``` module, as its tuple once its created we cannot modify the values of its field. This data storage container gives easy dot notation access to its value using key:
```python
In [4]: from collections import namedtuple

In [17]: person = namedtuple('person', 'first last age')

In [18]: p101 = person('Dev', 'Pat',  3)

In [19]: p101.first
Out[19]: 'Dev'

In [20]: p101.last
Out[20]: 'Pat'

In [21]: p101.age
Out[21]: 3

```
Any other better ways to achieve the same?