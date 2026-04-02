"use client";

import { useEffect, useState } from "react";
import {
    apiGetAllBooks,
    apiCreateBook,
    apiUpdateBook,
    apiDeleteBook,
    apiRestoreBook,
} from "@/lib/api";

type Book = {
    id: number;
    title: string;
    author: string;
    isbn: string;
    totalCopies: number;
    availableCopies: number;
    active: boolean;
};

export default function BookManager() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        totalCopies: 0,
        availableCopies: 0,
    });

    const loadData = async () => {
        const data = await apiGetAllBooks();
        setBooks(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name.includes("Copies") ? Number(value) : value }));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.author || !form.isbn) return alert("Fill all fields 😅");

        if (editId) {
            await apiUpdateBook(editId, form);
            setEditId(null);
        } else {
            await apiCreateBook(form);
        }

        setForm({ title: "", author: "", isbn: "", totalCopies: 0, availableCopies: 0 });
        loadData();
    };

    const handleEdit = (book: Book) => {
        setEditId(book.id);
        setForm({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Book Manager</h1>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
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
                    {editId ? "Update Book" : "Add Book"}
                </button>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                    <th className="border px-3 py-2">Title</th>
                    <th className="border px-3 py-2">Author</th>
                    <th className="border px-3 py-2">ISBN</th>
                    <th className="border px-3 py-2">Total</th>
                    <th className="border px-3 py-2">Available</th>
                    <th className="border px-3 py-2">Status</th>
                    <th className="border px-3 py-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {books.map((b) => (
                    <tr key={b.id} className="text-center border-t">
                        <td className="border px-3 py-2">{b.title}</td>
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
                                        await apiDeleteBook(b.id);
                                        loadData();
                                    }}
                                    className="bg-red-500 px-2 text-white rounded"
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    onClick={async () => {
                                        await apiRestoreBook(b.id);
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