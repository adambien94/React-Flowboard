export const supabase = {
  // minimal stub used in tests; extend as needed
  from: () => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  }),
} as unknown as import("@supabase/supabase-js").SupabaseClient;

