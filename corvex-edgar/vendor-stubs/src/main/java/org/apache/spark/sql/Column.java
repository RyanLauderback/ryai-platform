package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.Column} (Spark 3.5.9). */
public class Column {

  public Column(String name) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column equalTo(Object other) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column notEqual(Object other) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column isNull() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column isNotNull() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column isin(Object... list) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column cast(String to) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column cast(org.apache.spark.sql.types.DataType to) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column alias(String alias) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column desc() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column asc() {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
