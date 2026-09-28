package software.amazon.awssdk.regions;

/** Mirrors {@code software.amazon.awssdk.regions.Region} (AWS SDK for Java 2.x). */
public final class Region {

  public static final Region US_EAST_1 = new Region();
  public static final Region US_EAST_2 = new Region();
  public static final Region US_WEST_2 = new Region();

  private Region() {}

  public static Region of(String value) {
    throw new UnsupportedOperationException("compile-only stub");
  }

  public String id() {
    throw new UnsupportedOperationException("compile-only stub");
  }
}
