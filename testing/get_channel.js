const {Telegraf} = require('telegraf');
const bot = new Telegraf("5913797224:AAGWN9RkvnecYh1hJinnEsjWuxqsccL7zME");
var result = bot.telegram.sendMessage("@limoovpnbckup", "تست").then((res) => {
    console.log(res);
});
