"""Weekday-morning EDGAR batch: stage submissions, run the Spark job, publish stats."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from airflow import DAG
from airflow.operators.empty import EmptyOperator
from airflow.operators.python import PythonOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from airflow.providers.cncf.kubernetes.operators.pod import KubernetesPodOperator

log = logging.getLogger(__name__)

default_args: dict[str, Any] = {
    "owner": "corvex-data",
    "retries": 1,
    "retry_delay": timedelta(minutes=10),
    "email_on_failure": False,
    "depends_on_past": False,
}


def _stage_daily_index(ds: str | None = None) -> str:
    """Stage the day's EDGAR full-text submissions under the raw bucket prefix."""
    log.info("staging EDGAR submissions for run date %s", ds)
    return f"s3://corvex-edgar-raw/dt={ds}/"


with DAG(
    dag_id="corvex_edgar_daily_filings",
    description="Nightly ingest of EDGAR full-text submissions into the filings store",
    schedule="0 6 * * 1-5",
    start_date=datetime(2026, 6, 1),
    catchup=False,
    default_args=default_args,
    max_active_runs=1,
    tags=["corvex", "edgar", "sec-filings"],
) as dag:
    start = EmptyOperator(task_id="start")

    stage_index = PythonOperator(
        task_id="stage_daily_index",
        python_callable=_stage_daily_index,
        op_kwargs={"ds": "{{ ds }}"},
    )

    filings_batch = SparkSubmitOperator(
        task_id="filings_batch",
        application="/opt/corvex/edgar/edgar-core.jar",
        java_class="com.corvex.edgar.spark.FilingsBatchJob",
        conn_id="spark_default",
        conf={
            "spark.kubernetes.namespace": "corvex-edgar",
            "spark.kubernetes.authenticate.driver.serviceAccountName": "edgar-worker",
        },
        application_args=["{{ ds }}"],
    )

    publish_metrics = KubernetesPodOperator(
        task_id="publish_batch_metrics",
        namespace="corvex-edgar",
        name="edgar-batch-metrics",
        image="123456789012.dkr.ecr.us-east-1.amazonaws.com/corvex/edgar-core:8.2.0",
        cmds=["/opt/corvex/edgar/bin/publish-metrics.sh", "{{ ds }}"],
        service_account_name="edgar-worker",
    )

    done = EmptyOperator(task_id="done")

    start >> stage_index >> filings_batch >> publish_metrics >> done
