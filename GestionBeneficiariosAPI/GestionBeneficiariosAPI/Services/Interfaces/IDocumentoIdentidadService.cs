using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Models;

namespace GestionBeneficiariosAPI.Services.Interfaces
{
    public interface IDocumentoIdentidadService
    {
        Task<List<DocumentoIdentidad>> GetAllAsync();
        Task<bool> ToggleActivoAsync(int id);
    }
}
