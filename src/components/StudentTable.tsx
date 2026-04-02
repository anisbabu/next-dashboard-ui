"use client";

import { useEffect, useState } from "react";
import {
    apiGetAllStudents,
    apiCreateStudent,
    apiUpdateStudent,
    apiDeleteStudent,
    apiRestoreStudent,
} from "@/lib/api";

type Student = {
id: number;
name: string;    
code: string; 
mobile: string;                                   
email: string;                                    
gender: string;                                   
dob: Date;                                      
address: string;                                  
nationalId: string;                                                                   
bloodGroup: string;                               
admissionDate: Date;                            
religion: string;                                 
nationality: string;                              
classGrade: number;                               
section: number;};

export default function StudentManager() {
    const [students, setStudents] = useState<Student[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({
        name: "",
        code: "",
        mobile: "",
        totalCopies: 0,
        availableCopies: 0,
mobile: "",                                   
email: "",                                   
gender: "",                                   
dob: "",                                      
address: "",                                  
nationalId: "",                                                                   
bloodGroup: "",                               
admissionDate: "",                            
religion: "",                                 
nationality: "",                              
classGrade: 0,                               
section: 0,
    });

    const loadData = async () => {
        const data = await apiGetAllStudents();
        setStudents(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name.includes("Copies") ? Number(value) : value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.author || !form.isbn) return alert("Fill all fields 😅");

        if (editId) {
            await apiUpdateStudent(editId, form);
            setEditId(null);
        } else {
            await apiCreateStudent(form);
        }

        setForm({ name: "", author: "", isbn: "", totalCopies: 0, availableCopies: 0 });
        loadData();
    };

    const handleEdit = (student: Student) => {
        setEditId(student.id);
        setForm({
            name: student.name,
            author: student.author,
            isbn: student.isbn,
            totalCopies: student.totalCopies,
            availableCopies: student.availableCopies,
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Student Manager</h1>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded col-span-1 md:col-span-1"
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={form.author}
                    onChange={handleChange}
                    className="border p-2 rounded col-span-1 md:col-span-1"
                />
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={handleChange}
                    className="border p-2 rounded col-span-1 md:col-span-1"
                />
                <input
                    type="number"
                    name="totalCopies"
                    placeholder="Total Copies"
                    value={form.totalCopies}
                    onChange={handleChange}
                    className="border p-2 rounded col-span-1 md:col-span-1"
                />
                <input
                    type="number"
                    name="availableCopies"
                    placeholder="Available Copies"
                    value={form.availableCopies}
                    onChange={handleChange}
                    className="border p-2 rounded col-span-1 md:col-span-1"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-5"
                >
                    {editId ? "Update Student" : "Add Student"}
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                    <th className="border px-3 py-2">name</th>
                    <th className="border px-3 py-2">Author</th>
                    <th className="border px-3 py-2">ISBN</th>
                    <th className="border px-3 py-2">Total</th>
                    <th className="border px-3 py-2">Available</th>
                    <th className="border px-3 py-2">Status</th>
                    <th className="border px-3 py-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {students.map((b) => (
                    <tr key={b.id} className="text-center border-t">
                        <td className="border px-3 py-2">{b.name}</td>
                        <td className="border px-3 py-2">{b.author}</td>
                        <td className="border px-3 py-2">{b.isbn}</td>
                        <td className="border px-3 py-2">{b.totalCopies}</td>
                        <td className="border px-3 py-2">{b.availableCopies}</td>
                        <td className={`border px-3 py-2 ${b.active ? "text-green-600" : "text-red-500"}`}>
                            {b.active ? "Active" : "Inactive"}
                        </td>
                        <td className="border px-3 py-2 space-x-2">
                            <button
                                onClick={() => handleEdit(b)}
                                className="bg-yellow-500 px-2 text-white rounded"
                            >
                                Edit
                            </button>
                            {b.active ? (
                                <button
                                    onClick={async () => {
                                        await apiDeleteStudent(b.id);
                                        loadData();
                                    }}
                                    className="bg-red-500 px-2 text-white rounded"
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    onClick={async () => {
                                        await apiRestoreStudent(b.id);
                                        loadData();
                                    }}
                                    className="bg-green-600 px-2 text-white rounded"
                                >
                                    Restore
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}