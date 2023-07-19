/*


const auth = 
{
    'username' : 'admin',
    'password' : 'admin123456'
    'username' : 'testabc3',
    'password' : 'bbbb'
};



(async () => 
{
    var api_auth_res = (await axios.post('http://164.92.143.109/api/login/',auth,{headers:{'accept': 'application/json','Content-Type': 'application/json'}})).data;
    access_token = 'Bearer ' + api_auth_res.access;

    var create_agent = (await axios.post('http://164.92.143.109/api/admin/agent/create/',
    {
        agent_name:"test51223",
        volume:1000,
        maximum_day:30,
        country:"NL",
        prefix:"ASD3",
        username:"testabc3",
        password:"bbbb",
        panels:[2],
        maximum_user:30
    },
    {headers:{accept:'application/json',Authorization:access_token}})).data;


    var create_panel = (await axios.post('http://164.92.143.109/api/admin/panel/create/',
    {
        panel_name:"test",
        panel_url:"http://65.109.211.170:8000/dashboard/",
        panel_username:"admin",
        panel_password:"admin",
        panel_country:"NL",
        panel_user_max_count:1000,
        panel_user_max_date:30,
        panel_traffic:1000000,
    },
    {headers:{accept:'application/json',Authorization:access_token}}));

    var delete_panel = (await axios.delete('http://164.92.143.109/api/admin/panel/delete/',
    {
        data: { panel_id: 1 }, 
        headers: { accept: 'application/json',Authorization:access_token }
    })).data;


    var create_user = (await axios.post('http://164.92.143.109/api/user/create/',
    {
        username:"test1000",
        expire:1689922755,
        data_limit:50,
        country:"NL"
    },
    {headers:{accept:'application/json',Authorization:access_token}}));

     var agents = (await axios.get('http://164.92.143.109/api/admin/agents/',{headers:{accept:'application/json',Authorization:access_token}})).data
     var panels = (await axios.get('http://164.92.143.109/api/admin/panel/view/',{headers:{accept:'application/json',Authorization:access_token}})).data
     var users = (await axios.get('http://164.92.143.109/api/user/view/',{headers:{accept:'application/json',Authorization:access_token}})).data

        console.log(access_token);
        console.log(agents);
        console.log(panels);
        console.log(users);
})();

*/