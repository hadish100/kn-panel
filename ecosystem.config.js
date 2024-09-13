var backup_config = require('./backup_config.json');

const export_arr = 
[
  {
    name: "server",
    script: "server.js",
    watch: true
  },
  {
    name: "sync",
    script: "sync.js",
    watch: true
  },
]

if(!backup_config.telegram.disabled || !backup_config.email.disabled)
{
  export_arr.push
  ({
    name: "backup",
    script: "backup_service.js",
    watch: true
  });
}

module.exports = { apps: export_arr };
  