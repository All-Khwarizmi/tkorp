-- Création de la base de données
CREATE DATABASE IF NOT EXISTS tkorp;
USE tkorp;

-- Création des tables
CREATE TABLE IF NOT EXISTS person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastName VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
    species VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    weight INT NOT NULL,
    ownerId INT,
    FOREIGN KEY (ownerId) REFERENCES person(id)
);

-- Insertion des données de test
INSERT INTO person (lastName, firstName, email, phoneNumber) VALUES
('Lee', 'Sarah', 'sarah.lee1@example.com', '555-0355'),
('Doe', 'Chris', 'chris.doe2@example.com', '555-0332'),
('Doe', 'Jane', 'jane.doe3@example.com', '555-0394'),
('Doe', 'Michael', 'michael.doe4@example.com', '555-0144'),
('Walker', 'Sarah', 'sarah.walker5@example.com', '555-0391');

-- Insertion des animaux
INSERT INTO animal (name, dateOfBirth, species, breed, color, weight, ownerId) VALUES
('Bella','2013-05-08','Turtle','Musk Turtle', 'Spotted', 18272, 1),
('Luna','2020-12-07','Turtle','Box Turtle', 'Striped', 47483, 2),
('Luna','2023-08-12','Turtle','Musk Turtle', 'Brown', 44540, 3),
('Chloe','2017-09-08','Bird','Parrot', 'Striped', 18462, 4),
('Bella','2014-07-19','Turtle','Musk Turtle', 'Multicolor', 16812, 5);
