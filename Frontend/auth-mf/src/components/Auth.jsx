import React, { useState } from "react";

function Auth({ onSignup, onLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "resident" });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      onSignup(form);
    } else {
      onLogin(form);
    }
  };

  return (
    <div>
      <h2>{isRegistering ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        {isRegistering && (
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {isRegistering && (
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="resident">Resident</option>
            <option value="business_owner">Business Owner</option>
            <option value="community_organizer">Community Organizer</option>
          </select>
        )}
        <button type="submit">{isRegistering ? "Sign Up" : "Login"}</button>
      </form>
      <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: "pointer" }}>
        {isRegistering ? "Already have an account?" : "Need to create an account?"}
      </p>
    </div>
  );
}

export default Auth;
