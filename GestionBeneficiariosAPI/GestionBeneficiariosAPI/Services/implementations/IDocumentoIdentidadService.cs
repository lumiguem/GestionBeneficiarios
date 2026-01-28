using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;

namespace GestionBeneficiariosAPI.Services.implementations
{
    public interface IDocumentoIdentidadService
    {
        Task<List<DocumentoIdentidad>> GetAllAsync();
    }
}
