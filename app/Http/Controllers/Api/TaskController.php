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
    //
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
}
