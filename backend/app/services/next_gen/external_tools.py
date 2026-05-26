from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass
class ExternalToolConfig:
    photoroom_api_key: str | None
    removebg_api_key: str | None
    clipdrop_api_key: str | None
    claid_api_key: str | None
    letsenhance_api_key: str | None

    @property
    def photoroom_enabled(self) -> bool:
        return bool(self.photoroom_api_key)

    @property
    def removebg_enabled(self) -> bool:
        return bool(self.removebg_api_key)

    @property
    def clipdrop_enabled(self) -> bool:
        return bool(self.clipdrop_api_key)

    @property
    def claid_enabled(self) -> bool:
        return bool(self.claid_api_key)

    @property
    def letsenhance_enabled(self) -> bool:
        return bool(self.letsenhance_api_key)


def get_external_tool_config() -> ExternalToolConfig:
    return ExternalToolConfig(
        photoroom_api_key=os.getenv("PHOTOROOM_API_KEY"),
        removebg_api_key=os.getenv("REMOVEBG_API_KEY"),
        clipdrop_api_key=os.getenv("CLIPDROP_API_KEY"),
        claid_api_key=os.getenv("CLAID_API_KEY"),
        letsenhance_api_key=os.getenv("LETSENHANCE_API_KEY"),
    )
