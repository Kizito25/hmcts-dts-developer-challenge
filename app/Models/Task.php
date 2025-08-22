<?php

namespace App\Models;

use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
    ];

    protected $casts = [
        'status' => TaskStatus::class,
        'due_date' => 'datetime',
    ];


    public function scopeStatus(Builder $query, TaskStatus|string $status): Builder
    {
        $value = $status instanceof TaskStatus ? $status->value : $status;
        return $query->where('status', $value);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query
            ->where('due_date', '<', now())
            ->where('status', '!=', TaskStatus::DONE->value);
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', '!=', TaskStatus::DONE->value);
    }
}
