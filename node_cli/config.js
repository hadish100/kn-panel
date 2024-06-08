const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');
const file_path = '../docker-compose.yml';

(async () => 
{


    var file_content = await fs.promises.readFile(file_path, 'utf-8');
    var file_content_arr = file_content.split('\n');
    file_content_arr = file_content_arr.map((line) => 
    {
        if(line.includes("SSL_CERT"))
        {
            return line.replace("SSL_CERT", "#SSL_CERT")
        }
        
        else if(line.includes("SSL_KEY"))
        {
            return line.replace("SSL_KEY", "#SSL_KEY")
        }

        else if(line.includes("SSL_CLIENT"))
        {
            return line.replace("# ", "")
        }

        else
        {
            return line
        }
    })

    file_content = file_content_arr.join('\n');
    await fs.promises.writeFile(file_path, file_content);




    console.log(chalk.greenBright('Enter Cert: '));

    var input = [];

    var rl = readline.createInterface
    ({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.prompt();
    
    rl.on('line', function (cmd) 
    {
        input.push(cmd);
    });
    
    rl.on('close', async function (cmd) 
    {
        await fs.promises.writeFile('/var/lib/marzban-node/ssl_client_cert.pem',input.join("\n"));  
        console.log(chalk.blueBright('Cert file created!'));
        process.exit(0);
    });


    

})();