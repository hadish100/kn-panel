require('dotenv').config()
var backup_config = require('./backup_config.json');

const export_arr = 
[
  {
    name: "server",
    script: "server.js",
  },
  {
    name: "sync",
    script: "sync.js",
  },
]

if(!backup_config.telegram.disabled || !backup_config.email.disabled)
{
  export_arr.push
  ({
    name: "backup",
    script: "backup_service.js",
  });
}

if(process.env.RELEASE=="ALI")
{
  export_arr.push
  ({
    name: "agent_scanner",
    script: "agent_scanner.js",
  });
}

module.exports = { apps: export_arr };
  