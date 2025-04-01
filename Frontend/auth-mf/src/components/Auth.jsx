import React, { useState } from "react";

function Auth({ onSignup, onLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "resident" });

  return (
    <div>
      <h2>Auth Micro Frontend</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSignup(form);
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="resident">Resident</option>
          <option value="business_owner">Business Owner</option>
          <option value="community_organizer">Community Organizer</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>

      <button onClick={() => onLogin(form)}>Login</button>
    </div>
  );
}

export default Auth;
