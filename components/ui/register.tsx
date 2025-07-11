import React, { useState, ChangeEvent, FormEvent } from 'react';
import { registerUser, RegisterData } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Forms.css';

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterData>({
        nombre: '',
        correo: '',
        pass: ''
    });
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            alert("Registrado con éxito. Inicia sesión.");
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error en registro");
        }
    };

    return (
        <div className="contenedor">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
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
                <button type="submit" className="btn insertar">Registrar</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Register;
