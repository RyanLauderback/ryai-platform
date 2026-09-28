# vendor-stubs

Compile-only mirrors of the vendor APIs that `edgar-core` is written against:

- `org.apache.spark.sql.*` and `org.apache.spark.api.java.function.*` mirror
  **Apache Spark 3.5.9** (`org.apache.spark:spark-sql_2.12:3.5.9`). On the EKS
  cluster the real Spark distribution is supplied by the runtime, exactly like a
  `provided`-scope dependency in a real Spark build.
- `software.amazon.awssdk.*` mirrors the **AWS SDK for Java 2.x** S3 client
  (`software.amazon.awssdk:s3`). The real SDK ships in the job container image.

Every method body throws `UnsupportedOperationException("compile-only stub")`.
These classes exist so that the batch job and the S3 store compile with the same
names and signatures they use in production. They are never executed, and they are
never packaged into the `edgar-core` jar (`provided` scope).
