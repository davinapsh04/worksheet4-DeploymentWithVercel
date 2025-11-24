"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PostDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<unknown>(null);

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`/api/posts/${id}`);
            if (res.status === 404) {
                router.push("/not-found");
            } else {
                setPost(await res.json());
            }
        };
        fetchPost();
    }, [id, router]);

    const handleDelete = async () => {
        await fetch(`/api/posts/${id}`, { method: "DELETE" });
        router.push("/");
    };

    if (!post) return <p className="container mt-4">Loading...</p>;

    return (
        <main className="container mt-4">
            <h3>{(post as { title: string }).title}</h3>
            <p className="text-muted">
                {new Date(
                    (post as { createdAt: string }).createdAt
                ).toLocaleDateString("id-ID")}
            </p>
            <p>{(post as { content: string }).content}</p>

            <button onClick={handleDelete} className="btn btn-danger">
                Delete
            </button>
        </main>
    );
}

