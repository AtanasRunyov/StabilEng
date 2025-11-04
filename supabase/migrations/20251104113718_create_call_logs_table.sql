/*
  # Create Call Logs Table

  1. New Tables
    - `call_logs`
      - `id` (uuid, primary key) - Unique identifier for each call log
      - `to_phone_number` (text) - The phone number that was called
      - `call_sid` (text, unique) - Twilio call SID for reference
      - `status` (text) - Call status (queued, ringing, in-progress, completed, failed, etc.)
      - `duration` (integer, nullable) - Call duration in seconds
      - `recording_url` (text, nullable) - URL to the call recording
      - `created_at` (timestamptz) - Timestamp when the call was initiated
      - `updated_at` (timestamptz) - Timestamp when the record was last updated

  2. Security
    - Enable RLS on `call_logs` table
    - Add policy for public read access (since this is a demo app)
    - Add policy for public insert access (for call creation)
    - Add policy for public update access (for status updates)

  3. Indexes
    - Index on `call_sid` for fast lookups
    - Index on `created_at` for chronological queries
*/

CREATE TABLE IF NOT EXISTS call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_phone_number text NOT NULL,
  call_sid text UNIQUE NOT NULL,
  status text DEFAULT 'queued',
  duration integer,
  recording_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_logs_call_sid ON call_logs(call_sid);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);

ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to call_logs"
  ON call_logs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to call_logs"
  ON call_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to call_logs"
  ON call_logs
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_call_logs_updated_at
  BEFORE UPDATE ON call_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
