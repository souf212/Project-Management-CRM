using System.ComponentModel.DataAnnotations;

namespace Project_service.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key from JWT (Spring Boot User ID)
        public long UserId { get; set; }

        public List<DomainTask> Tasks { get; set; } = new();
    }
}
