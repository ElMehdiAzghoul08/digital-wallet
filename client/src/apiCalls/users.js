const { axiosInstance } = require('.');

// user login

export const loginUser = async (payload) => {
    try {
        const { data } = await axiosInstance.post('/api/users/login', payload);
        return data;
        
    } catch (error) {
        return error.response.data;
    }};

// user registration

export const registerUser = async (payload) => {
    try {
        const { data } = await axiosInstance.post('/api/users/register', payload);
        return data;
        
    } catch (error) {
        return error.response.data;
    }}

// get user information

export const getUserInfo = async () => {
    try {
        const { data } = await axiosInstance.post('/api/users/get-user-info', );
            
        return data;
        
    } catch (error) {
        return error.response.data;
    }
    }