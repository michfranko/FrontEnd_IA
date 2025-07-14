-- This script creates a table to store the history of traffic analysis records.

CREATE TABLE analysis_history (
    id SERIAL PRIMARY KEY,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url_1 TEXT NOT NULL,
    image_url_2 TEXT NOT NULL,
    prediction_a VARCHAR(255),
    prediction_b VARCHAR(255),
    vehicle_count_a INTEGER,
    vehicle_count_b INTEGER,
    recommendation TEXT
);

-- Example of how to insert a record (for testing purposes):
-- INSERT INTO analysis_history (image_url_1, image_url_2, prediction_a, prediction_b, vehicle_count_a, vehicle_count_b, recommendation)
-- VALUES ('path/to/image1.jpg', 'path/to/image2.jpg', 'Avance', 'Alto', 5, 2, 'Se recomienda dar preferencia a la Calle A.');
