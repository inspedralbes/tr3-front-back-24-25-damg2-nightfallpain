CREATE TABLE Usuaris_Jugadors (
    id CHAR(36) PRIMARY KEY, 
    nom VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    contrasenya VARCHAR(255) NOT NULL, 
    data_registre TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    es_admin BOOLEAN DEFAULT FALSE, 
    XP INT DEFAULT 0
);

CREATE TABLE Armes (
    id CHAR(36) PRIMARY KEY, 
    nom VARCHAR(255) NOT NULL, 
    dany INT NOT NULL, 
    raresa VARCHAR(255) NOT NULL, 
    atributs JSON NOT NULL 
);

CREATE TABLE Skins (
    id CHAR(36) PRIMARY KEY, 
    usuari_id CHAR(36) NOT NULL, 
    nom VARCHAR(255) NOT NULL, 
    preu DECIMAL(10,2) NOT NULL, 
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (usuari_id) REFERENCES Usuaris_Jugadors(id) ON DELETE CASCADE
);

CREATE TABLE Enemics (
    id CHAR(36) PRIMARY KEY, 
    nom VARCHAR(255) NOT NULL, 
    vida INT NOT NULL, 
    atac INT NOT NULL, 
    comportament TEXT NOT NULL
);