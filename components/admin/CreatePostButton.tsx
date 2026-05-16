"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPostAction } from "@/app/(admin)/admin/(app)/posts/actions";
import { Icon } from "./icons";

export function CreatePostButton() {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className="adm-btn adm-btn-primary adm-btn-sm"
      disabled={pending}
      onClick={() => {
        start(async () => {
          const res = await createPostAction();
          if ("id" in res) router.push(`/admin/posts/${res.id}`);
        });
      }}
    >
      {pending ? <span className="adm-spinner" /> : <Icon.Plus width={14} height={14} />}
      <span>New post</span>
    </button>
  );
}
