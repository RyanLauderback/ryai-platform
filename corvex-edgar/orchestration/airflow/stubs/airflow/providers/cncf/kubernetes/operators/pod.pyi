from typing import Any

from airflow.models.baseoperator import BaseOperator

class KubernetesPodOperator(BaseOperator):
    def __init__(
        self,
        *,
        namespace: str | None = ...,
        image: str | None = ...,
        name: str | None = ...,
        cmds: list[str] | None = ...,
        arguments: list[str] | None = ...,
        env_vars: dict[str, str] | None = ...,
        service_account_name: str | None = ...,
        **kwargs: Any,
    ) -> None: ...
