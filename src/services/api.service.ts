import axios from 'axios';

export interface RegisterData {
    nombre: string;
    correo: string;
    pass: string;
}

export interface LoginData {
    correo: string;
    pass: string;
}

export const registerUser = (data: RegisterData) => {
    return axios.post('/api/register', data);
};

export const loginUser = (data: LoginData) => {
    return axios.post('/api/login', data);
};
