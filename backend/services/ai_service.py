from groq import Groq
from database.config import settings

_client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = (
    "You are CodeAI, a helpful AI assistant like ChatGPT. "
    "You can help with anything — coding, debugging, explaining concepts, answering general questions, writing, math, and more. "
    "When writing code, always use markdown code blocks with the language specified. "
    "Be conversational, friendly, clear, and helpful. "
    "For coding questions, provide working examples. For general questions, give thorough but concise answers."
)


def _ask(prompt: str) -> str:
    response = _client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=2048,
    )
    return response.choices[0].message.content


def generate_code(prompt: str, language: str) -> str:
    return _ask(f"Generate {language} code for: {prompt}\nProvide clean, well-commented code.")


def explain_code(code: str, language: str) -> str:
    return _ask(
        f"Explain this {language} code line by line for a beginner:\n```{language}\n{code}\n```"
    )


def debug_code(code: str, language: str, error: str) -> str:
    return _ask(
        f"Debug this {language} code.\nError: {error}\n```{language}\n{code}\n```\n"
        "Identify the bug, explain why it occurs, and provide the fixed code."
    )


def convert_code(code: str, from_lang: str, to_lang: str) -> str:
    return _ask(
        f"Convert this {from_lang} code to {to_lang}:\n```{from_lang}\n{code}\n```\n"
        "Maintain the same logic and add comments where the syntax differs."
    )


def optimize_code(code: str, language: str) -> str:
    return _ask(
        f"Optimize this {language} code for performance and readability:\n```{language}\n{code}\n```\n"
        "Explain what was improved and why."
    )


def chat_response(message: str, history: list) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in history[-12:]:
        role = m["role"] if m["role"] in ("user", "assistant") else "user"
        messages.append({"role": role, "content": m["content"]})

    response = _client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=4096,
    )
    return response.choices[0].message.content
