import React, { useState, ChangeEvent, FormEvent } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Forms.css';

interface FormData {
    correo: string;
    pass: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ correo: '', pass: '' });
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            localStorage.setItem("userId", res.data.userId);
            navigate("/cursos");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error de inicio de sesión");
        }
    };

    return (
        <div className="contenedor">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="pass"
                    placeholder="Contraseña"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="btn insertar">Iniciar Sesión</button>
            </form>
            {error && <p className="error">{error}</p>}
            <br />
            <div className="link">
                ¿No tienes una cuenta?{" "}
                <button onClick={() => navigate("/")} className="btn-link">
                    Regístrate
                </button>
            </div>
        </div>
    );
};

export default Login;
