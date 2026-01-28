using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.Models;

namespace GestionBeneficiariosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentoIdentidadController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DocumentoIdentidadController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("activos")]
        public async Task<ActionResult<IEnumerable<DocumentoIdentidad>>> GetActivos()
        {
            var documentos = await _context.DocumentosIdentidad
                                           .Where(d => d.Activo)
                                           .ToListAsync();
            return Ok(documentos);
        }
    }
}
