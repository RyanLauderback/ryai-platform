package com.corvex.edgar.parse;

/** Raised when a raw EDGAR submission cannot be parsed into the expected fields. */
public class EdgarParseException extends RuntimeException {

  public EdgarParseException(String message) {
    super(message);
  }

  public EdgarParseException(String message, Throwable cause) {
    super(message, cause);
  }
}
