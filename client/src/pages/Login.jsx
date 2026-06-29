import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl"
      >

        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          🔐 Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;