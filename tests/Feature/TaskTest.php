<?php

namespace Tests\Feature;

use App\Enums\TaskStatus;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class TaskTest extends TestCase
{
    use RefreshDatabase; // <- runs migrations for each test

    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $this->withoutExceptionHandling();
        $response = $this->getJson('api/tasks');

        $response->assertStatus(200);
    }
    /**
     * Task Tests
     * */

    // Helper for JSON structure used by TaskResource
    function taskJsonStructure(): array
    {
        return [
            'id',
            'title',
            'description',
            'status',
            'due_date',
            'is_overdue',
            'created_at',
            'updated_at',
        ];
    }
    public function test_can_create_a_task(): void
    {
        $data = [
            'title' => 'Test Task',
            'description' => 'This is a test task',
            'status' => TaskStatus::TODO->value,
            'due_date' => now()->addDay()->toDateTimeString(),
        ];

        $response = $this->postJson('api/tasks', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => $this->taskJsonStructure()])
            ->assertJsonPath('data.title', $data['title'])
            ->assertJsonPath('data.description', $data['description']);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'description' => 'This is a test task',
            'status' => TaskStatus::TODO->value,
        ]);
    }

    public function test_create_task_requires_a_title(): void
    {
        $data = [
            // 'title' is missing
            'description' => 'This is a test task',
            'status' => TaskStatus::TODO->value,
            'due_date' => now()->addDay()->toDateTimeString(),
        ];

        $this->postJson('api/tasks', $data)
            ->assertStatus(422) // Unprocessable Entity
            ->assertJsonValidationErrors('title');
    }

    public function test_create_task_requires_a_valid_status(): void
    {
        $data = [
            'title' => 'Test Task',
            'description' => 'This is a test task',
            'status' => 'invalid-status',
            'due_date' => now()->addDay()->toDateTimeString(),
        ];

        $this->postJson('api/tasks', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_create_task_requires_a_valid_due_date(): void
    {
        $data = [
            'title' => 'Test Task',
            'description' => 'This is a test task',
            'status' => TaskStatus::TODO->value,
            'due_date' => 'not-a-date',
        ];

        $this->postJson('api/tasks', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors('due_date');
    }

    // test to update a status of a task
    public function test_can_update_a_task_status(): void
    {
        $task = Task::factory()->create();
        $data = [
            'status' => TaskStatus::DONE->value,
        ];

        $response = $this->patchJson("api/tasks/{$task->id}/status", $data);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => $this->taskJsonStructure()])
            ->assertJsonPath('data.status', TaskStatus::DONE->value);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => TaskStatus::DONE->value,
        ]);
    }
    public function test_update_task_status_requires_a_valid_status(): void
    {
        $task = Task::factory()->create();
        $data = [
            'status' => 'invalid-status',
        ];

        $this->patchJson("api/tasks/{$task->id}/status", $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }
    public function test_can_retrieve_a_task(): void
    {
        $task = Task::factory()->create();

        $response = $this->getJson("api/tasks/{$task->id}");

        $response->assertStatus(200)->assertJsonStructure($this->taskJsonStructure())
            ->assertJsonPath('id', $task->id);
    }
    public function test_can_retrieve_all_tasks(): void
    {
        Task::factory(5)->create();

        $response = $this->getJson('api/tasks');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => [$this->taskJsonStructure()]]);
    }
    public function test_can_delete_a_task(): void
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("api/tasks/{$task->id}");

        $response->assertStatus(204); // No Content

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
    public function test_delete_non_existent_task(): void
    {
        $response = $this->deleteJson('api/tasks/99999');

        $response->assertStatus(404);
    }
}
