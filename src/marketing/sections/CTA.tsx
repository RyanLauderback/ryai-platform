import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-5 pb-20">
      <div className="mx-auto max-w-6xl rounded-3xl bg-brand-600 px-6 py-14 text-center text-white sm:px-14">
        <h2 className="text-3xl font-bold">Make your next decision with the full picture.</h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-100">
          Start with a preloaded demo workspace. No credit card, setup, or data connection required.
        </p>
        <Button className="mt-7 bg-white text-brand-700 hover:bg-brand-50" asChild>
          <Link to="/signup">Explore Corvex Console</Link>
        </Button>
      </div>
    </section>
  );
}
