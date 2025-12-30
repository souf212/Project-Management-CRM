import React, { useState, useEffect, useContext } from 'react';
import ProjectService from '../services/project.service';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Folder, Trash2, LayoutGrid } from 'lucide-react';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        ProjectService.getAllProjects().then(
            (response) => {
                setProjects(response.data);
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                    navigate('/login');
                }
            }
        );
    };

    const handleCreateProject = (e) => {
        e.preventDefault();
        ProjectService.createProject({ name: newProjectName, description: newProjectDesc }).then(() => {
            setNewProjectName('');
            setNewProjectDesc('');
            setIsCreating(false);
            loadProjects();
        });
    };

    const handleDeleteProject = (e, id) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        if (window.confirm("Are you sure?")) {
            ProjectService.deleteProject(id).then(() => {
                loadProjects();
            });
        }
    }

    return (
        <motion.div
            className="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: '2rem' }}
        >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))', padding: '10px', borderRadius: '12px' }}>
                        <LayoutGrid color="white" size={24} />
                    </div>
                    <h1 style={{ marginBottom: 0 }}>Dashboard</h1>
                </div>
                <button className="btn btn-secondary" onClick={() => { logout(); navigate('/login'); }}>
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Create New Card */}
                <motion.div
                    className="glass"
                    whileHover={{ scale: 1.02, borderColor: 'hsl(var(--primary))' }}
                    onClick={() => setIsCreating(true)}
                    style={{
                        minHeight: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        borderColor: 'var(--glass-border)'
                    }}
                >
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '1rem', marginBottom: '1rem' }}>
                        <Plus size={32} color="hsl(var(--primary))" />
                    </div>
                    <h3>Create Project</h3>
                </motion.div>

                {/* Project List */}
                <AnimatePresence>
                    {projects.map((p, index) => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    className="glass"
                                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                    style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ background: 'rgba(124, 77, 255, 0.2)', padding: '8px', borderRadius: '8px' }}>
                                            <Folder size={20} color="hsl(var(--primary))" />
                                        </div>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: '8px' }}
                                            onClick={(e) => handleDeleteProject(e, p.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem' }}>{p.name}</h3>
                                    <p style={{ flex: 1, fontSize: '0.9rem' }}>{p.description || "No description provided."}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span>ID: {p.id}</span>
                                        <span>Created recently</span>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal Overlay for Creating Project */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                        }}
                        onClick={() => setIsCreating(false)}
                    >
                        <motion.div
                            className="glass-panel"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{ width: '500px', maxWidth: '90%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ marginBottom: '1.5rem' }}>New Project</h2>
                            <form onSubmit={handleCreateProject}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Project Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
                                    <textarea
                                        value={newProjectDesc}
                                        onChange={(e) => setNewProjectDesc(e.target.value)}
                                        rows="3"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Project</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
