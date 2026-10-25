"""
Configuration for the fact-checking system.
"""

import os
import logging
import requests
from typing import Dict, Any, Optional

from dotenv import load_dotenv

# ── Google Generative AI (new SDK) ──────────────────────────
try:
    from google import genai
    from google.genai import types
    _genai_available = True
except ImportError:
    genai = None
    types = None
    _genai_available = False
    logging.warning("google-genai not installed. Gemini functionality will be unavailable.")

# ── LangChain Google Generative AI (optional) ────────────────
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:
    ChatGoogleGenerativeAI = None
    logging.warning("langchain_google_genai not installed.")

# ── Tavily ───────────────────────────────────────────────────
try:
    from tavily import TavilyClient
except ImportError:
    TavilyClient = None
    logging.warning("tavily-python not installed.")

_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=_env_path)
load_dotenv()

# ── Groq (Primary LLM) ──────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
GROQ_PARSER_MODEL = os.getenv("GROQ_PARSER_MODEL", "openai/gpt-oss-20b")

# ── Gemini ───────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# ── Search / News APIs ───────────────────────────────────────
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY2")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# ── Wikidata ─────────────────────────────────────────────────
WIKIDATA_API_ENDPOINT = "https://www.wikidata.org/w/api.php"

# ── Confidence Thresholds ────────────────────────────────────
HIGH_CONFIDENCE_THRESHOLD = float(os.getenv("HIGH_CONFIDENCE_THRESHOLD", "0.8"))
MEDIUM_CONFIDENCE_THRESHOLD = float(os.getenv("MEDIUM_CONFIDENCE_THRESHOLD", "0.5"))
LOW_CONFIDENCE_THRESHOLD = float(os.getenv("LOW_CONFIDENCE_THRESHOLD", "0.3"))


# ── LLM Factories ────────────────────────────────────────────

def get_primary_llm(streaming: bool = False):
    """Get the primary LLM client (Groq – openai/gpt-oss-20b by default)."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set. Cannot create primary LLM client.")
    from langchain_groq import ChatGroq
    return ChatGroq(
        api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        streaming=streaming,
        temperature=0.0,
        max_tokens=800,
    )


def get_azure_openai_parser_llm():
    """Get the parser LLM client (Groq – lighter model for parsing tasks)."""
    if not GROQ_API_KEY:
        logging.error("GROQ_API_KEY not set. Cannot create parser LLM client.")
        raise ValueError("GROQ_API_KEY not set.")
    from langchain_groq import ChatGroq
    logging.info(f"Initializing Groq parser LLM with model: {GROQ_PARSER_MODEL}")
    return ChatGroq(
        api_key=GROQ_API_KEY,
        model=GROQ_PARSER_MODEL,
        temperature=0.1,
        max_retries=3,
        max_tokens=800,
    )


# ── Search Client Factories ───────────────────────────────────

def get_tavily_client():
    """Get the Tavily search client."""
    if not TAVILY_API_KEY:
        raise ValueError("TAVILY_API_KEY not set. Cannot create Tavily client.")
    if TavilyClient is None:
        raise ImportError("tavily-python is not installed.")
    return TavilyClient(api_key=TAVILY_API_KEY)


def get_duckduckgo_client():
    """Get the DuckDuckGo search client."""
    try:
        from duckduckgo_search import DDGS
        return DDGS()
    except ImportError:
        try:
            from ddgs import DDGS
            return DDGS()
        except ImportError:
            raise ImportError("duckduckgo-search / ddgs package is not installed.")


def get_news_api_client():
    """Get the NewsAPI client."""
    if not NEWS_API_KEY:
        raise ValueError("NEWS_API_KEY not set. Cannot create NewsAPI client.")
    from newsapi import NewsApiClient
    return NewsApiClient(api_key=NEWS_API_KEY)


def get_wikidata_client():
    """Get a function to query the Wikidata API."""

    def query_wikidata(search_term: str, language: str = "en", limit: int = 5):
        """Query the Wikidata API for entities."""
        params = {
            "action": "wbsearchentities",
            "format": "json",
            "language": language,
            "search": search_term,
            "limit": limit,
        }
        headers = {"User-Agent": "TathyaFactChecker/1.0 (contact: user@example.com)"}
        response = requests.get(WIKIDATA_API_ENDPOINT, params=params, headers=headers)
        if response.status_code == 200:
            return response.json()
        raise Exception(
            f"Wikidata API request failed with status code {response.status_code}"
        )

    return query_wikidata


def get_entity_details(entity_id: str, language: str = "en"):
    """Get detailed information about a Wikidata entity."""
    params = {
        "action": "wbgetentities",
        "format": "json",
        "ids": entity_id,
        "languages": language,
    }
    headers = {"User-Agent": "TathyaFactChecker/1.0 (contact: user@example.com)"}
    response = requests.get(WIKIDATA_API_ENDPOINT, params=params, headers=headers)
    if response.status_code == 200:
        return response.json()
    raise Exception(
        f"Wikidata API request failed with status code {response.status_code}"
    )


# ── Gemini Google Search ──────────────────────────────────────

def perform_gemini_google_search(claim: str) -> str:
    """
    Performs a search using the Gemini model with Google Search tool enabled.

    Args:
        claim: The claim or query to search for.

    Returns:
        The text response from the Gemini model, or an error string.
    """
    if not _genai_available:
        logging.error("google-genai library is not installed.")
        return "Error: Gemini library not available."
    if not GEMINI_API_KEY:
        logging.error("GEMINI_API_KEY not set.")
        return "Error: GEMINI_API_KEY not configured."
    if not GEMINI_MODEL:
        logging.error("GEMINI_MODEL environment variable not set.")
        return "Error: GEMINI_MODEL not configured."

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=claim)],
            )
        ]
        tools = [types.Tool(google_search=types.GoogleSearch())]
        generate_content_config = types.GenerateContentConfig(
            tools=tools,
            temperature=0.1,
            response_mime_type="text/plain",
        )

        logging.info(f"Sending request to Gemini model '{GEMINI_MODEL}' with Google Search enabled.")
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=generate_content_config,
        )

        if response.candidates and response.candidates[0].content.parts:
            search_response = response.candidates[0].content.parts[0].text
            logging.info(f"Received response from Gemini: {search_response[:100]}...")
            return search_response

        logging.warning("Gemini response did not contain expected content parts.")
        return "Error: No valid response content from Gemini."

    except Exception as e:
        logging.error(f"Error during Gemini search for '{claim}': {e}")
        return f"Error: {e}"