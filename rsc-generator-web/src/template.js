// template.js
export const template = `/interface vlan
add interface={{ WAN }} name=V20-WIFI-GRATIS vlan-id=20
add interface={{ WAN }} name=V21-WIFI-KAI vlan-id=21
add interface=sfp-sfpplus1 name=V37-MGT vlan-id=37
add interface=sfp-sfpplus1 name=V2132-INET vlan-id=2132

/interface pppoe-client
add add-default-route=yes disabled=no interface=V2132-INET name=TO_INET user={{ Hostname }}  password=IJE#25424! use-peer-dns=yes 
/ip hotspot profile
add dns-name=wifi.grts hotspot-address=192.168.20.1 html-directory=WG login-by=http-chap,http-pap name=WG

/interface list
add name=MGMT
add name=MGMT2

/ip pool
add name=pool_wifi-gratis ranges=192.168.20.2-192.168.21.254
add name=pool_wifi-kai ranges=192.168.30.2-192.168.31.254

/ip dhcp-server
add address-pool=pool_wifi-gratis interface=V20-WIFI-GRATIS name=dhcp1
add address-pool=pool_wifi-kai interface=V21-WIFI-KAI name=dhcp2

/ip hotspot
add address-pool=pool_wifi-gratis addresses-per-mac=unlimited disabled=no \\
    idle-timeout=30s interface=V20-WIFI-GRATIS name={{ Hostname }}  \\
    profile=WG

/ip hotspot user profile
set [ find default=yes ] address-pool=pool_wifi-gratis shared-users=unlimited
add add-mac-cookie=no address-pool=pool_wifi-gratis !idle-timeout \\
    !mac-cookie-timeout name=WG session-timeout=2h shared-users=unlimited

/routing table
add disabled=no fib name=For_MGMT

/snmp community
add addresses=::/0 name=SSPACE-NETWORK

/ip neighbor discovery-settings
set discover-interface-list=MGMT2

/interface list member
add interface=V2132-INET list=MGMT
add interface=V37-MGT list=MGMT2
add interface=ether10 list=MGMT2
add interface=ether9 list=MGMT2
add interface=ether8 list=MGMT2
add interface=ether7 list=MGMT2
add interface=ether6 list=MGMT2
add interface=V37-MGT list=MGMT
add interface=ether10 list=MGMT
add interface=ether9 list=MGMT
add interface=ether8 list=MGMT
add interface=ether7 list=MGMT
add interface=ether6 list=MGMT

/ip address
add address={{ IP Address }}  interface=V37-MGT network=10.240.32.0
add address=192.168.20.1/23 interface=V20-WIFI-GRATIS network=192.168.20.0
add address=192.168.30.1/23 interface=V21-WIFI-KAI network=192.168.30.0

/ip dhcp-server network
add address=192.168.20.0/23 comment="hotspot network" gateway=192.168.20.1
add address=192.168.30.0/23 gateway=192.168.30.1

/ip dns
set allow-remote-requests=yes 

/ip firewall filter
add action=passthrough chain=unused-hs-chain comment=\\
    "place hotspot rules here" disabled=yes
add action=drop chain=input comment="Drop ICMP from WIFI GRATIS to router" \
    in-interface=V20-WIFI-GRATIS protocol=icmp
add action=drop chain=input comment="Drop ICMP from WIFI KAI to router" \
    in-interface=V21-WIFI-KAI protocol=icmp
add action=drop chain=forward comment="Drop ICMP from WIFI GRATIS" \
    in-interface=V20-WIFI-GRATIS protocol=icmp
add action=drop chain=forward comment="Drop ICMP from WIFI KAI" in-interface=\
    V21-WIFI-KAI protocol=icmp
add action=drop chain=input comment=\
    "Drop mgmt default+custom from WIFI GRATIS to router" dst-port=\
    22,23,8291,8728,8729,25423,26423,25422,26422,25424,26424,25428,26428 \
    in-interface=V20-WIFI-GRATIS protocol=tcp
add action=drop chain=input comment=\
    "Drop mgmt default+custom from WIFI KAI to router" dst-port=\
    22,23,8291,8728,8729,25423,26423,25422,26422,25424,26424,25428,26428 \
    in-interface=V21-WIFI-KAI protocol=tcp
add action=drop chain=forward comment=\
    "Drop mgmt default+custom from WIFI GRATIS" dst-port=\
    22,23,8291,8728,8729,25423,26423,25422,26422,25424,26424,25428,26428 \
    in-interface=V20-WIFI-GRATIS protocol=tcp
add action=drop chain=forward comment=\
    "Drop mgmt default+custom from WIFI KAI" dst-port=\
    22,23,8291,8728,8729,25423,26423,25422,26422,25424,26424,25428,26428 \
    in-interface=V21-WIFI-KAI protocol=tcp
add action=accept chain=input connection-state=established,related
add action=accept chain=forward connection-state=established,related
add action=add-src-to-address-list address-list=PORT-SCANNER \
    address-list-timeout=1d chain=forward comment=\
    "Detect port scan WIFI GRATIS" in-interface=V20-WIFI-GRATIS protocol=tcp \
    psd=21,3s,3,1
add action=add-src-to-address-list address-list=PORT-SCANNER \
    address-list-timeout=1d chain=forward comment="Detect port scan WIFI KAI" \
    in-interface=V21-WIFI-KAI protocol=tcp psd=21,3s,3,1

/ip firewall mangle
add action=mark-connection chain=input comment="Mangle For Management RB" \\
    in-interface=V37-MGT new-connection-mark=Route_MGMT
add action=mark-routing chain=output connection-mark=Route_MGMT \\
    new-routing-mark=For_MGMT

/ip firewall nat
add action=passthrough chain=unused-hs-chain comment=\\
    "place hotspot rules here" disabled=yes
add action=masquerade chain=srcnat comment="masquerade hotspot network"

/ip hotspot user
add disabled=yes name=admin
add name=wifiguest! password=!w1figu3st# profile=WG server={{ Hostname }}

/ip hotspot walled-garden
add dst-host=adakita.id
add dst-host=macroad.co.id
add dst-host=*.macroad.co.id
add dst-host=bit.ly
add dst-host=onesignal.com
add dst-host=*.onesignal.com
add dst-host=cdn.onesignal.com
add dst-host=codifytechnology.com
add dst-host=*.codifytechnology.com
add dst-host=adakita.co
add dst-host=*.adakita.co
add dst-host=like.co.id
add dst-host=*.like.co.id
add dst-host=pixelminer.click
add dst-host=myhuaweicloud.com
add dst-host=*.myhuaweicloud.com

/ip route
add check-gateway=ping comment=Route_MGMT disabled=no distance=1 dst-address=\\
    0.0.0.0/0 gateway=10.240.32.1 pref-src="" routing-table=For_MGMT scope=30 \\
    suppress-hw-offload=no target-scope=10

/ip service
set ftp disabled=yes
set www disabled=yes
set api-ssl disabled=yes
set ssh port=25422
set telnet port=25423
set winbox port=25424
set api port=25428

/radius
add address=10.250.1.51 secret=testing123 service=login timeout=300ms

/radius incoming
set accept=yes

/snmp
set contact=sspace enabled=yes location={{ Hostname }} trap-community=\\
    SSPACE-NETWORK trap-version=2

/system clock
set time-zone-name=Asia/Jakarta

/system identity
set name={{ Identity }}

/system scheduler
add interval=3h name=sched-hapus-host on-event=hapus-host-dynamic policy=\\
    ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon \\
    start-date=2025-09-10 start-time=15:00:00

/system script
add dont-require-permissions=no name=hapus-host-dynamic owner=alhadis policy=\\
    read,write,test source="/ip hotspot host remove [find dynamic=yes]"

/tool mac-server
set allowed-interface-list=MGMT

/tool mac-server mac-winbox
set allowed-interface-list=MGMT

/user aaa
set default-group=write use-radius=yes

/user
set admin password=Admin1234`;

export default template;