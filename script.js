#!/usr/bin/env node

const shell = require('shelljs');
const inquirer = require('inquirer');

const repoName = process.argv.slice(2)[0];

// 1. Clone the repo

if (!shell.which('git')) {
	shell.echo('⛔️ Error: Please install git');
	shell.exit(1);
}

let cloneStatus = repoName
	? shell.exec(
			`git clone https://github.com/harshil1712/Discord-Bot-Template.git ${repoName}`
	  ).code
	: shell.exec(
			`git clone https://github.com/harshil1712/Discord-Bot-Template.git`
	  ).code;

if (cloneStatus !== 0) {
	shell.echo('⛔️ Error: Git clone failed');
	shell.exit(1);
}

shell.echo('✨ Repo was successfully cloned!');

// 2. Install the packages

repoName ? shell.cd(repoName) : shell.cd('Discord-Bot-Template');
shell.echo(shell.pwd());

shell.echo('🔄 Installing packages...');

if (shell.exec('npm install').code !== 0) {
	shell.echo('Error: npm install failed');
	shell.exit(1);
}

shell.echo('✨ Packages install successfully');

// 3. Create .env and ask for bot token

inquirer
	.prompt([
		{
			type: 'password',
			message: 'Enter your Bot Token Value',
			name: 'token',
		},
	])
	.then((answers) => {
		shell.touch('.env');
		shell.ShellString(`BOT_TOKEN=${answers.token}`).to('.env');

		// 4. Initialize git

		shell.exec('rm -rf .git');
		shell.exec('git init');

    // 5. Select request library to install after the repo it's cloned
    requestLibraryStep();
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
			shell.echo("⛔️ Error: Can't create the .env file\n");
		} else {
			// Something else went wrong
		}
	});

  const requestLibraryStep = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "request",
          message: "Which request library do yo want to use for your requests?",
          choices: [
            { name: "axios", value: "npm i axios" },
            { name: "node-fetch", value: "npm i node-fetch" },
            { name: "got", value: "npm i got" },
            { name: "I will handle these by myself", value: "" },
          ],
        },
      ])
      .then(({ request }) => {
        if (request) {
          shell.exec(request);
        }
      })
      .catch((error) => {
        shell.echo("⛔️ Error: Can't install the request library selected");
      })
      .finally(() => shell.echo("🤖 You'r all set to build your bot"));
  };