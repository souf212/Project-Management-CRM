using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project_service.Models
{
    // Named DomainTask to avoid conflict with System.Threading.Tasks.Task
    public class DomainTask
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public bool IsCompleted { get; set; } = false;

        public int ProjectId { get; set; }

        [JsonIgnore]
        public Project? Project { get; set; }
    }
}
