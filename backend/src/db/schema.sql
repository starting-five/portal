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

-- Removed price_units table
CREATE TABLE IF NOT EXISTS listing_types (
  id SERIAL PRIMARY KEY
);

-- Multilingual translations for listing types
CREATE TABLE IF NOT EXISTS listing_type_translations (
  id SERIAL PRIMARY KEY,
  listing_type_id INT NOT NULL REFERENCES listing_types(id) ON DELETE CASCADE,
  language_code VARCHAR(8) NOT NULL,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (listing_type_id, language_code)
);

CREATE TABLE IF NOT EXISTS ownership_types (
  id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS ownership_type_translations (
  id SERIAL PRIMARY KEY,
  ownership_type_id INT NOT NULL REFERENCES ownership_types(id) ON DELETE CASCADE,
  language_code VARCHAR(8) NOT NULL,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (ownership_type_id, language_code)
);



CREATE TABLE IF NOT EXISTS listing_statuses (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL
);

-- Multilingual translations for listing statuses
CREATE TABLE IF NOT EXISTS listing_statuses_translations (
  id SERIAL PRIMARY KEY,
  listing_status_id INT NOT NULL REFERENCES listing_statuses(id) ON DELETE CASCADE,
  language_code VARCHAR(8) NOT NULL,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (listing_status_id, language_code)
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
  listing_type_id INT REFERENCES listing_types(id),
  ownership_type_id INT REFERENCES ownership_types(id),
  location_id INT REFERENCES locations(id),
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  land_size_sqm INT DEFAULT 0,
  building_size_sqm INT,
  status_id INT REFERENCES listing_statuses(id),
  -- price_unit_id INT, -- removed price_units support
  price NUMERIC(18, 2),
  -- currency_id INT, -- removed currencies support
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  year_built INT,
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


-- 6. Create the 'features' table (refactored for best practice)
CREATE TABLE IF NOT EXISTS feature_categories (
  key VARCHAR(50) PRIMARY KEY,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feature_categories_translations (
  id SERIAL PRIMARY KEY,
  category_key VARCHAR(50) NOT NULL REFERENCES feature_categories(key) ON DELETE CASCADE,
  language_code VARCHAR(8) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (category_key, language_code)
);

CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  category_key VARCHAR(50) NOT NULL REFERENCES feature_categories(key) ON DELETE RESTRICT,
  key VARCHAR(50) UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6a. Create the 'features_translations' table for multilingual support
CREATE TABLE IF NOT EXISTS features_translations (
  id SERIAL PRIMARY KEY,
  feature_id INT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  language_code VARCHAR(8) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (feature_id, language_code)
);

-- 7. Create the 'listing_features' join table for the many-to-many relationship
CREATE TABLE IF NOT EXISTS listing_features (
  listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  feature_id INT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, feature_id)
);

-- 8. Create the 'listing_translations' table for multilingual title/description
CREATE TABLE IF NOT EXISTS listing_translations (
  id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  language_code VARCHAR(8) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (listing_id, language_code)
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
   -- No more title/description fields in listings table
   NEW.search_vector := to_tsvector('english', '');
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
-- CREATE INDEX IF NOT EXISTS listings_price_unit_id_idx ON listings(price_unit_id); -- removed price_units support
-- CREATE INDEX IF NOT EXISTS listings_currency_id_idx ON listings(currency_id); -- removed currencies support
CREATE INDEX IF NOT EXISTS listings_price_idx ON listings(price);