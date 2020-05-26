---
title: "Vagrant to turn up Cumulus Linux"
last_modified_at: 2020-05-25T00:00:03-05:00
categories:
  - Blog
tags:
  - - [Networking, NetOps]
---

Goal of this blog post to was learn Vagrant to turn up the multiple VMs. I was planning to explore Cumulus Linux for long time so I thought of combined learning of Vagrant to bring up two Cumulus Linux VM topology and bring up EBGP multipath between them.

Vagrant can be used with VM providers, there are many including VirtualBox and KVM. We are going to use VirtualBox. VirtualBox is default choice of Vagrant so you don’t have to define it in Vagrant file. 

Cumulus Linux site has related details on Vagrant usage as well as configuration/verification of protocols.

You can create any folder and create Vagrant file in it, I have it located at:

```
/mnt/c/Users/lab/vagrant
lab> ls -l
total 8
-rwxrwxrwx 1 root root 4100 May 25 15:03 Vagrantfile
lab>
```

So lets start with exploring the Vagrant file fist:

```
VX_BOX = "CumulusCommunity/cumulus-vx"

Vagrant.configure(2) do |config|

  config.vm.define "r1" do |r1|
    r1.vm.box = VX_BOX

    # Internal network for swp* interfaces.
    r1.vm.network "private_network", virtualbox__intnet: "swp1", auto_config: false
    r1.vm.network "private_network", virtualbox__intnet: "swp2", auto_config: false
  end

  config.vm.define "r2" do |r2|
    r2.vm.box = VX_BOX

    # Internal network for swp* interfaces.
    r2.vm.network "private_network", virtualbox__intnet: "swp1", auto_config: false
    r2.vm.network "private_network", virtualbox__intnet: "swp2", auto_config: false
  end
```
In above config file, ```VX_BOX``` is like a variable which indicates which kind of VM you want to provision in your topology. In our adventure, we are looking to spin Cumulus Linux VM.  ```VX_BOX``` is reference in ```r1.vm.box``` and ```r2.vm.box``` so we are going to provision two Cumulus Linux VM name ```r1``` and ```r2```.

```r1``` and ```r2``` are my VM names which are defined with ```config.vm.define```.

```r1.vm.network``` defines the interface and related configuration properties. Here for each VM, we are provisioning 2 interfaces name ```swp[1-2]``` which are connected to ```private_network``` bridge. 

Once you have Vagrant file ready with VMs and connectivity definition, you are all set to launch the VMs using following command:

```vagrant up```

#### How to verify the VMs status:
```
PS C:\Users\lab\vagrant> vagrant status
Current machine states:

r1                        running (virtualbox)
r2                        running (virtualbox)
```

#### How to check the VMs parameters:
```
PS C:\Users\lab\vagrant> vagrant ssh-config
Host r1
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile C:/Users/lab/vagrant/.vagrant/machines/r1/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL

Host r2
  HostName 127.0.0.1
  Port 2200
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile C:/Users/lab/vagrant/.vagrant/machines/r2/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL
```

#### Vagrant global-status
```
PS C:\Users\lab\vagrant> vagrant global-status
id       name    provider   state   directory
---------------------------------------------------------------------------
572f2fb  r1      virtualbox running C:/Users/lab/vagrant
2cbf6a8  r2      virtualbox running C:/Users/lab/vagrant
```

This will fetch and download the Cumulus Linux box reference and turn on the VMs. It also check the connectivity to VM. Once everything is ready, you can login to VMs using ```vagrant ssh``` command as shown below:
```
vagrant> vagrant ssh r1
Linux r1 4.19.0-cl-1-amd64 #1 SMP Cumulus 4.19.94-1+cl4u3 (2020-03-05) x86_64

Welcome to Cumulus VX (TM)

Cumulus VX (TM) is a community supported virtual appliance designed for
experiencing, testing and prototyping Cumulus Networks' latest technology.
For any questions or technical support, visit our community site at:
http://community.cumulusnetworks.com

The registered trademark Linux (R) is used pursuant to a sublicense from LMI,
the exclusive licensee of Linus Torvalds, owner of the mark on a world-wide
basis.
Last login: Tue May 26 01:51:04 2020 from 10.0.2.2


vagrant@r1:mgmt:~$
```
Once you login, you can execute all regular Linux command. Here we will go over the configuration and verification mostly from VM ```r1```. 

To verify anything related to Cumulus Linux networking components, one can use ```net``` command which we will explore now.

