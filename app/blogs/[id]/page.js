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
    <div className="main-content-wrapper">
      <p className="detail-loading">กำลังโหลด...</p>
    </div>
  );

  if (!blog) return (
    <div className="main-content-wrapper">
      <div className="detail-not-found">
        <p>ไม่พบบทความ</p>
        <Link href="/blogs" className="detail-back-link">← กลับหน้าหลัก</Link>
      </div>
    </div>
  );

  return (
    <div className="main-content-wrapper">
      <article className="neo-detail-card">

        {/* action bar: กลับ / แก้ไข / ลบ */}
        <div className="neo-detail-actions">
          <Link href="/blogs" className="neo-detail-back">← กลับ</Link>
          <div className="neo-detail-action-btns">
            <Link href={`/blogs/${id}/edit`} className="neo-btn-action neo-btn-edit">
              แก้ไข
            </Link>
            <button
              className="neo-btn-action neo-btn-delete"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? 'กำลังลบ...' : 'ลบ'}
            </button>
          </div>
        </div>

        {/* header: avatar + author */}
        <div className="neo-head">
          <div className="neo-author-avatar">
            {blog.author?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <span className="neo-author-name">📝 ผู้เขียน: {blog.author}</span>
        </div>

        <div className="neo-content">
          {/* cover image */}
          {blog.coverimage && (
            <div className="neo-detail-cover">
              <img src={blog.coverimage} alt={blog.title} />
            </div>
          )}

          {/* title */}
          <h1 className="neo-detail-title">{blog.title}</h1>

          {/* divider */}
          <div className="neo-detail-divider" />

          {/* content */}
          <div className="neo-detail-content">
            {blog.content}
          </div>

          {/* error */}
          {error && (
            <p className="neo-detail-error">{error}</p>
          )}
        </div>

      </article>
    </div>
  );
}