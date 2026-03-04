# 📋 Gestión de Beneficiarios

![GitHub](https://img.shields.io/badge/status-active-success)
![.NET](https://img.shields.io/badge/.NET-7%2B-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red)

Proyecto **full stack** para la gestión de beneficiarios.

Incluye:

* 🔧 Backend en **.NET (API REST)**
* 🎨 Frontend en **React + Vite**
* 🗄️ Base de datos **SQL Server** con **procedimientos almacenados**

---

## 📑 Tabla de Contenidos

* [Requisitos previos](#-requisitos-previos)
* [Instalación](#️-instrucciones-de-instalación)
* [Ejecución](#️-instrucciones-para-ejecutar-el-proyecto)
* [Base de Datos](#️-base-de-datos)
* [Notas adicionales](#-notas-adicionales)
* [Autor](#-autor)

---

## 📦 Requisitos previos

Asegúrate de tener instalado:

* **Node.js** v18 o superior
* **npm** o **pnpm**
* **.NET SDK 7 o superior**
* **SQL Server** (LocalDB, Express o superior)
* **SQL Server Management Studio (SSMS)** (recomendado)

---

## 🛠️ Instrucciones de instalación

### 1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd GestionBeneficiarios
```

---

### 2️⃣ Configurar la base de datos

1. Abrir **SQL Server Management Studio**
2. Ejecutar el script SQL proporcionado en el proyecto
3. Verificar que la base de datos **GestionBeneficiarios** se haya creado correctamente

El script crea automáticamente:

* Base de datos
* Tablas
* Datos iniciales
* Procedimientos almacenados

---

### 3️⃣ Configurar el Backend (.NET API)

1. Abrir el proyecto en **Visual Studio**, **Rider** o **VS Code**
2. Editar el archivo `appsettings.json`
3. Configurar la cadena de conexión:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=GestionBeneficiarios;Trusted_Connection=True;TrustServerCertificate=True"
}
```

4. Restaurar dependencias:

```bash
dotnet restore
```

---

### 4️⃣ Configurar el Frontend (React)

```bash
cd frontend
npm install
```

---

## ▶️ Instrucciones para ejecutar el proyecto

### ▶️ Backend

```bash
dotnet run
```

Backend disponible en:

```
https://localhost:5001
```

*(o el puerto configurado en `Program.cs`)*

---

### ▶️ Frontend

```bash
npm run dev
```

Frontend disponible en:

```
http://localhost:5173
```

---

## 🗄️ Base de Datos

### 📌 Nombre

```
GestionBeneficiarios
```

---

### 📌 Tablas

* **DocumentoIdentidad**
* **Beneficiario**

---

### 📌 Procedimientos almacenados

| Procedimiento                    | Descripción                    |
| -------------------------------- | ------------------------------ |
| `sp_Beneficiario_Listar`         | Lista todos los beneficiarios  |
| `sp_Beneficiario_ListarPaginado` | Lista beneficiarios paginados  |
| `sp_Beneficiario_ObtenerPorId`   | Obtiene un beneficiario por ID |
| `sp_Beneficiario_Insertar`       | Inserta un beneficiario        |
| `sp_Beneficiario_Actualizar`     | Actualiza un beneficiario      |
| `sp_Beneficiario_Eliminar`       | Elimina un beneficiario        |

---

### 📌 Datos iniciales

El script incluye datos de ejemplo para:

* Tipos de documentos de identidad
* Beneficiarios

---

## 🎥 Video Demo

📌 **Demostración de la aplicación**
👉 [Ver video demo](https://drive.google.com/file/d/1Vy3IAWnnTlVBvgkZ5zt4keH1m69u_an6/view?usp=sharing)

En el video se muestra:

* Listado de beneficiarios
* Registro de un nuevo beneficiario
* Edición de un beneficiario existente
* Eliminación con confirmación

---

## 📝 Notas adicionales

* El acceso a datos se realiza mediante **procedimientos almacenados**
* Validaciones aplicadas en **frontend y backend**
* Arquitectura preparada para escalar y extender funcionalidades

---

## 👨‍💻 Autor

**Miguel Moreno**
Reto Técnico – Gestión de Beneficiarios

---

⭐ Si este proyecto fue útil, no olvides darle una estrella en GitHub
