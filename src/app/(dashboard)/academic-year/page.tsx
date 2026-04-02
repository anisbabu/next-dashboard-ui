"use client";

import { useEffect, useState } from "react";
import {
    apiGetAll,
    apiCreate,
    apiDelete,
    apiRestore,
    apiUpdate,
} from "@/lib/api";

type Year = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
};

export default function Home() {
    const [years, setYears] = useState<Year[]>([]);
    const [startDate, setStartDate] = useState("");
    const [editId, setEditId] = useState<number | null>(null);

    const loadData = async () => {
        const data = await apiGetAll();
        setYears(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async () => {
        if (!startDate) return alert("Pick a date bro 😅");

        if (editId) {
            await apiUpdate(editId, startDate);
            setEditId(null);
        } else {
            await apiCreate(startDate);
        }

        setStartDate("");
        loadData();
    };

    const handleEdit = (year: Year) => {
        setEditId(year.id);
        setStartDate(year.startDate);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Academic Year</h1>

            {/* Form */}
            <div className="flex gap-4 mb-6">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-3 rounded w-full text-lg"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold"
                >
                    {editId ? "Update" : "Create"}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-center text-lg">
                    <thead>
                    <tr className="bg-blue-700">
                        <th className="py-3 px-4 border">Name</th>
                        <th className="py-3 px-4 border">Start Date</th>
                        <th className="py-3 px-4 border">End Date</th>
                        <th className="py-3 px-4 border">Status</th>
                        <th className="py-3 px-4 border">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {years.map((y) => (
                        <tr key={y.id} className="border-t">
                            <td className="py-3 px-4 border">{y.name}</td>
                            <td className="py-3 px-4 border">{y.startDate}</td>
                            <td className="py-3 px-4 border">{y.endDate}</td>
                            <td className="py-3 px-4 border">
                                {y.active ? (
                                    <span className="text-green-600 font-semibold">Active</span>
                                ) : (
                                    <span className="text-red-500 font-semibold">Inactive</span>
                                )}
                            </td>
                            <td className="py-3 px-4 border space-x-2">
                                <button
                                    onClick={() => handleEdit(y)}
                                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 text-white rounded font-medium"
                                >
                                    Edit
                                </button>

                                {y.active ? (
                                    <button
                                        onClick={async () => {
                                            await apiDelete(y.id);
                                            loadData();
                                        }}
                                        className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white rounded font-medium"
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            await apiRestore(y.id);
                                            loadData();
                                        }}
                                        className="bg-green-600 hover:bg-green-700 px-3 py-2 text-white rounded font-medium"
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
        </div>
    );
}