
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const payload = { email, password };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(`${baseUrl}/auth/login`, options);
      if (!response.ok) {
        throw new Error('Innlogging mislyktes');
      }
      const responseData = await response.json();
      setUser(responseData.data);

      // Hvis du ønsker å videresende til en ny side, bruk for eksempel:
      // navigate("/profile"); // husk isåfall useNavigate()
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Din email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Ditt passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Logg Inn</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <h3>Velkommen, {user.name}!</h3>
          <p>Email: {user.email}</p>
          {user.avatar && (
            <img
              src={user.avatar.url}
              alt={user.avatar.alt}
              style={{ width: '100px', height: '100px' }}
            />
          )}
        </div>
      )}
    </div>
  );
}
