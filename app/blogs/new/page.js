"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBlogPage() {
  const router = useRouter();
  
  // 1. ตั้ง State ให้ตรงกับข้อมูลบล็อกของเรา
  const [form, setForm] = useState({
    title: "", content: "", coverimage: "", author: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); 
    setError("");

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "สร้างไม่สำเร็จ")
     
      router.push('/blogs');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>เขียนบทความใหม่</h1>
      
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="title" placeholder="หัวข้อบทความ" value={form.title} onChange={onChange} required />
        <input name="coverimage" placeholder="ลิงก์รูปภาพหน้าปก (URL)" value={form.coverimage} onChange={onChange} required />
        <input name="author" placeholder="ชื่อผู้เขียน" value={form.author} onChange={onChange} required />
        <textarea name="content" placeholder="เนื้อหาบทความ..." rows={6} value={form.content} onChange={onChange} required />
        
        <button disabled={saving}>{saving ? "กำลังบันทึก..." : "สร้างบทความ"}</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      
      <p><Link href="/blogs">กลับไปหน้าแรก</Link></p>
    </div>
  );
}