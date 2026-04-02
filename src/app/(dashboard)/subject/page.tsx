"use client";

import { useEffect, useState } from "react";

// Subject type matching the backend entity
type Subject = {
  id: number;
  name: string;
  code: string;
  marks: number;
  passMarks: number;
  active: boolean;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Subject>>({
    name: "",
    code: "",
    marks: 0,
    passMarks: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const API_BASE = "http://localhost:8080/api/subjects";

  // Fetch all active subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form and editing state
  const resetForm = () => {
    setFormData({ name: "", code: "", marks: 0, passMarks: 0 });
    setEditingId(null);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Request failed");
      }
      await fetchSubjects(); // refresh list
      resetForm(); // clear form
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Soft delete subject
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchSubjects(); // refresh list
      if (editingId === id) resetForm(); // if we were editing the deleted subject, reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Populate form for editing
  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      marks: subject.marks,
      passMarks: subject.passMarks,
    });
    setEditingId(subject.id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          {loading ? (
            <p>Loading...</p>
          ) : subjects.length === 0 ? (
            <p>No subjects found.</p>
          ) : (
            <ul className="space-y-2">
              {subjects.map((subject) => (
                <li
                  key={subject.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <strong>{subject.name}</strong> ({subject.code})
                    <br />
                    <span className="text-sm text-gray-600">
                      Marks: {subject.marks} | Pass: {subject.passMarks}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(subject)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form (Add/Edit) */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {editingId ? "Edit Subject" : "Add New Subject"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                name="marks"
                value={formData.marks ?? ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pass Marks
              </label>
              <input
                type="number"
                name="passMarks"
                value={formData.passMarks ?? ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}