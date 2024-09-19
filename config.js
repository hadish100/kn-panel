const chalk = require('chalk');
const prompt = require('prompt-sync')({sigint: true});
const { execSync } = require('child_process');
const fs = require('fs').promises;

(async () => 
{
    var config = {};
    var telegram_config = {};

    var domain_regex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    var name_regex = /[a-zA-Z0-9]+/;
    config.panel_name = prompt(chalk.greenBright('Enter panel name: '));
    while(!name_regex.test(config.panel_name)) config.panel_name = prompt(chalk.redBright('Invalid name! Please enter a valid name: '));

    config.panel_domain = prompt(chalk.greenBright('Enter panel domain: (Example: panel.test.ir) '));
    while(!domain_regex.test(config.panel_domain)) config.panel_domain = prompt(chalk.redBright('Invalid domain! Please enter a valid domain: '));

    config.sublink_domain = prompt(chalk.greenBright('Enter sublink domain: (Example: sub.test.ir) '));
    while(!domain_regex.test(config.sublink_domain)) config.sublink_domain = prompt(chalk.redBright('Invalid domain! Please enter a valid domain: '));
    
    config.panel_name = format_name(config.panel_name);
    config.panel_domain = fomat_url(config.panel_domain);
    config.sublink_domain = fomat_url(config.sublink_domain);

    await change_env_file('RELEASE',config.panel_name);
    await change_env_file('SUB_URL',config.sublink_domain);
    await change_env_file('PANEL_URL',config.panel_domain);

    var main_config = generate_nginx_config(config.sublink_domain, config.panel_domain, 5000, "knp-backend") + "\n" + generate_nginx_config(config.panel_domain, config.panel_domain, 3000, "knp-frontend");
    await fs.writeFile('./main.conf', main_config);

    var is_telegram_disabled = prompt(chalk.greenBright('Do you want to enable telegram backups? (y/n) ')).toLowerCase()
    while(is_telegram_disabled != 'y' && is_telegram_disabled != 'n') is_telegram_disabled = prompt(chalk.redBright('Invalid input! Please enter y or n: ')).toLowerCase();
    telegram_config.disabled = is_telegram_disabled == 'n';
    
    if(!telegram_config.disabled)
    {
        var telegram_bot_token_regex = /^[0-9]+:[a-zA-Z0-9_-]+$/;
        var telegram_chat_id_regex = /^[0-9]+$/;
        telegram_config.bot_token = prompt(chalk.greenBright('Enter telegram bot token: '));
        while(!telegram_bot_token_regex.test(telegram_config.bot_token)) telegram_config.bot_token = prompt(chalk.redBright('Invalid bot token! Please enter a valid bot token: '));
        telegram_config.chat_id = prompt(chalk.greenBright('Enter telegram chat id: '));
        while(!telegram_chat_id_regex.test(telegram_config.chat_id)) telegram_config.chat_id = prompt(chalk.redBright('Invalid chat id! Please enter a valid chat id: '));
        var backup_interval = prompt(chalk.greenBright('Enter backup interval (in seconds): '));
        while(isNaN(backup_interval)) backup_interval = prompt(chalk.redBright('Invalid interval! Please enter a valid interval: '));
        backup_interval = parseInt(backup_interval);

        await set_telegram_property(telegram_config);
        await set_backup_interval(backup_interval);
    }

    else
    {
        telegram_config.bot_token = '';
        telegram_config.chat_id = '';
        await set_telegram_property(telegram_config);
    }


    var does_the_client_want_zarinpal = prompt(chalk.greenBright('Do you want to enable Zarinpal payments? (y/n) ')).toLowerCase();
    while(does_the_client_want_zarinpal != 'y' && does_the_client_want_zarinpal != 'n') does_the_client_want_zarinpal = prompt(chalk.redBright('Invalid input! Please enter y or n: ')).toLowerCase();

    if(does_the_client_want_zarinpal == 'y')
    {
        var zarinpal_merchant_id = prompt(chalk.greenBright('Enter Zarinpal merchant id: '));
        while(zarinpal_merchant_id.length != 36) zarinpal_merchant_id = prompt(chalk.redBright('Invalid merchant id! Please enter a valid merchant id: '));
        await change_env_file('ZARINPAL_TOKEN',zarinpal_merchant_id);
    }

    var does_the_client_want_nowpayments = prompt(chalk.greenBright('Do you want to enable Nowpayments payments? (y/n) ')).toLowerCase();
    while(does_the_client_want_nowpayments != 'y' && does_the_client_want_nowpayments != 'n') does_the_client_want_nowpayments = prompt(chalk.redBright('Invalid input! Please enter y or n: ')).toLowerCase();

    if(does_the_client_want_nowpayments == 'y')
    {
        var nowpayments_api_key = prompt(chalk.greenBright('Enter Nowpayments api key: '));
        while(nowpayments_api_key.includes("#")) nowpayments_api_key = prompt(chalk.redBright('Invalid api key! Please enter a valid api key: '));
        await change_env_file('NOWPAYMENTS_TOKEN',nowpayments_api_key);
    }


    console.log(chalk.blueBright('Config wizard completed!'));

})();


function generate_nginx_config(domain,ssl,port,container_name)
{
    return `
    server {
        listen 443 ssl;
        server_name ${domain};
    
        ssl_certificate /etc/letsencrypt/live/${ssl}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${ssl}/privkey.pem;
    
        location / {
            proxy_pass http://${container_name}:${port};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    
    server {
        listen 80;
        server_name ${domain};
        return 301 https://$host$request_uri;
    }

    `
}

async function change_env_file(key,value)
{
    var env_file = await fs.readFile('./.env','utf8');
    env_file = env_file.replace(new RegExp(`${key}=(.*)`),`${key}=${value}`);
    await fs.writeFile('./.env',env_file);
}

function fomat_url(url)
{
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function format_name(name)
{
    return name.trim().toUpperCase().replace(/\s/g, '_');
}

async function set_telegram_property(obj)
{
    var config_file = await fs.readFile('./backup_config.json','utf8');
    config_file = JSON.parse(config_file);
    config_file.telegram = obj;
    await fs.writeFile('./backup_config.json',JSON.stringify(config_file,null,4));
}

async function set_backup_interval(interval)
{
    var config_file = await fs.readFile('./backup_config.json','utf8');
    config_file = JSON.parse(config_file);
    config_file.interval = interval;
    await fs.writeFile('./backup_config.json',JSON.stringify(config_file,null,4));
}
