import { getKey, hasKey } from './keys.js';

const OPENAI_ACCESS_TOKEN = 'OPENAI_ACCESS_TOKEN';
const OPENAI_API_KEY = 'OPENAI_API_KEY';
const OPENAI_ORG_ID = 'OPENAI_ORG_ID';

export function getOpenAICredential() {
    if (hasKey(OPENAI_ACCESS_TOKEN)) {
        return {
            value: getKey(OPENAI_ACCESS_TOKEN),
            source: OPENAI_ACCESS_TOKEN,
        };
    }

    if (hasKey(OPENAI_API_KEY)) {
        return {
            value: getKey(OPENAI_API_KEY),
            source: OPENAI_API_KEY,
        };
    }

    throw new Error(
        `OpenAI credential not found. Set ${OPENAI_ACCESS_TOKEN} for an OAuth/workload-issued bearer token or ${OPENAI_API_KEY} for the standard API key flow.`
    );
}

export function createOpenAIConfig(url) {
    const config = {};

    if (url)
        config.baseURL = url;

    if (hasKey(OPENAI_ORG_ID))
        config.organization = getKey(OPENAI_ORG_ID);

    config.apiKey = getOpenAICredential().value;
    return config;
}
