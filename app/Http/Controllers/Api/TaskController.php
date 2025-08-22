<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;

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
        // Sorting & pagination
        $sort = in_array($request->query('sort'), ['due_date', 'created_at'], true)
            ? $request->query('sort')
            : 'due_date';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';
        $perPage = (int) $request->query('per_page', 25);
        $perPage = max(1, min($perPage, 100)); // clamp 1..100

        $tasks = $query
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return TaskResource::collection($tasks);
    }
    /**
     * POST /api/tasks
     * body: { title, description?, status?, due_date }
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        // Default status if not supplied
        $data['status'] = $data['status'] ?? TaskStatus::TODO->value;
        $task = Task::create($data);

        return TaskResource::make($task)->response()->setStatusCode(201);
    }
    /**
     * GET /api/tasks/{task}
     */
    public function show(Task $task)
    {
        return TaskResource::make($task);
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

        return TaskResource::make($task);
    }
    /**
     * DELETE /api/tasks/{task}
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->noContent();
    }
}
