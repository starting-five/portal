-- 1. Create a function to generate a unique, human-readable listing ID.
-- This function ensures the generated ID does not already exist.
CREATE OR REPLACE FUNCTION generate_unique_listing_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  found BOOLEAN;
BEGIN
  LOOP
    new_id := LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
    new_id := SUBSTRING(new_id, 1, 4) || '-' || SUBSTRING(new_id, 5, 4);
    SELECT EXISTS(SELECT 1 FROM listings WHERE listing_id = new_id) INTO found;
    IF NOT found THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TYPE feature_category AS ENUM ('scenic', 'property', 'amenity');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create lookup tables for types, statuses, etc.
CREATE TABLE IF NOT EXISTS currencies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS price_units (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS listing_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS ownership_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS listing_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Create the 'locations' table (no change)
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- 4. Create the 'listings' table
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  listing_id VARCHAR(9) UNIQUE NOT NULL DEFAULT generate_unique_listing_id(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  listing_type_id INT REFERENCES listing_types(id),
  ownership_type_id INT REFERENCES ownership_types(id),
  location_id INT REFERENCES locations(id),
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  land_size_sqm INT DEFAULT 0,
  building_size_sqm INT,
  status_id INT REFERENCES listing_statuses(id),
  price_unit_id INT REFERENCES price_units(id),
  price NUMERIC(18, 2),
  currency_id INT REFERENCES currencies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  year_built INT,
  facilities JSONB,
  search_vector TSVECTOR
);

-- 5. Create the 'listing_images' table
CREATE TABLE IF NOT EXISTS listing_images (
  id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create the 'features' table
CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category feature_category NOT NULL
);

-- 7. Create the 'listing_features' join table for the many-to-many relationship
CREATE TABLE IF NOT EXISTS listing_features (
  listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  feature_id INT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, feature_id)
);

-- 8. Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create a trigger to call the function before any update on the 'listings' table
-- This avoids needing to manage 'updated_at' in the application code.
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 10. Create a function and trigger to update the search_vector for full-text search
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
   NEW.search_vector :=
      setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_listings_search_vector ON listings;
CREATE TRIGGER update_listings_search_vector
BEFORE INSERT OR UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_search_vector();

-- 11. Add performance-enhancing indexes
-- Index for full-text search
CREATE INDEX IF NOT EXISTS listings_search_idx ON listings USING GIN(search_vector);

-- Indexes for foreign keys to speed up JOINs and filtering
CREATE INDEX IF NOT EXISTS listings_location_id_idx ON listings(location_id);
CREATE INDEX IF NOT EXISTS listings_listing_type_id_idx ON listings(listing_type_id);
CREATE INDEX IF NOT EXISTS listings_ownership_type_id_idx ON listings(ownership_type_id);
CREATE INDEX IF NOT EXISTS listings_status_id_idx ON listings(status_id);
CREATE INDEX IF NOT EXISTS listings_price_unit_id_idx ON listings(price_unit_id);
CREATE INDEX IF NOT EXISTS listings_currency_id_idx ON listings(currency_id);
CREATE INDEX IF NOT EXISTS listings_price_idx ON listings(price);