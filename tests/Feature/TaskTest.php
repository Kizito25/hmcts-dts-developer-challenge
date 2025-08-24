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
            ->assertUnprocessable() // Same as assertStatus(422)
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
            ->assertUnprocessable()
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
            ->assertUnprocessable()
            ->assertJsonValidationErrors('due_date');
    }
}