```
root@r1:mgmt:~# net

Usage:
    # net <COMMAND> [<ARGS>] [help]
    #
    # net is a command line utility for networking on Cumulus Linux switches.
    #
    # COMMANDS are listed below and have context specific arguments which can
    # be explored by typing "<TAB>" or "help" anytime while using net.
    #
    # Use "man net" for a more comprehensive overview.

    net abort
    net commit [verbose] [confirm [<number-seconds>]] [description <wildcard>]
    net commit permanent <wildcard>
    net del all
    net help [verbose]
    net pending [json]
    net rollback (<number>|last)
    net rollback description <wildcard-snapshot>
    net show commit (history|<number>|last)
    net show rollback (<number>|last)
    net show rollback description <wildcard-snapshot>
    net show configuration [commands|files|acl|bgp|multicast|ospf|ospf6]
    net show configuration interface [<interface>] [json]

Options:

    # Help commands
    help     : context sensitive information; see section below
    example  : detailed examples of common workflows

    # Configuration commands
    add      : add/modify configuration
    del      : remove configuration

    # Commit buffer commands
    abort    : abandon changes in the commit buffer
    commit   : apply the commit buffer to the system
    pending  : show changes staged in the commit buffer
    rollback : revert to a previous configuration state

    # Status commands
    show     : show command output
    clear    : clear counters, BGP neighbors, etc

    <number-seconds> : Number of seconds
```

#### How do I configure interfaces:
```
net add interface swp1 ip address 1.1.1.1/24
net add interface swp2 ip address 1.1.2.1/24
```	   

#### How do I verify the interface status:
```
root@r1:mgmt:~# net show interface
State  Name  Spd  MTU    Mode          LLDP       Summary
-----  ----  ---  -----  ------------  ---------  ----------------------
UP     lo    N/A  65536  Loopback                 IP: 127.0.0.1/8
       lo                                         IP: ::1/128
UP     eth0  1G   1500   Mgmt                     Master: mgmt(UP)
       eth0                                       IP: 10.0.2.15/24(DHCP)
UP     swp1  1G   9216   Interface/L3  r2 (swp1)  IP: 1.1.1.1/24
UP     swp2  1G   9216   Interface/L3  r2 (swp2)  IP: 1.1.2.1/24
UP     mgmt  N/A  65536  VRF                      IP: 127.0.0.1/8
       mgmt                                       IP: ::1/128
```

#### How do I verify the lldp neighbor status:
```
root@r1:mgmt:~# net show lldp

LocalPort  Speed  Mode          RemoteHost  RemotePort
---------  -----  ------------  ----------  ----------
swp1       1G     Interface/L3  r2          swp1
swp2       1G     Interface/L3  r2          swp2
```

#### How do I configure the BGP:
```
net add bgp autonomous-system 100
net add bgp router-id 0.0.0.1
net add bgp neighbor 1.1.1.2 remote-as external
net add bgp bestpath as-path multipath-relax
```
#### How do I apply the configuration:
```
net commit
```
There are few configuration management commands similar to JUNOS are also available:
```
root@r1:mgmt:~#  net commit
    confirm      :  approve, acknowledge, etc
    description  :  description
    permanent    :  Duplicate address detection permanent freez
    verbose      :  show detailed output
    <ENTER>
root@r1:mgmt:~# net rollback
    <number>     :  any integer
    description  :  description
    last         :  the most recent 'net commit' snapshot
root@r1:mgmt:~# net pending
    json  :  Print output in json
    <ENTER>
```	

#### How do I verify the BGP neighbor status:
```
root@r1:mgmt:~# net show bgp summary
show bgp ipv4 unicast summary
=============================
BGP router identifier 0.0.0.1, local AS number 100 vrf-id 0
BGP table version 1
RIB entries 1, using 184 bytes of memory
Peers 2, using 41 KiB of memory

Neighbor         V         AS MsgRcvd MsgSent   TblVer  InQ OutQ  Up/Down State/PfxRcd
cumulus(1.1.1.2) 4        200    8246    8268        0    0    0 06:52:16            0
cumulus(1.1.2.2) 4        200     795     800        0    0    0 00:39:36            0

Total number of neighbors 2
```

#### How do I check the BGP configuration:

