const fs = require('fs').promises;


const uid = () => { return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000; }
const generate_token = (id) => { return jwt.sign({id},JWT_SECRET_KEY,{expiresIn: '3h'}); }
const get_now = () => { return Math.floor(Date.now() / 1000); }

const validate_token = (token) =>
{
    token = token.replace("bearer ","").replace("Bearer ","");
    try
    {
        var decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
    
    catch(err)
    {
        return false;
    }
}



module.exports = 
{
    uid,
    generate_token,
    get_now,
    validate_token,
}