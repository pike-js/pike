import app from 'commander';

app
  .command('new <name>', 'Creates a new Pike app')
  .action((name, cmd) => {
    console.log('name', name);
    console.log('cmd', cmd);
  });

app.parse(process.argv);
