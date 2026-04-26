"use client" 
import React, { useState } from 'react'
import Link from 'next/link'

export default function MainLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const myGroup = [
        { id: 1, name: "Punyavee", desc1: "Good Presenter" ,desc2: "Good Ideas", img: "/Angpao.jpg" },
        { id: 2, name: "Wiratchaphon", desc1: "Good Morning", desc2: "Good Night", img: "/Mai.jpg" },
        { id: 3, name: "Thuntanit", desc1: "Good Job", desc2: "Good Bye", img: "/Potae.jpg" },
    ];

    return (
        <div className="main-layout">
            <header className="top-nav">
                <button
                    className="hamburger-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    ☰
                </button>
                <h2>ฺBlogs too Box</h2>
            </header>

            <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                <ul className="sidebar-menu">
                    <li>
                        <Link href="/blogs" className="sidebar-link">
                            <span className="icon">🏠</span>
                            <span className={`text ${isSidebarOpen ? '' : 'hidden'}`}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/popular" className="sidebar-link">
                            <span className="icon">🔥</span>
                            <span className={`text ${isSidebarOpen ? '' : 'hidden'}`}>Popular</span>
                        </Link>
                    </li>
                </ul>
            </aside>

            <main className="main-content-wrapper">
                {children}
            </main>
            <aside className="right-sidebar">
                <div className="right-card">
                    <h3>Name of the group</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {myGroup.map((member) => (
                            <li key={member.id}>
                                <div className="profile-card" style={{ marginBottom: 0 }}>
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="profile-avatar"
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 900, fontSize: '1rem' }}>{member.name}</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{member.desc1}</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{member.desc2}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>
            </aside>

        </div>
    )
}