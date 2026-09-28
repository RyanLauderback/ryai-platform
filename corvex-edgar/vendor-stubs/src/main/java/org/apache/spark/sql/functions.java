package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.functions} (Spark 3.5.9). */
public final class functions {

  private functions() {}

  public static Column col(String colName) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column lit(Object literal) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column trim(Column e) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column lower(Column e) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column upper(Column e) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column regexp_replace(Column e, String pattern, String replacement) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column to_date(Column e, String fmt) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column to_timestamp(Column e, String fmt) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column current_timestamp() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column input_file_name() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static Column concat_ws(String sep, Column... exprs) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public static org.apache.spark.sql.expressions.UserDefinedFunction udf(
      org.apache.spark.sql.api.java.UDF1<?, ?> f, org.apache.spark.sql.types.DataType returnType) {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
