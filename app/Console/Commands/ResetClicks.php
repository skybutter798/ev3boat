<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB; // Include the DB facade

class ResetClicks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clicks:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset user clicks';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('users')->update(['clicks' => 3]);
        $this->info('User clicks have been reset.');
    }
}
