import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProjectService from '../services/project.service';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Circle, Trash2, Plus, Calendar } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadTasks();
    }, [id]);

    const loadTasks = () => {
        ProjectService.getTasks(id).then(
            (response) => {
                setTasks(response.data);
            },
            (error) => {
                if (error.response && error.response.status === 404) {
                    navigate('/dashboard');
                }
            }
        );
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        ProjectService.createTask(id, { title: newTaskTitle }).then(() => {
            setNewTaskTitle('');
            loadTasks();
        });
    };

    const handleToggleComplete = (taskId) => {
        ProjectService.toggleTaskCompletion(taskId).then(() => {
            loadTasks();
        });
    };

    const handleDeleteTask = (taskId) => {
        ProjectService.deleteTask(taskId).then(() => {
            loadTasks();
        });
    }

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    return (
        <motion.div
            className="container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ paddingTop: '2rem', maxWidth: '800px' }}
        >
            <Link to="/dashboard" className="btn btn-secondary" style={{ display: 'inline-flex', marginBottom: '2rem', padding: '8px 16px' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="glass-panel" style={{ padding: '0' }}>
                <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Project Details</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                <Calendar size={16} />
                                <span>Project ID: {id}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>{progress}%</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Completed</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)))' }}
                        />
                    </div>
                </div>

                <div style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Tasks <span style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 'normal' }}>({tasks.length})</span>
                    </h3>

                    {/* Add Task Input */}
                    <form onSubmit={handleCreateTask} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Plus size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Add a new task..."
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>

                    {/* Task List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <AnimatePresence>
                            {tasks.map(t => (
                                <motion.div
                                    key={t.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="glass"
                                    style={{
                                        padding: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: t.isCompleted ? 'rgba(52, 199, 89, 0.05)' : 'rgba(255,255,255,0.02)',
                                        borderColor: t.isCompleted ? 'rgba(52, 199, 89, 0.2)' : 'var(--glass-border)'
                                    }}
                                >
                                    <div
                                        onClick={() => handleToggleComplete(t.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1 }}
                                    >
                                        {t.isCompleted ? (
                                            <CheckCircle size={24} color="#34c759" />
                                        ) : (
                                            <Circle size={24} color="var(--text-muted)" />
                                        )}
                                        <span style={{
                                            textDecoration: t.isCompleted ? 'line-through' : 'none',
                                            color: t.isCompleted ? 'var(--text-muted)' : 'white',
                                            transition: 'all 0.3s'
                                        }}>
                                            {t.title}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-danger"
                                        style={{ padding: '8px', opacity: 0.6 }}
                                        whileHover={{ opacity: 1 }}
                                        onClick={() => handleDeleteTask(t.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {tasks.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                No tasks yet. Add one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectDetails;
