<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Task::class;

    public function definition(): array
    {
        $status = fake()->randomElement(TaskStatus::options());

        return [
            'title'       => fake()->sentence(3),
            'description' => fake()->paragraph(5),
            'status'      => $status,
            'due_date'    => fake()->dateTimeBetween('-2 days', '+10 days'),
        ];
    }

    public function done(): self
    {
        return $this->state(fn() => ['status' => TaskStatus::DONE->value]);
    }

    public function overdue(): self
    {
        return $this->state(fn() => [
            'status' => fake()->randomElement([TaskStatus::TODO->value, TaskStatus::IN_PROGRESS->value]),
            'due_date' => fake()->dateTimeBetween('-7 days', 'now -1 hour'),
        ]);
    }
}
