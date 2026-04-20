import { NextResponse} from "next/server"
import { mysqlPool } from "@/utils/db";

export async function GET(request) {
    const promisePool = mysqlPool.promise(); 
    const [rows, fields] = await promisePool.query(
        'SELECT * FROM blogs;'
    )    
    
  return NextResponse.json(rows);
}

export async function POST(request) {
    try {
        const body = await request.json();
        // รับค่าให้ตรงกับคอลัมน์ในตาราง blogs ของเรา
        const { title, content, coverimage, author } = body; 
        
        const promisePool = mysqlPool.promise();
        const [result] = await promisePool.query(
            'INSERT INTO blogs (title, content, coverimage, author) VALUES (?, ?, ?, ?)',
            [title, content, coverimage, author]
        );
        
        return NextResponse.json({ message: "สร้างบทความสำเร็จ", id: result.insertId }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
