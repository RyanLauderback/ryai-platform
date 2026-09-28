from collections.abc import Iterator
from typing import Any

class Blob:
    name: str
    bucket: Bucket
    def __init__(self, name: str, bucket: Bucket, **kwargs: Any) -> None: ...
    def download_as_text(self, encoding: str | None = ..., **kwargs: Any) -> str: ...
    def download_as_bytes(self, **kwargs: Any) -> bytes: ...
    def upload_from_string(
        self,
        data: str | bytes,
        content_type: str | None = ...,
        **kwargs: Any,
    ) -> None: ...
    def exists(self, **kwargs: Any) -> bool: ...

class Bucket:
    name: str
    client: Client
    def __init__(self, client: Client, name: str, **kwargs: Any) -> None: ...
    def blob(self, blob_name: str, **kwargs: Any) -> Blob: ...
    def list_blobs(
        self,
        prefix: str | None = ...,
        max_results: int | None = ...,
        **kwargs: Any,
    ) -> Iterator[Blob]: ...

class Client:
    project: str | None
    def __init__(self, project: str | None = ..., **kwargs: Any) -> None: ...
    def bucket(self, bucket_name: str) -> Bucket: ...
    def list_blobs(
        self,
        bucket_or_name: Bucket | str,
        prefix: str | None = ...,
        max_results: int | None = ...,
        **kwargs: Any,
    ) -> Iterator[Blob]: ...
