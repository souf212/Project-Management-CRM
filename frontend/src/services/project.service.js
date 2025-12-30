import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:5259/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class ProjectService {
    getAllProjects() {
        return api.get('projects');
    }

    createProject(project) {
        return api.post('projects', project);
    }

    deleteProject(id) {
        return api.delete(`projects/${id}`);
    }

    updateProject(id, project) {
        return api.put(`projects/${id}`, project);
    }

    getTasks(projectId) {
        return api.get(`projects/${projectId}/tasks`);
    }

    createTask(projectId, task) {
        return api.post(`projects/${projectId}/tasks`, task);
    }

    toggleTaskCompletion(taskId) {
        return api.put(`tasks/${taskId}/complete`);
    }

    deleteTask(taskId) {
        return api.delete(`tasks/${taskId}`);
    }
}

export default new ProjectService();
