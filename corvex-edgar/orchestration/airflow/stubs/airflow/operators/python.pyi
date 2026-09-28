from collections.abc import Callable, Collection, Mapping, Sequence
from typing import Any

from airflow.models.baseoperator import BaseOperator

class PythonOperator(BaseOperator):
    def __init__(
        self,
        *,
        python_callable: Callable[..., Any],
        op_args: Collection[Any] | None = ...,
        op_kwargs: Mapping[str, Any] | None = ...,
        templates_dict: dict[str, Any] | None = ...,
        templates_exts: Sequence[str] | None = ...,
        show_return_value_in_logs: bool = ...,
        **kwargs: Any,
    ) -> None: ...

class ShortCircuitOperator(PythonOperator): ...
class BranchPythonOperator(PythonOperator): ...

def get_current_context() -> dict[str, Any]: ...
