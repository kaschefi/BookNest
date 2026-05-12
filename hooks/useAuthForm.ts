import { useState } from "react";

export function useAuthForm(isLogin: boolean) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    onSuccessLogin?: () => void,
    onSuccessSignup?: () => void
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin && password !== repeatPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        if (onSuccessLogin) onSuccessLogin();
        else window.location.href = "/";
      } else {
        setSuccess("Account created successfully! Please sign in.");
        setName("");
        setPassword("");
        setRepeatPassword("");
        if (onSuccessSignup) onSuccessSignup();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    repeatPassword, setRepeatPassword,
    error,
    success,
    loading,
    showPassword, setShowPassword,
    showRepeatPassword, setShowRepeatPassword,
    handleSubmit
  };
}
