package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.SparkSession} (Spark 3.5.9). */
public class SparkSession implements java.io.Closeable {

  public static Builder builder() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameReader read() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> sql(String sqlText) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public void stop() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  @Override
  public void close() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static class Builder {
    public Builder appName(String name) {
      throw new UnsupportedOperationException("compile-only stub");
    }

    public Builder master(String master) {
      throw new UnsupportedOperationException("compile-only stub");
    }

    public Builder config(String key, String value) {
      throw new UnsupportedOperationException("compile-only stub");
    }

    public Builder config(String key, long value) {
      throw new UnsupportedOperationException("compile-only stub");
    }

    public Builder config(String key, boolean value) {
      throw new UnsupportedOperationException("compile-only stub");
    }

    public SparkSession getOrCreate() {
      throw new UnsupportedOperationException("compile-only stub");
    }
  }
}
