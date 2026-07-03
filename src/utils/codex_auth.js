import { existsSync, readFileSync } from 'fs';
import os from 'os';
import path from 'path';
import { getKey, hasKey } from './keys.js';

const CODEX_ACCESS_TOKEN = 'CODEX_ACCESS_TOKEN';
const CODEX_AUTH_FILE = 'CODEX_AUTH_FILE';
const CODEX_BASE_URL = 'CODEX_BASE_URL';
const DEFAULT_CODEX_BASE_URL = 'https://chatgpt.com/backend-api/codex';

function expandHome(filePath) {
    if (!filePath)
        return filePath;
    if (filePath === '~')
        return os.homedir();
    if (filePath.startsWith('~/') || filePath.startsWith('~\\'))
        return path.join(os.homedir(), filePath.slice(2));
    return filePath;
}

function defaultCodexAuthFile() {
    return path.join(os.homedir(), '.codex', 'auth.json');
}

function readJsonFile(filePath) {
    const expanded = expandHome(filePath);
    if (!expanded || !existsSync(expanded))
        return null;
    return JSON.parse(readFileSync(expanded, 'utf8'));
}

function findAccessToken(data) {
    if (!data || typeof data !== 'object')
        return null;

    const candidates = [
        data.access_token,
        data.accessToken,
        data.token,
        data?.tokens?.access_token,
        data?.tokens?.accessToken,
        data?.providers?.['openai-codex']?.access_token,
        data?.providers?.['openai-codex']?.tokens?.access_token,
    ];

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim())
            return candidate.trim();
    }

    return null;
}

function configuredAuthFile() {
    if (process.env[CODEX_AUTH_FILE])
        return process.env[CODEX_AUTH_FILE];
    if (hasKey(CODEX_AUTH_FILE))
        return getKey(CODEX_AUTH_FILE);
    return null;
}

export function getCodexBaseUrl(url) {
    if (url)
        return url.replace(/\/+$/, '');
    if (process.env[CODEX_BASE_URL])
        return process.env[CODEX_BASE_URL].replace(/\/+$/, '');
    if (hasKey(CODEX_BASE_URL))
        return getKey(CODEX_BASE_URL).replace(/\/+$/, '');
    return DEFAULT_CODEX_BASE_URL;
}

export function getCodexAccessToken() {
    if (process.env[CODEX_ACCESS_TOKEN]) {
        return {
            value: process.env[CODEX_ACCESS_TOKEN],
            source: CODEX_ACCESS_TOKEN,
        };
    }

    if (hasKey(CODEX_ACCESS_TOKEN)) {
        return {
            value: getKey(CODEX_ACCESS_TOKEN),
            source: CODEX_ACCESS_TOKEN,
        };
    }

    const authFiles = [configuredAuthFile(), defaultCodexAuthFile()].filter(Boolean);
    for (const authFile of authFiles) {
        const data = readJsonFile(authFile);
        const token = findAccessToken(data);
        if (token) {
            return {
                value: token,
                source: expandHome(authFile),
            };
        }
    }

    throw new Error(
        'Codex OAuth token not found. Run `node scripts/codex-login.js` or `codex login --device-auth`, or set CODEX_ACCESS_TOKEN.'
    );
}

export const CodexAuthConfig = {
    defaultBaseUrl: DEFAULT_CODEX_BASE_URL,
    defaultAuthFile: defaultCodexAuthFile,
};
