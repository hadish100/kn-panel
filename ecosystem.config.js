module.exports = {
    apps: [
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
      {
        name: "backup",
        script: "backup_config.js",
        watch: true
      }
    ]
  };
  