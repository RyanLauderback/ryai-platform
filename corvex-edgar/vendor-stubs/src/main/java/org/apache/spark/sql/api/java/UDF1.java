package org.apache.spark.sql.api.java;

/** Mirrors {@code org.apache.spark.sql.api.java.UDF1} (Spark 3.5.9). */
@FunctionalInterface
public interface UDF1<T1, R> extends java.io.Serializable {
  R call(T1 t1) throws Exception;
}
