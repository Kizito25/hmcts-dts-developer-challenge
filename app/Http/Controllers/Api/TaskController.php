<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        /**
         * GET /api/tasks
         * Optional query params:
         *   - status=TODO|IN_PROGRESS|DONE
         *   - overdue=true (filters: due_at < now AND status != DONE)
         */
        $query = Task::query();

        if ($request->filled('status')) {
            $query->status($request->string('status'));
        }

        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        $tasks = $query->orderBy('due_date')->orderByDesc('created_at')->get();

        return response()->json($tasks);
    }
    /**
     * POST /api/tasks
     * body: { title, description?, status?, due_date }
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        // Default status if not supplied
        $status = $data['status'] ?? TaskStatus::TODO->value;

        $task = Task::create([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'status'      => $status,
            'due_date'      => $data['due_date'],
        ]);

        return response()->json($task, 201);
    }
    /**
     * GET /api/tasks/{task}
     */
    public function show(Task $task)
    {
        return response()->json($task);
    }
    /**
     * PATCH /api/tasks/{task}/status
     * body: { status }
     */
    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        $task->update([
            'status' => $request->validated('status'),
        ]);

        return response()->json($task);
    }
}
