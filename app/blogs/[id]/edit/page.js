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

  // ดึงข้อมูลบล็อกเก่ามาใส่ฟอร์ม
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

  // ฟังก์ชันตอนกดเซฟ
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); 
    setError("");

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT", // ใช้ Method PUT สำหรับการแก้ไข
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "แก้ไขไม่สำเร็จ");
      
      router.push(`/blogs/${id}`); // กลับไปหน้าอ่านบทความ
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>แก้ไขบทความ</h1>
      
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="title" placeholder="หัวข้อ" value={form.title} onChange={onChange} required />
        <input name="coverimage" placeholder="URL รูปหน้าปก" value={form.coverimage} onChange={onChange} required />
        <input name="author" placeholder="ชื่อผู้เขียน" value={form.author} onChange={onChange} required />
        <textarea name="content" placeholder="เนื้อหา..." rows={6} value={form.content} onChange={onChange} required />
        
        <button disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
      
      <p><Link href={`/blogs/${id}`}>ยกเลิก</Link></p>
    </div>
  );
}