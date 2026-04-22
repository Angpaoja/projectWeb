"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "", content: "", coverimage: "", author: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();          // ห้าม browser reload
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "สร้างไม่สำเร็จ");

      router.push('/blogs');

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="main-content-wrapper">
      <form className="neo-form-container" onSubmit={onSubmit}> {/* ✅ เพิ่ม onSubmit */}
        <h1 className="neo-form-title">📝 สร้างบทความใหม่</h1>

        <div className="neo-form-group">
          <label className="neo-label">ชื่อบทความ (Title)</label>
          <input
            type="text"
            name="title"           // ✅ เพิ่ม
            value={form.title}     // ✅ เพิ่ม
            onChange={onChange}    // ✅ เพิ่ม
            className="neo-input"
            placeholder="พิมพ์ชื่อบทความที่นี่..."
            required
          />
        </div>

        <div className="neo-form-group">
          <label className="neo-label">หน้าปก (Cover Image URL)</label>
          <input
            type="text"
            name="coverimage"      // ✅ เพิ่ม
            value={form.coverimage}// ✅ เพิ่ม
            onChange={onChange}    // ✅ เพิ่ม
            className="neo-input"
            placeholder="https://..."
          />
        </div>

        <div className="neo-form-group">
          <label className="neo-label">เนื้อหา (Content)</label>
          <textarea
            name="content"         // ✅ เพิ่ม
            value={form.content}   // ✅ เพิ่ม
            onChange={onChange}    // ✅ เพิ่ม
            className="neo-input"
            placeholder="เล่าเรื่องราวของคุณ..."
            required
          />
        </div>

        <div className="neo-form-group">
          <label className="neo-label">ผู้เขียน (Author)</label>
          <input
            type="text"
            name="author"          // ✅ เพิ่ม field author กลับมา
            value={form.author}
            onChange={onChange}
            className="neo-input"
            placeholder="ชื่อผู้เขียน..."
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