using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GestionBeneficiariosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeneficiarioController : ControllerBase
    {
        private readonly IBeneficiarioService _service;

        public BeneficiarioController(IBeneficiarioService service)
        {
            _service = service;
        }

        // GET: api/Beneficiario/paged?page=1&pageSize=10
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetPagedAsync(page, pageSize);
            return Ok(result);
        }

        // GET: api/Beneficiario
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // GET: api/Beneficiario/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/Beneficiario
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BeneficiarioDto dto)
        {
            if (dto == null)
                return BadRequest("Datos inválidos.");

            var created = await _service.CreateAsync(dto);

            // Devuelve JSON completo con documentoIdentidad
            return CreatedAtAction(
                nameof(GetById),      // Acción para obtener el registro recién creado
                new { id = created.Id },
                created
            );
        }

        // PUT: api/Beneficiario/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BeneficiarioDto dto)
        {
            if (id <= 0 || dto == null)
                return BadRequest("Datos inválidos.");

            await _service.UpdateAsync(id, dto);
            dto.Id = id;

            return Ok(dto); // Devuelve el DTO actualizado
        }

        // DELETE: api/Beneficiario/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido.");

            await _service.DeleteAsync(id);
            return NoContent(); // 204
        }
    }
}
