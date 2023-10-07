const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');
const { Telegraf , Markup } = require('telegraf');
const bot = new Telegraf('6691381418:AAGn_1oBMzi2i0-J3N7P_0D_9_UbVjXl4QM');
const axios = require('axios');
const fs = require('fs').promises;


const api_key = "resllmwriewfeujeh3i3ifdkmwheweljedifefhyr"
const kb1 = [["🔹 PANELS" , "🔸 ADD PANEL"]]
var temp_data = {};

// --- FUNCTIONS --- //

const add_panel = async (url) =>
{
    await fs.appendFile('panels.txt', url+"\n");
}

const get_panels = async () =>
{
    var panels = await fs.readFile('panels.txt');
    panels = panels.toString().split("\n");
    if(panels[panels.length-1] == "") panels.pop();
    return panels;
}

const get_panel_url = async (name) =>
{
    var panels = await get_panels();
    var panel = panels.filter((panel) => panel.split(",")[0] == name)[0];
    return panel.split(",")[1];
}

const remove_panel = async (name) =>
{
    var panels = await get_panels();
    panels = panels.filter((panel) => panel.split(",")[0] != name);
    await fs.writeFile('panels.txt', panels.join("\n"));
}

const get_knp_info = async (name) =>
{
    var panel_url = await get_panel_url(name);
    var knp_info = (await axios.post(panel_url+"/get_knp_info",{service_access_api_key:api_key},{timeout:15000})).data;
    var result_arr = [];
    result_arr[0] = `
STATUS: ${knp_info.sd_status?"🔴 OFFLINE":"🟢 ONLINE"}

👉🏻 KNP name: <b>${name}</b>
👉🏻 KNP url: <b><a href="${panel_url}">${panel_url.replace(/^https?:\/\//, '')}</a></b>
👉🏻 Active Marzban panels: <b>${knp_info.active_panels_count[0]} of ${knp_info.active_panels_count[1]}</b>
👉🏻 Agents count: <b>${knp_info.agents_count}</b>
👉🏻 Users count: <b>${knp_info.users_count}</b>
👉🏻 Logins count (last 24h): <b>${knp_info.today_logins}</b>`;

    result_arr[1] = 
    {caption:'Caption',parse_mode:'HTML',...Markup.inlineKeyboard
    ([
    [Markup.button.callback('📂 GET LOGS', 'get_logs-'+name)],
    [Markup.button.callback(knp_info.sd_status?"🟢 START":"🔴 SHUT DOWN",(knp_info.sd_status?"start-"+name:"shut_down-"+name)),Markup.button.callback('🗑 REMOVE', 'remove-'+name)]
    ])}

    return result_arr;

}

const get_knp_logs = async (name) =>
{
    var result_arr = [];
    var panel_url = await get_panel_url(name);
    var logs_arr = (await axios.post(panel_url+"/get_admin_logs",
    {
        service_access_api_key:api_key,
        number_of_rows:10,
        current_page:1,
        accounts:[],
        actions:[]
    },{timeout:15000})).data.obj;

    result_arr[0] = logs_arr.map((log_obj,i) => 
    {
        var date = new Date(log_obj.time * 1000);
        log_obj.msg = log_obj.msg.split(" ").map((x,y)=>
        {
            if(y==0) return `<b>${x}</b>`;
            else
            {
                if (x.startsWith("!")) 
                {
                    return `<b>${x.replace("!","")}</b>`;
                }

                else
                {
                    return x;
                }
            }
        }).join(" ");
        var log_time = date.toLocaleString("en-US",{ hourCycle: 'h23' }).replace(", "," - ");
        return ( (i%2?'🔸 ':'🔹 ') + log_obj.msg + "\n" + "📆 " + log_time)
    }).join("\n\n");

    result_arr[1] = {caption:'Caption',parse_mode:'HTML',...Markup.inlineKeyboard([[Markup.button.callback('◀️ BACK', 'back_to_info-'+name)]])}

    return result_arr;

}

// --- MIDDLEWARE --- //

const init_mw = async (ctx,next) =>
{
    if(!temp_data[ctx.from.id]) temp_data[ctx.from.id] = {};
    next();
}

const reset_mw = async (ctx,next) =>
{
    temp_data[ctx.from.id] = {};
    next();
}



bot.command('start',reset_mw, async (ctx) =>
{
    await ctx.reply("🔻 Welcome to KNP Manager" , Markup.keyboard(kb1).resize())
});

