import React from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

export default function RetroLinkButton({
  href,
  children,
  className = "",
  external,
  ariaLabel,
}: Props) {
  const isHttp = href.startsWith("http");
  const isExternal = external ?? isHttp;

  return (
    <a
      href={href}
      className={`block p-2 sm:p-3 border-2 border-retro-border text-center font-press text-[10px] sm:text-xs transition-colors break-words ${className}`}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
