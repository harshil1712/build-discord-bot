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

		shell.echo("🤖 You'r all set to build your bot");
	})
	.catch((error) => {
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
			shell.echo("⛔️ Error: Can't create the .env file\n");
		} else {
			// Something else went wrong
		}
	});
