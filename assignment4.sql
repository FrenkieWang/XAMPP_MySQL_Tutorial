DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userId INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50),
    titleOther VARCHAR(50),
    firstName VARCHAR(100) NOT NULL,
    surName VARCHAR(100) NOT NULL,
    mobile VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE addresses (
    addressId INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    addressType ENUM('home', 'shipping') NOT NULL,
    addressLine1 VARCHAR(100) NOT NULL,
    addressLine2 VARCHAR(100),
    town VARCHAR(100) NOT NULL,
    countyCity VARCHAR(100) NOT NULL,
    eircode VARCHAR(20),
    PRIMARY KEY (addressId),
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

INSERT INTO users (title, titleOther, firstName, surName, mobile, email) VALUES
('Mr', '', 'John', 'Doe', '1234567890', 'john.doe@example.com'),
('Ms', '', 'Jane', 'Doe', '0987654321', 'jane.doe@example.com'),
('Dr', '', 'Mike', 'Smith', '1122334455', 'mike.smith@example.com'),
('Mrs', '', 'Sara', 'Johnson', '2233445566', 'sara.johnson@example.com'),
('Miss', '', 'Lily', 'Adams', '3344556677', 'lily.adams@example.com');

-- User 1
INSERT INTO addresses (userId, addressType, addressLine1, addressLine2, town, countyCity, eircode) VALUES
(1, 'home', '123 Main St', '', 'Anytown', 'Anystate', '12345'),
(1, 'shipping', '456 Maple Ave', 'Apt 789', 'Othertown', 'Otherstate', '67890'),
(1, 'home', '789 Pine St', '', 'Sometown', 'Somestate', '24680');

-- User 2
INSERT INTO addresses (userId, addressType, addressLine1, addressLine2, town, countyCity, eircode) VALUES
(2, 'home', '321 Oak St', '', 'ThisTown', 'ThisState', '54321'),
(2, 'shipping', '654 Elm St', 'Suite 101', 'ThatTown', 'ThatState', '98765');