import { useState } from "react";

export default function DealerRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const register = async () => {
    setError("");
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("https://miraculous-bravery-production.up.railway.app/api/dealers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setMessage("Dealer account created successfully. You can login now.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Create Dealer Account</h1>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

      <input
        name="name"
        placeholder="Full Name"
        className="border rounded p-3 w-full mb-3"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        className="border rounded p-3 w-full mb-3"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border rounded p-3 w-full mb-3"
        value={form.password}
        onChange={handleChange}
      />

      <button
        onClick={register}
        className="bg-green-600 text-white w-full py-3 rounded"
      >
        Create Account
      </button>
    </div>
  );
}
