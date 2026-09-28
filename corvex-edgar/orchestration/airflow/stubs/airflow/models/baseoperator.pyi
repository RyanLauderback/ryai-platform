from datetime import timedelta
from typing import Any

class BaseOperator:
    task_id: str
    def __init__(
        self,
        *,
        task_id: str,
        owner: str = ...,
        retries: int | None = ...,
        retry_delay: timedelta = ...,
        email_on_failure: bool = ...,
        depends_on_past: bool = ...,
        dag: Any = ...,
        trigger_rule: str = ...,
        pool: str | None = ...,
        execution_timeout: timedelta | None = ...,
        doc_md: str | None = ...,
        **kwargs: Any,
    ) -> None: ...
    def execute(self, context: Any) -> Any: ...
    def __rshift__(self, other: Any) -> Any: ...
    def __lshift__(self, other: Any) -> Any: ...
    def __rrshift__(self, other: Any) -> Any: ...
    def __rlshift__(self, other: Any) -> Any: ...
    def set_upstream(self, other: Any) -> None: ...
    def set_downstream(self, other: Any) -> None: ...

def chain(*tasks: Any) -> None: ...
