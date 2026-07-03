import { getCodexAccessToken, getCodexBaseUrl } from '../utils/codex_auth.js';
import { strictFormat } from '../utils/text.js';

function extractText(value) {
    if (!value)
        return '';
    if (typeof value === 'string')
        return value;
    if (Array.isArray(value))
        return value.map(extractText).join('');
    if (typeof value !== 'object')
        return '';

    if (typeof value.output_text === 'string')
        return value.output_text;
    if (typeof value.text === 'string')
        return value.text;
    if (typeof value.delta === 'string')
        return value.delta;
    if (value.text && typeof value.text.value === 'string')
        return value.text.value;
    if (value.content)
        return extractText(value.content);
    if (value.item)
        return extractText(value.item);
    if (value.response)
        return extractText(value.response);
    if (value.output)
        return extractText(value.output);

    return '';
}

function parseSSEMessage(rawMessage) {
    let event = '';
    const data = [];

    for (const line of rawMessage.split(/\r?\n/)) {
        if (line.startsWith('event:')) {
            event = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
            data.push(line.slice(5).trimStart());
        }
    }

    return {
        event,
        data: data.join('\n'),
    };
}

export function extractTextFromCodexEvent(eventName, payload) {
    const type = payload?.type || eventName;

    if (type === 'response.output_text.delta')
        return { delta: typeof payload.delta === 'string' ? payload.delta : '' };

    if (type === 'response.output_item.done')
        return { fallback: extractText(payload.item || payload) };

    if (type === 'response.completed')
        return { fallback: extractText(payload.response || payload) };

    return { delta: '', fallback: '' };
}

export async function readCodexSSE(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let outputText = '';
    let fallbackText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;

        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split(/\r?\n\r?\n/);
        buffer = messages.pop() || '';

        for (const rawMessage of messages) {
            const { event, data } = parseSSEMessage(rawMessage);
            if (!data || data === '[DONE]')
                continue;

            let payload;
            try {
                payload = JSON.parse(data);
            } catch (err) {
                continue;
            }

            const text = extractTextFromCodexEvent(event, payload);
            outputText += text.delta || '';
            fallbackText += text.fallback || '';
        }
    }

    const finalBuffer = buffer.trim();
    if (finalBuffer) {
        const { event, data } = parseSSEMessage(finalBuffer);
        if (data && data !== '[DONE]') {
            try {
                const text = extractTextFromCodexEvent(event, JSON.parse(data));
                outputText += text.delta || '';
                fallbackText += text.fallback || '';
            } catch (err) {
                // Ignore partial or non-JSON terminal chunks.
            }
        }
    }

    return outputText || fallbackText;
}

function mapCodexError(status, body) {
    if (status === 401) {
        return 'Codex OAuth expired; run `node scripts/codex-login.js` or `codex login --device-auth`.';
    }
    if (status === 429) {
        return 'ChatGPT/Codex usage limit reached.';
    }
    if (status === 400 && body.toLowerCase().includes('unsupported parameter')) {
        return `Codex backend rejected an unsupported parameter. Mindcraft sends sanitized params only; response body: ${body}`;
    }
    return `Codex backend request failed with HTTP ${status}: ${body}`;
}

export class OpenAICodex {
    static prefix = 'openai-codex';

    constructor(model_name, url, params) {
        this.model_name = model_name;
        this.url = getCodexBaseUrl(url);
        this.params = params || {};
    }

    async sendRequest(turns, systemMessage, stop_seq='***') {
        const model = this.model_name || 'gpt-5.5';
        const messages = strictFormat(turns);
        const body = {
            model,
            instructions: systemMessage,
            input: messages,
            stream: true,
            store: false,
        };

        if (this.params.reasoning)
            body.reasoning = this.params.reasoning;

        try {
            const token = getCodexAccessToken().value;
            console.log('Awaiting openai-codex response from model', model);
            const response = await fetch(`${this.url}/responses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                return mapCodexError(response.status, errorBody);
            }

            if (!response.body)
                return 'Codex backend returned an empty response body.';

            let result = await readCodexSSE(response.body);
            const stopSeqIndex = result.indexOf(stop_seq);
            result = stopSeqIndex !== -1 ? result.slice(0, stopSeqIndex) : result;
            return result || 'Codex backend returned no text.';
        } catch (err) {
            if (err?.message?.includes('Codex OAuth token not found'))
                return err.message;
            console.log(err);
            return 'Codex backend disconnected, try again.';
        }
    }

    sendVisionRequest() {
        return 'Vision is not supported by the openai-codex provider. Configure vision_model with another provider.';
    }

    embed() {
        return Promise.reject(new Error('Embeddings are not supported by the openai-codex provider.'));
    }
}
