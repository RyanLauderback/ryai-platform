package org.apache.spark.sql.types;

/** Mirrors {@code org.apache.spark.sql.types.DataTypes} (Spark 3.5.9). */
public final class DataTypes {

  private DataTypes() {}

  public static final DataType StringType = new DataType() {};
  public static final DataType LongType = new DataType() {};
  public static final DataType IntegerType = new DataType() {};
  public static final DataType DoubleType = new DataType() {};
  public static final DataType BooleanType = new DataType() {};
  public static final DataType DateType = new DataType() {};
  public static final DataType TimestampType = new DataType() {};
}
