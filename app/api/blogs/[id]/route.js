import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(request, { params }) {
    const {id} = await params;
    const promisePool = mysqlPool.promise();
    const [rows, fields] = await promisePool.query(
        'SELECT * FROM blogs WHERE id = ?;' ,
        [id]
    );
    if (rows.length == 0) {
        return NextResponse.json(
            { message:`Blogs with id ${id} not found.` } ,
            { status: 404}
        )
    }
  return  NextResponse.json(rows[0]);
}
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, coverimage, author } = body;
        
        const promisePool = mysqlPool.promise();
        
        // เช็คก่อนว่ามีบล็อกนี้อยู่จริงไหม
        const [exists] = await promisePool.query('SELECT id FROM blogs WHERE id = ?', [id]);
        if (exists.length === 0) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // อัปเดตข้อมูลลงฐานข้อมูล
        await promisePool.query(
            'UPDATE blogs SET title = ?, content = ?, coverimage = ?, author = ? WHERE id = ?',
            [title, content, coverimage, author, id]
        );
        
        return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ" });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
export async function DELETE(_request, { params }) {
    try {
        const { id } = await params;
        const promisePool = mysqlPool.promise();
        const [exists] = await promisePool.query('SELECT id FROM blogs WHERE id = ?', [id]);
        if (exists.length === 0) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        await promisePool.query('DELETE FROM blogs WHERE id = ?', [id]);
        return NextResponse.json({ ok: true, message: "ลบข้อมูลสำเร็จ" });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
