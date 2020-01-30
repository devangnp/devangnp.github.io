---
title: "Netmiko multithreading with Junos devices"
last_modified_at: 2020-01-29T00:00:00-06:00
categories:
  - Blog
tags:
  - - NetOps
---

Automation of networking is always comes with scale requirement, manage or connect or capture data from so many devices, create reports of each device in separate files etc. Such requirements demands for multithreading or multiprocessing. 

Since connecting to routers or capturing data, storing collected data to the different files has some inbuilt I/O waiting/delay, we can use multithreading here.

Here I am using JUNOS devices, we can use any other vendor box or link servers to connect to and collect outputs. 

Required imports:
```python
from netmiko import juniper
from netmiko import ConnectHandler, file_transfer
import csv
import concurrent.futures as cf
import time
```
We may have long list of devices that we might want to work with so instead of defining all the devices in list and then iterating over it, let's use the CSV files which has list of routers and its parameters.
```python
'''
Function to read device data from CSV file and
return device list data to main.
'''


def read_devices(devicefile):
    with open(devicefile) as dfh:
        csv_reader = csv.DictReader(dfh)
        for device in csv_reader:
            yield device
```
As a part of modular approach, using the different function which can be used to initiate the connection to router using Netmiko module:
```python
'''
Function to connect to device using netmiko
after connection sucessful, it calls function to
collect data
'''


def connect_device(device_data):
    try:
        rtr = ConnectHandler(device_type=device_data['dtype'],
                             ip=device_data['ip'],
                             username=device_data['myuser'],
                             password=device_data['mypassword'])
    except Exception as error:
        print(error)
    goget_data(rtr, device_data)
```
Once device connections is established, we can use the following function to pass on the commands that we can capture from the interested devices, here we can use list or CSV or text files to supply the commands. Here I am using the list of commands to capture the data.

This function take cares of the writing collected commands output to the files for later analysis if we want to. I am closing the connection to the router in this function. We can write functions to take care of writing commands output to the file.
```python
'''
Supplying commands to be collected and write
output to file.
'''


def goget_data(rtr, device_data):
    cmds = ['show rsvp interface', 'show mpls interface']
    for cmd in cmds:
        outputfile = outputfildir + timestr + \
                        '-' + device_data['name'] + cmd.replace(' ', '-') + '.log'
        with open(outputfile, 'w') as ofh:
            print(f'### Collecting {cmd} data from {device_data["name"]}')
            output = rtr.send_command(cmd)
            ofh.write(time.ctime() + '\n')
            ofh.write(f'###   Hostname: {device_data["name"]}')
            ofh.write(output)
    rtr.disconnect()
```
Main function which calls all other function conncurently by creating threads using ThreadPoolExecutior:
```python
'''
Main function
filename formatting
Multithreading code
'''

starttime = (time.time())
print(starttime)

outputfildir = '/home/labroot/PythonMyProg/'\
                'py_networking/NetOps/netmiko_examples/outputs/'
timestr = time.strftime("%Y%m%d-%H%M%S")
device_data = read_devices('device-file.csv')
print(type(device_data))

'''
Creating threads to connect to devices simultaneously.
'''
with cf.ThreadPoolExecutor(max_workers=5) as ex:
    ex.map(connect_device, device_data)

print('Done collecting data')
print('Total time:', time.time()-starttime)
```
Script prints out following to let us know that it has completed the collecting the outputs:
```
### Collecting show rsvp interface data from r1
### Collecting show mpls interface data from r1
### Collecting show rsvp interface data from r2
### Collecting show mpls interface data from r2
### Collecting show rsvp interface data from r3
### Collecting show mpls interface data from r3
### Collecting show rsvp interface data from r4
### Collecting show mpls interface data from r4
Done collecting data
Total time: 6.01638388633728
```
As you can see the script completed the data collections of 4 routers with outputs stored in the appropriate files in 6 sceonds with ```max_workers=5```. 

How can I convert the script to sequential execution? Simple, by using ```max_workers=1```, script took around ```Total time: 23.678042888641357``` seconds to complete the work.

Agree that we can use Ansible or Salt to take care of heavy lifting but something to try out completely as python program.

Any better way to achieve it? 