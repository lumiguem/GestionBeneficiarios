using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;
using GestionBeneficiariosAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace GestionBeneficiariosAPI.Services.implementations
{
    public class BeneficiarioService : IBeneficiarioService
    {
        private readonly AppDbContext _context;

        public BeneficiarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BeneficiarioDto>> GetAllAsync()
        {
            var result = new List<BeneficiarioDto>();

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT b.Id, b.Nombres, b.Apellidos, b.DocumentoIdentidadId, b.NumeroDocumento, b.FechaNacimiento, b.Sexo, d.Nombre, d.Abreviatura, d.Pais " +
                              "FROM Beneficiario b " +
                              "INNER JOIN DocumentoIdentidad d ON b.DocumentoIdentidadId = d.Id";
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                result.Add(new BeneficiarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombres = reader.GetString(1),
                    Apellidos = reader.GetString(2),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = reader.GetInt32(3),
                        Nombre = reader.GetString(7),
                        Abreviatura = reader.GetString(8),
                        Pais = reader.GetString(9)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                });
            }

            return result;
        }

        public async Task<BeneficiarioDto?> GetByIdAsync(int id)
        {
            BeneficiarioDto? result = null;

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_ObtenerPorId";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id", id));

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                result = new BeneficiarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombres = reader.GetString(1),
                    Apellidos = reader.GetString(2),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = reader.GetInt32(3),
                        Nombre = reader.GetString(7),
                        Abreviatura = reader.GetString(8),
                        Pais = reader.GetString(9)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                };
            }

            return result;
        }

        public async Task<PagedResultDto<BeneficiarioDto>> GetPagedAsync(int page, int pageSize)
        {
            var result = new List<BeneficiarioDto>();
            int totalItems = 0;

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_ListarPaginado";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Page", page));
            cmd.Parameters.Add(new SqlParameter("@PageSize", pageSize));

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                result.Add(new BeneficiarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombres = reader.GetString(1),
                    Apellidos = reader.GetString(2),
                    DocumentoIdentidad = new DocumentoIdentidadDto
                    {
                        Id = reader.GetInt32(3),
                        Nombre = reader.GetString(7),
                        Abreviatura = reader.GetString(8),
                        Pais = reader.GetString(9)
                    },
                    NumeroDocumento = reader.GetString(4),
                    FechaNacimiento = reader.GetDateTime(5),
                    Sexo = reader.GetString(6)
                });
            }

            if (await reader.NextResultAsync() && await reader.ReadAsync())
            {
                totalItems = reader.GetInt32(0);
            }

            return new PagedResultDto<BeneficiarioDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = result
            };
        }

        public async Task<BeneficiarioDto> CreateAsync(BeneficiarioDto dto)
        {
            int newId;

            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            // 1️⃣ Ejecutar el SP de inserción
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "sp_Beneficiario_Insertar";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Nombres", dto.Nombres));
                cmd.Parameters.Add(new SqlParameter("@Apellidos", dto.Apellidos));
                cmd.Parameters.Add(new SqlParameter("@DocumentoIdentidadId", dto.DocumentoIdentidad.Id));
                cmd.Parameters.Add(new SqlParameter("@NumeroDocumento", dto.NumeroDocumento));
                cmd.Parameters.Add(new SqlParameter("@FechaNacimiento", dto.FechaNacimiento));
                cmd.Parameters.Add(new SqlParameter("@Sexo", dto.Sexo[0]));

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    newId = Convert.ToInt32(reader["Id"]);
                }
                else
                {
                    throw new Exception("No se pudo crear el beneficiario.");
                }
            }

            // 2️⃣ Obtener el beneficiario recién creado usando la misma conexión
            BeneficiarioDto? created = null;

            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = "sp_Beneficiario_ObtenerPorId";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id", newId));

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    created = new BeneficiarioDto
                    {
                        Id = reader.GetInt32(0),
                        Nombres = reader.GetString(1),
                        Apellidos = reader.GetString(2),
                        DocumentoIdentidad = new DocumentoIdentidadDto
                        {
                            Id = reader.GetInt32(3),
                            Nombre = reader.GetString(7),
                            Abreviatura = reader.GetString(8),
                            Pais = reader.GetString(9)
                        },
                        NumeroDocumento = reader.GetString(4),
                        FechaNacimiento = reader.GetDateTime(5),
                        Sexo = reader.GetString(6)
                    };
                }
            }

            return created!;
        }


        public async Task UpdateAsync(int id, BeneficiarioDto dto)
        {
            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_Actualizar";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id", id));
            cmd.Parameters.Add(new SqlParameter("@Nombres", dto.Nombres));
            cmd.Parameters.Add(new SqlParameter("@Apellidos", dto.Apellidos));
            cmd.Parameters.Add(new SqlParameter("@NumeroDocumento", dto.NumeroDocumento));
            cmd.Parameters.Add(new SqlParameter("@FechaNacimiento", dto.FechaNacimiento));
            cmd.Parameters.Add(new SqlParameter("@Sexo", dto.Sexo[0]));
            cmd.Parameters.Add(new SqlParameter("@DocumentoIdentidadId", dto.DocumentoIdentidad.Id));

            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteAsync(int id)
        {
            using var conn = _context.Database.GetDbConnection();
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "sp_Beneficiario_Eliminar";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id", id));

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
