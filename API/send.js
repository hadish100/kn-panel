const axios = require('axios');


function send_resp(err)
{
    if(!err.response) return {status:"ERR",msg:(err.code || "An error occurred")}
    return {status:"ERR",msg:(err.response.data.detail || Object.keys(err.response.data)[0] + " : " + err.response.data[Object.keys(err.response.data)[0]])}
}


(async () => 
{



    try {
        var api_auth_res = (await axios.post('http://localhost:6000/api/login/', { username:"admin", password:"1234556" }, { headers: { 'accept': 'application/json', 'Content-Type': 'application/json' } })).data;
        console.log(api_auth_res);
    }

    catch (err) {
        console.log(err);
        console.log(send_resp(err));
    }

})();


