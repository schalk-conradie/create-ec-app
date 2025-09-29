#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { createWebResourceApp } from "./creators/webresource.js";
import { createPortalApp } from "./creators/portal.js";
import { createPowerPagesApp } from "./creators/powerpages.js";
import { createMobileApp } from "./creators/mobile.js";

interface AppTypeChoice {
	name: string;
	value: string;
	description: string;
}

const main = async (): Promise<void> => {
	console.log(chalk.bold.hex("#F5AB00")("\nEC App Creator\n"));
	console.log(chalk.gray("Create applications for your EC ecosystem.\n"));

	// Prompt for project name if not provided
	let projectName: string = process.argv[2];
	if (!projectName) {
		const { newProjectName } = await inquirer.prompt<{ newProjectName: string }>([
			{
				type: "input",
				name: "newProjectName",
				message: "What is the name of your project?",
				validate: (input: string) =>
					input === "." ||
					/^([a-z0-9\-_])+$/.test(input) ||
					'Project name may only include "." in order to use the parent directory name, lowercase letters, numbers, underscores, and hyphens.',
			},
		]);
		projectName = newProjectName;
	}

	// Prompt for application type
	const appTypes: AppTypeChoice[] = [
		{
			name: "Webresource App",
			value: "webresource",
			description: "React app for Dynamics 365 webresources with Vite, optional Kendo UI, and Tailwind"
		},
		{
			name: "Portal App",
			value: "portal",
			description: "Next.js app for customer portals with authentication and Dynamics integration"
		},
		{
			name: "Power Pages App",
			value: "powerpages",
			description: "React SPA for Power Pages with authentication context and data services"
		},
		{
			name: "Mobile App",
			value: "mobile",
			description: "React Native Expo app with TypeScript and NativeWind"
		}
	];

	const { appType } = await inquirer.prompt<{ appType: string }>([
		{
			type: "list",
			name: "appType",
			message: "What type of application would you like to create?",
			choices: appTypes.map(type => ({
				name: `${type.name}\n  ${chalk.gray(type.description)}`,
				value: type.value,
				short: type.name
			})),
			pageSize: 10
		},
	]);

	console.log(`\n${chalk.green("Creating")} ${chalk.bold(appType)} app: ${chalk.cyan(projectName)}\n`);

	// Route to the appropriate creator
	switch (appType) {
		case "webresource":
			await createWebResourceApp(projectName);
			break;
		case "portal":
			await createPortalApp(projectName);
			break;
		case "powerpages":
			await createPowerPagesApp(projectName);
			break;
		case "mobile":
			await createMobileApp(projectName);
			break;
		default:
			console.error(chalk.red(`Unknown app type: ${appType}`));
			process.exit(1);
	}

	// Final success message
	console.log(chalk.green.bold("\nProject created successfully."));
	console.log(`\n${chalk.cyan("Next steps:")}`);
	console.log(`  - cd ${projectName}`);
	if (appType === "webresource" || appType === "powerpages") {
		console.log(`  - If you selected Kendo UI: ${chalk.yellow("npx kendo-ui-license activate")}`);
	}
	console.log(`  - npm run dev`);
	console.log(`  - npm run build\n`);
};

main().catch((error) => {
	console.error(chalk.red("An error occurred:"), error);
	process.exit(1);
});
