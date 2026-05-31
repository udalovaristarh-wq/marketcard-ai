import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({
  children,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox={viewBox}
      {...props}
    >
      {children}
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </Icon>
  );
}

export function X(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Icon>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
      <path d="m5 3 .8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8Z" />
    </Icon>
  );
}

export function Eye(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function EyeOff(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3 3 18 18" />
      <path d="M10.7 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.2" />
      <path d="M6.5 6.7C3.6 8.6 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.5-1.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </Icon>
  );
}

export function Lock(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  );
}

export function User(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

export function Zap(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13 2 4 14h7l-1 8 10-14h-7Z" />
    </Icon>
  );
}

export function Timer(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 2h4" />
      <path d="M12 14V9" />
      <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
    </Icon>
  );
}

export function Upload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M20 16.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.5" />
    </Icon>
  );
}

export function MousePointer2(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4 3 7.4 17.2 2.1-7.6 7.5-2.4Z" />
      <path d="m13 13 5 5" />
    </Icon>
  );
}

export function Palette(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22a10 10 0 1 1 10-10 3.5 3.5 0 0 1-3.5 3.5h-1.9a1.7 1.7 0 0 0-1.2 2.9 1.8 1.8 0 0 1-1.2 3.1Z" />
      <path d="M7.5 10.5h.01" />
      <path d="M11 7.5h.01" />
      <path d="M15 8.5h.01" />
      <path d="M17 12h.01" />
    </Icon>
  );
}

export function TypeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </Icon>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <path d="m3 16 5-5 4 4 2-2 7 7" />
      <path d="M14.5 8.5h.01" />
    </Icon>
  );
}

export function Layers(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 2 9 5-9 5-9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </Icon>
  );
}

export function Wand2(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m21.6 11.6-9.2-9.2a1.4 1.4 0 0 0-2 0l-8 8a1.4 1.4 0 0 0 0 2l9.2 9.2a1.4 1.4 0 0 0 2 0l8-8a1.4 1.4 0 0 0 0-2Z" />
      <path d="m6 8 10 10" />
      <path d="m14 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
    </Icon>
  );
}

export function Search(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  );
}

export function BarChart3(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 3v18h18" />
      <path d="M8 17V9" />
      <path d="M13 17V5" />
      <path d="M18 17v-6" />
    </Icon>
  );
}

export function Globe(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </Icon>
  );
}

export function Shield(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

export function Star(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2l-5-4.9 6.9-1Z" />
    </Icon>
  );
}

export function Quote(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 21c3 0 6-2 6-6V8H3v7" />
      <path d="M15 21c3 0 6-2 6-6V8h-6v7" />
    </Icon>
  );
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m20 6-11 11-5-5" />
    </Icon>
  );
}

export function Crown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m2 7 5 5 5-9 5 9 5-5-2 12H4Z" />
      <path d="M5 22h14" />
    </Icon>
  );
}

export function Mail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Icon>
  );
}

export function MessageCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5a8.5 8.5 0 1 1 17 0Z" />
    </Icon>
  );
}

export function MapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}
