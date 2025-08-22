<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
// use App\Models\Task;
use App\Http\Controllers\Api\TaskController;


// Group authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/users', function () {
        // This route should return a list of users
        return User::all();
    });
});

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/{task}', [TaskController::class, 'show']);

// Route::prefix('tasks')->group(
//     function () {
//         Route::get('/', [TaskController::class, 'index']);
//     }
// );

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
// Route::get('/users', function () {
//     // This route should return a list of users
//     return User::all();
// });
// HMCTS requires a new system to be developed so caseworkers can keep track of their tasks. Your technical test is to develop that new system so caseworkers can efficiently manage their tasks.

// Task Requirements
// Backend API
// The backend should be able to:

// Create a task with the following properties:
// Title
// Description (optional field)
// Status
// Due date/time
// Retrieve a task by ID
// Retrieve all tasks
// Update the status of a task
// Delete a task

// Route::group(function () {
//     Route::get('/task', function (Request $request) {
//         return Task::all();
//     });

//     Route::get('/', function () {
//         // This route should return a list of users
//         return User::all();
//     });
// });

Route::prefix('auth/customer')->group(function () {
    // Route::get('/task', function (Request $request) {
    //     return Task::all();
    // });
    // Route::get('/task/{id}', function ($id) {
    //     return Task::findOrFail($id);
    // });
    // Route::post('/task', function (Request $request) {
    //     $task = Task::create($request->validate([
    //         'title' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'status' => 'required|string|in:pending,completed',
    //         'due_date' => 'required|date',
    //     ]));
    //     return response()->json($task, 201);
    // });

    // Route::put('/task/{id}', function (Request $request, $id) {
    //     $task = Task::findOrFail($id);
    //     $task->update($request->validate([
    //         'status' => 'required|string|in:pending,completed',
    //     ]));
    //     return response()->json($task);
    // });
    // Route::delete('/task/{id}', function ($id) {
    //     $task = Task::findOrFail($id);
    //     $task->delete();
    //     return response()->json(null, 204);
    // });


});


    // // Customer Authentication Routes
    // Route::prefix('auth/customer')->group(function () {
    //     Route::post('/register', [UserAuthController::class, 'register']);
    //     Route::post('/login', [UserAuthController::class, 'login']);
    //     Route::middleware(['auth:sanctum'])->get('verify', [UserAuthController::class, 'verifyAuth']);
    //     Route::middleware(['auth:sanctum'])->post('logout', [UserAuthController::class, 'logout']);
    // });