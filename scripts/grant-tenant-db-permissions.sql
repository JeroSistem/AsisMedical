-- Permisos MySQL para BD principal y BD por institución (multi-tenant)
GRANT ALL PRIVILEGES ON `asis_medical`.* TO 'asis'@'localhost';
GRANT ALL PRIVILEGES ON `asis_medical`.* TO 'asis'@'127.0.0.1';
GRANT ALL PRIVILEGES ON `asis_medical\_%`.* TO 'asis'@'localhost';
GRANT ALL PRIVILEGES ON `asis_medical\_%`.* TO 'asis'@'127.0.0.1';
GRANT CREATE, DROP ON *.* TO 'asis'@'localhost';
GRANT CREATE, DROP ON *.* TO 'asis'@'127.0.0.1';
FLUSH PRIVILEGES;
