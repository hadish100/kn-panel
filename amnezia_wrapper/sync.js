const {
    sleep,
    $sync_accounting,
  } = require('./utils.js');

async function init()
{
    while(true)
    {
        await $sync_accounting();
        await sleep(90);
    }
}

init();