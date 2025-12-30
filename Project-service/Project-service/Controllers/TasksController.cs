using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_service.Data;
using Project_service.Models;

namespace Project_service.Controllers
{
    [Authorize]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        private long GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
            if (userIdClaim == null) return 0;
            return long.Parse(userIdClaim.Value);
        }

        [HttpGet("projects/{projectId}/tasks")]
        public async Task<ActionResult<IEnumerable<DomainTask>>> GetTasks(int projectId)
        {
            var userId = GetUserId();
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null) return NotFound("Project not found or access denied");

            return await _context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<DomainTask>> CreateTask(int projectId, DomainTask task)
        {
            var userId = GetUserId();
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

             if (project == null) return NotFound("Project not found or access denied");

            task.ProjectId = projectId;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpPut("tasks/{id}/complete")]
        public async Task<IActionResult> ToggleComplete(int id)
        {
            var userId = GetUserId();
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null || task.Project.UserId != userId) return NotFound();

            task.IsCompleted = !task.IsCompleted;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("tasks/{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetUserId();
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null || task.Project.UserId != userId) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
