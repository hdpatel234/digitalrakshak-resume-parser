import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  avatar?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({
  name,
  avatar,
  className,
  size = "md",
}: UserAvatarProps) {
  return (
    <Avatar className={`${sizeMap[size]} ${className || ""}`}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback
        className={`${textSizeMap[size]} bg-gradient-to-br from-indigo-500 to-violet-600 text-white`}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
