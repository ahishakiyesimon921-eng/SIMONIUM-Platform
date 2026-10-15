import type {
  BaseRecord,
  RecordVisibility,
  ReviewStatus,
} from "../types/shared-records";

/**
 * SIMONIUM Record Repository Interface
 *
 * Defines a common contract for creating, reading,
 * updating, searching, and deleting platform records.
 *
 * This interface does not connect to a database.
 * A real repository implementation will be added later.
 *
 * All security-sensitive operations must be enforced
 * by the backend server.
 */

/**
 * Filters available when searching platform records.
 */
export interface RecordQuery {
  sectorId?: string;

  recordType?: string;

  createdBy?: string;

  status?: ReviewStatus;

  visibility?: RecordVisibility;

  searchText?: string;

  createdAfter?: string;

  createdBefore?: string;

  limit?: number;

  offset?: number;
}

/**
 * Standard interface for managing records.
 *
 * T represents a record type based on BaseRecord.
 */
export interface RecordRepository<
  T extends BaseRecord
> {
  /**
   * Save a new record.
   */
  create(record: T): Promise<T>;

  /**
   * Retrieve one record using its ID.
   *
   * Returns null when the record does not exist
   * or is not available to the requesting user.
   */
  getById(id: string): Promise<T | null>;

  /**
   * Search and retrieve records matching a query.
   */
  list(query?: RecordQuery): Promise<T[]>;

  /**
   * Update an existing record.
   *
   * The implementation must validate changes and
   * enforce authorization on the server.
   */
  update(
    id: string,
    changes: Partial<
      Pick<
        T,
        | "title"
        | "description"
        | "status"
        | "visibility"
      >
    >,
  ): Promise<T>;

  /**
   * Delete a record.
   *
   * The implementation must verify authorization
   * and handle linked records appropriately.
   */
  delete(id: string): Promise<void>;
}

/**
 * Standard error for record operations.
 */
export class RecordRepositoryError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "NOT_FOUND"
      | "VALIDATION_FAILED"
      | "ACCESS_DENIED"
      | "CONFLICT"
      | "STORAGE_ERROR",
  ) {
    super(message);

    this.name = "RecordRepositoryError";
  }
}
