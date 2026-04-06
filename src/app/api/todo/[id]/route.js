// /api/todo[id]
import { db1 } from "@/lib/db1";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const { rowCount } = await db1.query("DELETE FROM tasks WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    return NextResponse.json(
      { error: "Error al eliminar tarea" },
      { status: 500 },
    );
  }
}


export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, status, priority } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // construir update dinámico
    const fields = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (description !== undefined) {
      fields.push(`description = $${index++}`);
      values.push(description);
    }
    if (status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(status);
    }
    if (priority !== undefined) {
      fields.push(`priority = $${index++}`);
      values.push(priority);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "Nada para actualizar" },
        { status: 400 },
      );
    }

    // agregar updated_at automático
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const query = `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;

    const { rows } = await db1.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PATCH TASK ERROR:", error);
    return NextResponse.json(
      { error: "Error al actualizar tarea" },
      { status: 500 },
    );
  }
}
