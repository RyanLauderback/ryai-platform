# Airflow stubs

Compile-only (type-check-only) mirror of the Apache Airflow 2.11 API subset used by the
DAGs in this project: `airflow.DAG`, the classic operators (`PythonOperator`,
`EmptyOperator`), and the provider operators `SparkSubmitOperator`
(`apache-airflow-providers-apache-spark`) and `KubernetesPodOperator`
(`apache-airflow-providers-cncf-kubernetes`).

Production runs `apache-airflow==2.11.2` on Python 3.12; Airflow is intentionally not a
dependency of this project. The `.pyi` files here let `mypy` check the DAG code against the
real import paths and signatures without installing Airflow. They contain no runtime code
and are never imported at execution time.
