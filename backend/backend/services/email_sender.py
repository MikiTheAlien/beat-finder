import aiohttp
import os
from typing import Optional
from backend.config import settings


class EmailSender:
    """Send emails via Cloudflare Email Routing/Workers"""
    
    def __init__(self):
        self.api_token = settings.cloudflare_email_api_token
        self.from_email = os.getenv("CLOUDFLARE_FROM_EMAIL", "noreply@undrstnd.ch")
    
    async def send_verification_code(self, to_email: str, code: str) -> bool:
        """
        Send verification code via Cloudflare Email Routing.
        
        Note: This is a placeholder implementation. In production, you would:
        1. Use Cloudflare Email Workers to send emails
        2. Or use Cloudflare Email Routing with SMTP
        3. Or use a service like Resend, SendGrid, etc. with Cloudflare proxy
        """
        try:
            # For now, we'll use a simple HTTP request approach
            # In production, configure Cloudflare Email Workers or use their API
            
            # Placeholder: Log the email (in production, actually send it)
            print(f"[EMAIL] Sending verification code to {to_email}: {code}")
            
            # TODO: Implement actual Cloudflare email sending
            # Options:
            # 1. Use Cloudflare Workers with Email Workers API
            # 2. Use SMTP through Cloudflare Email Routing
            # 3. Use a service like Resend with Cloudflare proxy
            
            # For development, we'll simulate success
            # In production, implement actual email sending via Cloudflare
            
            return True
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    async def send_email_via_cloudflare_worker(self, to_email: str, subject: str, body: str) -> bool:
        """
        Send email via Cloudflare Worker endpoint.
        Configure a Cloudflare Worker to handle email sending.
        """
        if not self.api_token:
            return False
        
        try:
            worker_url = os.getenv("CLOUDFLARE_WORKER_URL")
            if not worker_url:
                # Fallback: log email for development
                print(f"[EMAIL] To: {to_email}, Subject: {subject}, Body: {body}")
                return True
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    worker_url,
                    json={
                        "to": to_email,
                        "from": self.from_email,
                        "subject": subject,
                        "body": body
                    },
                    headers={
                        "Authorization": f"Bearer {self.api_token}"
                    }
                ) as response:
                    return response.status == 200
                    
        except Exception as e:
            print(f"Error sending email via Cloudflare Worker: {e}")
            return False

