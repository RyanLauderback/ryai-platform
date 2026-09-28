package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.Row} (Spark 3.5.9). */
public interface Row extends java.io.Serializable {

  <T> T getAs(String fieldName);

  <T> T getAs(int i);

  String getString(int i);

  long getLong(int i);

  int getInt(int i);

  boolean isNullAt(int i);

  int fieldIndex(String name);

  int size();

  Object get(int i);
}
