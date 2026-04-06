// /api/todo
import { db1 } from "@/lib/db1";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await db1.query(`
      SELECT *
      FROM tasks
      ORDER BY created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener tareas" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, status, priority } = body;


    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 },
      );
    }


    const taskStatus = status || "PENDIENTE";
    const taskPriority = priority || "MEDIA";

    const { rows } = await db1.query(
      `INSERT INTO tasks (title, description, status, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || null, taskStatus, taskPriority],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al insertar tarea" },
      { status: 500 },
    );
  }
}
