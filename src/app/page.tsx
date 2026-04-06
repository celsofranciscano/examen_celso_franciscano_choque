"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, CheckCircle, Circle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA";
  priority: "BAJA" | "MEDIA" | "ALTA";
  created_at: string;
  updated_at: string | null;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "TODAS" | "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA"
  >("TODAS");

  // Formulario crear
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<
    "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA"
  >("PENDIENTE");
  const [newPriority, setNewPriority] = useState<"BAJA" | "MEDIA" | "ALTA">(
    "MEDIA",
  );

  // Modal edición
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<
    "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA"
  >("PENDIENTE");
  const [editPriority, setEditPriority] = useState<"BAJA" | "MEDIA" | "ALTA">(
    "MEDIA",
  );

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get<Task[]>("/api/todo");
      setTasks(data);
    } catch (error) {
      toast.error("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const { data } = await axios.post<Task>("/api/todo", {
        title: newTitle,
        description: newDescription || null,
        status: newStatus,
        priority: newPriority,
      });

      setTasks([data, ...tasks]);
      setNewTitle("");
      setNewDescription("");
      setNewStatus("PENDIENTE");
      setNewPriority("MEDIA");

      toast.success("Tarea creada correctamente");
    } catch (error: any) {
      toast.error("Error al crear tarea");
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;

    try {
      const { data } = await axios.patch<Task>(`/api/todo/${editingTask.id}`, {
        title: editTitle,
        description: editDescription || null,
        status: editStatus,
        priority: editPriority,
      });

      setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
      setEditingTask(null);
      toast.success("Tarea actualizada");
    } catch (error: any) {
      toast.error("Error al actualizar");
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm("¿Eliminar esta tarea?")) return;

    try {
      await axios.delete(`/api/todo/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Tarea eliminada correctamente");
    } catch (error: any) {
      toast.error("No se pudo eliminar la tarea");
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "COMPLETADA" ? "PENDIENTE" : "COMPLETADA";

    try {
      const { data } = await axios.patch<Task>(`/api/todo/${task.id}`, {
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
    } catch (error) {
      toast.error("No se pudo cambiar el estado");
    }
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "TODAS" || task.status === filter,
  );

  const getPriorityColor = (priority: string) => {
    if (priority === "ALTA") return "bg-red-500";
    if (priority === "MEDIA") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = (status: string) => {
    if (status === "COMPLETADA")
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "EN_PROGRESO")
      return <Clock className="w-5 h-5 text-blue-500" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando tareas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <CheckCircle className="w-10 h-10 text-primary" />
            Mi Todo List
          </h1>
          <Badge variant="outline" className="text-lg px-4 py-1">
            {tasks.length} tareas
          </Badge>
        </div>

        {/* Formulario Crear */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="¿Qué necesitas hacer?"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Detalles adicionales..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Estado</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(v: any) => setNewStatus(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                      <SelectItem value="COMPLETADA">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prioridad</Label>
                  <Select
                    value={newPriority}
                    onValueChange={(v: any) => setNewPriority(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAJA">Baja</SelectItem>
                      <SelectItem value="MEDIA">Media</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Crear Tarea
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["TODAS", "PENDIENTE", "EN_PROGRESO", "COMPLETADA"] as const).map(
            (f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f === "TODAS" ? "Todas" : f.replace("_", " ")}
              </Button>
            ),
          )}
        </div>

        {/* Lista de Tareas */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No hay tareas en esta categoría.
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleStatus(task)} className="mt-1">
                      {getStatusIcon(task.status)}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3
                          className={`font-medium text-lg ${task.status === "COMPLETADA" ? "line-through text-gray-500" : ""}`}
                        >
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-gray-600 mt-2 text-sm">
                          {task.description}
                        </p>
                      )}

                      <div className="text-xs text-gray-500 mt-3 flex gap-4">
                        <span>
                          Creada:{" "}
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                        {task.updated_at && (
                          <span>
                            Actualizada:{" "}
                            {new Date(task.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingTask(task);
                              setEditTitle(task.title);
                              setEditDescription(task.description || "");
                              setEditStatus(task.status);
                              setEditPriority(task.priority);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Tarea</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>Título</Label>
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Descripción</Label>
                              <Textarea
                                value={editDescription}
                                onChange={(e) =>
                                  setEditDescription(e.target.value)
                                }
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Estado</Label>
                                <Select
                                  value={editStatus}
                                  onValueChange={(v: any) => setEditStatus(v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDIENTE">
                                      Pendiente
                                    </SelectItem>
                                    <SelectItem value="EN_PROGRESO">
                                      En Progreso
                                    </SelectItem>
                                    <SelectItem value="COMPLETADA">
                                      Completada
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Prioridad</Label>
                                <Select
                                  value={editPriority}
                                  onValueChange={(v: any) => setEditPriority(v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="BAJA">Baja</SelectItem>
                                    <SelectItem value="MEDIA">Media</SelectItem>
                                    <SelectItem value="ALTA">Alta</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingTask(null)}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={updateTask}>
                              Guardar Cambios
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
