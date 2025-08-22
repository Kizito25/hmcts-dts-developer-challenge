<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Exception;
use Throwable;

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
        try {
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
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch tasks', 'error' => $e->getMessage()], 500);
        }
    }
    /**
     * POST /api/tasks
     * body: { title, description?, status?, due_date }
     */
    public function store(StoreTaskRequest $request)
    {
        try {
            $data = $request->validated();

            // Default status if not supplied
            $data['status'] = $data['status'] ?? TaskStatus::TODO->value;
            $task = Task::create($data);

            return TaskResource::make($task)->response()->setStatusCode(201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create task', 'error' => $e->getMessage()], $e->getCode());
        }
    }
    /**
     * GET /api/tasks/{task}
     */
    public function show(Task $task)
    {
        try {
            return TaskResource::make($task);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to fetch task', 'error' => $e->getMessage()], $e->getCode());
        }
    }
    /**
     * PATCH /api/tasks/{task}/status
     * body: { status }
     */
    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        try {
            $task->update([
                'status' => $request->validated('status'),
            ]);

            return TaskResource::make($task);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update task status', 'error' => $e->getMessage()], $e->getCode());
        }
    }
    /**
     * DELETE /api/tasks/{task}
     */
    public function destroy(Task $task)
    {
        try {

            $task->delete();

            return response()->noContent();
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to delete task', 'error' => $e->getMessage()], $e->getCode());
        }
    }
}
