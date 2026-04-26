"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function page() {
  const [Blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBLogs() {
      const res = await fetch(`/api/blogs`);
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    }
    fetchBLogs();
  }, []);

  if (loading) return <div>Loading...</div>
  const handleLike = (id) => {
    setBlogs(Blogs.map(blog =>
      blog.id === id ? { ...blog, likes: (blog.likes || 0) + 1 } : blog
    ));
  };
  return (
    <div className="content-area">
      <div style={{ marginBottom: '20px' }}>
        <Link href="/blogs/new" className="btn-uiverse">
          + Create New Blog
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '800px' }}>
        {Blogs.map((item) => (
          <div key={item.id} className="neo-card">
            <div className="neo-head">
              📝 ผู้เขียน: {item.author}
            </div>
            <div className="neo-content">
              {item.coverimage && (
                <img
                  src={item.coverimage}
                  alt={item.title}
                  style={{ width: '100%', height: '400px', objectFit: 'cover', border: '2px solid #000', borderRadius: '8px' }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                <h2 style={{ marginTop: '15px', marginBottom: '10px' }}>{item.title}</h2>
                <Link href={`/blogs/${item.id}`} className="neo-btn">
                  อ่านเพิ่มเติม
                </Link>
                <button
                  onClick={() => handleLike(item.id)}
                  className="neo-like-btn"
                  style={{ justifyContent: 'center' }}
                >
                  ❤️ {item.likes || 0}
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}