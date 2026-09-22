import { ShieldCheck } from "lucide-react";
import { brand } from "@/config/brand";

export function Testimonial() {
  return (
    <section className="bg-ink px-5 py-20 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <ShieldCheck className="h-10 w-10 text-mint" />
        <blockquote className="mt-7 text-2xl font-medium leading-10 sm:text-3xl">
          “{brand.testimonial.quote}”
        </blockquote>
        <p className="mt-6 font-semibold">{brand.testimonial.author}</p>
        <p className="text-sm text-slate-400">{brand.testimonial.role}</p>
      </div>
    </section>
  );
}
