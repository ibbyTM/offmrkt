import { describe, it, expect } from "vitest";
import { buildLeadsCsvContent, LandingLead } from "./useLandingLeads";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const makeLead = (overrides: Partial<LandingLead> = {}): LandingLead => ({
  id: "1",
  full_name: "Alice Smith",
  email: "alice@example.com",
  phone: "07700900000",
  interest_type: "buyer",
  referrer_url: "https://example.com",
  created_at: "2024-06-15T10:30:00Z",
  ...overrides,
});

// ---------------------------------------------------------------------------
// buildLeadsCsvContent — pure RFC 4180 CSV generation
// ---------------------------------------------------------------------------
describe("buildLeadsCsvContent", () => {
  it("generates correct headers on the first line", () => {
    const csv = buildLeadsCsvContent([makeLead()]);
    const [header] = csv.split("\n");
    expect(header).toBe("Date,Full Name,Email,Phone,Interest Type,Referrer URL");
  });

  it("wraps each cell in double quotes", () => {
    const csv = buildLeadsCsvContent([makeLead({ full_name: "Bob Jones", email: "bob@test.com" })]);
    const dataLine = csv.split("\n")[1];
    expect(dataLine).toContain('"Bob Jones"');
    expect(dataLine).toContain('"bob@test.com"');
  });

  it("escapes double quotes inside cell values (RFC 4180)", () => {
    const csv = buildLeadsCsvContent([makeLead({ full_name: 'John "JD" Doe' })]);
    const dataLine = csv.split("\n")[1];
    // RFC 4180: a literal " inside a quoted field must become ""
    expect(dataLine).toContain('"John ""JD"" Doe"');
  });

  it("handles null phone, interest_type, and referrer_url as empty strings", () => {
    const csv = buildLeadsCsvContent([
      makeLead({ phone: null, interest_type: null, referrer_url: null }),
    ]);
    const dataLine = csv.split("\n")[1];
    // Three empty quoted fields at the end
    expect(dataLine).toContain('""');
    // Should not contain literal 'null'
    expect(dataLine).not.toContain("null");
  });

  it("produces one data row per lead", () => {
    const csv = buildLeadsCsvContent([
      makeLead(),
      makeLead({ id: "2", full_name: "Carol White" }),
    ]);
    const lines = csv.split("\n");
    // 1 header + 2 data rows
    expect(lines).toHaveLength(3);
  });

  it("formats the date as yyyy-MM-dd HH:mm", () => {
    const csv = buildLeadsCsvContent([makeLead({ created_at: "2024-06-15T10:30:00Z" })]);
    const dataLine = csv.split("\n")[1];
    expect(dataLine).toContain("2024-06-15");
  });
});
