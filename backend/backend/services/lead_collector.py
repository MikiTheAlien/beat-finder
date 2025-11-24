from hubspot import HubSpot
from hubspot.crm.contacts import ApiException
from hubspot.crm.contacts.models import (
    SimplePublicObjectInput,
    PublicObjectSearchRequest,
    Filter,
    FilterGroup
)
from typing import Dict, Any, Optional
from backend.config import settings
import logging

logger = logging.getLogger(__name__)


class LeadCollector:
    """Collect and store leads in HubSpot CRM using Private App Access Token or Personal Access Key"""
    
    def __init__(self):
        self.access_token = settings.hubspot_access_token
        self.client = None
        
        if self.access_token:
            try:
                self.client = HubSpot(access_token=self.access_token)
                logger.info("HubSpot client initialized (token validation will happen on first use)")
            except Exception as e:
                logger.warning(f"Failed to initialize HubSpot client: {e}")
                self.client = None
    
    async def store_lead(
        self,
        email: str,
        metadata: Dict[str, Any]
    ) -> bool:
        """
        Store a verified lead in HubSpot using Private App Access Token or Personal Access Key.
        
        Requires Private App Access Token (recommended) or Personal Access Key with crm.objects.contacts.write permission.
        - Private App: Settings > Integrations > Private Apps (create app, get access token)
        - Personal Access Key: Settings > Development > Personal Access Key
        
        Args:
            email: Verified email address
            metadata: Additional metadata (timestamp, markers, language, etc.)
            
        Returns:
            True if successful, False otherwise
        """
        if not self.client:
            logger.warning("HubSpot client not initialized. Lead not stored.")
            return False
        
        try:
            # Prepare contact properties
            # Using only standard HubSpot properties that exist by default
            properties = {
                "email": email,
            }
            
            # Add optional standard properties if available
            # Note: Custom properties need to be created in HubSpot first
            # For now, we'll only use standard properties to avoid errors
            
            # Use search_api to find existing contact by email
            search_api = self.client.crm.contacts.search_api
            basic_api = self.client.crm.contacts.basic_api
            
            # Search for existing contact by email
            try:
                filter_group = FilterGroup(
                    filters=[
                        Filter(
                            property_name="email",
                            operator="EQ",
                            value=email
                        )
                    ]
                )
                
                # Create search request
                search_request = PublicObjectSearchRequest(
                    filter_groups=[filter_group],
                    limit=1,
                    properties=["email"]
                )
                
                search_result = search_api.do_search(
                    public_object_search_request=search_request
                )
                
                if search_result.results and len(search_result.results) > 0:
                    # Update existing contact
                    contact_id = search_result.results[0].id
                    basic_api.update(
                        contact_id=contact_id,
                        simple_public_object_input=SimplePublicObjectInput(properties=properties)
                    )
                    logger.info(f"Updated existing HubSpot contact: {email}")
                else:
                    # Create new contact
                    basic_api.create(
                        simple_public_object_input=SimplePublicObjectInput(properties=properties)
                    )
                    logger.info(f"Created new HubSpot contact: {email}")
                    
            except ApiException as e:
                error_body = getattr(e, 'body', {})
                if isinstance(error_body, str):
                    import json
                    try:
                        error_body = json.loads(error_body)
                    except:
                        pass
                error_msg = error_body.get('message', '') if isinstance(error_body, dict) else str(error_body)
                
                # Check for authentication errors
                if e.status == 401:
                    if 'expired' in error_msg.lower() or 'unauthorized' in error_msg.lower():
                        logger.error(f"HubSpot Access Token is expired or invalid. Please generate a new token. Error: {error_msg}")
                    else:
                        logger.error(f"HubSpot authentication failed (401): {error_msg}")
                    return False
                
                # Check for missing scopes (403)
                if e.status == 403:
                    errors = error_body.get('errors', []) if isinstance(error_body, dict) else []
                    required_scopes = []
                    for err in errors:
                        context = err.get('context', {})
                        required_scopes.extend(context.get('requiredGranularScopes', []))
                    if required_scopes:
                        logger.error(f"HubSpot Access Token is missing required scopes: {', '.join(required_scopes)}. Please update your Private App or Personal Access Key to include these scopes.")
                    else:
                        logger.error(f"HubSpot access forbidden (403): {error_msg}")
                    return False
                
                # Check for invalid properties (400)
                if e.status == 400 and 'PROPERTY_DOESNT_EXIST' in str(error_body):
                    logger.error(f"HubSpot properties don't exist. Error: {error_msg}. Using only standard properties (email).")
                    # Retry with only email property
                    properties = {"email": email}
                    try:
                        basic_api.create(
                            simple_public_object_input=SimplePublicObjectInput(properties=properties)
                        )
                        logger.info(f"Created new HubSpot contact: {email} (using only email property)")
                        return True
                    except ApiException as create_error:
                        logger.error(f"Failed to create contact even with email only: {create_error}")
                        return False
                
                # If search fails, try to create directly
                logger.warning(f"Search failed for {email}, attempting direct create: {e}")
                try:
                    basic_api.create(
                        simple_public_object_input=SimplePublicObjectInput(properties=properties)
                    )
                    logger.info(f"Created new HubSpot contact: {email}")
                except ApiException as create_error:
                    error_body = getattr(create_error, 'body', {})
                    if isinstance(error_body, str):
                        import json
                        try:
                            error_body = json.loads(error_body)
                        except:
                            pass
                    error_msg = error_body.get('message', '') if isinstance(error_body, dict) else str(error_body)
                    
                    # Check for authentication errors in create
                    if create_error.status == 401:
                        if 'expired' in error_msg.lower() or 'unauthorized' in error_msg.lower():
                            logger.error(f"HubSpot Access Token is expired or invalid. Please generate a new token. Error: {error_msg}")
                        else:
                            logger.error(f"HubSpot authentication failed (401): {error_msg}")
                        return False
                    
                    # Check for missing scopes (403)
                    if create_error.status == 403:
                        errors = error_body.get('errors', []) if isinstance(error_body, dict) else []
                        required_scopes = []
                        for err in errors:
                            context = err.get('context', {})
                            required_scopes.extend(context.get('requiredGranularScopes', []))
                        if required_scopes:
                            logger.error(f"HubSpot Access Token is missing required scopes: {', '.join(required_scopes)}. Please update your Private App or Personal Access Key to include these scopes.")
                        else:
                            logger.error(f"HubSpot access forbidden (403): {error_msg}")
                        return False
                    
                    # Check for invalid properties (400)
                    if create_error.status == 400 and 'PROPERTY_DOESNT_EXIST' in str(error_body):
                        logger.error(f"HubSpot properties don't exist. Error: {error_msg}. Using only standard properties (email).")
                        # Retry with only email property
                        properties = {"email": email}
                        try:
                            basic_api.create(
                                simple_public_object_input=SimplePublicObjectInput(properties=properties)
                            )
                            logger.info(f"Created new HubSpot contact: {email} (using only email property)")
                            return True
                        except ApiException as retry_error:
                            logger.error(f"Failed to create contact even with email only: {retry_error}")
                            return False
                    
                    # If create fails with conflict (409), contact might already exist
                    if create_error.status == 409:
                        logger.info(f"Contact {email} may already exist (409 conflict)")
                        return True
                    
                    raise
            
            return True
            
        except Exception as e:
            error_msg = str(e)
            # Check if it's an authentication error
            if '401' in error_msg or 'Unauthorized' in error_msg or 'expired' in error_msg.lower():
                logger.error(f"HubSpot authentication error: {error_msg}. Please check your Personal Access Key in Settings > Development > Personal Access Key")
            else:
                logger.error(f"Error storing lead in HubSpot: {e}")
            return False
    
    def is_configured(self) -> bool:
        """Check if HubSpot is properly configured"""
        return self.client is not None

