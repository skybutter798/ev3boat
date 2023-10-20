<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;
    public function blockHash()
    {
        return $this->belongsTo(\App\Models\BlockHash::class, 'blockhash_id');
    }

    public function getBlockHashValueAttribute()
    {
        return $this->blockHash ? $this->blockHash->hash : null;
    }

    public function getBlockHashLinkAttribute()
    {
        return $this->blockHash ? $this->blockHash->link : null;
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
