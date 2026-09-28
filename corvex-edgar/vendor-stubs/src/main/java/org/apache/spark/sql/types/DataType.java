package org.apache.spark.sql.types;

/** Mirrors {@code org.apache.spark.sql.types.DataType} (Spark 3.5.9). */
public abstract class DataType {

  public String typeName() {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
