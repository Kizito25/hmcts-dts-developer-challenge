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
        $response = $this->getJson('api/tasks');

        $this->withoutExceptionHandling();
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
        // $res = $this->postJson('/api/tasks', $payload)
        //     ->assertCreated()
        //     ->assertJsonStructure([
        //         'data' => [
        //             'id',
        //             'title',
        //             'description',
        //             'status',
        //             'due_at',
        //             'is_overdue',
        //             'created_at',
        //             'updated_at'
        //         ]
        //     ])
        //     ->assertJsonPath('data.title', $payload['title']);

        $data = [
            'title' => 'Test Task',
            'description' => 'This is a test task',
            'status' => TaskStatus::TODO->value,
            'due_date' => now()->addDay()->toDateTimeString(),
        ];

        $response = $this->postJson('api/tasks', $data);

        $response->assertStatus(201)
            ->assertJsonStructure($this->taskJsonStructure())
            ->assertJsonFragment([
                'title' => 'Test Task',
                'description' => 'This is a test task',
                'status' => TaskStatus::TODO->value,
            ]);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'description' => 'This is a test task',
            'status' => TaskStatus::TODO->value,
        ]);
    }
}
