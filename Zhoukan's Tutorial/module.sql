DROP TABLE IF EXISTS modules;

CREATE TABLE modules (
    moduleId INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(10),
    moduleName VARCHAR(50),
    PRIMARY KEY (moduleId)
);

INSERT INTO modules (code, moduleName) VALUES ('CS210', 'Algorithms & Data Structures 1');
INSERT INTO modules (code, moduleName) VALUES ('CS211', 'Algorithms & Data Structures 2');
INSERT INTO modules (code, moduleName) VALUES ('CS130', 'Database');