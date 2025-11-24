from pydantic import BaseModel


class BetaSignupResponse(BaseModel):
    success: bool
    message: str

