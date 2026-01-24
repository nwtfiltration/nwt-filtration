import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DealerLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const login = async () => {
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await fetch("https://miraculous-bravery-production.up.railway.app/api/dealers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token + dealer info
      localStorage.setItem("dealer_token", data.token);
      localStorage.setItem("dealer_name", data.dealer.name);

      // Redirect to admin orders
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Dealer Login</h1>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <input
        name="email"
        placeholder="Email"
        className="border rounded p-3 w-full mb-3"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border rounded p-3 w-full mb-3"
        onChange={handleChange}
      />

      <button
        onClick={login}
        className="bg-blue-600 text-white w-full py-3 rounded"
      >
        Login
      </button>
    </div>
  );
}


