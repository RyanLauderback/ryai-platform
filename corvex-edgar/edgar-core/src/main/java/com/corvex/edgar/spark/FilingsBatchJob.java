package com.corvex.edgar.spark;

import com.corvex.edgar.normalize.CikNormalizer;
import java.util.Properties;
import java.util.Set;
import org.apache.spark.api.java.function.FilterFunction;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.api.java.UDF1;
import org.apache.spark.sql.expressions.UserDefinedFunction;
import org.apache.spark.sql.functions;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Nightly batch: reads the day's raw EDGAR submissions from S3, normalizes them, and upserts the
 * filing rows into the metadata Postgres. Submitted on EKS by the Airflow DAG; never run outside
 * the cluster.
 */
public final class FilingsBatchJob {

  private static final Logger LOG = LoggerFactory.getLogger(FilingsBatchJob.class);

  private static final Set<String> PERIODIC_FORMS = Set.of("10-K", "10-Q", "8-K");

  static final StructType RAW_SCHEMA =
      new StructType()
          .add("accession_number", DataTypes.StringType, false)
          .add("cik", DataTypes.StringType, false)
          .add("company_name", DataTypes.StringType, true)
          .add("form_type", DataTypes.StringType, false)
          .add("period_of_report", DataTypes.StringType, true)
          .add("filed_at", DataTypes.StringType, false);

  private FilingsBatchJob() {}

  public static void main(String[] args) {
    String runDate = args.length > 0 ? args[0] : java.time.LocalDate.now().toString();
    String rawPrefix = env("EDGAR_RAW_PREFIX", "s3a://corvex-edgar-raw");
    String jdbcUrl = env("EDGAR_JDBC_URL", "jdbc:postgresql://edgar-db.internal:5432/edgar");
    String jdbcUser = env("EDGAR_JDBC_USER", "edgar");

    SparkSession spark =
        SparkSession.builder()
            .appName("corvex-edgar-filings-batch")
            .config(
                "spark.hadoop.fs.s3a.aws.credentials.provider",
                "com.amazonaws.auth.DefaultAWSCredentialsProviderChain")
            .getOrCreate();
    try {
      Dataset<Row> raw =
          spark.read().schema(RAW_SCHEMA).json(rawPrefix + "/dt=" + runDate + "/*.json");

      UserDefinedFunction normCik =
          functions.udf((UDF1<String, String>) CikNormalizer::normalize, DataTypes.StringType);

      Dataset<Row> clean =
          raw.filter(
                  (FilterFunction<Row>)
                      row -> {
                        String formType = row.getAs("form_type");
                        return formType != null && PERIODIC_FORMS.contains(formType);
                      })
              .withColumn("cik", normCik.apply(functions.col("cik")))
              .withColumn(
                  "filed_date",
                  functions.to_date(functions.col("filed_at"), "yyyy-MM-dd'T'HH:mm:ssX"))
              .withColumn("ingested_at", functions.current_timestamp())
              .dropDuplicates("accession_number");

      Properties jdbc = new Properties();
      jdbc.setProperty("user", jdbcUser);
      jdbc.setProperty("password", env("EDGAR_JDBC_PASSWORD", "changeme"));
      jdbc.setProperty("driver", "org.postgresql.Driver");

      clean.write().mode(SaveMode.Append).jdbc(jdbcUrl, "filing", jdbc);
      LOG.info("filings batch for dt={} written to {}", runDate, jdbcUrl);
    } finally {
      spark.stop();
    }
  }

  private static String env(String name, String fallback) {
    String value = System.getenv(name);
    return value == null || value.isBlank() ? fallback : value;
  }
}
