import axios from 'axios';

axios.interceptors.response.use
(
    response => 
    {
        return response
    },

    error => 
    {
        if (error.request.responseURL.endsWith('/login'))
        {
            return Promise.reject(error);
        }

        else if (error.response && error.response.status.toString().startsWith('5')) 
        {
            const customResponse = 
            {
                data: {status:"ERR",msg:"server is not responding"},
                status: error.response ? error.response.status : 500,
                headers: error.response ? error.response.headers : {},
                error: true,
            };
            return Promise.resolve(customResponse);
        }

        return Promise.reject(error);
    }
);

export default axios;