using GestionBeneficiariosAPI.DTOs;
using GestionBeneficiariosAPI.Services.implementations;
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

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetPagedAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        } 

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BeneficiarioDto dto)
        {
            await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BeneficiarioDto dto)
        {
            if (id <= 0)
                return BadRequest("Id inválido");

            await _service.UpdateAsync(id, dto);
            return NoContent(); // 204
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest("Id inválido");

            await _service.DeleteAsync(id);
            return NoContent(); // 204
        }
    }
}
