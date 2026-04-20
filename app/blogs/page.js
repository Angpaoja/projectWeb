
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

  return (
    <div>
      <h1>Blogs</h1>
       <div style={{ marginBottom: '30px' ,display: 'flex' , justifyContent : 'flex-end' }}>
        <Link href="/blogs/new" className= "btn-uiverse">
         + Create New Blog</Link>
      </div>

     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', marginTop: '20px' }}> 
        {Blogs.map((item) => (
          <div key={item.id} className="neo-card">
            <div className="neo-head">
               📝 ผู้เขียน: {item.author}
            </div>
            <div className="neo-content">
              <h2>{item.title}</h2>
              <img 
                src={item.coverimage} 
                alt={item.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', border: '2px solid #000', borderRadius: '4px' }} 
              />
              <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </p>              
              <Link href={`/blogs/${item.id}`} className="neo-btn">
                อ่านเพิ่มเติม
              </Link>
            </div>
            
          </div>
        ))}

      </div>
    </div>
  )
}

