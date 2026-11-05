from pydantic import BaseModel, Field


class ProfileInput(BaseModel):

    name: str = ""

    email: str = ""

    education: str = ""

    experience: str = ""

    skills: list[str] = Field(default_factory=list)

    interests: list[str] = Field(default_factory=list)


class MatchRequest(BaseModel):

    skills: list[str] = Field(default_factory=list)

    interests: list[str] = Field(default_factory=list)

    education: str = ""