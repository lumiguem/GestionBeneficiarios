-- Crear la base de datos
CREATE DATABASE GestionBeneficiarios;
GO

-- Usar la base de datos creada
USE GestionBeneficiarios;
GO

-- Tabla docuementos
CREATE TABLE DocumentoIdentidad (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Abreviatura VARCHAR(10) NOT NULL,
    Pais VARCHAR(50) NOT NULL,
    Longitud INT NOT NULL,
    SoloNumeros BIT NOT NULL,
    Activo BIT NOT NULL DEFAULT 1
);

-- Tabla beneficiarios
CREATE TABLE Beneficiario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    DocumentoIdentidadId INT NOT NULL,
    NumeroDocumento VARCHAR(20) NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Sexo CHAR(1) NOT NULL CHECK (Sexo IN ('M', 'F')),

    CONSTRAINT FK_Beneficiario_Documento FOREIGN KEY (DocumentoIdentidadId)
        REFERENCES DocumentoIdentidad(Id)
);

-- Inserts para Documentos 
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
('Documento Nacional de Identidad', 'DNI', 'Perú', 8, 1, 1),
('Pasaporte', 'PAS', 'Perú', 9, 0, 1),
('Cédula de Identidad', 'CE', 'Ecuador', 10, 1, 1),
('Tarjeta de Identidad', 'TI', 'Colombia', 12, 0, 1);

-- Inserts para Beneficiarios 
INSERT INTO Beneficiario (Nombres, Apellidos, DocumentoIdentidadId, NumeroDocumento, FechaNacimiento, Sexo)
VALUES
('Juan', 'Perez', 1, '12345678', '1990-05-12', 'M'),
('Maria', 'Gomez', 2, 'A12345678', '1985-10-20', 'F'),
('Carlos', 'Lopez', 3, '9876543210', '2000-01-15', 'M');


-- PROCEDIMIENTOS ALMACENADOS 

--Listar beneficiarios
CREATE PROCEDURE sp_Beneficiario_Listar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
        d.Nombre,
        d.Abreviatura,
        d.Pais
    FROM Beneficiario b
    INNER JOIN DocumentoIdentidad d 
        ON b.DocumentoIdentidadId = d.Id
    ORDER BY b.Id;
END;

--Listar beneficiarios paginados
CREATE PROCEDURE sp_Beneficiario_ListarPaginado
    @Page INT,
    @PageSize INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    SELECT
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
        d.Nombre AS DocumentoNombre,
        d.Abreviatura,
		d.Pais
    FROM Beneficiario b
    INNER JOIN DocumentoIdentidad d ON d.Id = b.DocumentoIdentidadId
    ORDER BY b.Id
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalItems FROM Beneficiario;
END;

--Obtener beneficiarios por id
CREATE PROCEDURE sp_Beneficiario_ObtenerPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo,
		d.Nombre,               
        d.Abreviatura,       
        d.Pais                
    FROM Beneficiario b
	INNER JOIN DocumentoIdentidad d ON b.DocumentoIdentidadId = d.Id
    WHERE b.Id = @Id;
END;

-- --Insertar beneficiarios
CREATE PROCEDURE sp_Beneficiario_Insertar
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Beneficiario
    (
        Nombres,
        Apellidos,
        DocumentoIdentidadId,
        NumeroDocumento,
        FechaNacimiento,
        Sexo
    )
    VALUES
    (
        @Nombres,
        @Apellidos,
        @DocumentoIdentidadId,
        @NumeroDocumento,
        @FechaNacimiento,
        @Sexo
    );
	SELECT SCOPE_IDENTITY() AS Id;
END;

--Actualizar beneficiarios
CREATE PROCEDURE sp_Beneficiario_Actualizar
    @Id INT,
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Beneficiario
    SET
        Nombres = @Nombres,
        Apellidos = @Apellidos,
        DocumentoIdentidadId = @DocumentoIdentidadId,
        NumeroDocumento = @NumeroDocumento,
        FechaNacimiento = @FechaNacimiento,
        Sexo = @Sexo
    WHERE Id = @Id;
END;

--Eliminar beneficiarios
CREATE PROCEDURE sp_Beneficiario_Eliminar
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Beneficiario
    WHERE Id = @Id;
END;
