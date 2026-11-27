---
title: IP Addressing in Computer Networks: IPv4 Classes, Types & Functions
date: 2026-11-28
author: Team VYOMARC Technologies
category: B.Tech Study Notes
excerpt: Complete guide to IP Addressing in Computer Networks. Learn the definition, functions, IPv4 vs IPv6 basics, address classes, and types for B.Tech exams.
---

![B.Tech Study Notes](https://img.shields.io/badge/B.Tech_Notes-Computer_Networks-blue?style=for-the-badge&logo=codeforces) ![Semester Exam](https://img.shields.io/badge/Subject-Data_Communication_&_Networks-success?style=for-the-badge)

## Definition of IP Address

In modern computer networking, an Internet Protocol (IP) address is the foundational logical coordinate that allows billions of computational devices to exchange information across local and global networks:

* **Unique Network Identifier:** An IP address is a unique numerical identifier assigned to every device (such as computers, servers, smartphones, and routers) participating in a network configured with the Internet Protocol suite.
* **Logical Addressing Scheme:** Unlike a physical MAC address which is permanently hardcoded into the network interface card (NIC), an IP address is a logical address assigned dynamically (via DHCP) or statically by network administrators, enabling hosts to relocate between networks without hardware modifications.
* **Routing and Delivery Coordinate:** It operates at the Network Layer (Layer 3 of OSI, Internet Layer of TCP/IP) to provide the routing and addressing parameters that intermediate routers inspect to forward packets toward their destination node.

---

## Functions of IP Address

An IP address performs three essential engineering functions within packet-switched networks:

* **Host Identification:** It uniquely identifies a specific computing device, interface, or host within an interconnected network environment.
* **Location Addressing:** It indicates where the device resides within the global network topology, specifying its network prefix and local subnet boundaries.
* **End-to-End Communication:** It enables routers to determine the optimal forwarding trajectory and deliver packets reliably between source and destination endpoints across the Internet.

---

## What is IPv4?

Internet Protocol version 4 (IPv4) is the fourth iteration of the Internet Protocol and the core communication technology upon which the global Internet was established:

* **Bit Size:** IPv4 utilizes a 32-bit binary addressing architecture to designate host interfaces.
* **Address Length:** The 32 bits are divided into 4 octets (4 bytes), with each octet consisting of 8 bits separated by periods.
* **Number of Addresses:** A 32-bit address space yields theoretically 2^32 distinct addresses, providing approximately 4.29 billion unique IP addresses.
* **Format:** Represented human-readably in dotted-decimal notation (e.g., 192.168.1.1), where each decimal octet ranges from 0 to 255.
* **Classes:** Historically structured into five distinct address classes (Class A, Class B, Class C, Class D, and Class E) based on leading bits to allocate varying host and network capacities.
* **Support for Transmission & Subnetting:** Supports unicast, broadcast, and multicast transmission modes, alongside classless inter-domain routing (CIDR) and variable-length subnet masking (VLSM) for efficient subnetting.

---

## IPv4 Address Classes

To distribute address allocations efficiently among organizations of varying scales, the original IPv4 specification divided the unicast and special address space into five distinct classes:

| Class | Range | Purpose | Default Subnet Mask |
| :--- | :--- | :--- | :--- |
| **Class A** | 1.0.0.0 to 126.255.255.255 | Designed for very large organizations with massive host counts | 255.0.0.0 (/8) |
| **Class B** | 128.0.0.0 to 191.255.255.255 | Allocated to medium-to-large networks such as universities and enterprises | 255.255.0.0 (/16) |
| **Class C** | 192.0.0.0 to 223.255.255.255 | Standard for small business networks, local area networks, and home LANs | 255.255.255.0 (/24) |
| **Class D** | 224.0.0.0 to 239.255.255.255 | Reserved exclusively for multicast routing and streaming groups | Not Applicable (N/A) |
| **Class E** | 240.0.0.0 to 255.255.255.255 | Reserved by IETF for research, experimental, and future developmental purposes | Not Applicable (N/A) |

*Special Reserved Block Note:* The IP address block `127.0.0.0` to `127.255.255.255` is omitted from commercial class assignments and is reserved strictly for internal host loopback diagnostics (most commonly `127.0.0.1` for localhost).

---

## Types of IPv4 Addresses

IPv4 transmission modes are classified into four distinct communication types based on the number and distribution of target recipient interfaces:

* **Unicast Address:** A point-to-point, one-to-one delivery mechanism where data packets are transmitted from a single source host directly to a single destination network interface.
* **Broadcast Address:** A one-to-all communication format where packets sent to a broadcast address (such as `255.255.255.255` for limited broadcast, or the highest address in a subnet for directed broadcast) are processed by every active host on the local physical network segment.
* **Multicast Address:** A one-to-many communication model where packets are delivered simultaneously to a specific group of subscribed host interfaces belonging to a designated multicast group (operating within the Class D range `224.0.0.0` to `239.255.255.255`).
* **Anycast Address:** A one-to-nearest delivery scheme where a single IP address is shared by multiple redundant servers across different geographical locations, and network routing protocols (such as BGP) automatically forward requests to the topologically closest server.

---

## Frequently Asked Questions (FAQ)

### What is the difference between a public IP and a private IP address?
A public IP address is globally unique and routable across the public Internet, assigned by Internet Service Providers (ISPs). A private IP address is non-routable on the public Internet and is reserved by RFC 1918 (such as 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16) for use inside local private networks, using Network Address Translation (NAT) to access external web services.

### Why is 127.0.0.1 called the loopback address?
The address 127.0.0.1 is designated as the IPv4 loopback address. When a computer sends network requests to this address, the operating system network stack routes the packets back into the local machine without placing signals on any physical network cable, enabling local server testing and inter-process communication diagnostics.

### Why did the networking industry develop IPv6?
The 32-bit IPv4 address pool provides approximately 4.29 billion total addresses, which have been virtually exhausted due to the global proliferation of mobile devices, cloud infrastructure, and IoT sensors. IPv6 utilizes a 128-bit address architecture, providing an astronomically large pool of 3.4 x 10^38 unique addresses to support long-term global growth.

### How does subnet masking work in IPv4?
A subnet mask is a 32-bit number used by network nodes to divide an IP address into two components: the Network ID (identifying the network segment) and the Host ID (identifying the specific device on that segment). By performing a bitwise AND operation between an IP address and its subnet mask, routers determine whether a destination host is local or requires remote forwarding.

---

## Conclusion & Next Topic

Understanding IPv4 addressing fundamentals, address classes, and transmission formats is indispensable for mastering computer networks, preparing for university B.Tech semester exams, and troubleshooting modern enterprise network topologies.

To examine how IP packets are processed across modular architectures, revisit our detailed guides:
* Study practical four-layer communication in our **[TCP/IP Model Explained](tcp-ip-model-explained.html)** guide.
* Review conceptual seven-layer networking in our **[OSI Reference Model](osi-reference-model-computer-network.html)** guide.

Next Topic: Learn about [IPv6 Addressing and Notation](ipv6-addressing-notation.html).

---

## 🏢 About VYOMARC Technologies

**VYOMARC Technologies** is an engineering-first software architecture and digital technology company based in Ramchandarpur, Bihar Sharif, Nalanda, Bihar (PIN 803216). We engineer production-grade enterprise software, custom high-performance web systems, and secure institutional platforms.

* **Office Address:** Ramchandarpur, Bihar Sharif, Nalanda, Bihar - 803216
* **Email:** vyomarctechnologies@gmail.com
* **Call / WhatsApp:** +91 825 270 2699
* **Operational Hours:** Mon-Sat, 10:00 AM to 4:00 PM

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between a public IP and a private IP address?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A public IP address is globally unique and routable across the public Internet. A private IP address is non-routable on the public Internet and is reserved for use inside local private networks, using Network Address Translation (NAT) to access external web services."
      }
    },
    {
      "@type": "Question",
      "name": "Why is 127.0.0.1 called the loopback address?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The address 127.0.0.1 is designated as the IPv4 loopback address. When a computer sends network requests to this address, the operating system routes the packets back into the local machine without placing signals on any physical network cable."
      }
    },
    {
      "@type": "Question",
      "name": "Why did the networking industry develop IPv6?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 32-bit IPv4 address pool provides approximately 4.29 billion total addresses, which have been exhausted. IPv6 utilizes a 128-bit address architecture, providing 3.4 x 10^38 unique addresses to support long-term global growth."
      }
    },
    {
      "@type": "Question",
      "name": "How does subnet masking work in IPv4?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A subnet mask is a 32-bit number used by network nodes to divide an IP address into two components: the Network ID and the Host ID. A bitwise AND operation between an IP address and its subnet mask determines whether a destination host is local or remote."
      }
    }
  ]
}
</script>
