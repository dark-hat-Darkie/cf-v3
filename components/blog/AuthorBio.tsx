import Image from "next/image";

type Props = {
  name: string;
  role: string;
  bio: string;
  avatar: {
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    blurDataURL?: string;
  } | null;
};

export function AuthorBio({ name, role, bio, avatar }: Props) {
  if (!bio.trim() && !role.trim() && !avatar) return null;

  return (
    <aside className="cf-author-bio" aria-label="About the author">
      {avatar ? (
        <div className="cf-author-bio-avatar">
          <Image
            src={avatar.url}
            alt={avatar.alt || name}
            width={avatar.width ?? 80}
            height={avatar.height ?? 80}
            sizes="80px"
            {...(avatar.blurDataURL ? { placeholder: "blur" as const, blurDataURL: avatar.blurDataURL } : {})}
          />
        </div>
      ) : (
        <div className="cf-author-bio-avatar cf-author-bio-avatar-placeholder" aria-hidden>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="cf-author-bio-body">
        <div className="cf-author-bio-name">{name}</div>
        {role.trim() ? <div className="cf-author-bio-role">{role}</div> : null}
        {bio.trim() ? <p className="cf-author-bio-text">{bio}</p> : null}
      </div>
    </aside>
  );
}
