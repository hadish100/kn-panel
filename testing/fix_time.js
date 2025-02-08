var { users_clct,logs_clct } = require('../db_interface');


async function init()
{
    const users = await (await users_clct()).find({}).toArray()
    const wrong_expire_users = users.filter(u=> u.expire - Math.floor(Date.now() / 1000) > 90 * 24 * 60 * 60)


    const valid_expires = {}


    for(let u of wrong_expire_users)
    {
        const usernamePart = u.username.includes("_") ? u.username.split("_").slice(1).join("_") : u.username

        const logs = await (await logs_clct()).find({
            $or: [
                {
                    $and: [
                        { msg: { $regex: `!${u.username} with !10000\\.00 GB data and`, $options: "i" } },
                        { msg: { $regex: `edited user`, $options: "i" } }
                    ]
                },
                {
                    $and: [
                        { msg: { $regex: `!${usernamePart} with !10000 GB data and`, $options: "i" } },
                        { msg: { $regex: `created user`, $options: "i" } }
                    ]
                }
            ]
        })
        .sort({ time: -1 })
        .limit(1)
        .toArray();
        
          
        if(!logs[0])
        {
            console.log(`No logs found for ${u.username}`)
            continue
        }

        const expire = logs[0].msg.split('!')[3].split(' ')[0]

        valid_expires[u.username] = logs[0].time + (expire * 24 * 60 * 60)

    }

    console.log(valid_expires)

}

init()