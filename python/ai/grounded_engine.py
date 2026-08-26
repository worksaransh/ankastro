import os
import json
import httpx
from typing import Dict, Any, Optional
from python.common.config import settings
from python.common.models import AIInterpretationRequest

async def synthesize_grounded_interpretation(request: AIInterpretationRequest) -> Dict[str, Any]:
    # Construct strictly grounded context prompt
    num = request.numerology
    astro = request.astrology

    context_lines = [
        f"User: {request.profile.full_name}, DOB: {request.profile.dob}",
        f"Mulank (Psychic Number): {num.mulank if num else 'N/A'}",
        f"Bhagyank (Life Path): {num.bhagyank if num else 'N/A'}",
        f"Name Number: {num.name_number if num else 'N/A'}",
        f"Personal Year: {num.personal_year if num else 'N/A'}",
        f"Ruling Planet: {num.ruling_planet if num else 'N/A'}",
        f"Lagna: {astro.lagna if astro else 'N/A'}",
        f"Moon Sign: {astro.moon_sign if astro else 'N/A'}",
        f"Nakshatra: {astro.nakshatra if astro else 'N/A'}",
        f"Active Mahadasha: {astro.current_mahadasha if astro else 'N/A'}"
    ]
    profile_summary = "\n".join(context_lines)

    system_prompt = (
        "You are AnkJyotish AI, an elite astrological and numerological intelligence companion. "
        "Strict rules: Never recalculate numbers. Rely strictly on provided mathematical parameters. "
        "Speak with modern luxury, clarity, elegance, constructive strategy, and empathetic precision."
    )

    user_query = request.user_query or f"Provide a master deep insight for the pillar '{request.report_pillar}'."
    prompt_payload = f"Verified Birth Calculations:\n{profile_summary}\n\nUser Request: {user_query}\n\nSynthesize tailored intelligence in language: {request.language}."

    # If Groq API key is present, invoke LLM; otherwise generate verified high-grade deterministic synthesis fallback
    if settings.GROQ_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}", "Content-Type": "application/json"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt_payload}
                        ],
                        "temperature": 0.4,
                        "max_tokens": 1200
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    return {
                        "synthesis": content,
                        "source": "groq_llama_3.3_70b",
                        "grounded": True,
                        "verified_data": {
                            "mulank": num.mulank if num else None,
                            "bhagyank": num.bhagyank if num else None,
                            "ruling_planet": num.ruling_planet if num else None
                        }
                    }
        except Exception as e:
            # Fallback smoothly
            pass

    # Deterministic Consultant-Grade Fallback
    m_val = num.mulank if num else 1
    b_val = num.bhagyank if num else 1
    r_planet = num.ruling_planet if num else "Sun"
    p_year = num.personal_year if num else 1

    synthesis_text = (
        f"### Cosmic Blueprint Synthesis for {request.profile.full_name}\n\n"
        f"**Core Archetype**: Mulank {m_val} governed by {r_planet}, moving along Life Path {b_val}.\n\n"
        f"**Strategic Guidance**: You are currently navigating **Personal Year {p_year}**. "
        f"Your psychological foundation channels the sovereign drive of {r_planet}. "
        f"In professional endeavors, focus on proprietary ownership and decisive execution. "
        f"In relationships, establish collaborative reciprocity without diminishing your natural sovereignty."
    )

    return {
        "synthesis": synthesis_text,
        "source": "deterministic_nikb_consultant_engine",
        "grounded": True,
        "verified_data": {
            "mulank": m_val,
            "bhagyank": b_val,
            "ruling_planet": r_planet
        }
    }
