import settings from './settings.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { existsSync, readFileSync } from 'fs';
import { pathToFileURL } from 'url';

async function loadLocalSettings(path = './settings.local.js') {
    if (!existsSync(path)) {
        return;
    }
    const localSettings = await import(pathToFileURL(path).href);
    Object.assign(settings, localSettings.default || localSettings.settings || {});
}

function parseBoolean(value) {
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseInteger(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

function parseArguments() {
    return yargs(hideBin(process.argv))
        .option('profiles', {
            type: 'array',
            describe: 'List of agent profile paths',
        })
        .option('task_path', {
            type: 'string',
            describe: 'Path to task file to execute'
        })
        .option('task_id', {
            type: 'string',
            describe: 'Task ID to execute'
        })
        .help()
        .alias('help', 'h')
        .parse();
}

await loadLocalSettings();

const args = parseArguments();
if (args.profiles) {
    settings.profiles = args.profiles;
}
if (args.task_path) {
    let tasks = JSON.parse(readFileSync(args.task_path, 'utf8'));
    if (args.task_id) {
        settings.task = tasks[args.task_id];
        settings.task.task_id = args.task_id;
    }
    else {
        throw new Error('task_id is required when task_path is provided');
    }
}

// these environment variables override certain runtime settings
if (process.env.MINDSERVER_PORT) {
    settings.mindserver_port = parseInteger(process.env.MINDSERVER_PORT, settings.mindserver_port);
}
if (process.env.PROFILES && JSON.parse(process.env.PROFILES).length > 0) {
    settings.profiles = JSON.parse(process.env.PROFILES);
}
if (process.env.INSECURE_CODING) {
    settings.allow_insecure_coding = parseBoolean(process.env.INSECURE_CODING);
}
if (process.env.AUTO_OPEN_UI) {
    settings.auto_open_ui = parseBoolean(process.env.AUTO_OPEN_UI);
}
if (process.env.BLOCKED_ACTIONS) {
    settings.blocked_actions = JSON.parse(process.env.BLOCKED_ACTIONS);
}
if (process.env.MAX_MESSAGES) {
    settings.max_messages = parseInteger(process.env.MAX_MESSAGES, settings.max_messages);
}
if (process.env.NUM_EXAMPLES) {
    settings.num_examples = parseInteger(process.env.NUM_EXAMPLES, settings.num_examples);
}
if (process.env.LOG_ALL) {
    settings.log_all_prompts = parseBoolean(process.env.LOG_ALL);
}
if (process.env.SETTINGS_JSON) {
    try {
        Object.assign(settings, JSON.parse(process.env.SETTINGS_JSON));
    } catch (err) {
        console.error("Failed to parse environment variable for SETTINGS_JSON:", err);
    }
}
const Mindcraft = await import('./src/mindcraft/mindcraft.js');
Mindcraft.init(false, settings.mindserver_port, settings.auto_open_ui);

for (let profile of settings.profiles) {
    const profile_json = JSON.parse(readFileSync(profile, 'utf8'));
    settings.profile = profile_json;
    Mindcraft.createAgent(settings);
}
