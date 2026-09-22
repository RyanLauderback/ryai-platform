import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/brand";
import { useAuthStore } from "@/store/auth";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const demoLogin = useAuthStore((state) => state.demoLogin);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const destination = (location.state as { from?: string } | null)?.from || "/app";
  const onSubmit = (values: FormValues) => {
    if (login(values.email, values.password)) navigate(destination);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </div>
        <div className="m-auto w-full max-w-sm py-16">
          <h1 className="text-3xl font-bold tracking-tight">{mode === "login" ? brand.auth.loginTitle : brand.auth.signupTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{mode === "login" ? "Sign in to continue to your intelligence workspace." : "Start exploring market intelligence in minutes."}</p>
          <Button
            variant="outline"
            className="mt-7 w-full"
            data-testid="demo-login"
            onClick={() => {
              demoLogin();
              navigate("/app");
            }}
          >
            {brand.auth.demoLabel}
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or use email<span className="h-px flex-1 bg-slate-200" /></div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {mode === "signup" && (
              <label className="block text-sm font-medium">Full name<Input className="mt-1.5" autoComplete="name" {...register("name")} /></label>
            )}
            <label className="block text-sm font-medium">Email<Input className="mt-1.5" type="email" autoComplete="email" data-testid="email-input" {...register("email")} /></label>
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            <label className="block text-sm font-medium">Password<Input className="mt-1.5" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} data-testid="password-input" {...register("password")} /></label>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            <Button type="submit" className="w-full" data-testid="auth-submit">{mode === "login" ? "Sign in" : "Create account"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? "New to Corvex? " : "Already have an account? "}
            <Link className="font-semibold text-brand-600" to={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create account" : "Log in"}</Link>
          </p>
        </div>
      </section>
      <section className="hidden bg-ink p-16 text-white lg:flex lg:flex-col lg:justify-end">
        <p className="text-sm font-semibold text-mint">{brand.company}</p>
        <h2 className="mt-4 max-w-lg text-4xl font-bold leading-tight">{brand.tagline}</h2>
        <p className="mt-5 max-w-lg text-slate-400">{brand.description}</p>
        <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
          {["40K+ sources", "24/7 monitoring", "Cited answers"].map((stat) => <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold" key={stat}>{stat}</div>)}
        </div>
      </section>
    </main>
  );
}
