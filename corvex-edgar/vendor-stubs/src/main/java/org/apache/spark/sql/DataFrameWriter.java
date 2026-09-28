package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.DataFrameWriter} (Spark 3.5.9). */
public class DataFrameWriter<T> {

  public DataFrameWriter<T> mode(SaveMode saveMode) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameWriter<T> mode(String saveMode) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameWriter<T> format(String source) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameWriter<T> option(String key, String value) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameWriter<T> partitionBy(String... colNames) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public void parquet(String path) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public void jdbc(String url, String table, java.util.Properties connectionProperties) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public void save(String path) {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
