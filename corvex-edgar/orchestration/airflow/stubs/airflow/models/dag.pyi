from datetime import datetime, timedelta
from types import TracebackType
from typing import Any

ScheduleArg = str | timedelta | None

class DAG:
    dag_id: str
    def __init__(
        self,
        dag_id: str,
        description: str | None = ...,
        schedule: ScheduleArg = ...,
        start_date: datetime | None = ...,
        end_date: datetime | None = ...,
        default_args: dict[str, Any] | None = ...,
        catchup: bool = ...,
        tags: list[str] | None = ...,
        max_active_runs: int = ...,
        max_active_tasks: int = ...,
        dagrun_timeout: timedelta | None = ...,
        doc_md: str | None = ...,
        params: dict[str, Any] | None = ...,
        render_template_as_native_obj: bool = ...,
        **kwargs: Any,
    ) -> None: ...
    def __enter__(self) -> DAG: ...
    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None: ...
