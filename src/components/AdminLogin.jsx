import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
        } catch (err) {
            console.error("Firebase Auth Error:", err.code, err.message);
            setError(err.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}