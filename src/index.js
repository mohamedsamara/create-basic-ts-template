#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require("inquirer");
var fs = require("fs");
var path = require("path");
var shell = require("shelljs");
var template = require("./utils/template");
var chalk_1 = require("chalk");
var yargs = require("yargs");
var CHOICES = fs.readdirSync(path.join(__dirname, "templates"));
var QUESTIONS = [
    {
        name: "template",
        type: "list",
        message: "What project template would you like to generate?",
        choices: CHOICES,
        when: function () { return !yargs.argv["template"]; },
    },
    {
        name: "name",
        type: "input",
        message: "Project name:",
        when: function () { return !yargs.argv["name"]; },
        validate: function (input) {
            if (/^([A-Za-z\-\_\d])+$/.test(input))
                return true;
            else
                return "Project name may only include letters, numbers, underscores and hashes.";
        },
    },
];
var CURR_DIR = process.cwd();
inquirer.prompt(QUESTIONS).then(function (answers) {
    answers = Object.assign({}, answers, yargs.argv);
    var projectChoice = answers["template"];
    var projectName = answers["name"];
    var templatePath = path.join(__dirname, "templates", projectChoice);
    var targetPath = path.join(CURR_DIR, projectName);
    var templateConfig = getTemplateConfig(templatePath);
    var options = {
        projectName: projectName,
        templateName: projectChoice,
        templatePath: templatePath,
        targetPath: targetPath,
        config: templateConfig,
    };
    if (!createProject(targetPath)) {
        return;
    }
    createDirectoryContents(templatePath, projectName, templateConfig);
    if (!postProcess(options)) {
        return;
    }
    showMessage(options);
});
function showMessage(options) {
    console.log("");
    console.log(chalk_1.default.green("Done."));
    console.log(chalk_1.default.green("Go into the project: cd ".concat(options.projectName)));
    var message = options.config.postMessage;
    if (message) {
        console.log("");
        console.log(chalk_1.default.yellow(message));
        console.log("");
    }
}
function getTemplateConfig(templatePath) {
    var configPath = path.join(templatePath, ".template.json");
    if (!fs.existsSync(configPath))
        return {};
    var templateConfigContent = fs.readFileSync(configPath);
    if (templateConfigContent) {
        return JSON.parse(templateConfigContent.toString());
    }
    return {};
}
function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk_1.default.red("Folder ".concat(projectPath, " exists. Delete or use another name.")));
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
}
function postProcess(options) {
    if (isNode(options)) {
        return postProcessNode(options);
    }
    return true;
}
function isNode(options) {
    return fs.existsSync(path.join(options.templatePath, "package.json"));
}
function postProcessNode(options) {
    shell.cd(options.targetPath);
    var cmd = "";
    if (shell.which("yarn")) {
        cmd = "yarn";
    }
    else if (shell.which("npm")) {
        cmd = "npm install";
    }
    if (cmd) {
        var result = shell.exec(cmd);
        if (result.code !== 0) {
            return false;
        }
    }
    else {
        console.log(chalk_1.default.red("No yarn or npm found. Cannot run installation."));
    }
    return true;
}
var SKIP_FILES = ["node_modules", ".template.json"];
function createDirectoryContents(templatePath, projectName, config) {
    var filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach(function (file) {
        var origFilePath = path.join(templatePath, file);
        // get stats about the current file
        var stats = fs.statSync(origFilePath);
        if (SKIP_FILES.indexOf(file) > -1)
            return;
        if (stats.isFile()) {
            var contents = fs.readFileSync(origFilePath, "utf8");
            contents = template.render(contents, { projectName: projectName });
            var writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, "utf8");
        }
        else if (stats.isDirectory()) {
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // recursive call
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), config);
        }
    });
}
