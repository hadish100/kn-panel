import React, { useState } from 'react'

import UsageStats from '../components/UsageStats'
import UsersTable from '../components/UsersTable'
import Button from '../components/Button'
import CreateUserForm from '../components/CreateUserForm'
import Search from '../components/Search'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as RefreshIcon } from '../assets/refresh.svg'
import './UsersPage.css'
import Pagination from '../components/Pagination'
import Dropdown from '../components/Dropdown'
import Navbar from '../components/Navbar'

let users = [
    {
        id: 1,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 2,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 3,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 4,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 5,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 6,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 7,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 8,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 9,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 10,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 11,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 12,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 13,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 14,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 15,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 16,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 17,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 18,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 19,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 20,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 21,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 22,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 23,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 24,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 25,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 26,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 27,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 28,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 29,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 30,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 31,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 32,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 33,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 34,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 35,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 36,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 37,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 38,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 39,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 40,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 41,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 42,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 43,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 44,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 45,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 46,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 47,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 48,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 49,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 50,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 51,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 52,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 53,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 54,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 55,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 56,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 57,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 58,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 59,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 60,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 61,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 62,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 63,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 64,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 65,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 66,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 67,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 68,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 69,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 70,
        username: "soheil17",
        isActive: true,
        expireTime: {
            days: 24,
            hours: 24,
            minutes: 32
        },
        dataUsage: 350766210,
        totalData: 2008976720,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 71,
        username: "soheil18",
        isActive: false,
        expireTime: {
            days: 15,
            hours: 12,
            minutes: 42
        },
        dataUsage: 1024785,
        totalData: 2006753,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
    {
        id: 72,
        username: "soheil19",
        isActive: true,
        expireTime: {
            days: 0,
            hours: 12,
            minutes: 19
        },
        dataUsage: 2056431,
        totalData: 2056431,
        subscriptionLink: "https://www.google.com",
        config: "loreamasndlasdobobllb32o39232o2b39g9gib21neo1hn//a/sd/454/"
    },
]

const UsersPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selection, setSelection] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const handleClick = () => {
        setShowModal(true)
        console.log(currentRows.length)
    }

    const handleClose = () => {
        setShowModal(false)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const LastRowIndex = currentPage * rowsPerPage
    const FirstRowIndex = LastRowIndex - rowsPerPage
    const currentRows = users.slice(FirstRowIndex, LastRowIndex)

    const totalPages = Math.ceil(users.length / rowsPerPage)

    const handleSelect = (option) => {
        setSelection(option)
        setRowsPerPage(option.value)
    }

    const itemsPerRowOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 },
    ]

    return (

        <div className='panel_body'>
        <Navbar />
            <UsageStats activeUsers={10} totalUsers={549} dataUsage="1 GB" remainingData="198 GB" allocableData="1 TB" />
            <div className="container flex items-center justify-between   column-reverse items-end gap-16">
                <Search />
                <span style={{ display: "flex", gap: "0.5rem" }} className='items-center'>
                    <Button className="transparent refresh"><RefreshIcon /></Button>
                    <Button onClick={handleClick} className="create-user-button primary">Create User</Button>
                </span>
            </div>
            <AnimatePresence>
                {showModal && <CreateUserForm
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    handleClose={handleClose}
                />}
            </AnimatePresence>
            <UsersTable users={users} rowsPerPage={rowsPerPage} currentRows={currentRows} />
            <div className='users-page__footer' style={{ position: "relative" }}>
                <span style={{ display: "flex" }}>
                    <Dropdown options={itemsPerRowOptions} value={selection} onChange={handleSelect}>Items per page</Dropdown>
                    <span style={{ fontSize: "0.75rem", color: "var(--dark-clr-200)", marginLeft: "0.5rem", marginTop: "0.5rem" }}>Items per page</span>
                </span>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div >
   
    )
}

export default UsersPage