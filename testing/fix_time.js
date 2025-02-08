var { users_clct,logs_clct } = require('../db_interface');


async function init()
{
    const users = await (await users_clct()).find({})
    console.log(users.length);
    const wrong_expire_users = users.filter(u=> u.expire - Math.floor(Date.now() / 1000) > 90 * 24 * 60 * 60)
    console.log(wrong_expire_users);

    
    const valid_expires = {}


    for(let u of wrong_expire_users)
    {
        const logs = await (await logs_clct()).findOne({$regex:{msg:`!${u.username} with !10000 GB data and`},$regex:{msg:`created user`}}).sort({time:-1})

        if(!logs)
        {
            console.log(`No logs found for ${u.username}`)
            continue
        }

        const expire = logs.msg.split('!')[3].split(' ')[0]

        valid_expires[u.username] = expire

    }

    console.log(valid_expires)

}

init()