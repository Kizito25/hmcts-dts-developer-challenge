<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\Api\TaskController;


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


// Authenticated User routes, May developer authentication routes here so users can fetch own Tasks
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });
// });

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/{task}', [TaskController::class, 'show']);
Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
Route::put('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
