import React, { useState } from 'react';

export default function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [venueManager, setVenueManager] = useState(false);

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name,
      email,
      password,
      venueManager,  
    };

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(`${baseUrl}/auth/register`, options);
      if (!response.ok) {
        throw new Error('Registrering mislyktes');
      }
      const responseData = await response.json();
      setUser(responseData.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Navn:</label>
          <input
            type="text"
            placeholder="Ditt navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label>
            <input
              type="checkbox"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
            />
            Venue Manager
          </label>
        </div>
        <button type="submit">Registrer</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <h3>Registrering vellykket, velkommen {user.name}!</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}
