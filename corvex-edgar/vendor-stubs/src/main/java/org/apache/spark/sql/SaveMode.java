package org.apache.spark.sql;

/** Mirrors {@code org.apache.spark.sql.SaveMode} (Spark 3.5.9). */
public enum SaveMode {
  Append,
  Overwrite,
  ErrorIfExists,
  Ignore
}
