CREATE database RTLS;

USE RTLS;

CREATE TABLE playback_data(
    id INT AUTO_INCREMENT PRIMARY KEY,
    lapid VARCHAR(40),
    player VARCHAR(25),
    initials VARCHAR(10),
    x DOUBLE(18,15),
    y DOUBLE(18,15),
    z DOUBLE(18,15),
    jumpCount INT(255) DEFAULT 0,
    stepCount INT(255) DEFAULT 0,
    speed DECIMAL(5,2) DEFAULT 0.0,
    ts DOUBLE(16,6)
);

CREATE TABLE laps(
	id INT AUTO_INCREMENT PRIMARY KEY,
    lapid VARCHAR(40),
    start_time DOUBLE(16,6),
    stop_time DOUBLE(16,6)
);

CREATE TABLE players(
	id INT AUTO_INCREMENT PRIMARY KEY,
    lapid VARCHAR(40),
    player VARCHAR(25)
);

DROP TABLE laps;

DROP TABLE playback_data;

DROP TABLE players;

SELECT * FROM playback_data; 

SELECT * FROM laps;

SELECT * FROM players;

DELETE FROM playback_data;

DELETE FROM laps;

