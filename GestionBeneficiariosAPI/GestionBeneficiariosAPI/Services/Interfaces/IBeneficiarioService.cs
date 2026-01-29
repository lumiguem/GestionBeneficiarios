using GestionBeneficiariosAPI.DTOs;

namespace GestionBeneficiariosAPI.Services.Interfaces
{
    public interface IBeneficiarioService
    {
        Task<PagedResultDto<BeneficiarioDto>> GetPagedAsync(int page, int pageSize);
        Task<List<BeneficiarioDto>> GetAllAsync();
        Task<BeneficiarioDto?> GetByIdAsync(int id);
        Task<BeneficiarioDto> CreateAsync(BeneficiarioDto dto);
        Task UpdateAsync(int id, BeneficiarioDto dto);
        Task DeleteAsync(int id);
    }
}
