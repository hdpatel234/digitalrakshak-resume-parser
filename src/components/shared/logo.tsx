import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const imgSize = sizeMap[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className || ""}`}>
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-md opacity-60" />
        <Image
          src="/new-logo.png"
          alt="Digitalrakshak Resume Parser Logo"
          width={imgSize}
          height={imgSize}
          className="relative rounded-xl object-cover"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold bg-gradient-to-r from-indigo-400 via-violet-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontSize: size === "lg" ? "1.25rem" : size === "md" ? "1rem" : "0.875rem" }}
          >
            Digitalrakshak
          </span>
          <span
            className="font-medium text-muted-foreground tracking-wide uppercase"
            style={{ fontSize: size === "lg" ? "0.65rem" : "0.6rem", letterSpacing: "0.08em" }}
          >
            Resume Parser
          </span>
        </div>
      )}
    </Link>
  );
}
