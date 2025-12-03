#!/usr/bin/env node

import path, { dirname } from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";
import { applyLayer, replaceTokensRecursively } from "./libFunctions.js";
import { log, spinner } from "@clack/prompts";
import { intro, outro, select, text, isCancel, cancel } from "@clack/prompts";

type AppTarget = "webresource" | "portal" | "power-pages";
type UiTarget = "kendo" | "shadcn-ui";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
	intro("Create EC App");

	const name = await text({
		message: "Project name",
		placeholder: "my-app",
		validate(value) {
			if (value.length === 0) return "Project name cannot be empty";
			if (value.toLocaleLowerCase() !== value)
				return "Project name must be lowercase";
			if (/\s/.test(value)) return "Project name cannot contain spaces";
			if (/[^a-z0-9-_]/.test(value))
				return "Project name can only contain letters, numbers, hyphens, and underscores";
		},
	});

	if (isCancel(name)) {
		cancel("Operation cancelled.");
		process.exit(0);
	}

	const projectName = String(name).trim();

	log.step(`Creating project: ${projectName}`);

	const target = await select<AppTarget>({
		message: "What are you building?",
		options: [
			{ label: "Web Resource", value: "webresource" },
			{ label: "Portal", value: "portal" },
			{ label: "Power Pages", value: "power-pages" },
		],
	});

	if (isCancel(target)) {
		cancel("Operation cancelled.");
		process.exit(0);
	}

	log.step(`Selected target: ${target}`);

	const uiType = await select<UiTarget>({
		message: "What UI library do you want to use?",
		options: [
			{ label: "Kendo UI", value: "kendo" },
			{ label: "Shadcn/UI", value: "shadcn-ui" },
		],
	});

	// log.step(`Selected UI library: ${String(uiType)}`);

	if (isCancel(uiType)) {
		cancel("Operation cancelled.");
		process.exit(0);
	}

	const shouldRunNpmInstall = await select<{ run: boolean }>({
		message: "Do you want to install dependencies?",
		options: [
			{ label: "Yes", value: { run: true } },
			{ label: "No", value: { run: false } },
		],
	});

	if (isCancel(shouldRunNpmInstall)) {
		cancel("Operation cancelled.");
		process.exit(0);
	}

	const projectDir = path.join(process.cwd(), projectName);
	const templatesRoot = path.join(__dirname, "..", "templates");

	const baseDir = path.join(templatesRoot, "base");
	const targetDir = path.join(templatesRoot, "targets", target);
	const uiDir = path.join(templatesRoot, "ui", uiType);

	await fs.copy(baseDir, projectDir);

	if (fs.existsSync(targetDir)) {
		await applyLayer(targetDir, projectDir);
	}

	if (fs.existsSync(uiDir)) {
		await applyLayer(uiDir, projectDir);
	}

	await replaceTokensRecursively(projectDir, {
		APP_NAME: projectName,
		TARGET: target,
		UI: uiType,
	});

	if (shouldRunNpmInstall.run) {
		const s = spinner();
		s.start("Running npm install...");
		const { execSync } = await import("node:child_process");
		execSync("npm install", { cwd: projectDir, stdio: "inherit" });
		s.stop("Dependencies installed.");
	}

	outro(`Scaffolded ${projectName} as ${target} with ${uiType}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