bot.hears(kb1[0][1] ,reset_mw, async (ctx) =>
{
    await ctx.reply
(`
✏️ Enter panel name & url

👉🏻 Example: knp5,http://209.38.245.93:5000
`,Markup.keyboard([["⛔️ Back"]]).resize());

    temp_data[ctx.from.id].is_waiting_for_panel_url = 1;
});

bot.hears(kb1[0][0] ,reset_mw, async (ctx) =>
{
    var panels = await get_panels();
    if(panels.length == 0)
    {
        await ctx.reply("💢 No panels found");
        return;
    }
    panels_names = panels.map((panel) => "▫️ " + panel.split(",")[0] + " ▫️");
    var panels_keyboard = [...panels_names , "⛔️ Back"];
    ctx.reply("🔻 Choose a panel",Markup.keyboard(panels_keyboard).resize())
});


bot.hears(/▫️ (.*) ▫️/ ,reset_mw, async (ctx) =>
{
    try
    {
        var panel_name = ctx.message.text.split("▫️")[1].trim();
        var knp_info = await get_knp_info(panel_name);
        ctx.reply(knp_info[0],knp_info[1]);
    }

    catch(err)
    {
        await ctx.reply("💢 Failed to connect to panel");
        return;
    }
});

bot.action(/back_to_info-.*/,reset_mw, async (ctx) =>
{
    try
    {
        var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
        var knp_info = await get_knp_info(panel_name);
        ctx.editMessageText(knp_info[0],knp_info[1]);
    }

    catch(err)
    {
        await ctx.reply("💢 Failed to connect to panel");
        return;
    }
});

bot.action(/get_logs-.*/,reset_mw, async (ctx) =>
{
    
    try
    {
        var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
        var logs = await get_knp_logs(panel_name);
        ctx.editMessageText(logs[0],logs[1]);
    }

    catch(err)
    {
        await ctx.reply("💢 Failed to connect to panel");
        return;
    }
});

bot.action(/remove-.*/,reset_mw, async (ctx) =>
{
    try
    {
        var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
        await remove_panel(panel_name);
        var panels = await get_panels();
        panels_names = panels.map((panel) => "▫️ " + panel.split(",")[0] + " ▫️");
        var panels_keyboard = [...panels_names , "⛔️ Back"];
        var panel_info_msg_id = ctx["update"]["callback_query"]["message"]["message_id"];
        await ctx.telegram.deleteMessage(ctx.chat.id,panel_info_msg_id);
        await ctx.reply("🗑 Panel removed",Markup.keyboard(panels_keyboard).resize());
    }

    catch(err)
    {
        await ctx.reply("💢 Panel not found");
        return;
    }
});

bot.action(/shut_down-.*/,reset_mw, async (ctx) =>
{
    try
    {
        var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
        var panel_url = await get_panel_url(panel_name);
        var sd_req = await axios.post(panel_url+"/enable_sd",{service_access_api_key:api_key},{timeout:15000});
        var knp_info = await get_knp_info(panel_name);
        ctx.editMessageText(knp_info[0],knp_info[1]);
    }

    catch(err)
    {
        ctx.reply("💢 Failed to connect to panel");
        return;
    }

});

bot.action(/start-.*/,reset_mw, async (ctx) =>
{
    try
    {
        var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
        var panel_url = await get_panel_url(panel_name);
        var sd_req = await axios.post(panel_url+"/disable_sd",{service_access_api_key:api_key},{timeout:15000});
        var knp_info = await get_knp_info(panel_name);
        ctx.editMessageText(knp_info[0],knp_info[1]);
    }

    catch(err)
    {
        ctx.reply("💢 Failed to connect to panel");
        return;
    }

});


bot.hears("⛔️ Back",reset_mw, async (ctx) =>
{
    ctx.reply("🔻 Returning" , Markup.keyboard(kb1).resize())
});

bot.on('text' ,init_mw, async (ctx) =>
{
    if(temp_data[ctx.from.id].is_waiting_for_panel_url && ctx.message.text != "⛔️ Back")
    {
        var url_regex = new RegExp("^(http|https)://");
        var panel_url = ctx.message.text.split(",")[1];
        if(!url_regex.test(panel_url))
        {
            await ctx.reply("💢 Invalid url , try again");
            return;
        }

        try
        {
            var req_res = await axios.post(panel_url+"/ping",{service_access_api_key:api_key},{timeout:5000});
            await add_panel(ctx.message.text);
            await ctx.reply("✅ Panel added",Markup.keyboard(kb1).resize());
            temp_data[ctx.from.id].is_waiting_for_panel_url = 0;
        }

        catch(err)
        {
            await ctx.reply("💢 Invalid url , try again");
            return;
        }

    }
});


bot.launch();
console.log("BOT INSTANCE STARTED ...");
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));