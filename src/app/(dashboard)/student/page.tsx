"use client";

import StudentTable from "@/components/StudentTable";

export default function StudentsPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Students</h1>
            <StudentTable />
        </div>
    );
}