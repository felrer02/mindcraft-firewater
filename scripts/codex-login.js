#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { CodexAuthConfig } from '../src/utils/codex_auth.js';

function commandExists(command) {
    const check = process.platform === 'win32' ? 'where' : 'command';
    const args = process.platform === 'win32' ? [command] : ['-v', command];
    const result = spawnSync(check, args, { stdio: 'ignore', shell: process.platform !== 'win32' });
    return result.status === 0;
}

function readAccessToken(authFile) {
    if (!existsSync(authFile))
        return null;
    const data = JSON.parse(readFileSync(authFile, 'utf8'));
    return data?.tokens?.access_token || data?.access_token || data?.accessToken || null;
}

if (!commandExists('codex')) {
    console.error('Codex CLI was not found.');
    console.error('Install it with: npm install -g @openai/codex');
    process.exit(1);
}

const login = spawnSync('codex', ['login', '--device-auth'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (login.status !== 0) {
    console.error('Codex device login did not complete successfully.');
    process.exit(login.status || 1);
}

const authFile = CodexAuthConfig.defaultAuthFile();
const token = readAccessToken(authFile);
if (!token) {
    console.error(`Codex login completed, but no access token was found in ${authFile}.`);
    console.error('If Codex is using an OS credential store, set CODEX_ACCESS_TOKEN or CODEX_AUTH_FILE for Mindcraft.');
    process.exit(1);
}

console.log(`Codex OAuth credential found in ${authFile}.`);
console.log('Mindcraft can now use models like openai-codex/gpt-5.5.');