```
root@r1:mgmt:~# net show configuration bgp

frr version 7.0+cl4u3

frr defaults datacenter

hostname cumulus

log syslog informational

hostname r1

service integrated-vtysh-config

router bgp 100
  bgp router-id 0.0.0.1
  bgp bestpath as-path multipath-relax
  neighbor 1.1.1.2 remote-as external
  neighbor 1.1.2.2 remote-as external

  address-family ipv4 unicast
    network 192.168.100.0/24

line vty
```

#### We can use ```more``` and ```egrep``` Linux utility as and when we need them to scroll or parse through the commands:
```
root@r1:mgmt:~#  net show configuration | egrep -i 1.1.1.2
  neighbor 1.1.1.2 remote-as external
  address 1.1.1.1/24

root@r1:mgmt:~#  net show configuration | more

dns

  nameserver
    10.0.2.3 # vrf mgmt

time

  zone
    Etc/UTC
```  

#### how do I configure null0 static route:

```
net add routing route 192.168.100.0/24 Null0
```

#### How do I verify the route status:
Take a note that the ECMP is enabled by default on Cumulus Linux box.
```
root@cumulus:mgmt:~# net show route
show ip route
=============
Codes: K - kernel route, C - connected, S - static, R - RIP,
       O - OSPF, I - IS-IS, B - BGP, E - EIGRP, N - NHRP,
       T - Table, v - VNC, V - VNC-Direct, A - Babel, D - SHARP,
       F - PBR, f - OpenFabric,
       > - selected route, * - FIB route, q - queued route, r - rejected route

C>* 1.1.1.0/24 is directly connected, swp1, 06:25:58
C>* 1.1.2.0/24 is directly connected, swp2, 06:25:58
B>* 192.168.100.0/24 [20/0] via 1.1.1.1, swp1, 00:00:05
  *                         via 1.1.2.1, swp2, 00:00:05
```	

#### How to clear protocol adjacency:
```
root@r1:mgmt:~# net clear
    bgp       :  Border Gateway Protocol
    counters  :  net show counters
    evpn      :  Ethernet VPN
    ip        :  Internet Protocol version 4/6
    ipv6      :  Internet Protocol version 6
    ospf      :  Open Shortest Path First (OSPFv2)
    ospf6     :  Open Shortest Path First (OSPFv3)
```

#### How to add debug or traces:
```
root@r1:mgmt:~# net add bgp debug
    bestpath         :  BGP bestpath
    keepalives       :  BGP keepalives
    neighbor-events  :  Neighbor state transition events
    updates          :  BGP updates
    zebra            :  Zebra information
```

#### How to read the debugs:
```
root@r1:mgmt:~# net show debugs
Zebra debugging status:

BGP debugging status:



Static debugging status
```

#### We can use Vagrant commands to stop, start, pause or reload the VMs we have provisioned:
```
Usage: vagrant [options] <command> [<args>]

    -h, --help                       Print this help.

Common commands:
     box             manages boxes: installation, removal, etc.
     cloud           manages everything related to Vagrant Cloud
     destroy         stops and deletes all traces of the vagrant machine
     global-status   outputs status Vagrant environments for this user
     halt            stops the vagrant machine
     help            shows the help for a subcommand
     init            initializes a new Vagrant environment by creating a Vagrantfile
     login
     package         packages a running vagrant environment into a box
     plugin          manages plugins: install, uninstall, update, etc.
     port            displays information about guest port mappings
     powershell      connects to machine via powershell remoting
     push            deploys code in this environment to a configured destination
     rdp             connects to machine via RDP
     reload          restarts vagrant machine, loads new Vagrantfile configuration
     resume          resume a suspended vagrant machine
     snapshot        manages snapshots: saving, restoring, etc.
     ssh             connects to machine via SSH
     ssh-config      outputs OpenSSH valid configuration to connect to the machine
     status          outputs status of the vagrant machine
     suspend         suspends the machine
     up              starts and provisions the vagrant environment
     upload          upload to machine via communicator
     validate        validates the Vagrantfile
     version         prints current and latest Vagrant version
     winrm           executes commands on a machine via WinRM
     winrm-config    outputs WinRM configuration to connect to the machine
```
Few references I used to learn about Cumulus Linux cli and Vagrant file Definition:
- 	[Dinesh Dutt's Cloud native datacenter networking book topologies](https://github.com/ddutt/cloud-native-data-center-networking/tree/master/topologies/){:target="_blank"}
-	[Cumulus Open Networking Certification book](https://cumulusnetworks.com/learn/resources/guides/cconp-exam-study-guide){:target="_blank"}
