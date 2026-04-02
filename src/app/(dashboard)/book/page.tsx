"use client";

import BookTable from "@/components/BookTable";

export default function BooksPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Books</h1>
            <BookTable />
        </div>
    );
}