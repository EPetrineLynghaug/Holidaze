// // src/components/Login.jsx
// import React, { useState, useContext } from 'react';
// import { UserContext } from '../context/UserContext';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { setUser } = useContext(UserContext);
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     const payload = { email, password };
//     const baseUrl = import.meta.env.VITE_API_BASE_URL;
//     const options = {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     };

//     try {
//       const response = await fetch(`${baseUrl}/auth/login`, options);
//       if (!response.ok) {
//         throw new Error('Innlogging mislyktes');
//       }
//       const responseData = await response.json();
//       setUser(responseData.data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white shadow-md  w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 py-6">Logg Inn</h2>
//         <form onSubmit={handleLogin} className="px-8 pb-8">
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-gray-700 text-sm font-semibold mb-2"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Din email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-gray-700 text-sm font-semibold mb-2"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Ditt passord"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Logg Inn
//           </button>
//           {error && (
//             <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }
