const chalk = require('chalk');
const prompt = require('prompt-sync')();
const readline = require('readline');
const fs = require('fs').promises;
const file_path = '../docker-compose.yml';

const docker_compose_template = `
  marzban-node-{{{node_name}}}:
    image: gozargah/marzban-node:latest
    restart: always

    environment:
      SSL_CLIENT_CERT_FILE: "/var/lib/marzban-node/ssl_client_cert_{{{node_name}}}.pem"

    volumes:
      - /var/lib/marzban-node:/var/lib/marzban-node
      - /var/lib/marzban:/var/lib/marzban

    ports:
      - {{{service_port}}}:62050
      - {{{api_port}}}:62051
      - {{{inbound_port_1_prime}}}:{{{inbound_port_1}}}
      - {{{inbound_port_2_prime}}}:{{{inbound_port_2}}}
      - {{{inbound_port_3_prime}}}:{{{inbound_port_3}}}
      - {{{inbound_port_4_prime}}}:{{{inbound_port_4}}}

`


function delete_inbound_ports(template)
{
    return template.split("\n").map(x=>
    {
        if(!x.includes("inbound_port_")) return x;
        else return null;
    }).filter((x) => x != null).join("\n");
}   



function template_replace(template,key,value)
{
    return template.replace(new RegExp(`{{{${key}}}}`,'g'),value);
}


async function init()
{
    var num_nodes = 1;

    if(process.argv[2] != "add") 
    {
        await fs.writeFile(file_path,"services:\n");
        console.log(chalk.greenBright('Enter number of nodes: '));
        num_nodes = prompt();
    }

    for(var i=0;i<num_nodes;i++)
    {
        var template = docker_compose_template;
        console.log(chalk.greenBright(`Enter node name ${i+1}: `));
        var node_name = prompt(); 
        template = template_replace(template,'node_name',node_name);
        console.log(chalk.greenBright(`Enter service port for node ${node_name}: `));
        var service_port = prompt();
        template = template_replace(template,'service_port',service_port);
        console.log(chalk.greenBright(`Enter api port for node ${node_name}: `));
        var api_port = prompt();
        template = template_replace(template,'api_port',api_port);
        console.log(chalk.redBright(`Do you want to enter inbound ports for ${node_name}? (y/n): `));
        var yn_input = prompt();
        if(yn_input.toLowerCase() == 'y')
        {
            console.log(chalk.greenBright(`Enter inbound port 1 for node ${node_name}: `));
            var inbound_port_1 = prompt();
            template = template_replace(template,'inbound_port_1',inbound_port_1);
            console.log(chalk.greenBright(`Enter inbound port 2 for node ${node_name}: `));
            var inbound_port_2 = prompt();
            template = template_replace(template,'inbound_port_2',inbound_port_2);
            console.log(chalk.greenBright(`Enter inbound port 3 for node ${node_name}: `));
            var inbound_port_3 = prompt();
            template = template_replace(template,'inbound_port_3',inbound_port_3);
            console.log(chalk.greenBright(`Enter inbound port 4 for node ${node_name}: `));
            var inbound_port_4 = prompt();
            template = template_replace(template,'inbound_port_4',inbound_port_4);

            console.log(chalk.greenBright(`Enter secondary inbound port 1 for node ${node_name}: `));
            var inbound_port_1_prime = prompt();
            template = template_replace(template,'inbound_port_1_prime',inbound_port_1_prime);
            console.log(chalk.greenBright(`Enter secondary inbound port 2 for node ${node_name}: `));
            var inbound_port_2_prime = prompt();
            template = template_replace(template,'inbound_port_2_prime',inbound_port_2_prime);
            console.log(chalk.greenBright(`Enter secondary inbound port 3 for node ${node_name}: `));
            var inbound_port_3_prime = prompt();
            template = template_replace(template,'inbound_port_3_prime',inbound_port_3_prime);
            console.log(chalk.greenBright(`Enter secondary inbound port 4 for node ${node_name}: `));
            var inbound_port_4_prime = prompt();
            template = template_replace(template,'inbound_port_4_prime',inbound_port_4_prime);

        }

        else template = delete_inbound_ports(template);

        console.log(chalk.greenBright('Enter Cert: '));

        var cert = await get_cert();

        await fs.writeFile(`/var/lib/marzban-node/ssl_client_cert_${node_name}.pem`,cert);
        await fs.appendFile(file_path,template);
        console.log(chalk.blueBright(`Node ${node_name} added to docker-compose.yml file!`));

    }








async function get_cert() 
{
    return new Promise((resolve, reject) => 
    {
        const cert_input = [];
        const rl = readline.createInterface
        ({
            input: process.stdin,
            output: process.stdout
        });

        rl.prompt();

        rl.on('line', (line) => 
        {
            cert_input.push(line);
            if (line === "-----END CERTIFICATE-----") 
            {
                rl.close();
            }
        });

        rl.on('close', () => {
            resolve(cert_input.join("\n"));
        });

        rl.on('error', (error) => 
        {
            reject(error);
        });
    });
}

}

init();