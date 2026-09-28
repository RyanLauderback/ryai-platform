import logging
from collections.abc import Callable, Mapping, Sequence
from typing import Any, ParamSpec, TypeVar

P = ParamSpec("P")
R = TypeVar("R")

class DailyPartitionsDefinition:
    def __init__(
        self,
        start_date: str,
        end_date: str | None = ...,
        timezone: str | None = ...,
        fmt: str = ...,
        end_offset: int = ...,
    ) -> None: ...

class AssetExecutionContext:
    @property
    def partition_key(self) -> str: ...
    @property
    def log(self) -> logging.Logger: ...

class ConfigurableResource:
    def __init__(self, **data: Any) -> None: ...

class EnvVar(str):
    key: str
    def __init__(self, key: str) -> None: ...

class MetadataValue:
    @staticmethod
    def int(value: int) -> MetadataValue: ...
    @staticmethod
    def text(value: str) -> MetadataValue: ...

class MaterializeResult:
    def __init__(
        self,
        metadata: Mapping[str, Any] | None = ...,
    ) -> None: ...

def asset(
    *,
    partitions_def: DailyPartitionsDefinition | None = ...,
    group_name: str | None = ...,
    compute_kind: str | None = ...,
    deps: Sequence[Any] | None = ...,
    description: str | None = ...,
) -> Callable[[Callable[P, R]], Callable[P, R]]: ...

class AssetSelection:
    @staticmethod
    def groups(*group_strs: str) -> AssetSelection: ...

class JobDefinition:
    name: str

def define_asset_job(
    name: str,
    selection: AssetSelection | None = ...,
    partitions_def: DailyPartitionsDefinition | None = ...,
    description: str | None = ...,
) -> JobDefinition: ...

class ScheduleDefinition:
    def __init__(
        self,
        *,
        name: str | None = ...,
        job: JobDefinition = ...,
        cron_schedule: str = ...,
        execution_timezone: str | None = ...,
        default_status: str | None = ...,
    ) -> None: ...

class Definitions:
    def __init__(
        self,
        *,
        assets: Sequence[Any] | None = ...,
        jobs: Sequence[Any] | None = ...,
        schedules: Sequence[ScheduleDefinition] | None = ...,
        resources: Mapping[str, Any] | None = ...,
    ) -> None: ...
    @staticmethod
    def validate_loadable(defs: Definitions) -> Definitions: ...
