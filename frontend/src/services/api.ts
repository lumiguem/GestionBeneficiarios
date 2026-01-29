const API_BASE_URL = "https://localhost:7207/api";

export async function http<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${input}`, {
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers
        },
        ...init
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error en la petición');
    }
    if (res.status === 204) {
        return undefined as T;
    }

    return res.json();
}
