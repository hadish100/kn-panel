require('dotenv').config()
const axios = require('axios');

const {
    sleep,
    get_accounts,
} = require("./utils");



async function main()
{

    await sleep(10000);

    while (true) 
    {
        var agents = await get_accounts();

        var {username, password} = agents.find(agent => agent.is_admin == 1);
        agents = agents.filter(agent => agent.is_admin == 0);

        for(let agent of agents)
        {
            
            if(agent.volume < 0 && agent.disable == 0)
            {
                var access_token = (await axios.post("http://knp-backend:" + process.env.SERVER_PORT + "/login", { username, password })).data.access_token;
                var disable_agent_request = await axios.post("http://knp-backend:" + process.env.SERVER_PORT + "/disable_agent", { access_token, agent_id: agent.id });
                var disable_user_request = await axios.post("http://knp-backend:" + process.env.SERVER_PORT + "/disable_all_agent_users", { access_token, agent_id: agent.id });
                
                console.log(`Agent: ${agent.name} has been disabled because of underpayment (volume: ${agent.volume})`);
            }

            console.log(`Agent: ${agent.name} has no underpayments (volume: ${agent.volume})`);

            
        }
        
        await sleep(30 * 60 * 1000);
    }
}

main();