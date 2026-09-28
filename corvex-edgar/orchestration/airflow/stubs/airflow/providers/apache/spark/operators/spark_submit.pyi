from typing import Any

from airflow.models.baseoperator import BaseOperator

class SparkSubmitOperator(BaseOperator):
    def __init__(
        self,
        *,
        application: str = ...,
        conn_id: str = ...,
        java_class: str | None = ...,
        application_args: list[Any] | None = ...,
        conf: dict[str, Any] | None = ...,
        name: str = ...,
        verbose: bool = ...,
        **kwargs: Any,
    ) -> None: ...
