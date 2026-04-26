"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [form, setForm] = useState({
    title: "", content: "", coverimage: "", author: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          title: data.title ?? "",
          content: data.content ?? "",
          coverimage: data.coverimage ?? "",
          author: data.author ?? ""
        });
      } else {
        setError(data?.error || "ไม่พบบทความ");
      }
      setLoading(false);
    })();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); 
    setError("");

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "แก้ไขไม่สำเร็จ");
      
      router.push(`/blogs/${id}`); 
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
   <div className="main-content-wrapper">
  <form className="neo-form-container" onSubmit={onSubmit}> 
    <h1 className="neo-form-title">📝 แก้ไขบทความ</h1>

    <div className="neo-form-group">
       <label className="neo-label">ผู้เขียน (Author)</label>
  <input
    type="text"
    name="author"
    value={form.author}
    onChange={onChange}
    className="neo-input"
    placeholder="ชื่อผู้เขียน..."
  />
      <label className="neo-label">ชื่อบทความ (Title)</label>
      <input
        type="text"
        name="title"              
        value={form.title}      
        onChange={onChange}       
        className="neo-input"
        placeholder="พิมพ์ชื่อบทความที่นี่..."
        required
      />
    </div>

    <div className="neo-form-group">
      <label className="neo-label">หน้าปก (Cover Image URL)</label>
      <input
        type="text"
        name="coverimage"         
        value={form.coverimage}   
        onChange={onChange}      
        className="neo-input"
        placeholder="https://..."
      />
    </div>

    <div className="neo-form-group">
      <label className="neo-label">เนื้อหา (Content)</label>
      <textarea
        name="content"            
        value={form.content}     
        onChange={onChange}      
        className="neo-input"
        placeholder="เล่าเรื่องราวของคุณ..."
        required
      />
    </div>

    {error && (
      <p style={{ color: 'red', fontWeight: 700 }}>{error}</p> 
    )}

    <button type="submit" className="neo-submit-btn" disabled={saving}>
      {saving ? "กำลังบันทึก..." : "POST BLOG 🚀"}  
    </button>
  </form>
</div>
  );
}