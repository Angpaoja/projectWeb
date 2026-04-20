"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`/api/blogs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "ไม่พบบทความ");
      }
      setLoading(false);
    }
    fetchBlog();
  }, [id]);

  async function onDelete() {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "ลบไม่สำเร็จ");
      router.push('/blogs');
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f7' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid #e0ddd8', borderTop: '2px solid #2c2c2a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: "'Lora', serif", color: '#888780', fontSize: 15 }}>กำลังโหลด...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!blog) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf9f7', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontFamily: "'Lora', serif", fontSize: 24, color: '#2c2c2a' }}>ไม่พบบทความ</p>
      <Link href="/blogs" style={{ fontSize: 14, color: '#185fa5', textDecoration: 'none' }}>← กลับหน้าหลัก</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .btn-edit:hover { background: #185fa5 !important; color: white !important; border-color: #185fa5 !important; }
        .btn-delete:hover { background: #a32d2d !important; color: white !important; border-color: #a32d2d !important; }
        .btn-back:hover { color: #2c2c2a !important; }
      `}</style>

      {/* Top Nav */}
      <header style={{ borderBottom: '1px solid #e0ddd8', background: '#faf9f7', padding: '0 40px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link href="/blogs">
            <span className="btn-back" style={{ fontSize: 14, color: '#888780', cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
              ← กลับ
            </span>
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/blogs/${id}/edit`}>
              <button className="btn-edit" style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #d3d1c7', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#2c2c2a', transition: 'all 0.2s ease' }}>
                แก้ไข
              </button>
            </Link>
            <button
              className="btn-delete"
              onClick={onDelete}
              disabled={deleting}
              style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #d3d1c7', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: deleting ? 'not-allowed' : 'pointer', color: '#a32d2d', transition: 'all 0.2s ease', opacity: deleting ? 0.5 : 1 }}
            >
              {deleting ? 'กำลังลบ...' : 'ลบ'}
            </button>
          </div>
        </div>
      </header>

      {/* Article */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 40px 100px' }}>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#d3d1c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#5f5e5a', flexShrink: 0 }}>
            {blog.author?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <span style={{ fontSize: 14, color: '#5f5e5a', fontWeight: 400 }}>{blog.author}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 38, fontWeight: 600, color: '#2c2c2a', lineHeight: 1.25, letterSpacing: '-1px', marginBottom: 32 }}>
          {blog.title}
        </h1>

        {/* Cover Image */}
        {blog.coverimage && (
          <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 40, background: '#e0ddd8' }}>
            <img src={blog.coverimage} alt={blog.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Divider */}
        <div style={{ width: 40, height: 2, background: '#2c2c2a', marginBottom: 32 }} />

        {/* Content */}
        <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 18, lineHeight: 1.85, color: '#444441', letterSpacing: '0.1px' }}>
          {blog.content}
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 24, padding: '12px 16px', background: '#fcebeb', border: '1px solid #f7c1c1', borderRadius: 6, color: '#a32d2d', fontSize: 14 }}>
            {error}
          </div>
        )}
      </article>
    </div>
  );
}