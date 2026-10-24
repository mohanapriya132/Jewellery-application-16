import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

/**
 * Generic Supabase data fetching hook with automatic fallback.
 * If Supabase returns data -> use it.
 * If Supabase returns empty or errors -> fall back to hardcoded data.
 *
 * @param {string} table - Supabase table name
 * @param {Array|Object} fallbackData - Hardcoded data to use as fallback
 * @param {Object} options - { select, orderBy, filter }
 */
export function useSupabaseData(table, fallbackData = [], options = {}) {
  const { select = "*", orderBy = null, filter = null } = options;

  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(select);

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      if (filter) {
        Object.entries(filter).forEach(([col, val]) => {
          query = query.eq(col, val);
        });
      }

      const { data: sbData, error: sbError } = await query;

      if (sbError) {
        console.warn(`[useSupabaseData] Error fetching ${table}:`, sbError.message);
        setError(sbError.message);
      } else if (sbData) {
        setData(sbData);
        setError(null);
      }
    } catch (err) {
      console.warn(`[useSupabaseData] Unexpected error for ${table}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, select, orderBy?.column, orderBy?.ascending, JSON.stringify(filter)]);

  return { data, loading, error, setData, refetch: fetchData };
}
