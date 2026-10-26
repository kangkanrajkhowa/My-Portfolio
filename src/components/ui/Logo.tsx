import Image from "next/image";
import { asset } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={asset("/icon.svg")}
      alt="KR"
      width={76}
      height={64}
      priority
      className={className}
    />
  );
}
