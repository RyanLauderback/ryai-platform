package org.apache.spark.api.java.function;

/** Mirrors {@code org.apache.spark.api.java.function.FilterFunction} (Spark 3.5.9). */
@FunctionalInterface
public interface FilterFunction<T> extends java.io.Serializable {
  boolean call(T value) throws Exception;
}
