---
title: "Where would I start learning network automation?"
last_modified_at: 2020-05-06T00:00:03-05:00
categories:
  - Blog
tags:
  - - [NetOps]
---

I had trouble identifying where to start with my automation journey being network engineer who spend most of the time on routers, network debugging, lab replication etc. 

Looking at me learning, my few colleagues also were asking me the same question so I thought of documenting this blog post which is more of the questions or task one should start with.

#### Let's start with Python and explore: 
- Pick your favorite networking vendor.
- Check out if they have Python library to connect, collect and parse the data if not you can pick netconf, netmiko, napalm etc...
- Once you have identify the vendor, pick a device or use GNS3 to simulate the device.
- Figure out, what are the configuration knobs you have to enable on router for automation/ssh/netconf to work.
- Pick two commands you are using most frequently: one command should be structured and one is not structured.
- Find out if that output can be displayed in XML or JSON? commands which can be displayed in XML or JSON, I would consider it structured vs non structured command output.
- Identify if RPC of that command is available to call or execute command.
- For structured command, learn how to read XML or JSON hierarchy and identify only one or two field out of whole command that you want to capture.
- Identify how would you connect/login into router using python script.
- Once login, identify how would you execute the command or RPC of the command. 
- Identify which format have you received the output.
- Parse the various hierarchy to extract the data you want, if it is unstructured command then use the existing textFsm or define new textfsm file.
- print the output as is on the screen.
- Print output with proper message on screen.
- Capture the output multiple time and store it in list.
- Capture the output multiple time and store it in file.
- Define the threshold, if reading is great or less then threshold, print log with proper warning.
- If threshold is breach, write a module or function to take some action or print log message.

#### Next tasks:
- Find out one more command that you can run on FPC or line card and use all above points to create automation. Mostly the FPC commands are unstructured. 
- Create YAML file filter of the structured command and use it to extract the same information as mentioned above. 
- Login to the router and capture a log messages using script, in same script parse a log patter and chop it down into multiple string, based on the log message trigger the action of disabling interface or capture "request support information" or show tech command. 

#### Next let's accomplished same tasks using available automation tools:
- Ansible
- Nornir
- SaltStack

#### Next journey to create the web page to display nicely: 
- How can I integrate the Flask with Python tool I have built?
