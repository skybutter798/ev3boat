<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\HashController;

class FetchLatestBlockHash extends Command
{
    protected $signature = 'hash:fetch-latest';
    protected $description = 'Fetch the latest block hash';

    public function handle()
    {
        $hashController = new HashController();
        $hashController->getLatestBlockHash();
        
        $this->info('Fetched the latest block hash.');
    }
}
