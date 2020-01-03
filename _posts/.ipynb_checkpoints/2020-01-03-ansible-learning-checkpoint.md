---
title: "Learning Ansible automation to manage network devices in the lab"
last_modified_at: 2020-01-03T00:00:01-05:00
categories:
  - Blog
tags:
  - - NetOps
---

With so many tools available, I decided to try out the Ansible to see how it works and what can I do with it so documenting few things that I tried with it.

- my Ansible directory tree structure
- Ansible default config file and modification
- creating inventory 
- defining variables in inventory as well as global variables, I decided to use username and password which I can supply to all my hosts in variable
- Different example of play books:
    - Capturing data using show commands
    - Configure device using set commands in separate files
    - How to pass username and password as variable 
- How to execute the play book and various options.

#### My ansible dir structure looks like this:

```
ansible/
|-- ansible.cfg
|-- ansible_inventory
|   |-- group_vars
|   |   `-- all.yaml
|   `-- inventory
|-- ansible_playbooks
|   |-- playbook_filter_file.yaml
|   |-- playbook_lo0_desc.yaml
|   |-- playbook_uptime_prompt.yaml
|   `-- playbook_version_uptime.yaml
|-- router_config
|   `-- r1_filter.conf
`-- uptime.yaml
```

#### Ansible config file
```
root@ubuntu:~# cat ansible/ansible.cfg 
[defaults]

inventory = /home/lab/ansible/ansible_inventory/inventory
host_key_checking = False

[ssh_connection]
scp_if_ssh=True
```

#### Ansible inventory and groups variables:

```
root@ubuntu:~# cat ansible/ansible_inventory/group_vars/all.yaml 
username: lab
password: lab123

root@ubuntu:~# cat ansible/ansible_inventory/inventory 
[lab]
r1 ansible_host=10.1.1.1 device_role=router

[routers:children]
lab

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

#### Example playbook file:

In this example, we are going to configure the router with few filter terms using set commands. Configuration set commands are stored in separate file named ```r1_filter.conf```.

```
root@ubuntu:~# cat ansible/ansible_playbooks/playbook_filter_file.yaml 
---
- name: Filter config from file
  hosts: 
    - lab
  roles:
    - Juniper.junos
  connection: local
  gather_facts: no

  tasks:
  
    - name: config firewall filter from file
      juniper_junos_config:
        load: set
        src: /home/lab/ansible/router_config/r1_filter.conf
        comment: configuring filter from file

    - name: verify firewall
      juniper_junos_command:
        commands:
          - "show configuration firewall"
      register: junos_result

    - name: Print response
      debug:
        var: junos_result
```
```r1_filter.conf``` file content:

```
root@ubuntu:~# cat ansible/router_config/r1_filter.conf 
set firewall family inet filter scale term 1 from destination-address 192.168.1.1
set firewall family inet filter scale term 1 then accept
set firewall family inet filter scale term 2 from destination-address 192.168.1.2
set firewall family inet filter scale term 2 then accept
set firewall family inet filter scale term 3 from destination-address 192.168.1.3
set firewall family inet filter scale term 3 then accept
```

Another example playbook file where we are just reading the show commands and supplying username and password from variable file:

```
root@ubuntu:~# cat ansible/ansible_playbooks/playbook_version_uptime.yaml 
---
- name: Get device information
  hosts: 
    - lab
  roles:
    - Juniper.junos
  connection: local
  gather_facts: no

  tasks:
    - name: Get software and uptime information
      juniper_junos_command:        
        user: "{{username}}"
        passwd: "{{password}}"
        commands: 
          - "show system uptime"
      register: junos_result

    - name: Print response
      debug:
        var: junos_result
```
Complete output of ```playbook_version_uptime.yaml ``` playbook execution:

```

root@ubuntu:~/ansible# ansible-playbook playbook_version_uptime.yaml 

PLAY [Get device information] ***************************************************************************************************************************************************************************************

TASK [Get software and uptime information] **************************************************************************************************************************************************************************
ok: [r1]

TASK [Print response] ***********************************************************************************************************************************************************************************************
ok: [r1] => {
    "junos_result": {
        "changed": false,
        "command": "show system uptime",
        "failed": false,
        "format": "text",
        "msg": "The command executed successfully.",
        "stdout": "\nCurrent time: 2020-01-03 11:08:04 PST\nTime Source:  NTP CLOCK \nSystem booted: 2019-11-20 13:39:36 PST (6w1d 21:28 ago)\nProtocols started: 2019-12-19 10:17:01 PST (2w1d 00:51 ago)\nLast configured: 2020-01-03 10:38:36 PST (00:29:28 ago) by lab\n11:08AM  up 43 days, 21:28, 1 users, load averages: 4.54, 4.33, 4.28\n",
        "stdout_lines": [
            "",
            "Current time: 2020-01-03 11:08:04 PST",
            "Time Source:  NTP CLOCK ",
            "System booted: 2019-11-20 13:39:36 PST (6w1d 21:28 ago)",
            "Protocols started: 2019-12-19 10:17:01 PST (2w1d 00:51 ago)",
            "Last configured: 2020-01-03 10:38:36 PST (00:29:28 ago) by lab",
            "11:08AM  up 43 days, 21:28, 1 users, load averages: 4.54, 4.33, 4.28"
        ]
    }
}

PLAY RECAP **********************************************************************************************************************************************************************************************************
r1                         : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

root@ubuntu:~/ansible# 
```

Few more ways to execute the playbook where you supply the username and password separately:
``` 2010  ansible-playbook -i inventory playbook_filter_file.yaml -u labroot -k ```

Documenting data for my own reference in future as well as to help others if they are looking for something and may find it useful.