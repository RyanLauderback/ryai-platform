package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.Dataset} (Spark 3.5.9). */
public class Dataset<T> implements java.io.Serializable {

  public Dataset<Row> withColumn(String colName, Column col) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> withColumnRenamed(String existing, String newName) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> select(Column... cols) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> select(String col, String... cols) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<Row> drop(String... colNames) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<T> filter(Column condition) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<T> filter(String conditionExpr) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<T> filter(org.apache.spark.api.java.function.FilterFunction<T> func) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<T> dropDuplicates(String col1, String... cols) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<T> repartition(int numPartitions) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Dataset<T> cache() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public Column col(String colName) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public long count() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public java.util.List<T> collectAsList() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public org.apache.spark.sql.types.StructType schema() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public String[] columns() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public DataFrameWriter<T> write() {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public void show(int numRows) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public void printSchema() {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
