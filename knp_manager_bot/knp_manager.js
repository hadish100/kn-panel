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
    var panel_name = ctx.message.text.split("▫️")[1].trim();
    try
    {
        var panel_url = await get_panel_url(panel_name);
        var knp_info = (await axios.post(panel_url+"/get_knp_info",{service_access_api_key:api_key},{timeout:15000})).data;
        await ctx.reply
(`
STATUS: 🟢 ONLINE

👉🏻 KNP name: <b>${panel_name}</b>
👉🏻 KNP url: <b><a href="${panel_url}">${panel_url.replace(/^https?:\/\//, '')}</a></b>
👉🏻 Active Marzban panels: <b>${knp_info.active_panels_count[0]} of ${knp_info.active_panels_count[1]}</b>
👉🏻 Agents count: <b>${knp_info.agents_count}</b>
👉🏻 Users count: <b>${knp_info.users_count}</b>
👉🏻 Logins count (last 24h): <b>${knp_info.today_logins}</b>`,{caption:'Caption',parse_mode:'HTML',...Markup.inlineKeyboard
([
[Markup.button.callback('📂 GET LOGS', 'get_logs-'+panel_name)],
[Markup.button.callback('❌ SHUT DOWN', 'shut_down-'+panel_name),Markup.button.callback('🗑 REMOVE', 'remove-'+panel_name)]
])}
);
    }

    catch(err)
    {
        await ctx.reply("💢 Failed to connect to panel");
        return;
    }
});

bot.action(/get_logs-.*/,reset_mw, async (ctx) =>
{
    var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
    var panel_url = await get_panel_url(panel_name);
    try
    {
        var logs_arr = (await axios.post(panel_url+"/get_admin_logs",
        {
            service_access_api_key:api_key,
            number_of_rows:10,
            current_page:1,
            accounts:[],
            actions:[]
        },{timeout:15000})).data.obj;

        ctx.reply(logs_arr.map((log_obj,i) => 
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
        }).join("\n\n"),{parse_mode:'HTML'});
    }

    catch(err)
    {
        await ctx.reply("💢 Failed to connect to panel");
        console.log(err);
        return;
    }
});

bot.action(/remove-.*/,reset_mw, async (ctx) =>
{
    try
    {
        var panel_name = ctx["update"]["callback_query"]["data"].split("-")[1];
        await remove_panel(panel_name);
        await ctx.reply("✅ Panel removed");
    }

    catch(err)
    {
        await ctx.reply("💢 Panel not found");
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