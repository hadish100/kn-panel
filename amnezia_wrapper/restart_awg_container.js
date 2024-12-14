const {restart_awg_container} = require('./utils.js');

async function init()
{
    await restart_awg_container();
    process.exit(0);
}

init();

// echo "alias awg-restart='node /root/wrapper/restart_awg_container.js'" >> ~/.bashrc && source ~/.bashrc