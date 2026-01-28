using GestionBeneficiariosAPI.DTOs;

namespace GestionBeneficiariosAPI.Services
{
    public interface IBeneficiarioService
    {
        Task<PagedResultDto<BeneficiarioDto>> GetPagedAsync(int page, int pageSize);
        Task<List<BeneficiarioDto>> GetAllAsync();
        Task<BeneficiarioDto?> GetByIdAsync(int id);
        Task CreateAsync(BeneficiarioDto dto);
        Task UpdateAsync(int id, BeneficiarioDto dto);
        Task DeleteAsync(int id);
    }
}
