// app/posts/[id]/edit/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
    const params = useParams(); // { id: "..." }
    const id = params?.id as string;
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/posts/${id}`)
            .then(async (res) => {
                if (!res.ok) throw new Error("Gagal mengambil post");
                return res.json();
            })
            .then((data) => {
                setTitle(data.title ?? "");
                setContent(data.content ?? "");
            })
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.message ?? "Gagal menyimpan");
            }
            // sukses → kembali ke halaman post atau list
            router.push(`/posts/${id}`); // atau router.back()
        } catch (err) {
            setError(String(err));
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
            <h1>Edit Post</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <form onSubmit={handleSave}>
                <div style={{ marginBottom: 12 }}>
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={8}
                        style={{ width: "100%", padding: 8 }}
                    />
                </div>
                <div>
                    <button type="submit" disabled={saving}>
                        {saving ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button type="button" onClick={() => router.back()} style={{ marginLeft: 8 }}>
                        Batal
                    </button>
                </div>
            </form>
        </main>
    );
}
