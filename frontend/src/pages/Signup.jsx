import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await register(email, password);
            setMessage('Registration successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to register. Email might be taken.');
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh' }}>
            <motion.div
                className="glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ width: '400px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p>Join us and start managing projects</p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: 'rgba(52, 199, 89, 0.1)',
                            color: '#34c759',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <CheckCircle size={18} />
                        {message}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: 'rgba(255, 59, 48, 0.1)',
                            color: '#ff4d4d',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            style={{ paddingLeft: '44px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem', position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            style={{ paddingLeft: '44px' }}
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign Up <UserPlus size={18} />
                    </motion.button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <p>Already have an account? <Link to="/login" style={{ color: 'hsl(var(--primary))', textDecoration: 'none', fontWeight: '500' }}>Login</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
