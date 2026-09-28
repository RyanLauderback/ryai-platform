package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.DataFrameReader} (Spark 3.5.9). */
public class DataFrameReader {

  public DataFrameReader format(String source) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameReader option(String key, String value) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameReader schema(org.apache.spark.sql.types.StructType schema) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> json(String... paths) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> parquet(String... paths) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> load(String... paths) {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
