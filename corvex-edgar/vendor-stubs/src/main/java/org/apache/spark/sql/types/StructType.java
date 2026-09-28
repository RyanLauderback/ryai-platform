package org.apache.spark.sql.types;

/** Mirrors {@code org.apache.spark.sql.types.StructType} (Spark 3.5.9). */
public class StructType extends DataType {

  public StructType add(String name, DataType dataType, boolean nullable) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public String[] fieldNames() {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
