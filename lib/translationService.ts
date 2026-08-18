/**
 * Automatic Translation Service
 * Detects whether input text is English or Farsi.
 * Translates between English and Farsi so English is saved to DB as primary 'name'
 * and Farsi is saved to DB as 'faName' and stored in dictionary.
 */

export interface TranslatedName {
    name: string;   // English name saved to DB
    faName: string; // Farsi translation saved to DB / dictionary
}

export async function autoTranslateAcademicTitle(inputName: string): Promise<TranslatedName> {
    const trimmed = inputName.trim();
    if (!trimmed) {
        return { name: "", faName: "" };
    }

    const isFarsi = /[\u0600-\u06FF]/.test(trimmed);

    // Primary: Groq LLM Translation API (qwen/qwen3.6-27b)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
        const groqModels = ["qwen/qwen3.6-27b", "openai/gpt-oss-20b", "groq/compound-mini"];
        for (const model of groqModels) {
            try {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqApiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: "system",
                                content: "You are an academic translator. Output ONLY a JSON object with keys \"en\" and \"fa\". For example: {\"en\": \"Music\", \"fa\": \"موسیقی\"}"
                            },
                            {
                                role: "user",
                                content: `Translate: "${trimmed}"`
                            }
                        ],
                        response_format: { type: "json_object" }
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const rawContent = data.choices[0]?.message?.content || "";
                    const cleaned = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
                    const json = JSON.parse(cleaned);

                    const enVal = json.en || json.english || json.EN;
                    const faVal = json.fa || json.farsi || json.persian || json.FA;

                    if (enVal && faVal) {
                        return {
                            name: enVal.trim().replace(/\.$/, ""),
                            faName: faVal.trim().replace(/\.$/, "")
                        };
                    }
                }
            } catch (err) {
                console.warn(`[TranslationService] Groq ${model} failed:`, err);
            }
        }
    }

    // Fallback 1: MyMemory Translation API
    try {
        const langpair = isFarsi ? "fa|en" : "en|fa";
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${langpair}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const translatedText = data.responseData?.translatedText;
            if (translatedText && typeof translatedText === "string") {
                const cleanTranslated = translatedText.replace(/[().]/g, "").trim();
                return isFarsi
                    ? { name: cleanTranslated, faName: trimmed }
                    : { name: trimmed, faName: cleanTranslated };
            }
        }
    } catch (err) {
        console.warn("[TranslationService] MyMemory failed:", err);
    }

    // Fallback 2: Raw input
    return isFarsi ? { name: trimmed, faName: trimmed } : { name: trimmed, faName: trimmed };
}

export const autoTranslateLessonName = autoTranslateAcademicTitle;
export const autoTranslateFieldName = autoTranslateAcademicTitle;
