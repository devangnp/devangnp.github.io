---
title: "Words count using Python"
last_modified_at: 2020-04-25T00:00:03-05:00
categories:
  - Blog
tags:
  - - [NetOps]
---

Program to find out how many words specific text or line has and count how many time each word appears in the text. Once we have repetition count, program list the top talkers as well. 

I am using following example text from one of my blog post. 

```python
In [3]: mytext                                                                                                                                        
Out[3]: '''Given a task to come up with new design which has routing based redundancy, Anycast routing seems to be the great option. In case of anycast routing, customer will end up advertising the same prefix/subnet from their multiple POPs or locations. User closer to specific POP or location will use the anycast site reachable and routeable closer to user.With anycast routing, redundancy and fail over to next available or next closest site is readily available as user will have the multiple copy of same route reachable via different location. If one of the anycast site goes down then it will withdraw the subnet or prefix it advertised from that site and user will start using the next available best route or site.'''
```

To clean up the punctuation I will use simple for loop and replace the punctuation in the text with blank space. There might be a library or module that we may be able to use which could cover all the punctuation but to keep it simple we will use the only those which we are using ```.,\n```. 

I will also use the lower method to convert all the words into the lower casing or letters so that I can count them correctly. 

```python

In [26]: for char in '.,\n': 
    ...:     mytext_words = mytext.replace(char,' ') 
    ...:      
      

In [27]: mytext_words.lower()                                                                                                                         
Out[27]: 'given a task to come up with new design which has routing based redundancy  anycast routing seems to be the great option  in case of anycast routing  customer will end up advertising the same prefix/subnet from their multiple pops or locations  user closer to specific pop or location will use the anycast site reachable and routeable closer to user with anycast routing  redundancy and fail over to next available or next closest site is readily available as user will have the multiple copy of same route reachable via different location  if one of the anycast site goes down then it will withdraw the subnet or prefix it advertised from that site and user will start using the next available best route or site '
```

Now its time to chop or split the whole text and convert it to the list for easy counting.
```python
In [30]: mytext_words = mytext_words.split()                         

In [48]: type(mytext_words)                                                                                                                           
Out[48]: list
```

Once we have a list, we can use ```Counter``` from ```Collection``` module:

```python
In [18]: from collections import Counter                                                                                                            
In [31]: Counter(mytext_words)                                                                                                                        
Out[31]: 
Counter({'given': 1,
         'a': 1,
         'task': 1,
         'to': 5,
         'come': 1,
...

In [33]: count_words = Counter(mytext_words)
```
We will use the count_words which is of type ```Collections.Counter``` object.
```python
In [49]: type(count_words)                                                                                                                            
Out[49]: collections.Counter
```

### We took care of data cleaning, conversion and formating, now  its time to play around with few resulting tasks:

### How can I list top 5 talkers?
We can use the Counter with most_common keyword with argument to list the top N talkers. 
```python
In [37]: Counter(mytext_words).most_common(5)                                                                                                         
Out[37]: [('the', 7), ('to', 5), ('anycast', 5), ('will', 5), ('or', 5)]
```

### How many times a specific word showed up in the text?
Few list method we can use to report how many time a specific word showed up:

```python
In [40]: mytext_words.count('anycast')                                                                                                                
Out[40]: 5
```
### How many total words are there in the text?
Once we have build the list of words, we can use len function to find out the total number of words text has.
```python
In [41]: len(mytext_words)                                                                                                                            
Out[41]: 123
```

### How can I list all the words based on their count in descending order? 
```python

In [34]: sorted(count_words.items(), key=lambda count_words: count_words[1], reverse = True)                                                          
Out[34]: 
[('the', 7),
 ('to', 5),
 ('anycast', 5),
 ('will', 5),
 ('or', 5),
 ('site', 5),
 ('routing', 4),
 ('user', 4),
 ('of', 3),
 ('and', 3),
 ('next', 3),
 ('available', 3),
 ('up', 2),
 ('with', 2),
 ('redundancy', 2),
 ('same', 2),
 ('from', 2),
 ('multiple', 2),
 ('closer', 2),
 ('location', 2),
 ('reachable', 2),
 ('route', 2),
 ('it', 2),
 ('given', 1),
 ('a', 1),
 ('task', 1),
 ('come', 1),
 ('new', 1),
 ('design', 1),
 ('which', 1),
 ('has', 1),
 ('based', 1),
 ('seems', 1),
 ('be', 1),
 ('great', 1),
 ('option', 1),
 ('in', 1),
 ('case', 1),
 ('customer', 1),
 ('end', 1),
 ('advertising', 1),
 ('prefix/subnet', 1),
 ('their', 1),
 ('pops', 1),
 ('locations', 1),
 ('specific', 1),
 ('pop', 1),
 ('use', 1),
 ('routeable', 1),
 ('fail', 1),
 ('over', 1),
 ('closest', 1),
 ('is', 1),
 ('readily', 1),
 ('as', 1),
 ('have', 1),
 ('copy', 1),
 ('via', 1),
 ('different', 1),
 ('if', 1),
 ('one', 1),
 ('goes', 1),
 ('down', 1),
 ('then', 1),
 ('withdraw', 1),
 ('subnet', 1),
 ('prefix', 1),
 ('advertised', 1),
 ('that', 1),
 ('start', 1),
 ('using', 1),
 ('best', 1)]
```

