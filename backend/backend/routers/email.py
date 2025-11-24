from fastapi import APIRouter
import time
import logging
import traceback

from backend.models.requests import BetaSignupRequest
from backend.models.responses import BetaSignupResponse
from backend.services.lead_collector import LeadCollector

logger = logging.getLogger(__name__)

router = APIRouter()

lead_collector = LeadCollector()


@router.post("/beta-signup", response_model=BetaSignupResponse)
async def beta_signup(request: BetaSignupRequest):
    """Collect email for beta signup and store in HubSpot"""
    
    try:
        logger.info(f"Beta signup request received for email: {request.email}")
        
        # Store lead in HubSpot
        if lead_collector.is_configured():
            logger.info("HubSpot is configured, attempting to store lead")
            metadata = {
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "markers": [],
                "language": "en",
                "source": "beta_signup"
            }
            success = await lead_collector.store_lead(request.email, metadata)
            
            if success:
                logger.info(f"Successfully stored lead for {request.email}")
                return BetaSignupResponse(
                    success=True,
                    message="Thank you for signing up! We'll notify you when we launch."
                )
            else:
                logger.warning(f"Failed to store lead for {request.email}, but returning success")
                return BetaSignupResponse(
                    success=True,
                    message="Thank you for signing up! We'll notify you when we launch."
                )
        else:
            # HubSpot not configured, but still return success
            logger.info("HubSpot not configured, but beta signup received - returning success")
            return BetaSignupResponse(
                success=True,
                message="Thank you for signing up! We'll notify you when we launch."
            )
    except Exception as e:
        logger.error(f"Error in beta_signup endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        # Still return success to user, but log the error
        return BetaSignupResponse(
            success=True,
            message="Thank you for signing up! We'll notify you when we launch."
        )
