package org.apache.spark.sql.expressions;

import org.apache.spark.sql.Column;

/** Mirrors {@code org.apache.spark.sql.expressions.UserDefinedFunction} (Spark 3.5.9). */
public abstract class UserDefinedFunction {

  public Column apply(Column... exprs) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public UserDefinedFunction asNonNullable() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public UserDefinedFunction withName(String name) {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
