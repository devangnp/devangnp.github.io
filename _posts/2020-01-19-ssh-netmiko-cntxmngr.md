---
title: "Netmiko SSH connection handling using with statement"
last_modified_at: 2020-01-19T00:00:01-05:00
categories:
  - Blog
tags:
  - - NetOps
---

While working on Python program to connect to multiple lab devices and capture data, I faced the issue (due to bug in my program) where router was rejecting SSH connection request. 

As one might have guessed, it was issue due to the number of SSH connection limit reached! Upon investigation, I saw so many user logins were left stale on router due to my experiment of writing script and testing it again and again. 

```
lab@R1> show system users  
lab  pts/15   10.0.0.132                    8:39AM     23 -cl           
lab  pts/16   10.0.0.132                    8:42AM     20 -cl           
lab  pts/17   10.0.0.132                    8:43AM     19 -cl           
lab  pts/18   10.0.0.132                    8:45AM     17 -cl           
lab  pts/19   10.0.0.132                    8:47AM     16 -cl           
lab  pts/20   10.0.0.132                    8:48AM     15 -cl           
lab  pts/21   10.0.0.132                    8:48AM     14 -cl           
lab  pts/22   10.0.0.132                    8:49AM     13 -cl           
lab  pts/23   10.0.0.132                    8:50AM     12 -cl           
lab  pts/24   10.0.0.132                    8:53AM      9 -cl           
lab  pts/25   10.0.0.132                    8:55AM      7 -cl           
lab  pts/26   10.0.0.132                    8:56AM      6 -cl           
lab  pts/27   10.0.0.132                    8:57AM      5 -cl           
lab  pts/28   10.0.0.132                    8:58AM      4 -cl           
lab  pts/29   10.0.0.132                    9:01AM      1 -cl
```

Good part is, it was easy to isolate and identify this problem. 

In script, I was doing opening connection, capturing data and script just ends with out closing the connections. 
```python
In [5]: try: 
   ...:     ssh_conn = ConnectHandler(**R1) 
   ...:      
   ...: except Exception as err: 
   ...:     print(err) 
   ...:                      
```

Adding simple statement to disconnect the session resolved the issue. However I started looking at how to handle it better.

```python
In [24]: ssh_conn.disconnect()
```

I ended up with following way to manage it better. Using context manager, it will open connection and once we are done with data collection, it will automatically close or disconnect the connection as well. 

Disadvantage is that we have to execute the command capture code inside the with context manager or you can use earlier mentioned mathod and just close the session at the end once you are done capturing command. 
```
In [25]: try: 
    ...:     with ConnectHandler(**R1) as ssh_conn: 
    ...:         output = ssh_conn.send_command('show rsvp interface') 
    ...:         import time 
    ...:         time.sleep(10) 
    ...: except Exception as err: 
    ...:     print(err) 
```

Router logs:
```
Jan 19 17:17:59  R1 mgd[15886]: UI_LOGIN_EVENT: User 'lab' login, class 'j-super-user' [15886], ssh-connection '10.0.0.132 57238 10.0.0.1 22', client-mode 'cli'   <<< opening ssh connection
Jan 19 17:18:03  R1 mgd[15886]: UI_CMDLINE_READ_LINE: User 'lab', command 'set cli screen-length 0 '
Jan 19 17:18:03  R1 mgd[15886]: UI_CMDLINE_READ_LINE: User 'lab', command 'set cli screen-width 511 '
Jan 19 17:18:04  R1 mgd[15886]: UI_CMDLINE_READ_LINE: User 'lab', command 'show rsvp interface '  <<< collecting the data
Jan 19 17:18:14  R1 mgd[15886]: UI_LOGOUT_EVENT: User 'lab' logout   <<< closing connection
```

Do you have any better idea or way to handle it?