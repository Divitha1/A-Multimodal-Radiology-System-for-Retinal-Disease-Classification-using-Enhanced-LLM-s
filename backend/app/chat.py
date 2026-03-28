from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth import get_current_user
from utils.rag import rag_engine
from models.database import get_database
import os

router = APIRouter(prefix="/chat", tags=["Medical Chatbot"])

class ChatRequest(BaseModel):
    message: str
    context_type: str = "general" # can be 'report', 'image', etc.

from typing import Optional, List

class ChatResponse(BaseModel):
    reply: str
    source: str
    expert_knowledge: List = []
    clinical_context: Optional[dict] = None

@router.post("/", response_model=ChatResponse)
async def chat_with_medical_llm(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint for the Multimodal Medical LLM Assistant.
    Provides expert-grade radiology insights using RAG and User Context.
    """
    db = get_database()
    
    # 1. Fetch Latest Clinical Finding for Personalization
    latest_report = await db.reports.find_one(
        {"user_id": current_user.get("id")},
        sort=[("created_at", -1)]
    )
    
    finding_context = ""
    clinical_data = None
    if latest_report:
        finding = latest_report.get("diagnosis", latest_report.get("finding", "Unknown"))
        finding_context = f" I see your latest scan from {latest_report.get('date', 'recently')} indicates showing signs of {finding}."
        clinical_data = {
            "finding": finding,
            "date": latest_report.get("date"),
            "source": "Clinical Records"
        }

    # 2. Retrieve Expert Knowledge from Knowledge Base
    # If the user asks something like "what should I do", we use the finding as preferred context
    search_query = request.message
    if any(k in request.message.lower() for k in ["what should i do", "my result", "help me"]):
        if latest_report:
            search_query += f" {latest_report.get('diagnosis')}"

    search_results = rag_engine.search(search_query, top_k=1)
    
    if not search_results:
        reply = f"Hello {current_user.get('full_name')}.{finding_context} I can help you understand your retinal fundus images and OCT scans. Please ask about specific diseases, preventions, or interpretations."
        return {
            "reply": reply,
            "source": "general_assistant",
            "clinical_context": clinical_data
        }

    # 3. Extract Top Match
    top_match = search_results[0]
    
    # 4. Formulate Expert Response
    response_text = f"Expert Insight: {top_match['response']}\n\n{finding_context if finding_context else ''}\nBased on your query about {top_match['instruction'].lower()}, this is the professional clinical guidance."

    return {
        "reply": response_text,
        "source": "medical_rag_engine",
        "expert_knowledge": search_results,
        "clinical_context": clinical_data
    }
