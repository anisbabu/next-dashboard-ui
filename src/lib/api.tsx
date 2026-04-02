const BASE_URL = "http://localhost:8080/books";

export async function apiGetAllBooks() {
    const res = await fetch(BASE_URL);
    return res.json();
}

export async function apiCreateBook(book: any) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
    return res.json();
}

export async function apiUpdateBook(id: number, book: any) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
    return res.json();
}

export async function apiDeleteBook(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return res.json();
}

export async function apiRestoreBook(id: number) {
    const res = await fetch(`${BASE_URL}/restore/${id}`, { method: "PUT" });
    return res.json();
}

// Academic Year APIs
const YEAR_BASE_URL = "http://localhost:8080/academic-year";

export async function apiGetAll() {
    const res = await fetch(YEAR_BASE_URL, { cache: "no-store" });
    return res.json();
}

export async function apiGetById(id: number) {
    const res = await fetch(`${YEAR_BASE_URL}/${id}`);
    return res.json();
}

export async function apiCreate(startDate: string) {
    const res = await fetch(YEAR_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate }),
    });
    return res.json();
}

export async function apiUpdate(id: number, startDate: string) {
    const res = await fetch(`${YEAR_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate }),
    });
    return res.json();
}

export async function apiDelete(id: number) {
    await fetch(`${YEAR_BASE_URL}/${id}`, { method: "DELETE" });
}

export async function apiRestore(id: number) {
    await fetch(`${YEAR_BASE_URL}/restore/${id}`, { method: "PUT" });
}


// student APIs
const STUDENT_BASE_URL = "http://localhost:8080/students";

export async function apiGetAllStudents() {
    const res = await fetch(STUDENT_BASE_URL);
    return res.json();
}

export async function apiCreateStudent(book: any) {
    const res = await fetch(STUDENT_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
    return res.json();
}

export async function apiUpdateStudent(id: number, book: any) {
    const res = await fetch(`${STUDENT_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
    return res.json();
}

export async function apiDeleteStudent(id: number) {
    const res = await fetch(`${STUDENT_BASE_URL}/${id}`, { method: "DELETE" });
    return res.json();
}

export async function apiRestoreStudent(id: number) {
    const res = await fetch(`${STUDENT_BASE_URL}/restore/${id}`, { method: "PUT" });
    return res.json();
}