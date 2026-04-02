"use client";

import { useEffect, useState } from "react";

// Types matching the backend entities
type AcademicYear = {
  id: number;
  name: string;
  // other fields if needed
};

type Exam = {
  id: number;
  name: string;
  academicYear: AcademicYear; // Backend returns full object
  startDate: string;          // "YYYY-MM-DD"
  endDate: string;
  active: boolean;
};

// Form data for create/update
type ExamFormData = {
  name: string;
  academicYearId: number | undefined;
  startDate: string;
  endDate: string;
};

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExamFormData>({
    name: "",
    academicYearId: undefined,
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const API_BASE = "http://localhost:8080/api/exams";
  const YEARS_API = "http://localhost:8080/academic-year";

  // Fetch all active exams
  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data = await res.json();
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch academic years for dropdown
  const fetchAcademicYears = async () => {
    setYearsLoading(true);
    try {
      const res = await fetch(YEARS_API);
      if (!res.ok) throw new Error("Failed to fetch academic years");
      const data = await res.json();
      setAcademicYears(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setYearsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchAcademicYears();
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form and editing state
  const resetForm = () => {
    setFormData({
      name: "",
      academicYearId: undefined,
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate dates
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      setError("Start date cannot be after end date");
      return;
    }

    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? "PUT" : "POST";

    // Build payload for backend
    const payload = {
      name: formData.name,
      academicYearId: formData.academicYearId,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Request failed");
      }
      await fetchExams(); // refresh list
      resetForm(); // clear form
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Soft delete exam
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchExams(); // refresh list
      if (editingId === id) resetForm(); // if we were editing the deleted exam, reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Populate form for editing
  const handleEdit = (exam: Exam) => {
    setFormData({
      name: exam.name,
      academicYearId: exam.academicYear.id,
      startDate: exam.startDate,
      endDate: exam.endDate,
    });
    setEditingId(exam.id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exam List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Exams</h2>
          {loading ? (
            <p>Loading...</p>
          ) : exams.length === 0 ? (
            <p>No exams found.</p>
          ) : (
            <ul className="space-y-2">
              {exams.map((exam) => (
                <li
                  key={exam.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <strong>{exam.name}</strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      Year: {exam.academicYear.name} |{" "}
                      {exam.startDate} – {exam.endDate}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(exam)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
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
            {editingId ? "Edit Exam" : "Add New Exam"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <select
                name="academicYearId"
                value={formData.academicYearId ?? ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={yearsLoading}
              >
                <option value="" disabled>
                  {yearsLoading ? "Loading years..." : "Select a year"}
                </option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
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