import { SearchResult } from "../types/SearchResult";
import React from "react";

/**
 * Check if a search term matches any value in an object (nested search)
 */
export const checkNested = (
  obj: Record<string, unknown>,
  searchTerm: string,
): boolean => {
  return Object.values(obj).some((value) =>
    typeof value === "object" && value !== null
      ? checkNested(value as Record<string, unknown>, searchTerm)
      : typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

/**
 * Filter data based on search chips/terms
 */
export const filterData = <T extends Record<string, unknown>>(
  chips: string[],
  data: T[],
): T[] => {
  if (chips.length === 0) return data;
  return data.filter((item) => chips.every((chip) => checkNested(item, chip)));
};

/**
 * Interface for a sort level configuration
 */
export interface SortLevel {
  key: string;
  direction: "asc" | "desc";
}

/**
 * Interface for two-level sort configuration
 */
export interface SortConfig {
  primary: SortLevel | null;
  secondary: SortLevel | null;
}

/**
 * Compare two values for sorting
 */
const compareValues = <T>(a: T, b: T, key: string, direction: "asc" | "desc"): number => {
  const aValue = (a as Record<string, unknown>)[key];
  const bValue = (b as Record<string, unknown>)[key];
  const sortDir = direction === "asc" ? 1 : -1;

  // Handle null/undefined values
  if (aValue == null && bValue == null) return 0;
  if (aValue == null) return 1;
  if (bValue == null) return -1;

  // Special handling for date sorting
  if (key === "dueDate") {
    const aDate = new Date(aValue as string);
    const bDate = new Date(bValue as string);

    if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
      return 0;
    }

    return (aDate.getTime() - bDate.getTime()) * sortDir;
  }

  // Default comparison
  if (aValue > bValue) return 1 * sortDir;
  if (aValue < bValue) return -1 * sortDir;
  return 0;
};

/**
 * Sort data based on primary and optional secondary sort configuration
 */
export const sortData = <T extends Record<string, unknown>>(
  data: T[],
  primaryKey: string | null,
  primaryDirection: "asc" | "desc" | "none",
  secondaryKey?: string | null,
  secondaryDirection?: "asc" | "desc",
): T[] => {
  if (primaryDirection === "none" || !primaryKey) return data;

  return [...data].sort((a: T, b: T) => {
    // Primary sort
    const primaryCompare = compareValues(
      a,
      b,
      primaryKey,
      primaryDirection as "asc" | "desc",
    );

    // If equal and secondary sort exists, use it
    if (primaryCompare === 0 && secondaryKey && secondaryDirection) {
      return compareValues(a, b, secondaryKey, secondaryDirection);
    }

    return primaryCompare;
  });
};

/**
 * Parse event value from CustomEvent or standard React event
 */
export const getEventValue = (
  e: CustomEvent | React.ChangeEvent<HTMLInputElement>,
): string => {
  return "detail" in e ? e.detail?.value || "" : e.target?.value || "";
};

/**
 * Parse key from CustomEvent or standard React keyboard event
 */
export const getEventKey = (e: CustomEvent | React.KeyboardEvent): string => {
  if ("detail" in e) {
    return (e as CustomEvent).detail?.key || "";
  }
  return (e as React.KeyboardEvent).key || "";
};
