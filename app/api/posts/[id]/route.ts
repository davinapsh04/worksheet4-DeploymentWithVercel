import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {

  const { id } = params;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });

  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  return NextResponse.json(post);

}

export async function PUT(req: Request, { params }: { params: { id: string } }) {

  try {

    const { id } = params;

    const body = await req.json();

    const { title, content } = body;

    if (!title || !content) {

      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    }

    const updated = await prisma.post.update({

      where: { id: Number(id) },

      data: {

        title,

        content,

      },

    });

    return NextResponse.json(updated);

  } catch (err: any) {

    // jika id tidak ada, prisma akan throw -> tangani sebagai 404

    return NextResponse.json({ message: err?.message ?? "Error" }, { status: 500 });

  }

}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {

  const { id } = params;

  await prisma.post.delete({ where: { id: Number(id) } });

  // 204 tidak boleh ada body, jadi gunakan 200 untuk pesan

  return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });

}

