"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";

import { supabase } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetMessages() {
    setMessage("");
    setErrorMessage("");
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setPassword("");
    setPasswordConfirmation("");
    resetMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage(
        "Veuillez renseigner votre adresse e-mail et votre mot de passe."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (mode === "signup" && password !== passwordConfirmation) {
      setErrorMessage(
        "Les deux mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setMessage("Votre compte a été créé avec succès.");
          router.push("/dashboard");
          router.refresh();
          return;
        }

        setMessage(
          "Votre compte a été créé. Consultez votre boîte e-mail pour confirmer votre inscription."
        );

        setPassword("");
        setPasswordConfirmation("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/cloud-setup");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.";

      setErrorMessage(translateAuthError(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
        <PageHeader
          title="Compte Legacy"
          subtitle={
            mode === "login"
              ? "Connectez-vous pour retrouver votre famille."
              : "Créez votre compte personnel."
          }
        />

        <Card>
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F8F6F2] p-1">
            <button
              type="button"
              onClick={() => changeMode("login")}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                mode === "login"
                  ? "bg-white text-black shadow-sm"
                  : "text-black"
              }`}
            >
              Connexion
            </button>

            <button
              type="button"
              onClick={() => changeMode("signup")}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-black shadow-sm"
                  : "text-black"
              }`}
            >
              Inscription
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-2 block font-semibold text-black">
                Adresse e-mail
              </label>

              <Input
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-black">
                Mot de passe
              </label>

              <Input
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="6 caractères minimum"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-2 block font-semibold text-black">
                  Confirmer le mot de passe
                </label>

                <Input
                  type="password"
                  value={passwordConfirmation}
                  onChange={setPasswordConfirmation}
                  placeholder="Saisissez à nouveau le mot de passe"
                />
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
              >
                {errorMessage}
              </div>
            )}

            {message && (
              <div
                role="status"
                className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-900"
              >
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading
                ? "Veuillez patienter..."
                : mode === "login"
                  ? "Se connecter"
                  : "Créer mon compte"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-black">
            {mode === "login"
              ? "Vous n’avez pas encore de compte ?"
              : "Vous avez déjà un compte ?"}
          </p>

          <button
            type="button"
            onClick={() =>
              changeMode(mode === "login" ? "signup" : "login")
            }
            className="mt-2 w-full font-semibold text-[#5E7A5B]"
          >
            {mode === "login"
              ? "Créer un compte"
              : "Se connecter"}
          </button>
        </Card>

        <Link
          href="/"
          className="text-center font-semibold text-black"
        >
          ← Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Adresse e-mail ou mot de passe incorrect.";
  }

  if (normalized.includes("user already registered")) {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Veuillez confirmer votre adresse e-mail avant de vous connecter.";
  }

  if (normalized.includes("password should be at least")) {
    return "Le mot de passe est trop court.";
  }

  if (normalized.includes("unable to validate email")) {
    return "Cette adresse e-mail semble invalide.";
  }

  if (normalized.includes("rate limit")) {
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  }

  return message;
}