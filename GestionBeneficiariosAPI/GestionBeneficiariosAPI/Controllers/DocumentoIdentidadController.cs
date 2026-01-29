using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionBeneficiariosAPI.Data;
using GestionBeneficiariosAPI.Models;
using GestionBeneficiariosAPI.Services.Interfaces;

namespace GestionBeneficiariosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentoIdentidadController : ControllerBase
    {
        private readonly IDocumentoIdentidadService _service;
        public DocumentoIdentidadController(IDocumentoIdentidadService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpPatch("{id}/alternar-estado")]
        public async Task<IActionResult> AlternarEstado(int id)
        {
            var actualizado = await _service.ToggleActivoAsync(id);

            if (!actualizado)
                return NotFound();

            return NoContent();
        }


    }


}
