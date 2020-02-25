---
title: "Working with files in Python"
last_modified_at: 2020-01-30T00:00:01-05:00
categories:
  - Blog
tags:
  - - NetOps
---

Working with files and directories is everyday work so how can we create, rename, traverse through different level of directories and files is what I am trying to learn and document in this blog post.

```python
In [3]: import os                  
In [4]: import sys                  
In [5]: import glob
```
How do I create 5000 empty files?
```python
In [32]: for i in range(3,5000): 
    ...:     fname = 'touch '+'hi'+str(i) 
    ...:     os.system(fname) 
    ...:
```
How can I iterate over all the files?
```python
In [33]: myfile = glob.glob('*')                                                                                                                       ```              
```glob.glob``` reads all the files in same dir and creates the list. Pathlib module glob can be used to return generator object.         

Here glob will return all files in given dir as list and I have 5000 files, let's check the size of the list.
```python
In [35]: sys.getsizeof(myfile)                                                                                                                                       
Out[35]: 40808

In [39]: len(myfile)                                                                                                                                                 
Out[39]: 5001

In [37]: ls -l | wc -l                                                                                                                                               
5002
```
Next goal is to renaming all the files by appending ```d_``` at the beginning of the file name:
```python
In [36]: for file in myfile: 
    ...:     os.rename(file,'d_'+file) 


In [40]: ls -l
total 0
-rw-r--r-- 1 root root 0 Jan 30 18:55 d_hi10
-rw-r--r-- 1 root root 0 Jan 30 18:55 d_hi100
-rw-r--r-- 1 root root 0 Jan 30 18:55 d_hi1000
...
```

How to search for the file recursively with specific patter or extension from given or current directory:
```python
In [43]: glob.glob('PythonMyProg/py_networking/**/*.ipynb', recursive=True)
    
Out[43]: 
['PythonMyProg/py_networking/NetOps/threading_1.ipynb',
 'PythonMyProg/py_networking/NetOps/router_textFsm/netmiko_jnpr.ipynb',
 'PythonMyProg/py_networking/NetOps/router_textFsm/netmiko_textfsm.ipynb',
 'PythonMyProg/py_networking/NetOps/logparsing/log_parsing.ipynb',
```
