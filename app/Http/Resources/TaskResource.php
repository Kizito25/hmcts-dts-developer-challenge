<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = is_string($this->status) ? $this->status : ($this->status->value ?? null);

        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'status'      => $status,
            'due_date'    => optional($this->due_date)->toIso8601String(),
            'is_overdue'  => $this->due_date?->isPast() && $status !== 'DONE',
            'created_at'  => optional($this->created_at)->toIso8601String(),
            'updated_at'  => optional($this->updated_at)->toIso8601String(),
        ];
        // return parent::toArray($request)
    }
}
