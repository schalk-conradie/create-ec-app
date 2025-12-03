#!/usr/bin/env node

import path, { dirname } from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";
import { applyLayer, replaceTokensRecursively } from "./libFunctions.js";

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
    });

    if (isCancel(name)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }

    const projectName = String(name).trim();

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

    const uiType = await select<UiTarget>({
        message: "What UI library do you want to use?",
        options: [
            { label: "Kendo UI", value: "kendo" },
            { label: "Shadcn/UI", value: "shadcn-ui" },
        ],
    });

    if (isCancel(uiType)) {
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

    outro(`Scaffolded ${projectName} as ${target} with ${uiType}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
