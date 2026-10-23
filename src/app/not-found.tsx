import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/shell/Nav";
import { Footer } from "@/components/shell/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        id="main"
        className="relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 45% at 50% 40%, color-mix(in oklab, var(--violet) 18%, transparent), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <p className="eyebrow relative">Error 404</p>
        <h1 className="display relative mt-6 text-[26vw] leading-none md:text-[16rem]">
          4<span className="text-lime">0</span>4
        </h1>
        <p className="relative mt-4 max-w-sm text-sm text-muted">
          This page drifted into the void. The work, the stack and the contact
          form are all still on the home page.
        </p>
        <Link href="/" className="btn btn-primary relative mt-8">
          <ArrowLeft size={15} /> Back to the portfolio
        </Link>
      </main>
      <Footer />
    </>
  );
}
