/interface vlan
add interface=sfp-sfpplus1 name=V20-WIFI-GRATIS vlan-id=20
add interface=sfp-sfpplus1 name=V21-WIFI-KAI vlan-id=21
add interface=sfp-sfpplus1 name=V37-MGT vlan-id=37
add interface=sfp-sfpplus1 name=V2132-INET vlan-id=2132

/interface pppoe-client
add add-default-route=yes disabled=no interface=V2132-INET name=TO_INET user={{ Hostname }}  password=IJE#25424! use-peer-dns=yes 
/ip hotspot profile
add dns-name=wifi.grts hotspot-address=192.168.20.1 html-directory=WG login-by=http-chap,http-pap name=WG

/ip pool
add name=pool_wifi-gratis ranges=192.168.20.2-192.168.21.254
add name=pool_wifi-kai ranges=192.168.30.2-192.168.31.254

/ip dhcp-server
add address-pool=pool_wifi-gratis interface=V20-WIFI-GRATIS name=dhcp1
add address-pool=pool_wifi-kai interface=V21-WIFI-KAI name=dhcp2

/ip hotspot
add address-pool=pool_wifi-gratis addresses-per-mac=unlimited disabled=no \
    idle-timeout=30s interface=V20-WIFI-GRATIS name={{ Hostname }}  \
    profile=WG

/ip hotspot user profile
set [ find default=yes ] address-pool=pool_wifi-gratis shared-users=unlimited
add add-mac-cookie=no address-pool=pool_wifi-gratis !idle-timeout \
    !mac-cookie-timeout name=WG session-timeout=2h shared-users=unlimited

/routing table
add disabled=no fib name=For_MGMT

/snmp community
add addresses=::/0 name=SSPACE-NETWORK

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
add action=passthrough chain=unused-hs-chain comment=\
    "place hotspot rules here" disabled=yes

/ip firewall mangle
add action=mark-connection chain=input comment="Mangle For Management RB" \
    in-interface=V37-MGT new-connection-mark=Route_MGMT
add action=mark-routing chain=output connection-mark=Route_MGMT \
    new-routing-mark=For_MGMT

/ip firewall nat
add action=passthrough chain=unused-hs-chain comment=\
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
add check-gateway=ping comment=Route_MGMT disabled=no distance=1 dst-address=\
    0.0.0.0/0 gateway=10.240.32.1 pref-src="" routing-table=For_MGMT scope=30 \
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
set contact=sspace enabled=yes location={{ Hostname }} trap-community=\
    SSPACE-NETWORK trap-version=2

/system clock
set time-zone-name=Asia/Jakarta

/system identity
set name={{ Identity }}

/system scheduler
add interval=3h name=sched-hapus-host on-event=hapus-host-dynamic policy=\
    ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon \
    start-date=2025-09-10 start-time=15:00:00

/system script
add dont-require-permissions=no name=hapus-host-dynamic owner=alhadis policy=\
    read,write,test source="/ip hotspot host remove [find dynamic=yes]"

/user aaa
set default-group=write use-radius=yes

/user
set admin password=Admin1234